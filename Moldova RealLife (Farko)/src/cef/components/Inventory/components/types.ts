import { 
  InventoryEquipList, 
  InventoryWeaponPlayerData, 
  InventoryDataCef, 
  InventoryItemCef, 
  ExchangeData, 
  OWNER_TYPES 
} from "../../../../shared/inventory";

export interface InventoryMainData extends InventoryEquipList {
  equip: InventoryEquipList;
  weapons: InventoryWeaponPlayerData;
  blocks: InventoryDataCef[];
  hotkeys: [
    number | null,
    number | null,
    number | null,
    number | null,
    number | null,
    number | null,
    number | null,
    number | null,
    number | null
  ];
  open: boolean;
  addModal?: boolean;
  containerType: OWNER_TYPES;
  containerNumber: number;
  containerSlot?: number;
  current?: [OWNER_TYPES, number];
  inv_level?: number;
  isExchangeOpened?: boolean;
  exchangeData?: ExchangeData;
  mouseOnItem: { x: number; y: number; itemName: string };
  phoneSlot?: number | null;
  armorSlot?: number | null;
  backpackSlot?: number | null;
  
  hunger?: number;
  thirst?: number;
}

export interface ItemDrawProps {
  inventory: any;
  item: InventoryItemCef;
  owner_type: OWNER_TYPES;
  owner_id: number;
  keyName: any;
  isDraggable?: { x: number; y: number };
  ishotkey?: boolean;
}

export interface ItemDrawState {
  rightClick?: boolean;
  left?: number;
  top?: number;
  position?: [number, number];
  clickPress?: boolean;
  split?: number;
  isDragging?: boolean;
  dragStarted?: boolean;
  showSplitModal: boolean
} 