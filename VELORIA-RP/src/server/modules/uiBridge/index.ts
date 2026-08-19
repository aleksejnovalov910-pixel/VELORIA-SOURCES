import { mysql } from '../../core/mysql';
import { getInventory } from '../inventory';

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
  const primary = player.getVariable('veloria:characterId');
  if (typeof primary === 'number') return primary;
  const legacy = player.getVariable('characterId');
  return typeof legacy === 'number' ? legacy : null;
}

function normalizeSettings(value: unknown): UiSettings {
  const raw = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  return {
    hud: typeof raw.hud === 'boolean' ? raw.hud : DEFAULT_SETTINGS.hud,
    minimap: typeof raw.minimap === 'boolean' ? raw.minimap : DEFAULT_SETTINGS.minimap,
    voiceVolume: Math.max(0, Math.min(100, Number(raw.voiceVolume ?? DEFAULT_SETTINGS.voiceVolume))),
    interfaceScale: Math.max(80, Math.min(120, Number(raw.interfaceScale ?? DEFAULT_SETTINGS.interfaceScale)))
  };
}

export function registerUiBridgeModule(): void {
  mp.events.add('veloria:inventory:data', async (player: PlayerMp) => {
    const id = characterId(player);
    if (!id) return;
    try {
      player.call('veloria:inventory:data', [JSON.stringify(await getInventory(id))]);
    } catch {
      player.call('veloria:notify', ['error', 'Не удалось открыть инвентарь']);
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
