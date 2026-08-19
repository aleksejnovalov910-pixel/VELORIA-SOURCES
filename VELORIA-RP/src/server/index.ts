import 'dotenv/config';
import { logger } from './core/logger';
import { initMySql } from './database/mysql';
import { initRedis } from './database/redis';
import { registerAccountModule } from './modules/accounts';
import { registerCharacterModule } from './modules/characters';
import { registerGameplayModules } from './modules/gameplay';
import { registerBankingModule } from './modules/banking';
import { registerPhoneModule } from './modules/phone';
import { registerMarketModule } from './modules/market';
import { registerUiBridgeModule } from './modules/uiBridge';
import { registerTabletModule } from './modules/tablet';
import { registerVehicleRuntimeModule } from './modules/vehicleRuntime';
import { registerDealershipModule } from './modules/dealerships';
import { registerDmvModule } from './modules/dmv';
import { registerImpoundModule } from './modules/impound';
import { registerVehicleMarketModule } from './modules/vehicleMarket';
import { registerPropertyModule } from './modules/property';
import { registerJobsModule } from './modules/jobs';
import { registerBusinessModule } from './modules/businesses';
import { registerEquipmentModule } from './modules/equipment';
import { registerFactionsModule } from './modules/factions/runtime';
import { registerFamiliesModule } from './modules/families/runtime';
import { registerAdminModule } from './modules/admin/runtime';

async function bootstrap(){
  logger.info('Starting VELORIA RP v0.1 core...');
  await initMySql();
  await initRedis();

  registerAccountModule();
  registerCharacterModule();
  registerGameplayModules();
  registerBankingModule();
  registerPhoneModule();
  registerMarketModule();
  registerUiBridgeModule();
  registerTabletModule();
  registerVehicleRuntimeModule();
  registerDealershipModule();
  registerDmvModule();
  registerImpoundModule();
  registerVehicleMarketModule();
  registerPropertyModule();
  registerJobsModule();
  registerBusinessModule();
  registerEquipmentModule();
  registerFactionsModule();
  registerFamiliesModule();
  registerAdminModule();

  mp.events.add('playerJoin',(player:PlayerMp)=>{
    player.dimension=1000+player.id;
    player.setVariable('veloria:authenticated',false);
    logger.info(`Player connected: ${player.name} (${player.id})`);
  });

  mp.events.add('playerQuit',(player:PlayerMp,exitType:string,reason:string)=>{
    logger.info(`Player disconnected: ${player.name}; ${exitType}; ${reason}`);
  });

  logger.info('VELORIA RP core initialized');
}

void bootstrap().catch(error=>{
  logger.error('Fatal bootstrap error',error);
  process.exitCode=1;
});
