import { LangString } from "../../modules/lang";
import "../ClothShop/style.less";
import "./style.less";
import React, { Component } from "react";
import { systemUtil } from "../../../shared/system";
import { CustomEvent } from "../../modules/custom.event";
import { TattooItem, tattoosShared } from "../../../shared/tattoos";
import {
  DONATE_MONEY_NAMES,
  tattooRemoveCostMultipler,
} from "../../../shared/economy";
import { CEF } from "../../modules/CEF";
import bg from "./assets/BG.png";
import blur from "../ClothShop/assets/lblur.png";
const icons = Object.fromEntries(
  Object.entries(import.meta.glob("./assets/*.svg", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.svg$/)[1];
      return [name, value.default];
    }
  )
);
const png = Object.fromEntries(
  Object.entries(import.meta.glob("./assets/*.png", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.png$/)[1];
      return [name, value.default];
    }
  )
);
import check from "./../ClothShop/assets/check.svg";
import exitIcon from "./assets/exit.svg";

export class TattooShop extends Component<
  { test?: boolean },
  {
    name: string;
    id?: number;
    type?: number;
    selectedSector?: string;
    selectedItem?: number;
    data?: {
      item_id: number;
      // count: number;
      price: number;
    }[];
    inputQuery: string;
    tattoos?: [string, string][];
    donate?: number;
    show: boolean;
  }
> {
  ev: import("../../../shared/custom.event").CustomEventHandler;
  constructor(props: any) {
    super(props);
    this.state = {
      selectedSector: "ZONE_HEAD",
      selectedItem: 0,
      name: LangString(
        "components.TattooShop.index.6588c02ad73861d70f5018e48096760b"
      ),
      inputQuery: "",
      type: 0,
      tattoos: CEF.test
        ? [
            ["mpbusiness_overlays", "MP_Buis_M_Chest_001"],
            ["mpbeach_overlays", "MP_Bea_M_Back_000"],
          ]
        : null,
      data: CEF.test
        ? [
            { item_id: 1, price: 1000000 },
            { item_id: 2, price: 20000 },
          ]
        : null,
      donate: 0,
      show: CEF.test,
    };
    this.ev = CustomEvent.register(
      "cef:tattoo_shop:init",
      (
        id: number,
        name: string,
        type: number,
        data: {
          item_id: number;
          count: number;
          price: number;
        }[],
        tattoos: [string, string][],
        donate
      ) => {
        this.setState({
          selectedItem: 0,
          show: true,
          id,
          name,
          type,
          data: data || [],
          tattoos: tattoos || [],
          donate,
        });
      }
    );
  }
  componentWillUnmount() {
    if (this.ev) this.ev.destroy();
  }
  selectTattoo(id: number) {
    this.setState({ selectedItem: id });
    if (id >= 100000) {
      const cfg = tattoosShared.findTattoo(
        this.state.tattoos[id - 100000][0],
        this.state.tattoos[id - 100000][1]
      );
      CustomEvent.triggerClient("tattoo:preview", JSON.stringify(cfg));
    } else {
      CustomEvent.triggerClient(
        "tattoo:preview",
        JSON.stringify(id ? tattoosShared.getTattoo(id) : null)
      );
    }
  }
  selectCategory(id: string) {
    this.setState({ selectedSector: id });
    this.selectTattoo(0);
    CustomEvent.triggerClient("tattoo:category", id);
  }
  close() {
    CustomEvent.triggerClient("tattoo:exit");
  }
  getCurrent() {
    if (!this.state.selectedItem) return;
    return this.state.data.find((q) => q.item_id == this.state.selectedItem);
  }

  currentTattooExists(item?: {
    item_id: number;
    count: number;
    price: number;
    params: TattooItem;
  }) {
    const current = item ? item : this.getCurrent();
    if (!current) return false;
    const data = tattoosShared.getTattoo(current.item_id);
    return !!this.state.tattoos.find(
      (q) =>
        q[0] === data.collection &&
        (q[1] === data.overlay_male || q[1] === data.overlay_female)
    );
  }
  render() {
    if (!this.state.show) return <></>;
    if (!this.state.data) return <></>;
    if (!this.state.tattoos) return <></>;
    const remove =
      this.currentTattooExists() || this.state.selectedItem >= 100000;
    let removePrice = 0;
    if (remove) {
      if (this.currentTattooExists()) {
        removePrice = this.getCurrent()
          ? this.getCurrent().price * tattooRemoveCostMultipler
          : 0;
      } else {
        const q = tattoosShared.findTattoo(
          this.state.tattoos[this.state.selectedItem - 100000][0],
          this.state.tattoos[this.state.selectedItem - 100000][1]
        );
        if (q) removePrice = q.price * tattooRemoveCostMultipler;
      }
    }
    let items = this.state.data
      ? this.state.data.filter(
          (q) =>
            tattoosShared.getTattoo(q.item_id) &&
            tattoosShared.getTattoo(q.item_id).zone == this.state.selectedSector
        )
      : [];
    return (
      <div
        className="tattoo-shop"
      >
        <div className="tattoo-shop__shadow" />
        <div className="tattoo-shop__top">
          <div className="tattoo-shop__top__title">
            <h1>
              <span>Tattoo </span> Salon
            </h1>
            <p>Alege dintre zeci de modele si lasa amprenta ta pe piele</p>
          </div>
          <div className="tattoo-shop__top__exit" onClick={() => this.close()}>
            <p>Exit</p>
            <div className="tattoo-shop__top__exit__img">
              <img src={exitIcon} alt="Exit" />
            </div>
          </div>
        </div>
        <div className="tattoo-shop__content">
          <div className="tattoo-shop__content__list">
            <div className="tattoo-shop__content__list__categories">
              {tattoosShared.categorys.map((data, index) => {
                return (
                  <div
                    key={index}
                    className={`tattoo-shop__content__list__category ${
                      this.state.selectedSector == data[1] ? "selected" : ""
                    }`}
                    onClick={() => this.selectCategory(data[1])}
                  >
                    <img src={icons[`p${data[1]}1`]} />
                    {data[0]}
                  </div>
                );
              })}
              <div
                className={`tattoo-shop__content__list__category ${
                  this.state.selectedSector === "used" ? "selected" : ""
                }`}
                onClick={() => this.selectCategory("used")}
              >
                <img src={icons["tattoo"]} />
                Tatuaj simplu
              </div>
            </div>
            <div className="tattoo-shop__content__list__items">
              <div className="tattoo-shop__content__search">
                <img src={icons[`search`]} alt="" />
                <input
                  type="text"
                  placeholder="Nume..."
                  value={this.state.inputQuery}
                  onChange={(e) =>
                    this.setState({ ...this.state, inputQuery: e.target.value })
                  }
                />
              </div>
              <div className="tattoo-shop__content__items">
                {this.state.selectedSector == "used"
                  ? this.state.tattoos
                      .filter((item) =>
                        tattoosShared
                          .findTattoo(item[0], item[1])
                          .name.toLowerCase()
                          .includes(this.state.inputQuery.toLowerCase())
                      )
                      .map((item, index) => {
                        let cfg = tattoosShared.findTattoo(item[0], item[1]);
                        return (
                          <div
                            key={index}
                            className={`tattoo-shop__content__item ${
                              index + 100000 == this.state.selectedItem
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => {
                              this.selectTattoo(index + 100000);
                            }}
                          >
                            {cfg.name}
                          </div>
                        );
                      })
                  : items
                      .filter(
                        (data) =>
                          tattoosShared.getTattoo(data.item_id) &&
                          !this.state.tattoos.find(
                            (s) =>
                              s[0] ===
                                tattoosShared.getTattoo(data.item_id)
                                  .collection &&
                              (s[1] ===
                                tattoosShared.getTattoo(data.item_id)
                                  .overlay_male ||
                                s[1] ===
                                  tattoosShared.getTattoo(data.item_id)
                                    .overlay_female)
                          )
                      )
                      .filter((data) =>
                        tattoosShared
                          .getTattoo(data.item_id)
                          .name.toLowerCase()
                          .includes(this.state.inputQuery.toLowerCase())
                      )
                      .map((data, index) => {
                        return (
                          <div
                            key={index}
                            className={`tattoo-shop__content__item ${
                              data.item_id == this.state.selectedItem
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => {
                              this.selectTattoo(data.item_id);
                            }}
                          >
                            <h2>
                              {tattoosShared.getTattoo(data.item_id)
                                ? tattoosShared.getTattoo(data.item_id).name
                                : LangString(
                                    "components.TattooShop.index.1ed368cf3bee3ac469e13d068daf907d"
                                  )}
                            </h2>
                            <h3>
                              $ {tattoosShared.getTattoo(data.item_id)?.price}
                            </h3>
                          </div>
                        );
                      })}
              </div>
            </div>
          </div>
          <div className="tattoo-shop__content__price">
            <div className="tattoo-shop__content__price__top">
              <h1>Pretul total:</h1>
              <h2>
                {this.state.donate ? `${DONATE_MONEY_NAMES[3]} ` : "$"}
                {systemUtil.numberFormat(
                  remove
                    ? removePrice
                    : this.getCurrent()
                    ? this.getCurrent().price
                    : 0
                )}
              </h2>
            </div>
            <button
              className="tattoo-shop__content__price__btn"
              type="button"
              onClick={(e) => {
                if (remove) {
                  CustomEvent.triggerServer(
                    "tattoo:remove",
                    this.state.id,
                    this.state.selectedItem - 100000,
                    removePrice
                  );
                } else {
                  CustomEvent.triggerServer(
                    "tattoo:buy",
                    this.state.id,
                    this.state.selectedItem
                  );
                }
              }}
            >
              Buy
            </button>
          </div>
        </div>
      </div>
    );
  }
}
