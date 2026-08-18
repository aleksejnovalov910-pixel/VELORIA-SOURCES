import React, { Component, JSX } from "react";
import {
  CONTAINERS_DATA,
  OWNER_TYPES,
  InventoryChoiseItemData,
  InventoryDataCef,
  InventoryItemCef,
  InventoryEquipList,
  convertInventoryItemArrayToObject,
  getItemWeight,
  ExchangeData,
  ExchangeReadyStatus,
  InventoryWeaponPlayerData,
  PLAYER_INVENTORY_MAX_LEVEL,
  inventoryShared,
} from "../../../../shared/inventory";
import { InventoryMainData } from "./types";
import { CustomEvent } from "../../../modules/custom.event";
import { CEF } from "../../../modules/CEF";
import { ItemDraw } from "./ItemDraw";
import { InventoryData } from "./InventoryData";
import { InventoryContainer } from "./InventoryContainer";
import { ClothesEquipment } from "./ClothesEquipment";
import { ExchangeBlock } from "./ExchangeBlock";
import { Hotkeys } from "./Hotkeys";
import { InventoryModal } from "./InventoryModal";
import bagpackIcon from "../img/clothes/bagpack.svg";
import lockedIcon from "../img/lockedIcon.png";
import { LangString } from "../../../modules/lang";

import MouseLeftIcon from "../img/mouseLeft.svg";
import MouseRightIcon from "../img/mouseRight.svg";
import ExitIcon from "../img/exit.svg";
import { TreeLevelColumn } from "typeorm";
import exchangeBackground from "../images/TradeBG.png";

export class InventoryMain extends Component<{}, InventoryMainData> {
  eventHandlers: any;

  constructor(props: {}) {
    super(props);
    this.state = {
      hotkeys: [null, null, null, null, null, null, null, null, null],
      equip: {
        bracelet: 0,
        watch: 0,
        ear: 0,
        glasses: 0,
        hat: 0,
        accessorie: 0,
        accessorie2: 0,
        foot: 0,
        leg: 0,
        torso: 0,
        mask: 0,
        armor: 0,
        gloves: 0,
      },
      bracelet: 0,
      watch: 0,
      ear: 0,
      glasses: 0,
      hat: 0,
      accessorie: 0,
      accessorie2: 0,
      foot: 0,
      leg: 0,
      torso: 0,
      mask: 0,
      armor: 0,
      armorSlot: null,
      gloves: 0,
      phoneSlot: null,
      weapons: {
        item_id: 0,
        id: 0,
        ammo: 0,
        serial: "",
        max_ammo: 0,
        unloaded: false,
      },
      containerType: OWNER_TYPES.PLAYER,
      containerNumber: -1,
      current: [OWNER_TYPES.PLAYER, -1],
      addModal: false,
      blocks: [],
      mouseOnItem: { x: 0, y: 0, itemName: "" },
      open: false,

      hunger: 0,
      thirst: 0,
    };
  }

  componentDidMount() {
    this.eventHandlers = InventoryData.registerEventHandlers(this);

    if (!inventoryShared.items || inventoryShared.items.length === 0) {
      console.warn(
        "inventoryShared is not initialized, some features may not work"
      );
    }

    if (CEF.test) {
      const testData = InventoryData.renderTestBlock();
      this.setState({
        blocks: testData.blocks,
        hotkeys: testData.hotkeys,
        weapons: testData.weapons,
        exchangeData: testData.exchangeData,
        isExchangeOpened: testData.isExchangeOpened,
        open: true,
        hunger: 20,
        thirst: 50,
        armorSlot: 960,
        phoneSlot: 500,
        backpackSlot: 600,
      });
    }

    CustomEvent.register(
      "inventory:update:special_slots",
      (armorId: number | null, phoneId: number | null, backpackId: number | null) => {
        this.setState({
          armorSlot: armorId,
          phoneSlot: phoneId,
          backpackSlot: backpackId,
        });
      }
    );

    console.log(this.state.hotkeys, this.state.hotkeys.slice(2, 8));
  }

  componentWillUnmount() {
    InventoryData.unregisterEventHandlers(this.eventHandlers);
  }

  openInventory(
    blocks: InventoryDataCef[],
    equip: InventoryEquipList,
    weapons: InventoryWeaponPlayerData,
    hotkeys: [
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number
    ],
    inv_level: number,
    hunger: number,
    water: number,
    armorId?: number | null,
    phoneId?: number | null,
    bagId?: number | null,
  ) {
    console.log("openInventory", bagId);
    const blocksDataOpen: any[] = (this.state.blocks || [])
      .filter((q) => !q.closed)
      .map((q) => [q.owner_type, q.owner_id, q.left, q.top, q.drag]);
    this.setState(
      {
        open: true,
        equip,
        blocks,
        weapons,
        hotkeys,
        inv_level,
        hunger,
        thirst: water,
        armorSlot: armorId !== undefined ? armorId : undefined,
        phoneSlot: phoneId !== undefined ? phoneId : undefined,
        backpackSlot: bagId !== undefined ? bagId : undefined,
      },
      () => {
        // Process blocks to show previously opened ones and find backpack inventory
        const updatedBlocks = this.state.blocks.map((q) => {
          const show = blocksDataOpen.find(
            (s) => s[0] === q.owner_type && s[1] === q.owner_id
          );
          if (show) {
            return {
              ...q,
              show: true,
              left: show[2],
              top: show[3],
              drag: show[4],
            };
          }
          return q;
        });
        
        // Find and open backpack inventory if backpackSlot exists
        if (this.state.backpackSlot) {
          // Find the backpack inventory block by matching the owner_id with backpackSlot
          const backpackBlock = updatedBlocks.find(block => {
            // Check if this is a bag type inventory and the ID matches the backpackSlot
            return (
              // Check for BAG owner type or any of the BAG1-BAGx owner types
              (block.owner_type === OWNER_TYPES.BAG || 
               (block.owner_type >= OWNER_TYPES.BAG1 && block.owner_type <= OWNER_TYPES.BAG_LAST)) && 
              block.owner_id === this.state.backpackSlot
            );
          });
          
          // If backpack inventory found, mark it to show
          if (backpackBlock) {
            const blockIndex = updatedBlocks.indexOf(backpackBlock);
            if (blockIndex !== -1) {
              updatedBlocks[blockIndex] = {
                ...backpackBlock,
                show: true,
                // Set default position if not already set
                left: backpackBlock.left || 400,
                top: backpackBlock.top || 200,
                drag: backpackBlock.drag || { x: 0, y: 0 }
              };
            }
          }
        }
        
        this.setState({
          blocks: updatedBlocks
        });
      }
    );
  }

  openExchangeMenu(
    myInventory: InventoryDataCef,
    exchangeData: ExchangeData,
    equip: InventoryEquipList,
    weapons: InventoryWeaponPlayerData,
    hotkeys: [
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number
    ],
    inv_level: number,
    armorId?: number | null,
    phoneId?: number | null
  ) {
    this.setState({
      open: true,
      isExchangeOpened: true,
      equip,
      weapons,
      hotkeys,
      inv_level,
      exchangeData,
      blocks: [myInventory],
      armorSlot: armorId !== undefined ? armorId : this.state.armorSlot,
      phoneSlot: phoneId !== undefined ? phoneId : this.state.phoneSlot,
    });
  }

  showBlocks(
    owner_type: OWNER_TYPES,
    owner_id: number,
    left: number,
    top: number
  ) {
    const blocks = [...this.state.blocks];
    
    const isContainer = CONTAINERS_DATA.some(container => container.owner_type === owner_type);
    
    if (isContainer) {
      blocks.forEach(block => {
        if (CONTAINERS_DATA.some(container => container.owner_type === block.owner_type) && 
            block.show && 
            !(block.owner_type === owner_type && block.owner_id === owner_id)) {
          block.show = false;
        }
      });
    }

    const item = blocks.findIndex(
      (q) => q.owner_type === owner_type && q.owner_id === owner_id
    );
    if (item > -1) {
      blocks[item].show = true;
      blocks[item].left = left;
      blocks[item].top = top;
      this.setState({ blocks });
      this.updateDragPos(owner_type, owner_id, { x: 0, y: 0 });
      this.currentItem(OWNER_TYPES.PLAYER, -1);
    }
  }

  hideBlocks(
    owner_type: OWNER_TYPES,
    owner_id: number
  ) {
    const blocks = [...this.state.blocks];
    const item = blocks.findIndex(
      (q) => q.owner_type === owner_type && q.owner_id === owner_id
    );
    if (item > -1) {
      blocks[item].show = false;
      this.setState({ blocks });
    }
  }

  currentItem = (owner_type: OWNER_TYPES, owner_id: number) => {
    this.setState({ ...this.state, current: [owner_type, owner_id] });
  };

  enterContainer = (
    owner_type: OWNER_TYPES,
    owner_id?: number,
    slot?: number
  ) => {
    let actualOwnerId = owner_id;

    this.setState({
      ...this.state,
      containerType: owner_type,
      containerNumber: actualOwnerId ? actualOwnerId : 0,
      containerSlot: slot !== undefined ? slot : undefined,
    });
  };

  updateDragPos = (
    owner_type: OWNER_TYPES,
    owner_id: number,
    data: { x: number; y: number }
  ) => {
    if (this.state.current[0] === OWNER_TYPES.PLAYER) {
      const blocks = [...this.state.blocks];
      const index = blocks.findIndex(
        (q) => q.owner_type === owner_type && q.owner_id === owner_id
      );
      if (index > -1) {
        blocks[index].drag = {
          x: (blocks[index].drag ? blocks[index].drag.x : 0) + data.x,
          y: (blocks[index].drag ? blocks[index].drag.y : 0) + data.y,
        };
        this.setState({ blocks });
      }
    }
  };

  closeInventory() {
    CustomEvent.triggerServer("inventory:close");
    CEF.gui.setGui(null);
  }

  setExchangeMyMoney(value: number) {
    const exchangeData = this.state.exchangeData;
    if (exchangeData) {
      exchangeData.myData.money = value;
      this.setState({ exchangeData });
    }
  }

  _exchangeInputTimer: number | null = null;

  handleExchangeInput = (value: string) => {
    const parsedValue = Number.parseInt(value);
    if (Number.isNaN(parsedValue)) {
      this.setExchangeMyMoney(0);
    } else {
      this.setExchangeMyMoney(parsedValue);
    }

    if (!this._exchangeInputTimer && this.state.exchangeData) {
      this._exchangeInputTimer = window.setTimeout(() => {
        CustomEvent.triggerServer(
          "inventory::exchange::moneyChange",
          this.state.exchangeData?.myData.money || 0
        );
        this._exchangeInputTimer = null;
      }, 1000);
    }
  };

  getHotkeyItemSlot(slot: number) {
    const actualSlot = slot >= 10000 ? slot - 10000 : slot;

    if (actualSlot === 2) {
      if (!this.state.backpackSlot) return null;
      return this.myInventory.items.find((q) => q[0] === this.state.backpackSlot);
    }

    if (actualSlot === 3) {
      if (!this.state.armorSlot) return null;
      return this.myInventory.items.find((q) => q[0] === this.state.armorSlot);
    }

    if (actualSlot === 4) {
      if (!this.state.phoneSlot) return null;
      return this.myInventory.items.find((q) => q[0] === this.state.phoneSlot);
    }

    if (!this.state.hotkeys) return null;
    const id = this.state.hotkeys[actualSlot];
    if (!id) return null;
    return this.myInventory.items.find((q) => q[0] === id);
  }

  get myInventory() {
    const items = this.state.blocks.find(
      (block) =>
        block.owner_type === OWNER_TYPES.PLAYER && block.owner_id === CEF.id
    );

    if (!items)
      return { items: [] as InventoryItemCef[], weight: 0, weight_max: 0 };

    let weight = 0;
    items.items.map((itemCef) => {
      const item = convertInventoryItemArrayToObject(itemCef);
      weight += getItemWeight(item.item_id, item.count);
    });

    return {
      ...items,
      weight: weight,
    };
  }

  drawEmptyItem = (key?: any, slot?: number) => {
    const isCurrentDragging =
      this.state.current &&
      this.state.current[0] !== OWNER_TYPES.PLAYER &&
      this.state.current[1] !== -1;

    const isSpecialSlot =
      slot !== undefined && (slot === 10003 || slot === 10004);

    const actualSlot = isSpecialSlot ? slot - 10000 : slot;

    const isTargetSlot =
      this.state.containerType === OWNER_TYPES.HOTKEY &&
      ((!isSpecialSlot && this.state.containerNumber === slot) ||
        (isSpecialSlot && this.state.containerNumber === slot));

    const className = `${
      this.isDragToHotkey() && slot !== undefined ? "slot" : ""
    } slot`;

    return (
      <div
        tabIndex={-1}
        className={className}
        key={key}
        style={{ zIndex: 10004 }}
        onMouseEnter={() =>
          slot !== undefined
            ? this.enterContainer(OWNER_TYPES.HOTKEY, slot, 0)
            : null
        }
        onMouseLeave={() =>
          slot !== undefined
            ? this.enterContainer(OWNER_TYPES.PLAYER, -1)
            : null
        }
      />
    );
  };

  drawEmptyString = (count = 7, key?: any): React.ReactElement[] => {
    const items: React.ReactElement[] = [];
    for (let q = 0; q < count; q++) {
      items.push(this.drawEmptyItem(`${key}_${q}`));
    }
    return items;
  };

  isDragToHotkey = () => {
    return (
      this.state.current[0] === OWNER_TYPES.PLAYER &&
      CEF.id === this.state.current[1]
    );
  };

  renderInventoryContainerItems = (
    owner_type: OWNER_TYPES,
    owner_id: number,
    items: InventoryItemCef[],
    line: 7 | 5 | 12 | 20,
    mini: boolean,
    isDraggable?: { x: number; y: number }
  ): React.ReactElement => {
    const minSlots = owner_type === OWNER_TYPES.PLAYER && owner_id === CEF.id 
      ? line * 4 
      : owner_type === OWNER_TYPES.BAG 
        ? line * 3
        : line;

    let count = items.length;
    while (count >= line) count -= line;

    const isActivelyDragging =
      this.state.current &&
      this.state.current[0] !== OWNER_TYPES.PLAYER &&
      this.state.current[1] !== -1;

    const isTargetContainer =
      this.state.containerType === owner_type &&
      this.state.containerNumber === owner_id;

    // const targetContainerClass =
    //   isTargetContainer && isActivelyDragging ? "target-container" : "";

    const totalSlots = Math.max(
      items.length + (line - (count || line)),
      minSlots
    );

    const slots = new Array(totalSlots).fill(null);

    items.forEach((item) => {
      const itemObj = convertInventoryItemArrayToObject(item);

      let slotIndex = -1;

      try {
        const extraData = item[4] ? JSON.parse(item[4]) : null;
        if (extraData && typeof extraData.slot === "number") {
          slotIndex = extraData.slot;
        }
      } catch (e) {
      }

      if (slotIndex >= 0 && slotIndex < slots.length) {
        if (slots[slotIndex] === null) {
          slots[slotIndex] = item;
        } else {
          let foundEmptySlot = false;
          for (let i = 0; i < slots.length; i++) {
            if (slots[i] === null) {
              slots[i] = item;
              foundEmptySlot = true;
              break;
            }
          }

          if (!foundEmptySlot) {
            slots.push(item);
          }
        }
      } else {
        let foundEmptySlot = false;
        for (let i = 0; i < slots.length; i++) {
          if (slots[i] === null) {
            slots[i] = item;
            foundEmptySlot = true;
            break;
          }
        }

        if (!foundEmptySlot) {
          slots.push(item);
        }
      }
    });

    return (
      <div
        className={`inventory-slots`}
        onMouseEnter={() => this.enterContainer(owner_type, owner_id)}
        onMouseLeave={() => this.enterContainer(OWNER_TYPES.PLAYER, -1)}
      >
        {slots.map((item, slotIndex) => {
          const isTargetSlot =
            isTargetContainer && this.state.containerSlot === slotIndex;
          // const slotClass =
          //   isTargetSlot && isActivelyDragging ? "target-slot" : "";

          if (item) {
            return (
              <div
                key={`slot_${owner_type}_${owner_id}_${slotIndex}`}
                className={`item-slot`}
                onMouseEnter={() =>
                  this.enterContainer(owner_type, owner_id, slotIndex)
                }
              >
                <ItemDraw
                  inventory={this}
                  item={item}
                  owner_type={owner_type}
                  owner_id={owner_id}
                  keyName={slotIndex}
                  isDraggable={isDraggable || null}
                />
              </div>
            );
          } else {
            return (
              <div
                key={`empty_slot_${owner_type}_${owner_id}_${slotIndex}`}
                className={`empty-slot`}
                onMouseEnter={() =>
                  this.enterContainer(owner_type, owner_id, slotIndex)
                }
                onMouseLeave={() => this.enterContainer(OWNER_TYPES.PLAYER, -1)}
              >
                {this.drawEmptyItem(
                  `empty_${owner_type}_${owner_id}_${slotIndex}`
                )}
              </div>
            );
          }
        })}
      </div>
    );
  };

  render() {
    if (!this.state.open) return <></>;

    const filteredBlocks = this.state.blocks.filter(
      (q) =>
        !(q.owner_type === OWNER_TYPES.PLAYER && q.owner_id === CEF.id) &&
        !q.show &&
        !CONTAINERS_DATA.some((s) => s.owner_type === q.owner_type)
    );

    const hasOtherContainers = filteredBlocks.some(
      (b) => b.owner_type !== OWNER_TYPES.WORLD
    );

    const inventoryData = this.myInventory;
    const inventoryWeight = inventoryData.weight || 0;
    const inventoryMaxWeight = inventoryData.weight_max || 0;

    return (
      <div
        className="inventory-container-box"
        style={{
          background: `${
            this.state.isExchangeOpened ? "rgba(17, 19, 17, 0.9)" : ""
          }`
          // background: !CEF.test ? "transparent" : "rgba(0, 0, 0, 0.9)"
        }}
      >
        <InventoryModal
          addModal={this.state.addModal}
          inv_level={this.state.inv_level}
          onClose={() => this.setState({ addModal: false })}
        />

        <div
          className={`all-inventory ${
            this.state.isExchangeOpened ? "exchange-mode" : ""
          }`}
        >
          <>
            <header className="inventory-header">
              <div className="inventory-header-block">
                <div className="inventory-header-block-item">
                  <img src={MouseLeftIcon} alt="" />
                  <span>Apasa pe un obiect pentru a vedea informatii despre el</span>
                </div>
                <div className="inventory-header-block-item">
                  <img src={MouseRightIcon} alt="" />
                  <span>
                    Poti tine apasat butonul stang al mouse-ului pentru a muta 
                    un obiect in inventar
                  </span>
                </div>
              </div>
              <div className="inventory-header-block">
                <div className="inventory-header-block-item-exit">
                  <span>Exit</span>
                  <img
                    src={ExitIcon}
                    alt=""
                    onClick={() => this.closeInventory()}
                  />
                </div>
              </div>
            </header>
            {/* <div className="top">
              <div className="title">
                <h1>
                  <span>inventory</span>
                </h1>
                <p>A place to store your personal belongings and items</p>
              </div>
            </div> */}
            <div className="content">
              <div
                className={`inventory ${
                  this.state.isExchangeOpened ? "exchange-opened" : ""
                }`}
              >
                <div className="inventory-top">
                  <div className="inventory-title element-title">
                    <div className="element-img">
                      <img src={bagpackIcon} alt="" />
                      <h1>Inventory</h1>
                    </div>
                  </div>
                  <div className="inventory-weight">
                    <div className="kg">
                      <p>
                        {(inventoryWeight / 1000).toFixed(1)} /{" "}
                        <span>{(inventoryMaxWeight / 1000).toFixed(1)} kg</span>
                      </p>
                    </div>
                    {!(
                      this.state.inv_level &&
                      this.state.inv_level >= PLAYER_INVENTORY_MAX_LEVEL
                    ) ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          this.setState({ addModal: true });
                        }}
                        onKeyDown={(e) => {
                          e.preventDefault();
                          this.setState({ addModal: true });
                        }}
                      >
                        +
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>

                {this.renderInventoryContainerItems(
                  OWNER_TYPES.PLAYER,
                  CEF.id,
                  this.myInventory.items,
                  7,
                  false
                )}
                <div style={{ height: "auto" }} className="inventory-backpack">
                  {(this.state.blocks?.length &&
                  this.state.blocks.some((q) => q.show)) ? (
                    this.state.blocks
                      .filter(
                        (q) =>
                          !(
                            q.owner_type === OWNER_TYPES.PLAYER &&
                            q.owner_id === CEF.id
                          ) && q.show
                      )
                      .map((block) => {
                        let blockWeight = 0;
                        block.items.forEach((itemCef) => {
                          const item =
                            convertInventoryItemArrayToObject(itemCef);
                          blockWeight += getItemWeight(
                            item.item_id,
                            item.count
                          );
                        });

                        return (
                          <React.Fragment
                            key={`${block.owner_type}-${block.owner_id}`}
                          >
                            <InventoryContainer
                              owner_type={block.owner_type}
                              owner_id={block.owner_id}
                              name={block.name}
                              desc={block.desc}
                              items={block.items || []}
                              max_weight={block.weight_max}
                              weight={blockWeight}
                              line={12}
                              close={block.closed}
                              draggable={block.show ? null : null}
                              drag={block.drag}
                              inventory={this}
                              onEnterContainer={this.enterContainer}
                              renderEmptyString={this.drawEmptyString}
                              renderInventoryContainerItems={
                                this.renderInventoryContainerItems
                              }
                            />
                          </React.Fragment>
                        );
                      })
                  ) : (
                    <>
                      <div className="inventory-top">
                        <div className="inventory-title element-title">
                          <div className="element-img">
                            <img src={bagpackIcon} alt="" />
                            <h1>Backpack</h1>
                          </div>
                          {/* <p>Lorem ipsum dolor sit amet!</p> */}
                        </div>
                      </div>
                      <div className="inventory-disable-container">
                        <div className="inventory-slots">
                          {this.drawEmptyString(12)}
                        </div>
                        <div className="inventory-overlay">
                          <img src={lockedIcon} alt="" />
                          <span>Nu ai un rucsac</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {!this.state.isExchangeOpened && (
                  <div className="inventory-hotkeys">
                    <div className="hotkeys">
                      <Hotkeys
                        hotkeys={this.state.hotkeys.slice(2, 8)}
                        baseSlot={2}
                        showNumbers={true}
                        getHotkeyItemSlot={this.getHotkeyItemSlot.bind(this)}
                        inventory={this}
                        drawEmptyItem={this.drawEmptyItem}
                        onEnterContainer={this.enterContainer}
                      />
                    </div>
                  </div>
                )}
              </div>
              {!this.state.isExchangeOpened ? (
                <div className="inventory-clothes">
                  <ClothesEquipment
                    equip={this.state.equip}
                    weapons={this.state.weapons}
                    inventory={this}
                    onEnterContainer={this.enterContainer}
                    hunger={this.state.hunger}
                    thirst={this.state.thirst}
                  />
                  {!this.state.isExchangeOpened && this.state.hotkeys ? (
                    <div className="hotkeys">
                      <Hotkeys
                        hotkeys={[
                          this.state.hotkeys[0],
                          this.state.hotkeys[1],
                          this.state.backpackSlot || null,
                          this.state.armorSlot || null,
                          this.state.phoneSlot || null,
                        ]}
                        baseSlot={0}
                        showNumbers={true}
                        isSpecial={true}
                        getHotkeyItemSlot={this.getHotkeyItemSlot.bind(this)}
                        inventory={this}
                        drawEmptyItem={this.drawEmptyItem}
                        onEnterContainer={this.enterContainer}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <></>
              )}
              <div className="storage">
                <div
                  className="storage-blocks"
                  // style={{
                  // height: this.state.isExchangeOpened ? "100%" : "100%",
                  // }}
                >
                  {!this.state.isExchangeOpened &&
                    this.state.blocks?.length &&
                    this.state.blocks
                      .filter(
                        (q) =>
                          !(
                            q.owner_type === OWNER_TYPES.PLAYER &&
                            q.owner_id === CEF.id
                          ) &&
                          !q.show &&
                          !CONTAINERS_DATA.some(
                            (s) => s.owner_type === q.owner_type
                          ) &&
                          !(
                            q.owner_type === OWNER_TYPES.WORLD &&
                            hasOtherContainers
                          )
                      )
                      .map((block, index) => {
                        let blockWeight = 0;
                        block.items.forEach((itemCef) => {
                          const item =
                            convertInventoryItemArrayToObject(itemCef);
                          blockWeight += getItemWeight(
                            item.item_id,
                            item.count
                          );
                        });

                        return (
                          <InventoryContainer
                            key={`container-${block.owner_type}-${block.owner_id}`}
                            owner_type={block.owner_type}
                            owner_id={block.owner_id}
                            name={block.name}
                            desc={block.desc}
                            items={block.items}
                            max_weight={block.weight_max}
                            weight={blockWeight}
                            line={60}
                            close={block.closed}
                            draggable={
                              block.show
                                ? { left: block.left, top: block.top }
                                : undefined
                            }
                            inventory={this}
                            onEnterContainer={this.enterContainer}
                            renderEmptyString={this.drawEmptyString}
                            renderInventoryContainerItems={
                              this.renderInventoryContainerItems
                            }
                          />
                        );
                      })}

                  {this.state.isExchangeOpened && this.state.exchangeData && (
                    <ExchangeBlock
                      exchangeData={this.state.exchangeData}
                      onInputChange={this.handleExchangeInput}
                    />
                  )}
                </div>
                {/* <div className="hotkeys">
                  {!this.state.isExchangeOpened && this.state.hotkeys ? (
                    <Hotkeys 
                      hotkeys={this.state.hotkeys}
                      getHotkeyItemSlot={this.getHotkeyItemSlot.bind(this)}
                      inventory={this}
                      drawEmptyItem={this.drawEmptyItem}
                      onEnterContainer={this.enterContainer}
                    />
                  ) : (
                    <></>
                  )}
                </div> */}
              </div>
            </div>
          </>
        </div>
      </div>
    );
  }
}
