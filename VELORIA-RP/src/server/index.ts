import 'dotenv/config';
import { logger } from './core/logger';
import { initMySql } from './database/mysql';
import { initRedis } from './database/redis';
import { registerAccountModule } from './modules/accounts';
import { registerCharacterModule } from './modules/characters';
import { registerGameplayModules } from './modules/gameplay';
import { registerBankingModule } from './modules/banking';
import { registerPhoneModule } from './modules/phone';

async function bootstrap() {
  logger.info('Starting VELORIA RP v0.1 core...');
  await initMySql();
  await initRedis();

  registerAccountModule();
  registerCharacterModule();
  registerGameplayModules();
  registerBankingModule();
  registerPhoneModule();

  mp.events.add('playerJoin', (player: PlayerMp) => {
    player.dimension = 1000 + player.id;
    logger.info(`Player connected: ${player.name} (${player.id})`);
  });

  mp.events.add('playerQuit', (player: PlayerMp, exitType: string, reason: string) => {
    logger.info(`Player disconnected: ${player.name}; ${exitType}; ${reason}`);
  });

  logger.info('VELORIA RP core initialized');
}

void bootstrap().catch((error) => {
  logger.error('Fatal bootstrap error', error);
  process.exitCode = 1;
});
