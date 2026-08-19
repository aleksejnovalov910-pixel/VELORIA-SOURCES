export const VeloriaEvents = {
  AuthOpen: 'veloria:auth:open', AuthLogin: 'veloria:auth:login', AuthRegister: 'veloria:auth:register', AuthResult: 'veloria:auth:result',
  CharactersOpen: 'veloria:characters:open', CharacterSelect: 'veloria:character:select', CharacterCreateStart: 'veloria:character:create:start', CharacterCreateSave: 'veloria:character:create:save', CharacterCreatorOpen: 'veloria:character:creator:open', CharacterCreatorClose: 'veloria:character:creator:close',
  HudSetVisible: 'veloria:hud:visible', HudUpdate: 'veloria:hud:update',
  InventoryOpen: 'veloria:inventory:open', InventorySync: 'veloria:inventory:sync', InventoryMove: 'veloria:inventory:move', InventoryUse: 'veloria:inventory:use', InventoryDrop: 'veloria:inventory:drop',
  PhoneToggle: 'veloria:phone:toggle', TabletToggle: 'veloria:tablet:toggle', SettingsToggle: 'veloria:settings:toggle',
  VehicleLock: 'veloria:vehicle:lock', VehicleEngine: 'veloria:vehicle:engine', VehicleSeatbelt: 'veloria:vehicle:seatbelt', VehicleSync: 'veloria:vehicle:sync',
  InteractionOpen: 'veloria:interaction:open', MarketOpen: 'veloria:market:open',
  Notify: 'veloria:notify'
} as const;
export type VeloriaEventName = typeof VeloriaEvents[keyof typeof VeloriaEvents];
