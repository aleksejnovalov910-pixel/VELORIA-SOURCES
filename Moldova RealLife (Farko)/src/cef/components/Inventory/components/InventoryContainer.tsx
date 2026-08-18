import React, { JSX } from "react";
import { InventoryItemCef, OWNER_TYPES } from "../../../../shared/inventory";
import { ItemDraw } from "./ItemDraw";
import worldIcon from "../img/worldIcon.svg";
import bagpackIcon from "../img/clothes/bagpack.svg";
import { LangString } from "../../../modules/lang";
import { CustomEvent } from "../../../modules/custom.event";
import { CEF } from "../../../modules/CEF";

interface InventoryContainerProps {
  owner_type: OWNER_TYPES;
  owner_id: number;
  name: string;
  desc: string;
  items: InventoryItemCef[];
  max_weight: number;
  weight: number;
  line: number;
  close?: boolean;
  draggable?: { left: number; top: number };
  drag?: { x: number; y: number };
  inventory: any;
  onEnterContainer: (owner_type: OWNER_TYPES, owner_id: number, slot?: number) => void;
  renderEmptyString: (count: number, keyPrefix?: string) => React.ReactElement[];
  renderInventoryContainerItems: (
    owner_type: OWNER_TYPES,
    owner_id: number,
    items: InventoryItemCef[],
    line: number,
    mini: boolean,
    isDraggable?: { x: number; y: number }
  ) => React.ReactElement;
}

const ownerTypeToIcon = (owner_type: OWNER_TYPES) => {
  switch (owner_type) {
    case OWNER_TYPES.WORLD:
      return worldIcon;
    case OWNER_TYPES.PLAYER:
      return bagpackIcon;
    case OWNER_TYPES.BAG:
      return bagpackIcon;
    default:
      return worldIcon;
  }
}

export const InventoryContainer: React.FC<InventoryContainerProps> = (props) => {
  const {
    owner_type,
    owner_id,
    name,
    desc,
    items,
    max_weight,
    weight,
    line,
    close = false,
    draggable,
    drag,
    inventory,
    onEnterContainer,
    renderEmptyString,
    renderInventoryContainerItems
  } = props;

  const takeAllItems = () => {
    if (owner_type === OWNER_TYPES.WORLD && items.length > 0) {
      items.forEach((item) => {
        CustomEvent.triggerServer("inventory:choiceItem", {
          item: {
            id: item[0],
          },
          owner_type: owner_type,
          owner_id: owner_id,
          task: "transfer",
          target_type: OWNER_TYPES.PLAYER,
          target_id: CEF.id
        });
      });
      CEF.playSound("up-inventory", 0.05);
    }
  };

  if (owner_type === OWNER_TYPES.WORLD && items.length === 0) {
    return (
      <div
        onMouseEnter={() => onEnterContainer(owner_type, owner_id)}
        onMouseLeave={() => onEnterContainer(OWNER_TYPES.PLAYER, -1)}
        className={`storage-block`}
      >
        <div className="storage-top">
          <div className="storage-title element-title">
            <div className="element-img">
              <img src={ownerTypeToIcon(owner_type)} alt="" />
              <h1>
                {LangString(
                  "components.Inventory.index_new.e4f0da67b26cf896a55eccdae9c24a92",
                )}
              </h1>

              <div className="takeAll">
                <button onClick={takeAllItems}>Ia totul</button>
              </div>
            </div>
            {/* <p>
              {LangString(
                "components.Inventory.index_new.ef38cc64b1f0a284ef6c270ac4b14883",
              )}
            </p> */}
          </div>
        </div>
        <div className="inventory-slots">{renderEmptyString(60)}</div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => onEnterContainer(owner_type, owner_id)}
      onMouseLeave={() => onEnterContainer(OWNER_TYPES.PLAYER, -1)}
      style={
        draggable
          ? {
              position: "absolute",
              zIndex: 10005,
              transform: "translate(-50%, -100%)",
              left: draggable.left,
              top: draggable.top,
            }
          : {}
      }
      className={`storage-block`}
      key={`item_continer_${owner_type}_${owner_id}`}
      id={`item_continer_${draggable ? "draggable" : ""}_${owner_type}_${owner_id}`}
    >
      <div className="storage-top">
        {owner_type === OWNER_TYPES.WORLD ? (
          <>
            <div className="storage-title element-title">
              <div className="element-img">
                <img src={worldIcon} alt="" />
                <h1>
                  {LangString(
                    "components.Inventory.index_new.e4f0da67b26cf896a55eccdae9c24a92",
                  )}
                </h1>

                <div className="takeAll">
                  <button onClick={takeAllItems}>Ia totul</button>
                </div>
              </div>
            </div>
          </>
        ) : draggable ? (
          <>
            <div className="storage-title element-title">
              <div className="element-img">
                <img src={ownerTypeToIcon(owner_type)} alt="" />
                <h1>{name}</h1>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="storage-title element-title">
              <div className="element-img">
                <img src={ownerTypeToIcon(owner_type)} alt="" />
                <h1>{name}</h1>
              </div>
            </div>
            {draggable ? (
              <></>
            ) : (
              <div className="inventory-weight">
                <div className="kg">
                  <p>
                    {(weight / 1000).toFixed(1)} / <span>{(max_weight / 1000).toFixed(1)} kg</span>
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {!close ? (
        renderInventoryContainerItems(
          owner_type,
          owner_id,
          items,
          line,
          owner_type === OWNER_TYPES.WORLD,
          draggable ? drag : null,
        )
      ) : (
        <div className="inventory-slots">
          {renderEmptyString(line * 3, `empty_container_${owner_type}_${owner_id}`)}
        </div>
      )}
    </div>
  );
}; 