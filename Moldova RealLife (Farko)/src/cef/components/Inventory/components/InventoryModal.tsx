import React from "react";
import { getDonateItemConfig, DONATE_MONEY_NAMES } from "../../../../shared/economy";
import { CustomEvent } from "../../../modules/custom.event";
import { system } from "../../../modules/system";
import { PLAYER_INVENTORY_MAX_LEVEL } from "../../../../shared/inventory";
import backPackBig from "../img/backPackBig.png";

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

interface InventoryModalProps {
  addModal: boolean;
  inv_level?: number;
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = (props) => {
  const { addModal, inv_level, onClose } = props;

  if (!addModal) return null;

  return (
    <div
      className={`modal-increasing-capacity-inventory-wrapper ${addModal ? "visible" : ""}`}
    >
      <div className="modal-increasing-capacity-inventory-wrapper-container">
        <button
          type="button"
          className="close-button"
          onClick={(e) => {
            e.preventDefault();
            onClose();
          }}
        >
          <img
            tabIndex={-1}
            src={svg.close}
            width="24"
            height="24"
            alt=""
          />
        </button>
        <div className="image">
          <img src={backPackBig} alt="" />
        </div>
        <div className="desc">
          <p className="p-18px fw400 lh180">
            {getDonateItemConfig(7).desc}
          </p>
          <button
            type="button"
            className="br4"
            disabled={
              inv_level &&
              inv_level >= PLAYER_INVENTORY_MAX_LEVEL
            }
            onClick={(e) => {
              e.preventDefault();
              onClose();
              CustomEvent.triggerServer("mainmenu:buyShop", 7);
            }}
          >
            <p tabIndex={-1} className="p-16px fw800 upper">
              {system.numberFormat(getDonateItemConfig(7).price)}{" "}
              {DONATE_MONEY_NAMES[2]}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}; 