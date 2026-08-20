import { db } from '../../database/mysql';
import { logger } from '../../core/logger';

function characterId(player: PlayerMp): number | null {
  const value = Number(player.getVariable('veloria:characterId') ?? player.getVariable('characterId'));
  return Number.isSafeInteger(value) && value > 0 ? value : null;
}

function finite(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

async function savePlayer(player: PlayerMp) {
  const id = characterId(player);
  if (!id || player.dimension !== 0) return;

  const position = player.position;
  const heading = Number(player.heading);
  if (!position || !finite(position.x) || !finite(position.y) || !finite(position.z) || !finite(heading)) return;

  await db().execute(
    'UPDATE characters SET pos_x=?, pos_y=?, pos_z=?, heading=? WHERE id=? LIMIT 1',
    [position.x, position.y, position.z, heading, id]
  );
}

export function registerPlayerPersistenceModule() {
  mp.events.add('playerQuit', (player: PlayerMp) => {
    void savePlayer(player).catch((error) => logger.error(`Failed to save character position on quit: ${player.name}`, error));
  });

  const timer = setInterval(() => {
    mp.players.forEach((player: PlayerMp) => {
      void savePlayer(player).catch((error) => logger.error(`Autosave failed for ${player.name}`, error));
    });
  }, 60_000);

  // Do not keep a standalone Node process alive during tests/preflight.
  timer.unref?.();
}
