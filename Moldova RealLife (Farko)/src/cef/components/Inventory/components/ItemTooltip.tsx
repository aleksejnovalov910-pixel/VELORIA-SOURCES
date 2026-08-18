import React, { JSX } from "react";
import { LangString } from "../../../modules/lang";
import { getItemDesc, getItemName, getItemWeight, OWNER_TYPES } from "../../../../shared/inventory";
import { CEF } from "../../../modules/CEF";

interface ItemTooltipProps {
  item: any;
  itemCfg: any;
  positionTooltip: { left: number; top: number };
  inventory: any;
  owner_type: OWNER_TYPES;
  owner_id: number;
  blocks: any[];
  canUse: boolean;
  ishotkey?: boolean;
  weaponCfg: any;
  transfer: (target_type: OWNER_TYPES, target_id: number) => void;
  useItem: (e: React.MouseEvent<any, MouseEvent>) => void;
  weaponMods: (e: React.MouseEvent<any, MouseEvent>) => void;
  split: (amount: number) => void;
  dropItem: () => void;
  addToExchange: () => void;
  selectToDisplay: () => void;
  isMyInventory: boolean;
  drawEquipHotkeyChoice: JSX.Element[];
  isDraggable?: { x: number; y: number };
  onClose: () => void;
}

export const ItemTooltip: React.FC<ItemTooltipProps> = (props) => {
  const { 
    item, 
    itemCfg, 
    positionTooltip, 
    inventory, 
    owner_type, 
    owner_id, 
    blocks, 
    canUse,
    ishotkey,
    weaponCfg,
    transfer,
    useItem,
    weaponMods,
    split,
    dropItem,
    addToExchange,
    selectToDisplay,
    isMyInventory,
    drawEquipHotkeyChoice,
    isDraggable,
    onClose
  } = props;

  const pos = positionTooltip;
  const obj = document.getElementById(
    `item_continer_draggable_${owner_type}_${owner_id}`,
  );
  let posX = 0;
  let posY = 0;
  if (obj && isDraggable) {
    posX = obj.offsetLeft - obj.offsetWidth / 2;
    posY = obj.offsetTop - obj.offsetHeight;
    pos.left -= posX;
    pos.top -= posY;
  }

  const desc = !ishotkey ? getItemDesc(itemCfg.item_id) : null;

  return (
    <div tabIndex={-1} className="mini-modal-menu-inventory-body">
      <div
        tabIndex={-1}
        className="mini-modal-menu-inventory-background"
        onClick={(e) => {
          e.preventDefault();
          onClose();
        }}
        onKeyDown={(e) => {
          e.preventDefault();
          onClose();
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          onClose();
        }}
      />
      <div
        tabIndex={-1}
        className="mini-modal-menu-inventory"
        style={{
          ...pos,
          transform:
            window.innerHeight / 2 > 0 ? "" : "translateY(-22vw)",
        }}
        onClick={(e) => {
          e.preventDefault();
        }}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <div tabIndex={-1} className="descr-wrap">
          <div tabIndex={-1} className="itemName">
            {getItemName(item)}
          </div>
          <div tabIndex={-1} className="space-backpack">
            <div tabIndex={-1} className="weight-backpack">
              <p tabIndex={-1} className="p-12px fw500 dark-04">
                {(
                  getItemWeight(item.item_id, item.count) / 1000
                ).toFixed(3)}{" "}
                {LangString(
                  "components.Inventory.index_new.739004ccdc4044a3ff718ef7e040f939",
                )}
              </p>
            </div>
          </div>
          {desc ? (
            <div tabIndex={-1} className="text-wrap">
              <p
                tabIndex={-1}
                className="p-14px fw400 dark lh120"
                style={{ whiteSpace: "pre-line" }}
              >
                {desc}
              </p>
            </div>
          ) : (
            <></>
          )}
        </div>
        <ul className="mini-modal-menu-wrap br4">
          {owner_type === OWNER_TYPES.WORLD ? (
            <>
              <li
                onClick={(e) => {
                  e.preventDefault();
                  transfer(OWNER_TYPES.PLAYER, CEF.id);
                }}
                onKeyDown={(e) => {
                  e.preventDefault();
                  transfer(OWNER_TYPES.PLAYER, CEF.id);
                }}
              >
                <p tabIndex={-1} className="p-14px fw500 dark">
                  {LangString(
                    "components.Inventory.index_new.aeb02289cf740735e740b1dd611c1eac",
                  )}
                </p>
              </li>
              {itemCfg.canSplit && item.count > 1 && (
                <li
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.count < 2) return;
                    split(1);
                  }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    if (item.count < 2) return;
                    split(1);
                  }}
                >
                  <p tabIndex={-1} className="p-14px fw500 dark">
                    {LangString(
                      "components.Inventory.index_new.5ec3a7b7ac14fabd456a668cea53b7c6",
                    )}
                  </p>
                </li>
              )}
            </>
          ) : (
            <>
              {!ishotkey && inventory.state.isExchangeOpened && (
                <li
                  onClick={(e) => {
                    e.preventDefault();
                    addToExchange();
                  }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    addToExchange();
                  }}
                >
                  <p tabIndex={-1} className="p-14px fw500 dark">
                    {LangString(
                      "components.Inventory.index_new.212af58646412a0b348506bbec7630ff",
                    )}
                  </p>
                </li>
              )}
              {!ishotkey && (
                <li
                  onClick={(e) => {
                    e.preventDefault();
                    dropItem();
                  }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    dropItem();
                  }}
                >
                  <p tabIndex={-1} className="p-14px fw500 dark">
                    {LangString(
                      "components.Inventory.index_new.b7d400cf04e15dd3095c3f16eab2eac4",
                    )}
                  </p>
                </li>
              )}
              {itemCfg.type === 7 &&
                blocks.find((d) => d.item_id === item.item_id)
                  ?.bag_sync && (
                <li
                  onClick={(e) => {
                    e.preventDefault();
                    selectToDisplay();
                  }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    selectToDisplay();
                  }}
                >
                  <p tabIndex={-1} className="p-14px fw500 dark">
                    {LangString(
                      "components.Inventory.index_new.e4ca3588a1e1ce91d7c3356b59186ede",
                    )}
                  </p>
                </li>
              )}
              {canUse && !ishotkey ? (
                <li
                  onClick={(e) => {
                    e.preventDefault();
                    if (!canUse) return;
                    useItem(e);
                  }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    if (!canUse) return;
                    //@ts-ignore
                    useItem(e);
                  }}
                >
                  <p tabIndex={-1} className="p-14px fw500 dark">
                    {inventory.state.weapons &&
                    inventory.state.weapons.id === item.id
                      ? LangString(
                          "components.Inventory.index_new.69f00569c1ee458dc599abf492599458",
                        )
                      : itemCfg.inHand
                        ? LangString(
                            "components.Inventory.index_new.bd02271417d0a2e9ef6b55456b148ba6",
                          )
                        : LangString(
                            "components.Inventory.index_new.27654810e285a5caa1a68fd1a82268ec",
                          )}
                  </p>
                </li>
              ) : (
                <></>
              )}
              {canUse &&
              !ishotkey &&
              itemCfg.type === 5 &&
              weaponCfg &&
              weaponCfg.addons ? (
                <li
                  onClick={(e) => {
                    e.preventDefault();
                    if (!canUse) return;
                    weaponMods(e);
                  }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    if (!canUse) return;
                    //@ts-ignore
                    weaponMods(e);
                  }}
                >
                  <p tabIndex={-1} className="p-14px fw500 dark">
                    {LangString(
                      "components.Inventory.index_new.9a97095deb05114a1ea65212b7e8b6c6",
                    )}
                  </p>
                </li>
              ) : (
                <></>
              )}
              {itemCfg.canSplit && item.count > 1 && !ishotkey ? (
                <li
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.count < 2) return;
                    split(1);
                  }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    if (item.count < 2) return;
                    split(1);
                  }}
                >
                  <p tabIndex={-1} className="p-14px fw500 dark">
                    {LangString(
                      "components.Inventory.index_new.aa5110ca58e58cfde6f17531f3c2520e",
                    )}
                  </p>
                </li>
              ) : (
                <></>
              )}

              {!ishotkey && blocks
                .filter(
                  (q) =>
                    q.owner_type !== OWNER_TYPES.WORLD &&
                    !(
                      q.owner_type === owner_type &&
                      q.owner_id === owner_id
                    ),
                )
                .map((target) => {
                  return (
                    <li
                      onClick={(e) => {
                        e.preventDefault();
                        transfer(target.owner_type, target.owner_id);
                      }}
                      onKeyDown={(e) => {
                        e.preventDefault();
                        transfer(target.owner_type, target.owner_id);
                      }}
                      key={`item_choice_${target.owner_type}_${target.owner_id}`}
                    >
                      {target.owner_type === OWNER_TYPES.PLAYER &&
                      target.owner_id === CEF.id ? (
                        <p tabIndex={-1} className="p-14px fw500 dark">
                          {LangString(
                            "components.Inventory.index_new.9ee8953630de6633efc116035c1312e9",
                          )}
                        </p>
                      ) : (
                        <p tabIndex={-1} className="p-14px fw500 dark">
                          {target.owner_type === OWNER_TYPES.PLAYER
                            ? LangString(
                                "components.Inventory.index_new.16f6057e990fff45ca656c1a86d170e3",
                              )
                            : [
                                OWNER_TYPES.VEHICLE,
                                OWNER_TYPES.VEHICLE_TEMP,
                              ].includes(target.owner_type)
                              ? LangString(
                                  "components.Inventory.index_new.67d9dab0bcfaf650e33bf3d4105a2a48",
                                )
                              : LangString(
                                  "components.Inventory.index_new.9a728b834feb93a2f4e2b95379c7fa50",
                                )}{" "}
                          {target.name} {target.desc}
                        </p>
                      )}
                    </li>
                  );
                })}

              {isMyInventory || ishotkey ? drawEquipHotkeyChoice : <></>}
            </>
          )}
        </ul>
      </div>
    </div>
  );
}; 