import React, { JSX } from "react";
import { OWNER_TYPES } from "../../../../shared/inventory";
import hotbaricon from "../img/hotbarIcon.png";
import { ItemDraw } from "./ItemDraw";
import { CEF } from "../../../modules/CEF";

// @ts-ignore
const svg = Object.fromEntries(
  Object.entries(import.meta.glob("../images/svg/*.svg", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.svg$/)[1];
      //@ts-ignore
      return [name, value.default];
    },
  ),
);

interface HotkeysProps {
  hotkeys: (number | null)[];
  getHotkeyItemSlot: (slot: number) => any;
  inventory: any;
  drawEmptyItem: (key?: any, slot?: number) => JSX.Element;
  onEnterContainer: (owner_type: OWNER_TYPES, owner_id: number, slot?: number) => void;
  baseSlot?: number;
  showNumbers?: boolean;
  isSpecial?: boolean;
}

export const Hotkeys: React.FC<HotkeysProps> = (props) => {
  const { hotkeys, getHotkeyItemSlot, inventory, drawEmptyItem, onEnterContainer, showNumbers = true, isSpecial = false } = props;

  const hotkeyHighlightClass = "";

  const renderEmptySlotIcon = (slot: number) => {
    const actualSlot = props.baseSlot !== undefined ? props.baseSlot + slot : slot;
    
    if (props.isSpecial && slot === 2) {
      return (
        <div className="empty-slot-icon">
          <img src={svg["backpack-hotkey"]} alt="Backpack Slot" />
        </div>
      );
    }

    if (props.isSpecial && slot === 3) {
      return (
        <div className="empty-slot-icon">
          <img src={svg["body-armor"]} alt="Armor Slot" />
        </div>
      );
    }
    
    if (props.isSpecial && slot === 4) {
      return (
        <div className="empty-slot-icon">
          <img src={svg["phone"] || svg["watch"]} alt="Phone Slot" />
        </div>
      );
    }
    
    return null;
  };

  return (
    <>
      {/* <div className="hotkeys-top">
        <div className="hotkeys-title element-title">
          <div className="element-img">
            <img src={hotbaricon} height="14px" alt="" />
            <h1>Hotbar</h1>
          </div>
          <p>Quick access items</p>
        </div>
      </div> */}
      <div className={`hotkeys-slots ${hotkeyHighlightClass}`}>
        {hotkeys.map((id, slot) => {
          const actualSlot = props.baseSlot !== undefined ? props.baseSlot + slot : slot;
          const showNumberForSlot = showNumbers && (!isSpecial || slot < 2);
          
          // const isTargetSlot = props.inventory.state.containerType === OWNER_TYPES.HOTKEY && 
          //                    props.inventory.state.containerNumber === actualSlot;
          
          // const targetSlotClass = isTargetSlot ? "target-slot" : "";
          const targetSlotClass = "";

          const specialSlotId = isSpecial && ([2, 3, 4].includes(slot)) ? 10000 + slot : actualSlot;

          if (!id)
            return (
              <div key={`hotkey_${slot}_container`} 
                className={`hotkey-slot-container ${targetSlotClass}`}
                onMouseEnter={() => onEnterContainer(OWNER_TYPES.HOTKEY, specialSlotId, 0)}
                onMouseLeave={() => onEnterContainer(OWNER_TYPES.PLAYER, -1)}
              >
                <div className="empty-slot-wrapper">
                  {drawEmptyItem(`hotkey_${slot}`, specialSlotId)}
                  {renderEmptySlotIcon(slot)}
                </div>
                {showNumberForSlot && <div className="hotkey-number">{actualSlot + 1}</div>}
              </div>
            );
          const item = getHotkeyItemSlot(actualSlot);
          if (!item)
            return (
              <div key={`hotkey_${slot}_container`} 
                className={`hotkey-slot-container ${targetSlotClass}`}
                onMouseEnter={() => onEnterContainer(OWNER_TYPES.HOTKEY, specialSlotId, 0)}
                onMouseLeave={() => onEnterContainer(OWNER_TYPES.PLAYER, -1)}
              >
                <div className="empty-slot-wrapper">
                  {drawEmptyItem(`hotkey_${slot}`, specialSlotId)}
                  {renderEmptySlotIcon(slot)}
                </div>
                {showNumberForSlot && <div className="hotkey-number">{actualSlot + 1}</div>}
              </div>
            );
          return (
            <div
              key={`hotkey_${slot}_container`}
              className={`hotkey-slot-container ${targetSlotClass}`}
              onMouseEnter={() =>
                onEnterContainer(OWNER_TYPES.HOTKEY, specialSlotId)
              }
              onMouseLeave={() => onEnterContainer(OWNER_TYPES.PLAYER, -1)}
            >
              <ItemDraw
                keyName={`hotkey_${slot}`}
                owner_type={OWNER_TYPES.PLAYER}
                owner_id={CEF.id}
                item={item}
                inventory={inventory}
                ishotkey={true}
              />
              {showNumberForSlot && <div className="hotkey-number">{actualSlot + 1}</div>}
            </div>
          );
        })}
      </div>
    </>
  );
}; 