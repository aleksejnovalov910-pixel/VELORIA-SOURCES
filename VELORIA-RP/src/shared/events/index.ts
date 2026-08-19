export const Events = {
  AuthLogin: 'veloria:auth:login',
  AuthRegister: 'veloria:auth:register',
  AuthResult: 'veloria:auth:result',
  CharacterListRequest: 'veloria:characters:list:request',
  CharacterList: 'veloria:characters:list',
  CharacterCreate: 'veloria:characters:create',
  CharacterSelect: 'veloria:characters:select',
  CharacterCreatorOpen: 'veloria:characterCreator:open',
  CharacterCreatorSave: 'veloria:characterCreator:save',
  CharacterSpawned: 'veloria:character:spawned'
} as const;

export type VeloriaEventName = typeof Events[keyof typeof Events];
