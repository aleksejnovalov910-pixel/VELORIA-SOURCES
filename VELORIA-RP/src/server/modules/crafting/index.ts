import { mysql } from '../../core/mysql';
import { ITEMS } from '../inventory';

type Recipe = {
  id: string;
  name: string;
  output: { item: string; amount: number };
  ingredients: Array<{ item: string; amount: number }>;
};

const STATIONS = [
  { id: 1, name: 'Верстак — La Mesa', x: 720.42, y: -1088.96, z: 22.18 },
  { id: 2, name: 'Верстак — Sandy Shores', x: 1174.65, y: 2640.31, z: 37.75 }
] as const;

const RECIPES: Recipe[] = [
  {
    id: 'bandage',
    name: 'Бинт',
    output: { item: 'bandage', amount: 1 },
    ingredients: [{ item: 'cloth', amount: 2 }]
  },
  {
    id: 'lockpick',
    name: 'Набор отмычек',
    output: { item: 'lockpick', amount: 1 },
    ingredients: [
      { item: 'scrap', amount: 2 },
      { item: 'metal', amount: 1 }
    ]
  },
  {
    id: 'repair_kit',
    name: 'Ремкомплект',
    output: { item: 'repair_kit', amount: 1 },
    ingredients: [
      { item: 'metal', amount: 3 },
      { item: 'scrap', amount: 3 },
      { item: 'cloth', amount: 1 }
    ]
  },
  {
    id: 'medkit',
    name: 'Аптечка',
    output: { item: 'medkit', amount: 1 },
    ingredients: [
      { item: 'bandage', amount: 2 },
      { item: 'cloth', amount: 1 }
    ]
  }
];

function characterId(player: PlayerMp): number | null {
  const id = Number(player.getVariable('veloria:characterId') ?? player.getVariable('characterId'));
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function stationById(raw: unknown) {
  const id = Math.trunc(Number(raw));
  return STATIONS.find(station => station.id === id) ?? null;
}

function recipeById(raw: unknown) {
  const id = String(raw ?? '');
  return RECIPES.find(recipe => recipe.id === id) ?? null;
}

function nearby(player: PlayerMp, station: (typeof STATIONS)[number], radius = 5): boolean {
  if (player.dimension !== 0) return false;
  const p = player.position;
  const dx = Number(p.x) - station.x;
  const dy = Number(p.y) - station.y;
  const dz = Number(p.z) - station.z;
  return dx * dx + dy * dy + dz * dz <= radius * radius;
}

function notify(player: PlayerMp, type: 'success' | 'error' | 'info', text: string) {
  player.call('veloria:notify', [type, text]);
}

function publicRecipes() {
  return RECIPES.map(recipe => ({
    id: recipe.id,
    name: recipe.name,
    output: { ...recipe.output, name: ITEMS[recipe.output.item]?.name ?? recipe.output.item },
    ingredients: recipe.ingredients.map(ingredient => ({
      ...ingredient,
      name: ITEMS[ingredient.item]?.name ?? ingredient.item
    }))
  }));
}

async function craft(player: PlayerMp, stationIdRaw: unknown, recipeIdRaw: unknown) {
  const id = characterId(player);
  const station = stationById(stationIdRaw);
  const recipe = recipeById(recipeIdRaw);
  if (!id || !station || !nearby(player, station)) return notify(player, 'error', 'Вы слишком далеко от верстака');
  if (!recipe) return notify(player, 'error', 'Рецепт не найден');

  const outputDef = ITEMS[recipe.output.item];
  if (!outputDef) return notify(player, 'error', 'Предмет рецепта не зарегистрирован');

  const conn = await mysql.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query(
      'SELECT slot,item,amount,metadata_json FROM character_inventory WHERE character_id=? ORDER BY slot FOR UPDATE',
      [id]
    );
    const inventory = (rows as any[]).map(row => ({
      slot: Number(row.slot),
      item: String(row.item),
      amount: Number(row.amount),
      metadataJson: String(row.metadata_json ?? '{}')
    }));

    const totals = new Map<string, number>();
    for (const row of inventory) totals.set(row.item, (totals.get(row.item) ?? 0) + row.amount);
    for (const ingredient of recipe.ingredients) {
      if ((totals.get(ingredient.item) ?? 0) < ingredient.amount) throw new Error('NOT_ENOUGH_MATERIALS');
    }

    for (const ingredient of recipe.ingredients) {
      let left = ingredient.amount;
      for (const row of inventory) {
        if (!left || row.item !== ingredient.item || row.amount <= 0) continue;
        const take = Math.min(left, row.amount);
        row.amount -= take;
        left -= take;
        if (row.amount <= 0) {
          await conn.query('DELETE FROM character_inventory WHERE character_id=? AND slot=?', [id, row.slot]);
        } else {
          await conn.query('UPDATE character_inventory SET amount=? WHERE character_id=? AND slot=?', [row.amount, id, row.slot]);
        }
      }
      if (left) throw new Error('NOT_ENOUGH_MATERIALS');
    }

    const [afterRows] = await conn.query(
      'SELECT slot,item,amount,metadata_json FROM character_inventory WHERE character_id=? ORDER BY slot FOR UPDATE',
      [id]
    );
    const after = afterRows as any[];
    const outputMeta = '{}';
    let left = recipe.output.amount;

    for (const row of after) {
      if (!left) break;
      if (String(row.item) !== recipe.output.item || String(row.metadata_json ?? '{}') !== outputMeta) continue;
      const current = Number(row.amount);
      if (current >= outputDef.stack) continue;
      const add = Math.min(left, outputDef.stack - current);
      await conn.query(
        'UPDATE character_inventory SET amount=amount+? WHERE character_id=? AND slot=?',
        [add, id, Number(row.slot)]
      );
      left -= add;
    }

    if (left) {
      const occupied = new Set(after.map(row => Number(row.slot)));
      for (let slot = 0; slot < 40 && left; slot++) {
        if (occupied.has(slot)) continue;
        const add = Math.min(left, outputDef.stack);
        await conn.query(
          'INSERT INTO character_inventory(character_id,slot,item,amount,metadata_json) VALUES(?,?,?,?,?)',
          [id, slot, recipe.output.item, add, outputMeta]
        );
        occupied.add(slot);
        left -= add;
      }
    }

    if (left) throw new Error('INVENTORY_FULL');

    await conn.query(
      'INSERT INTO inventory_logs(character_id,action,item,amount,details_json) VALUES(?,?,?,?,?)',
      [id, 'craft', recipe.output.item, recipe.output.amount, JSON.stringify({ recipeId: recipe.id, ingredients: recipe.ingredients })]
    );
    await conn.commit();

    notify(player, 'success', `${recipe.name}: создано ${recipe.output.amount} шт.`);
    player.call('veloria:crafting:done', [recipe.id]);
  } catch (error) {
    await conn.rollback();
    const code = error instanceof Error ? error.message : '';
    const text = code === 'NOT_ENOUGH_MATERIALS'
      ? 'Недостаточно материалов'
      : code === 'INVENTORY_FULL'
        ? 'В инвентаре недостаточно места'
        : 'Не удалось создать предмет';
    notify(player, 'error', text);
  } finally {
    conn.release();
  }
}

export function registerCraftingModule() {
  mp.events.add('veloria:crafting:open', (player: PlayerMp, stationIdRaw: unknown) => {
    const station = stationById(stationIdRaw);
    if (!characterId(player) || !station || !nearby(player, station)) return;
    player.call('veloria:crafting:data', [JSON.stringify({ station, recipes: publicRecipes() })]);
  });

  mp.events.add('veloria:crafting:craft', (player: PlayerMp, stationIdRaw: unknown, recipeIdRaw: unknown) => {
    void craft(player, stationIdRaw, recipeIdRaw).catch(() => notify(player, 'error', 'Не удалось создать предмет'));
  });
}

export const CraftingStations = STATIONS.map(station => ({ ...station }));
