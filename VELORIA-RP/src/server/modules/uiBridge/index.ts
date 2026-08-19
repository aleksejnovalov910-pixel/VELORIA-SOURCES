import { mysql } from '../../core/mysql';
import { getInventory, ITEMS, moveItem, removeItem } from '../inventory';

type UiSettings = {
  hud: boolean;
  minimap: boolean;
  voiceVolume: number;
  interfaceScale: number;
};

const DEFAULT_SETTINGS: UiSettings = {
  hud: true,
  minimap: true,
  voiceVolume: 80,
  interfaceScale: 100
};

function characterId(player: PlayerMp): number | null {
  const value = Number(player.getVariable('veloria:characterId') ?? player.getVariable('characterId'));
  return Number.isSafeInteger(value) && value > 0 ? value : null;
}

function normalizeSettings(value: unknown): UiSettings {
  const raw = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const voiceVolume = Number(raw.voiceVolume ?? DEFAULT_SETTINGS.voiceVolume);
  const interfaceScale = Number(raw.interfaceScale ?? DEFAULT_SETTINGS.interfaceScale);
  return {
    hud: typeof raw.hud === 'boolean' ? raw.hud : DEFAULT_SETTINGS.hud,
    minimap: typeof raw.minimap === 'boolean' ? raw.minimap : DEFAULT_SETTINGS.minimap,
    voiceVolume: Number.isFinite(voiceVolume) ? Math.max(0, Math.min(100, voiceVolume)) : DEFAULT_SETTINGS.voiceVolume,
    interfaceScale: Number.isFinite(interfaceScale) ? Math.max(80, Math.min(120, interfaceScale)) : DEFAULT_SETTINGS.interfaceScale
  };
}

async function syncInventory(player: PlayerMp, id: number) {
  player.call('veloria:inventory:data', [JSON.stringify(await getInventory(id))]);
}

export function registerUiBridgeModule(): void {
  mp.events.add('veloria:inventory:data', async (player: PlayerMp) => {
    const id = characterId(player);
    if (!id) return;
    try {
      await syncInventory(player, id);
    } catch {
      player.call('veloria:notify', ['error', 'Не удалось открыть инвентарь']);
    }
  });

  mp.events.add('veloria:inventory:move', async (player: PlayerMp, fromRaw: unknown, toRaw: unknown) => {
    const id = characterId(player);
    const from = Number(fromRaw), to = Number(toRaw);
    if (!id || !Number.isSafeInteger(from) || !Number.isSafeInteger(to)) return;
    try {
      await moveItem(id, from, to);
      await syncInventory(player, id);
    } catch (error) {
      const code = error instanceof Error ? error.message : '';
      player.call('veloria:notify', ['error', code === 'EMPTY_SLOT' ? 'В этой ячейке нет предмета' : 'Не удалось переместить предмет']);
    }
  });

  mp.events.add('veloria:inventory:use', async (player: PlayerMp, slotRaw: unknown) => {
    const id = characterId(player), slot = Number(slotRaw);
    if (!id || !Number.isSafeInteger(slot) || slot < 0 || slot >= 40) return;
    try {
      const inventory = await getInventory(id);
      const entry = inventory.find(item => item.slot === slot);
      if (!entry) throw new Error('EMPTY_SLOT');
      const def = ITEMS[entry.item];
      if (!def?.usable) throw new Error('NOT_USABLE');

      if (entry.item === 'medkit') {
        const current = Math.max(0, Number(player.health ?? 0));
        if (current >= 100) throw new Error('HEALTH_FULL');
        player.health = Math.min(100, current + 35);
      }

      await removeItem(id, entry.item, 1);
      player.call('veloria:notify', ['success', entry.item === 'water' ? 'Вы выпили воду' : entry.item === 'food' ? 'Вы поели' : entry.item === 'medkit' ? 'Аптечка использована' : `${def.name} использован`]);
      await syncInventory(player, id);
    } catch (error) {
      const code = error instanceof Error ? error.message : '';
      const text = code === 'EMPTY_SLOT' ? 'В этой ячейке нет предмета' : code === 'NOT_USABLE' ? 'Этот предмет нельзя использовать' : code === 'HEALTH_FULL' ? 'Здоровье уже полное' : 'Не удалось использовать предмет';
      player.call('veloria:notify', ['error', text]);
    }
  });

  mp.events.add('veloria:settings:get', async (player: PlayerMp) => {
    const id = characterId(player);
    if (!id) return;
    try {
      const [rows] = await mysql.query('SELECT ui_json FROM player_settings WHERE character_id=? LIMIT 1', [id]);
      const row = (rows as any[])[0];
      let parsed: unknown = {};
      if (row?.ui_json) {
        try { parsed = typeof row.ui_json === 'string' ? JSON.parse(row.ui_json) : row.ui_json; } catch { parsed = {}; }
      }
      player.call('veloria:settings:data', [JSON.stringify(normalizeSettings(parsed))]);
    } catch {
      player.call('veloria:settings:data', [JSON.stringify(DEFAULT_SETTINGS)]);
    }
  });

  mp.events.add('veloria:settings:save', async (player: PlayerMp, json: string) => {
    const id = characterId(player);
    if (!id) return;
    try {
      const settings = normalizeSettings(JSON.parse(String(json ?? '{}')));
      await mysql.query(
        `INSERT INTO player_settings(character_id,ui_json)
         VALUES(?,?)
         ON DUPLICATE KEY UPDATE ui_json=VALUES(ui_json),updated_at=CURRENT_TIMESTAMP`,
        [id, JSON.stringify(settings)]
      );
      player.setVariable('veloria:settings', JSON.stringify(settings));
    } catch {
      player.call('veloria:notify', ['error', 'Некорректные настройки']);
    }
  });
}
