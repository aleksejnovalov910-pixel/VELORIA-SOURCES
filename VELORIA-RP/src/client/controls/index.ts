import { VeloriaEvents } from '../../shared/events/veloria';
import { VELORIA_CONFIG } from '../../shared/config/server';

mp.keys.bind(VELORIA_CONFIG.phoneKey, true, () => mp.events.call(VeloriaEvents.PhoneToggle));
mp.keys.bind(VELORIA_CONFIG.tabletKey, true, () => mp.events.call(VeloriaEvents.TabletToggle));
mp.keys.bind(VELORIA_CONFIG.inventoryKey, true, () => mp.events.call(VeloriaEvents.InventoryToggle));
mp.keys.bind(VELORIA_CONFIG.settingsKey, true, () => mp.events.call(VeloriaEvents.SettingsToggle));
