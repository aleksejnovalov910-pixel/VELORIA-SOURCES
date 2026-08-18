import React from "react";
import { LangString } from "../../../modules/lang";
import { InventoryEquipList, InventoryWeaponPlayerData, OWNER_TYPES, inventoryShared } from "../../../../shared/inventory";
import { CustomEvent } from "../../../modules/custom.event";
import { CEF } from "../../../modules/CEF";
import jacketOrangeIcon from "../img/clothes/jacket-orange.svg";
import { ItemDraw } from "./ItemDraw";

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

interface ClothesEquipmentProps {
  equip: InventoryEquipList;
  weapons: InventoryWeaponPlayerData;
  inventory: any;
  onEnterContainer: (owner_type: OWNER_TYPES, owner_id: number) => void;
  hunger: number;
  thirst: number;
}

export const ClothesEquipment: React.FC<ClothesEquipmentProps> = (props) => {
  const { equip, weapons, inventory, onEnterContainer, hunger, thirst } = props;

  const drawEquipmentItem = (item: keyof InventoryEquipList, id: number, icon: string) => {
    // @ts-ignore
    const hasEquip = !!(equip as any)[item as any];
    return (
      <div
        tabIndex={-1}
        className="clothes-item"
        onClick={(e) => {
          e.preventDefault();
          if (!hasEquip) return;
          CustomEvent.triggerServer("inventory:unequip_item", id);
        }}
        onKeyDown={(e) => {
          e.preventDefault();
          if (!hasEquip) return;
          CustomEvent.triggerServer("inventory:unequip_item", id);
        }}
      >
        <img
          tabIndex={-1}
          src={hasEquip ? (iconsItems[`Item_${id}`] || defaultIconImage) : (svg[icon] || defaultIconImage)}
          alt=""
        />
      </div>
    );
  };

  const renderWeaponImage = () => {
    if (!weapons || !weapons.item_id) {
      return (
        <img tabIndex={-1} src={svg.gun || defaultIconImage} alt="" />
      );
    }

    try {
      const item = inventory.myInventory.items.find(
        (q: any) => q[0] === weapons.id
      );

      if (item) {
        return (
          <ItemDraw
            keyName={`weapon_${0}`}
            owner_type={OWNER_TYPES.PLAYER}
            owner_id={CEF.id}
            item={item}
            inventory={inventory}
            ishotkey={true}
          />
        );
      } else {
        return <img tabIndex={-1} src={svg.gun || defaultIconImage} alt="" />;
      }
    } catch (e) {
      console.error("Error rendering weapon image:", e);
      return <img tabIndex={-1} src={svg.gun || defaultIconImage} alt="" />;
    }
  };

  const renderAmmoImage = () => {
    try {
      if (weapons && weapons.item_id && inventoryShared.getWeaponConfigByItemId) {
        const weaponConfig = inventoryShared.getWeaponConfigByItemId(weapons.item_id);
        if (weaponConfig && weaponConfig.ammo_box) {
          return (
            <img
              src={iconsItems[`Item_${weaponConfig.ammo_box}`] || defaultIconImage}
              alt=""
              draggable="false"
            />
          );
        }
      }
      return <img tabIndex={-1} src={svg.magazine || defaultIconImage} alt="" />;
    } catch (e) {
      console.error("Error rendering ammo image:", e);
      return <img tabIndex={-1} src={svg.magazine || defaultIconImage} alt="" />;
    }
  };

  return (
    <div className="clothes">
      <div className="clothes-title element-title">
        <div className="element-img">
          <div className="element-img-line"></div>
          <div className="clothes-image-title">
            <img src={jacketOrangeIcon} alt="" />
            <h1>Clothes</h1>
          </div>
          <div className="element-img-line"></div>
        </div>
      </div>
      <div
        className="clothes-items-all"
        onMouseEnter={() =>
          onEnterContainer(OWNER_TYPES.CLOTHES, CEF.id)
        }
        onMouseLeave={() => onEnterContainer(OWNER_TYPES.PLAYER, -1)}
      >
        <div className="clothes-items">
          {/* {drawEquipmentItem("armor", 960, "body-armor")} */}
          {drawEquipmentItem("gloves", 949, "gloves")}
          {drawEquipmentItem("hat", 954, "hat")}
          {drawEquipmentItem("glasses", 955, "glasses")}
          {drawEquipmentItem("ear", 956, "earrings")}
          {drawEquipmentItem("accessorie", 958, "tie")}
          {drawEquipmentItem("mask", 950, "mask")}
          {drawEquipmentItem("torso", 951, "clothes")}
          {drawEquipmentItem("bracelet", 959, "bracelet")}
          {drawEquipmentItem("leg", 952, "pants")}
          {drawEquipmentItem("watch", 957, "watch")}
          {drawEquipmentItem("foot", 953, "shoes")}
        </div>
        <div className="weapons-items">
          {weapons ? (
            <>
              <div className="weapons-item">
                {renderWeaponImage()}
              </div>
              <div
                className="weapons-item"
                onClick={(e) => {
                  e.preventDefault();
                  CustomEvent.triggerServer(
                    "inventory:reload:weapon",
                  );
                  inventory.closeInventory();
                }}
                onKeyDown={(e) => {
                  e.preventDefault();
                  CustomEvent.triggerServer(
                    "inventory:reload:weapon",
                  );
                  inventory.closeInventory();
                }}
              >
                  <div className="weapon-item">
                    {renderAmmoImage()}
                    <div className="count">
                      x{weapons.ammo}
                    </div>
                  </div>
              </div>
            </>
          ) : (
            <>
              <div tabIndex={-1} className="weapon-item">
                <img tabIndex={-1} src={svg.gun || defaultIconImage} alt="" />
              </div>
              <div tabIndex={-1} className="weapon-item">
                <img tabIndex={-1} src={svg.magazine || defaultIconImage} alt="" />
              </div>
            </>
          )}
        </div>
        <div className="stats-items">
          <div className="stats-items-item">
            <div className="stats-items-item-block">
              <div 
                className="stats-items-item-block-circle-fill hunger"
                style={{
                  background: `conic-gradient(#14851d 0% ${hunger > 100 ? 100 : hunger}%, rgba(255, 255, 255, 0.1) ${hunger}% 100%)`
                }}
              >
                <div className="inner-circle">
                  <img src={svg.hunger} alt="" />
                </div>
              </div>
            </div>
            <div className="stats-items-item-block-text">
              <div className="stats-items-item-value">
                {hunger > 100 ? 100 : hunger.toFixed(0)}%
              </div>
              {/* <div className="stats-items-item-value secondary">
                / 100
              </div> */}
            </div>
          </div>
          
          <div className="stats-items-item">
            <div className="stats-items-item-block">
              <div 
                className="stats-items-item-block-circle-fill thirst"
                style={{
                  background: `conic-gradient(#4B9CD3 0% ${thirst > 100 ? 100 : thirst}%, rgba(255, 255, 255, 0.1) ${thirst}% 100%)`
                }}
              >
                <div className="inner-circle">
                  <img src={svg.water || svg.hunger} alt="" />
                </div>
              </div>
            </div>
            <div className="stats-items-item-block-text">
              <div className="stats-items-item-value">
                {thirst > 100 ? 100 : thirst.toFixed(0)}%
              </div>
              {/* <div className="stats-items-item-value secondary">
                / 100
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 