import React, { Component, createRef, JSX } from "react";
import { LangString } from "../../../modules/lang";
import { 
  convertInventoryItemArrayToObject, 
  getItemDesc, 
  getItemName, 
  getItemWeight,
  CONTAINERS_DATA,
  OWNER_TYPES,
  ITEM_TYPE,
  inventoryShared,
  InventoryDataCef,
  InventoryItemCef
} from "../../../../shared/inventory";
import { CEF } from "../../../modules/CEF";
import { CustomEvent } from "../../../modules/custom.event";
import { ItemDrawProps, ItemDrawState } from "./types";
import { NewSliderStyles } from "./ui/Slider";
import { ItemTooltip } from "./ItemTooltip";
import ellipse from "./../../Dialog/assets/ellipse.svg";
import { SplitModal } from "./SplitModal";

// @ts-ignore
const iconsItems = Object.fromEntries(
  Object.entries(
    import.meta.glob("../../../../shared/icons/*.png", { eager: true }),
  ).map(([key, value]) => {
    const name = key.match(/\/([^/]+)\.png$/)[1];
    //@ts-ignore
    return [name, value.default];
  }),
);

const defaultIconImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

export class ItemDraw extends Component<ItemDrawProps, ItemDrawState> {
  div: React.RefObject<HTMLDivElement>;
  dragTimeout: number | null = null;

  constructor(props: ItemDrawProps) {
    super(props);
    this.div = createRef();
    this.state = {
      position: [0, 0],
      split: 0,
      isDragging: false,
      dragStarted: false,
      showSplitModal: false,
    };
  }

  get item() {
    return convertInventoryItemArrayToObject(this.props.item);
  }

  get itemCfg() {
    return inventoryShared.get(this.item.item_id);
  }

  get weaponCfg() {
    const cfg = this.itemCfg;
    return cfg.type === ITEM_TYPE.WEAPON
      ? inventoryShared.getWeaponConfigByItemId(this.item.item_id)
      : null;
  }

  get owner_type() {
    return this.props.owner_type;
  }

  get owner_id() {
    return this.props.owner_id;
  }

  get blocks() {
    return this.props.inventory.state.blocks;
  }

  get inventory() {
    return this.props.inventory;
  }

  get id() {
    return this.item.id;
  }

  get hotkeys() {
    return this.props.inventory.state.hotkeys;
  }

  get hotkeySlot() {
    return this.hotkeys.findIndex((q: number) => q === this.id);
  }

  get canUse() {
    const cfg = this.itemCfg;
    const inv = CONTAINERS_DATA.find((c) => c.item_id === this.item.item_id);
    if (inv) return true;
    return cfg.use && this.isMyInventory;
  }

  get isMyInventory() {
    return this.owner_type === OWNER_TYPES.PLAYER && this.owner_id === CEF.id;
  }

  transfer(target_type: OWNER_TYPES, target_id: number, source_slot?: number, target_slot?: number) {
    if (target_type === OWNER_TYPES.WORLD) return this.dropItem();
    if (
      this.owner_type === OWNER_TYPES.WORLD &&
      (target_type !== OWNER_TYPES.PLAYER || target_id !== CEF.id)
    )
      return;
    this.setState({ rightClick: false }, () => {
      const data: any = { 
        task: "transfer", 
        target_type, 
        target_id,
        owner_type: this.owner_type,
      };
      
      if (source_slot !== undefined) {
        data.source_slot = source_slot;
      }
      
      if (target_slot !== undefined) {
        data.target_slot = target_slot;
      }
      
      this.choiceItem(data);
      CEF.playSound("up-inventory", 0.05);
    });
  }

  useItem(e: React.MouseEvent<any, MouseEvent>) {
    const inv = !this.weaponCfg
      ? CONTAINERS_DATA.find((c) => c.item_id === this.item.item_id)
      : null;
    console.log(inv);
    if (!inv && this.owner_type !== OWNER_TYPES.PLAYER)
      return this.transfer(OWNER_TYPES.PLAYER, CEF.id);
    if (!inv && this.owner_id !== CEF.id)
      return this.transfer(OWNER_TYPES.PLAYER, CEF.id);
    if (!this.canUse) return;
    
    const isBackpack = this.itemCfg.type === ITEM_TYPE.BAGS;
    
    if (inv) {
      CustomEvent.callServer("inventory:bag:selectBag", this.item.id).then((res) => {
        if (res == "show") {
          this.inventory.showBlocks(inv.owner_type, this.id, e.pageX, e.pageY);
          
          if (isBackpack) {
            CustomEvent.callServer("inventory:getSpecialSlots").then((slots) => {
              if (slots && Array.isArray(slots) && slots.length >= 3) {
                const [armorId, phoneId, backpackId] = slots;
                this.inventory.setState({
                  armorSlot: armorId,
                  phoneSlot: phoneId,
                  backpackSlot: backpackId
                });
              }
            });
          }
        } else if (res == "hide") {
          this.inventory.hideBlocks(inv.owner_type, this.id);
          
          if (isBackpack) {
            CustomEvent.callServer("inventory:getSpecialSlots").then((slots) => {
              if (slots && Array.isArray(slots) && slots.length >= 3) {
                const [armorId, phoneId, backpackId] = slots;
                this.inventory.setState({
                  armorSlot: armorId,
                  phoneSlot: phoneId,
                  backpackSlot: backpackId
                });
              }
            });
          }
        }
      });
    }
    
    this.setState({ rightClick: false }, () => {
      if (!inv) {
        this.choiceItem({ task: "useItem" });
        
        if (isBackpack) {
          setTimeout(() => {
            CustomEvent.callServer("inventory:getSpecialSlots").then((slots) => {
              if (slots && Array.isArray(slots) && slots.length >= 3) {
                const [armorId, phoneId, backpackId] = slots;
                this.inventory.setState({
                  armorSlot: armorId,
                  phoneSlot: phoneId,
                  backpackSlot: backpackId
                });
              }
            });
          }, 100);
        }
        
        // CustomEvent.triggerServer("inventory:close");
        // CEF.gui.setGui(null);
      }
      CEF.playSound("up-inventory", 0.05);
    });
  }

  weaponMods(e: React.MouseEvent<any, MouseEvent>) {
    const inv = CONTAINERS_DATA.find((c) => c.item_id === this.item.item_id);
    if (!inv) return this.useItem(e);
    this.inventory.showBlocks(inv.owner_type, this.id, e.pageX, e.pageY);
    this.setState({ rightClick: false }, () => {
      CEF.playSound("up-inventory", 0.05);
    });
  }

  openSplitModal() {
    this.setState({ 
      rightClick: false,
      showSplitModal: true 
    });
  }

  closeSplitModal() {
    this.setState({ showSplitModal: false });
  }

  split(amount: number) {
    if (this.item.count < 2 || amount < 1 || amount > this.item.count - 1) return;
    
    if (this.item.count - amount < 1) return;
    
    this.setState({ showSplitModal: false }, () => {
      this.choiceItem({
        task: "split",
        target_id: amount
      });
      CEF.playSound("up-inventory", 0.05);
    });
  }


  dropItem() {
    if (this.owner_type === OWNER_TYPES.WORLD) return;
    this.setState({ rightClick: false }, () => {
      this.choiceItem({ task: "drop" });
      CEF.playSound("drop-inventory", 0.05);
    });
  }

  addToExchange() {
    const itemConfig = inventoryShared.get(this.item.item_id);
    if (itemConfig.blockMove) {
      return;
    }

    CustomEvent.triggerServer("inventory::exchange::add", this.props.item[0]);
  }

  selectToDisplay() {
    if (this.itemCfg.type === ITEM_TYPE.BAGS)
      CustomEvent.triggerServer("inventory:bag:selectDisplay", this.item.id);
  }

  private choiceItem(data: Partial<any>) {
    this.setState({ rightClick: false }, () => {
      if (this.props.ishotkey && data.task === "unload_hotkey") {
        CustomEvent.triggerServer("inventory:choiceItem", {
          item: {
            id: this.item.id,
          },
          owner_type: OWNER_TYPES.PLAYER,
          owner_id: CEF.id,
          task: "unload_hotkey",
          hotkey_slot: data.owner_id,
        });
      } else {
        CustomEvent.triggerServer("inventory:choiceItem", {
          item: {
            id: this.item.id,
          },
          owner_type: this.owner_type,
          owner_id: this.owner_id,
          ...data,
        });
      }
    });
  }

  get drawEquipHotkeyChoice() {
    const items: JSX.Element[] = [];
    if (this.hotkeys.find((q: number) => q === this.id)) {
      items.push(
        <li
          key={"equip_hotkey_li_unload"}
          onClick={(e) => {
            e.preventDefault();
            this.choiceItem({
              task: "unload_hotkey",
              owner_id: this.hotkeySlot,
            });
          }}
          onKeyDown={(e) => {
            e.preventDefault();
            this.choiceItem({
              task: "unload_hotkey",
              owner_id: this.hotkeySlot,
            });
          }}
        >
          <p tabIndex={-1} className="p-14px fw500 dark">
            {LangString(
              "components.Inventory.index_new.146ee2f7858225ffc22cd671a4e35ded",
            )}{" "}
            {this.hotkeySlot + 1}
          </p>
        </li>,
      );
    } else {
      for (let id = 0; id < 5; id++) {
        items.push(
          <li
            onClick={(e) => {
              e.preventDefault();
              this.choiceItem({ task: "load_hotkey", owner_id: id });
            }}
            onKeyDown={(e) => {
              e.preventDefault();
              this.choiceItem({ task: "load_hotkey", owner_id: id });
            }}
            key={`equip_hotkey_li_${id}`}
          >
            <p tabIndex={-1} className="p-14px fw500 dark">
              {LangString(
                "components.Inventory.index_new.f44822dddda3e4f024201e7101568b72",
              )}{" "}
              {id + 1}{" "}
              {LangString(
                "components.Inventory.index_new.790e448886c728ca3c33a6a0979dec77",
              )}
            </p>
          </li>,
        );
      }
    }

    return items;
  }

  modalResponse = (key: number) => {
    const split = this.state.split;
    this.setState({ ...this.state, split: 0 });
    if (key !== 0) return;
    if (this.item.count < 2) return;
    this.split(split);
  };

  modal = () => {
    if (!this.state.split) return null;
    return (
      <div
        tabIndex={-1}
        className="dialog_main_wrap"
        style={{ zIndex: 20000, position: "absolute" }}
      >
        <div
          tabIndex={-1}
          className={"dialog_main"}
          style={{ position: "fixed", left: 0, top: 0 }}
        >
          <div tabIndex={-1} className="dialog_blur" />
          <div tabIndex={-1} className="dialog_grid" />
          <img tabIndex={-1} className="dialog_ellipse" src={ellipse} />
          <div tabIndex={-1} className="dialog_box">
            <h1>
              {LangString(
                "components.Inventory.index_new.06bb7a64bbfb18bfd5d89a3bb214dec9",
              )}
            </h1>
            <p>
              {LangString(
                "components.Inventory.index_new.17bda8603ae02ee2ca65f676ae3ad6cd",
              )}
            </p>
            <div tabIndex={-1} className="dialog_info">
              {this.addSlider(
                this.state.split,
                this.item.count - 1,
                (value: number) => {
                  this.setState({ ...this.state, split: value });
                },
              )}
            </div>
            <h5>
              {this.state.split}/{this.item.count - this.state.split}
            </h5>
            <div tabIndex={-1} className="dialog_button">
              <div
                tabIndex={-1}
                className="dialog_key"
                onClick={() => this.modalResponse(0)}
                onKeyDown={() => this.modalResponse(0)}
              >
                {LangString(
                  "components.Inventory.index_new.44ed1f05ba67cc28636f31f40338561d",
                )}
              </div>
              <div
                tabIndex={-1}
                className="dialog_key"
                onClick={() => this.modalResponse(1)}
                onKeyDown={() => this.modalResponse(1)}
              >
                {LangString(
                  "components.Inventory.index_new.d7e58648a9b54448d34cf9062c4a17f8",
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  private listenerKeyDown = (e: any): void => {
    if (e.keyCode === 9) {
      e.preventDefault();
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.listenerKeyDown);
    document.addEventListener("mouseup", this.handleMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.listenerKeyDown);
    document.removeEventListener("mouseup", this.handleMouseUp);
    if (this.dragTimeout) {
      clearTimeout(this.dragTimeout);
      this.dragTimeout = null;
    }
  }

  addSlider = (value: number, max: number, onChange: (val: number) => void) => {
    return (
      <div tabIndex={-1} style={{ width: "80%" }}>
        <NewSliderStyles
          min={1}
          max={max}
          step={1}
          value={value}
          valueLabelDisplay="off"
          getAriaValueText={(value: number) => {
            return `${value}%`;
          }}
          onChange={(_: any, val: number) => onChange(val)}
        />
      </div>
    );
  };

  get positionTooltip() {
    return {
      left: this.state.left + 10,
      top: this.state.top + 10,
    };
  }

  handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || this.state.rightClick) return;

    this.dragTimeout = window.setTimeout(() => {
      this.setState({ 
        dragStarted: true,
        position: [
          (e.clientX / document.documentElement.clientWidth) * 100,
          (e.clientY / document.documentElement.clientHeight) * 100,
        ],
        isDragging: true,
        rightClick: false
      });
      this.inventory.currentItem(this.props.owner_type, this.props.owner_id);
      document.addEventListener("mousemove", this.handleMouseMove);
      this.dragTimeout = null;
    }, 150); 
  };

  handleMouseMove = (e: MouseEvent) => {
    if (!this.state.isDragging) return;
    
    this.setState({
      position: [
        (e.clientX / document.documentElement.clientWidth) * 100,
        (e.clientY / document.documentElement.clientHeight) * 100,
      ]
    });
  };

  handleMouseUp = (e: MouseEvent) => {
    if (this.dragTimeout) {
      clearTimeout(this.dragTimeout);
      this.dragTimeout = null;
    }

    if (!this.state.isDragging) return;
    
    document.removeEventListener("mousemove", this.handleMouseMove);
    
    this.completeTransfer();
    
    this.setState({ 
      isDragging: false, 
      dragStarted: false,
      position: [0, 0] 
    });
  };

  completeTransfer = () => {
    const { containerType, containerNumber, containerSlot } = this.inventory.state;
    
    const isBackpack = this.itemCfg.type === ITEM_TYPE.BAGS;
    const isFromBackpackHotkey = this.props.ishotkey && 
                               (this.props.owner_id === 10002 || 
                               (this.inventory.state.isSpecial && this.props.owner_id === 2));
    
    if (isBackpack && this.props.ishotkey && containerType !== OWNER_TYPES.HOTKEY) {
      this.useItem({ preventDefault: () => {}, pageX: 0, pageY: 0 } as any);
      CEF.playSound("up-inventory", 0.05);
      this.inventory.currentItem(OWNER_TYPES.PLAYER, -1);
      return;
    }
    
    if (
      containerType === this.owner_type &&
      containerNumber === this.owner_id
    ) {
      const sourceBlock = this.inventory.state.blocks.find(
        (block: InventoryDataCef) => block.owner_type === this.owner_type && block.owner_id === this.owner_id
      );
      
      if (sourceBlock && containerSlot !== undefined) {
        let sourceSlot = -1;
        
        try {
          const extraData = this.item.extra ? JSON.parse(this.item.extra) : null;
          if (extraData && typeof extraData.slot === 'number') {
            sourceSlot = extraData.slot;
          }
        } catch (e) {
        }
        
        if (sourceSlot === -1) {
          sourceSlot = sourceBlock.items.findIndex((item: InventoryItemCef) => item[0] === this.id);
        }
        
        if (sourceSlot !== containerSlot && sourceSlot !== -1) {
          this.choiceItem({
            task: "slot_move",
            source_slot: sourceSlot,
            target_slot: containerSlot
          });
          
          CEF.playSound("up-inventory", 0.05);
        }
      }
      
      return;
    }

    let sourceSlot = -1;
    
    try {
      const extraData = this.item.extra ? JSON.parse(this.item.extra) : null;
      if (extraData && typeof extraData.slot === 'number') {
        sourceSlot = extraData.slot;
      }
    } catch (e) {
    }
    
    if (sourceSlot === -1 && !this.props.ishotkey) {
      const sourceBlock = this.inventory.state.blocks.find(
        (block: InventoryDataCef) => block.owner_type === this.owner_type && block.owner_id === this.owner_id
      );
      
      if (sourceBlock) {
        sourceSlot = sourceBlock.items.findIndex((item: InventoryItemCef) => item[0] === this.id);
      }
    }

    switch (containerType) {
      case OWNER_TYPES.HOTKEY:
        if (containerNumber === 10002 || (this.inventory.state.isSpecial && containerNumber === 2)) {
          if (this.itemCfg.type === ITEM_TYPE.BAGS) {
            this.useItem({ preventDefault: () => {}, pageX: 0, pageY: 0 } as any);
            setTimeout(() => {
              CustomEvent.callServer("inventory:getSpecialSlots").then((slots) => {
                if (slots && Array.isArray(slots) && slots.length >= 3) {
                  const [armorId, phoneId, backpackId] = slots;
                  this.inventory.setState({
                    armorSlot: armorId,
                    phoneSlot: phoneId,
                    backpackSlot: backpackId
                  });
                }
              });
            }, 100);
          } else {
            this.choiceItem({
              task: "load_hotkey",
              owner_id: containerNumber,
              source_slot: sourceSlot,
              owner_type: this.owner_type
            });
          }
        } else {
          this.choiceItem({
            task: "load_hotkey",
            owner_id: containerNumber,
            source_slot: sourceSlot,
            owner_type: this.owner_type
          });
        }
        CEF.playSound("up-inventory", 0.05);
        break;
      
      case OWNER_TYPES.CLOTHES:
        this.useItem({ preventDefault: () => {}, pageX: 0, pageY: 0 } as any);
        break;
      
      case OWNER_TYPES.WORLD:
        this.dropItem();
        break;
      
      default:
        if (containerType !== -1 && containerNumber !== -1) {
          const targetSlot = containerSlot !== undefined ? containerSlot : -1;
          this.transfer(containerType, containerNumber, sourceSlot, targetSlot);
        }
        break;
    }
    
    this.inventory.currentItem(OWNER_TYPES.PLAYER, -1);
  };

  render() {
    if (!this.item) return <></>;
    const obj = document.getElementById(
      `item_continer_draggable_${this.props.owner_type}_${this.props.owner_id}`,
    );
    let posX = 0;
    let posY = 0;
    if (obj && this.props.isDraggable) {
      posX = obj.offsetLeft - obj.offsetWidth / 2;
      posY = obj.offsetTop - obj.offsetHeight;
    }
    
    const isDraggingClass = this.state.isDragging ? "dragging" : "";
    
   return (
      <>
        {this.modal()}

        {this.state.showSplitModal && (
          <SplitModal
            isOpen={this.state.showSplitModal}
            item={this.props.item}
            onClose={this.closeSplitModal.bind(this)}
            onSplit={this.split.bind(this)}
          />
        )}

        {this.state.rightClick ?
          <ItemTooltip
            item={this.item}
            itemCfg={this.itemCfg}
            positionTooltip={this.positionTooltip}
            inventory={this.inventory}
            owner_type={this.owner_type}
            owner_id={this.owner_id}
            blocks={this.blocks}
            canUse={this.canUse}
            ishotkey={this.props.ishotkey}
            weaponCfg={this.weaponCfg}
            transfer={this.transfer.bind(this)}
            useItem={this.useItem.bind(this)}
            weaponMods={this.weaponMods.bind(this)}
            split={this.openSplitModal.bind(this)}
            dropItem={this.dropItem.bind(this)}
            addToExchange={this.addToExchange.bind(this)}
            selectToDisplay={this.selectToDisplay.bind(this)}
            isMyInventory={this.isMyInventory}
            drawEquipHotkeyChoice={this.drawEquipHotkeyChoice}
            isDraggable={this.props.isDraggable}
            onClose={() => this.setState({ rightClick: false })}
          />
        : <></>}
        
        <div
          tabIndex={-1}
          className={`slot ${isDraggingClass}`}
          key={`${this.props.owner_type}_${this.props.owner_id}_${this.item.id}_${this.props.keyName}`}
          style={{
            position: this.state.isDragging ? "fixed" : "relative",
            zIndex: this.state.isDragging ? 10006 : 10004,
            top: this.state.isDragging ? `calc(${this.state.position[1]}vh - ${posY}px)` : "auto",
            left: this.state.isDragging ? `calc(${this.state.position[0]}vw - ${posX}px)` : "auto",
            pointerEvents: this.state.isDragging ? "none" : "auto",
            cursor: this.state.isDragging ? "grabbing" : "grab",
            opacity: this.state.isDragging ? 0.8 : 1,
          }}
          onMouseDown={this.handleMouseDown}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            this.setState({
              rightClick: true,
              left: e.pageX,
              top: e.pageY,
            });
          }}
          onClick={(e) => {
            e.preventDefault();
            if (!this.state.clickPress) {
              this.setState({ clickPress: true }, () => {
                setTimeout(() => {
                  this.setState({ clickPress: false });
                }, 550);
              });
              return;
            }
            this.useItem(e);
          }}
          ref={this.div}
        >
          <div className="item">
            <div className="weapon-item">
              <div className="img-wrap">
                <img
                  tabIndex={-1}
                  src={iconsItems[`Item_${this.item.item_id}`] || defaultIconImage}
                  alt=""
                  draggable="false"
                />
              </div>
              {!this.props.ishotkey ? (
                <i tabIndex={-1} className="count p-14px fw700 upper">
                  x{this.item.count}
                </i>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
} 