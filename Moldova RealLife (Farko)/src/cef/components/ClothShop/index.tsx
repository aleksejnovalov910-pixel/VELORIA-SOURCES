import { LangString } from "../../modules/lang";
import "./style.less";
import React, { Component, createRef } from "react";
import { systemUtil } from "../../../shared/system";
import { CustomEvent } from "../../modules/custom.event";
import {
  ClothData,
  dressShopPartsList,
  GloveClothData,
  partsList,
} from "../../../shared/cloth";
import { CEF, dressCfg } from "../../modules/CEF";
import bg from "./../Fuel/assets/bg.svg";
import BG from "./assets/BG.png";
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
import left from "./assets/left.svg";
import check from "./assets/check.svg";
import {
  BUSINESS_SUBTYPE_NAMES,
  BUSINESS_TYPE,
} from "../../../shared/business";
import { InventoryEquipList } from "../../../shared/inventory";
import coins from "../../components/UserMenu/assets/svg/player-stop-white.svg";

export let dressData: InventoryEquipList;

export class ClothShop extends Component<
  { test?: boolean },
  {
    name: string;
    id?: number;
    type?: number;
    selectedSector?: number;
    selectedItem?: number;
    selectedPage?: number;
    selectedVariation: number;
    data?: {
      item_id: number;
      count: number;
      price: number;
      donate?: number;   // <-- adăugat aici
      name: string;
      params: ClothData[] | GloveClothData[];
    }[];
    donate?: number;
    show: boolean;
    searchQuery: string;
  }
> {
  ev: import("../../../shared/custom.event").CustomEventHandler;
  containerRef: React.RefObject<HTMLDivElement>;
  constructor(props: any) {
    super(props);
    this.state = {
      show: CEF.test,
      name: "",
      type: 0,
      selectedVariation: 0,
      selectedPage: 0,
      selectedSector: 1,
      selectedItem: 1,
      searchQuery: "",
      data: CEF.test
        ? [
            {
              item_id: 1,
              count: 2,
              price: 10000,
              name: "KIX",
              params: [
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Schwarzer Test",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Белый тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Серый тестовый",
                  },
                ],
              ],
            },
            {
              item_id: 2,
              count: 2,
              price: 10000,
              name: "Test",
              params: [
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Schwarzer Test",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Белый тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Серый тестовый",
                  },
                ],
              ],
            },
            {
              item_id: 3,
              count: 2,
              price: 10000,
              name: "Test",
              params: [
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Schwarzer Test",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Белый тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Серый тестовый",
                  },
                ],
              ],
            },
            {
              item_id: 4,
              count: 2,
              price: 10000,
              name: "Test",
              params: [
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Schwarzer Test",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Белый тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Серый тестовый",
                  },
                ],
              ],
            },
            {
              item_id: 5,
              count: 2,
              price: 10000,
              name: "Test",
              params: [
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Чёрный тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Белый тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Серый тестовый",
                  },
                ],
              ],
            },
            {
              item_id: 6,
              count: 2,
              price: 10000,
              name: "Test",
              params: [
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Чёрный тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Белый тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Серый тестовый",
                  },
                ],
              ],
            },
            {
              item_id: 7,
              count: 2,
              price: 10000,
              name: "Test",
              params: [
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Чёрный тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Белый тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Серый тестовый",
                  },
                ],
              ],
            },
            {
              item_id: 8,
              count: 2,
              price: 10000,
              name: "Test",
              params: [
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Чёрный тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Белый тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Серый тестовый",
                  },
                ],
              ],
            },
            {
              item_id: 9,
              count: 2,
              price: 10000,
              name: "Test",
              params: [
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Чёрный тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Белый тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Серый тестовый",
                  },
                ],
              ],
            },
            {
              item_id: 10,
              count: 2,
              price: 10000,
              name: "Test",
              params: [
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Чёрный тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Белый тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Серый тестовый",
                  },
                ],
              ],
            },
            {
              item_id: 11,
              count: 2,
              price: 10000,
              name: "Test",
              params: [
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Чёрный тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Белый тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Серый тестовый",
                  },
                ],
              ],
            },
            {
              item_id: 12,
              count: 2,
              price: 10000,
              name: "Test",
              params: [
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Чёрный тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Белый тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Серый тестовый",
                  },
                ],
              ],
            },
            {
              item_id: 13,
              count: 2,
              price: 10000,
              name: "Test",
              params: [
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Чёрный тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Белый тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Серый тестовый",
                  },
                ],
              ],
            },
            {
              item_id: 14,
              count: 2,
              price: 10000,
              name: "Test",
              params: [
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Чёрный тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Белый тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Серый тестовый",
                  },
                ],
              ],
            },
            {
              item_id: 15,
              count: 2,
              price: 10000,
              name: "Test",
              params: [
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Чёрный тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Белый тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Серый тестовый",
                  },
                ],
              ],
            },
            {
              item_id: 16,
              count: 2,
              price: 10000,
              name: "Test",
              params: [
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Чёрный тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Белый тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Серый тестовый",
                  },
                ],
              ],
            },
            {
              item_id: 17,
              count: 2,
              price: 10000,
              name: "Test",
              params: [
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Чёрный тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Белый тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Серый тестовый",
                  },
                ],
              ],
            },
            {
              item_id: 18,
              count: 2,
              price: 10000,
              name: "Test",
              params: [
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Чёрный тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Белый тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Серый тестовый",
                  },
                ],
              ],
            },
            {
              item_id: 19,
              count: 2,
              price: 10000,
              name: "Test",
              params: [
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Чёрный тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Белый тестовый",
                  },
                ],
                [
                  {
                    component: 1,
                    drawable: 1,
                    texture: 1,
                    name: "Серый тестовый",
                  },
                ],
              ],
            },
          ]
        : [],
    };
    this.containerRef = createRef<HTMLDivElement>();
    this.ev = CustomEvent.register(
      "cef:cloth_shop:init",
      async (
        id: number,
        name: string,
        type: number,
        dataIdss: string,
        donate: number
      ) => {
        const dataIds = JSON.parse(dataIdss);
        let datas: {
          item_id: number;
          count: number;
          price: number;
          name: string;
          params: ClothData[] | GloveClothData[];
        }[] = [];
        const catalog = await CEF.getCatalog(id);
        if (!catalog) return;
        const data = catalog
          .filter((q) => dataIds.includes(q.item))
          .map((q) => {
            return [q.item, q.price, q.count];
          });
        data.map((item) => {
          const cfg = dressCfg.find((q) => q.id == item[0]);
          if (!cfg) return;
          const { name, data } = cfg;
          datas.push({
            item_id: item[0],
            count: item[2],
            price: item[1],
            name,
            params: data,
          });
        });
        this.setState({ show: true, id, name, type, data: datas, donate });
      }
    );
  }
  handleKeyDown = (e: any) => {
    if (e.keyCode == 27) this.close();
  };
  componentDidMount = () => {
    document.addEventListener("keydown", this.handleKeyDown);
    this.adjustZoom();
    window.addEventListener("resize", this.adjustZoom);
  };
  componentWillUnmount = () => {
    if (this.ev) this.ev.destroy();
    window.removeEventListener("resize", this.adjustZoom);
    document.removeEventListener("keydown", this.handleKeyDown);
  };
  selectCloth = (id: number) => {
    this.setState({ selectedItem: id, selectedVariation: 0 }, () => {
      this.selectVariation(0);
      CEF.playSound("cliekc"); // sunet la selectarea unui articol

    });
  };
  selectVariation = (id: number) => {
    this.setState({ selectedVariation: id });
    CustomEvent.triggerClient(
      "cloth:preview",
      JSON.stringify(
        this.state.selectedItem
          ? this.state.data.find((q) => q.item_id == this.state.selectedItem)
              .params[id]
          : []
      ),
      id
    );
    CEF.playSound("cliekc"); // sunet cand alegi variatia

  };
  selectCategory = (id: number) => {
    this.setState({ selectedSector: id });
    this.selectCloth(0);
    CustomEvent.triggerClient("cloth:category", id);
    // CEF.playSound("cliekc"); // sunet la schimbarea categoriei

  };
  close(){
     CEF.playSound("exitmagazin"); // ruleaza instant
     CustomEvent.triggerClient("cloth:exit");
  }
  toggleCameraZoom = (enableZoom: boolean) => {
    CustomEvent.triggerClient("cloth:toggleCameraZoom", enableZoom);
  };
  getCurrent = () => {
    if (!this.state.selectedItem) return;
    return this.state.data.find((q) => q.item_id == this.state.selectedItem);
  };

  getName = (data: ClothData | GloveClothData) => {
    if (data.hasOwnProperty("texture")) {
      return (data as GloveClothData).name;
    } else {
      return (data as ClothData)[0].name;
    }
  };

  adjustZoom = () => {
    const container = this.containerRef.current;
    if (container) {
      const zoomCountOne = window.innerWidth / 1920;
      const zoomCountTwo = window.innerHeight / 1080;

      if (zoomCountOne < zoomCountTwo) {
        container.style.zoom = zoomCountOne.toString();
      } else {
        container.style.zoom = zoomCountTwo.toString();
      }
    }
  };

  render() {
    if (!this.state.data) return <></>;
    if (!this.state.show) return <></>;
    let items = this.state.data
      ? this.state.data.filter((q) =>
          q.params[0].hasOwnProperty("texture")
            ? this.state.selectedSector === 1000
            : (q.params[0] as ClothData)[0].component ==
              this.state.selectedSector
        )
      : [];

    return (
      <div className="clothes_browser">
        <div className="clothes_bg">
          <div className="clothes_bg_shadow" />
        </div>
        <div className="clothes__box" ref={this.containerRef}>
          <div className="clothes_top">
            <div className="clothes_title">
              <h1>
                <span>Magazin de </span> haine
              </h1>
              <p>Imbraca-te cu stil! Alege dintr-o gama variata de haine si accesorii</p>
            </div>
            <div className="clothes_exit">
              <p>Exit</p>
              <div className="exit-img" onClick={() => this.close()}>
                <img src={icons["exit"]} alt="Exit" />
              </div>
            </div>
          </div>
          <div className="clothes__main">
            <div
              className="clothes__main__list"
              onMouseEnter={() => this.toggleCameraZoom(false)}
              onMouseLeave={() => this.toggleCameraZoom(true)}
            >
              <div className="clothes__main__categories">
                {dressShopPartsList.map((data, index) => {
                  if (data[0] === 333) return <></>;
                  return (
                    <div
                      key={`cloth_cat_${index}`}
                      className={`clothes__main__category ${
                        this.state.selectedSector == data[0] ? "selected" : ""
                      }`}
                      onClick={() => this.selectCategory(data[0])}
                    >
                      <img src={png[`p${data[0]}`]} />
                    </div>
                  );
                })}
              </div>
              <div className="clothes__main__list__item">
                <div className="clothes__main__list__search">
                  <img src={icons["search"]} alt="" />
                  <input
                    type="text"
                    placeholder="Cauta..."
                    value={this.state.searchQuery}
                    onChange={(e) =>
                      this.setState({
                        ...this.state,
                        searchQuery: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="clothes__main__items">
                  {items.length > 0 ? (
                    items
                      .filter((data) =>
                        data.name
                          .toLowerCase()
                          .includes(this.state.searchQuery.toLowerCase())
                      )
                      .map((data, index) => {
                        return (
                          <div
                            key={`cloth_item_${index}`}
                            className={`clothes__main__item ${
                              data.item_id == this.state.selectedItem
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => this.selectCloth(data.item_id)}
                          >
                            <h2>{data.name}</h2>
                            <h3>
                            {this.state.donate ? (
                              <>
                                <img src={coins} width={18} height={18} style={{ verticalAlign: "middle" }} />{" "}
                                {systemUtil.numberFormat(data.price)}
                              </>
                            ) : (
                              <>$ {systemUtil.numberFormat(data.price)}</>
                            )}
                          </h3>
                          </div>
                        );
                      })
                  ) : (
                    <p>In aceasta categorie nu exista haine</p>
                  )}
                </div>
              </div>
            </div>
            {this.getCurrent() && (
              <div className="clothes__main__price">
                <h1>
                  {this.getName(
                    this.getCurrent().params[this.state.selectedVariation]
                  )}
                </h1>
                <div className="clothing-total-price-box">
                  <div className="clothing-types">
                    <div className="clothing-type">
                      <img
                        src={icons["arrow-left"]}
                        alt=""
                        onClick={() => {
                          if (!this.state.selectedVariation) return;
                          this.selectVariation(
                            this.state.selectedVariation - 1
                          );
                        }}
                      />
                      <h2>Varianta #{this.state.selectedVariation + 1}</h2>
                      <img
                        src={icons["arrow-right"]}
                        alt=""
                        onClick={() => {
                          if (
                            this.state.selectedVariation + 1 >=
                            this.getCurrent().params.length
                          )
                            return;
                          this.selectVariation(
                            this.state.selectedVariation + 1
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="clothing-total-price-top">
                    <h1>Pret total:</h1>
                    <h2>
                      {this.state.donate ? (
                        <img src={coins} width={24} height={24} />
                      ) : null}
                      {this.state.donate ? " " : "$"}{" "}
                      {systemUtil.numberFormat(this.getCurrent().price)}
                    </h2>
                  </div>
                  <button
                    className="button"
                    type="button"
                    onClick={() => {
                      CustomEvent.triggerServer(
                        "cloth:buy",
                        this.state.id,
                        this.state.selectedItem,
                        this.state.selectedVariation
                      );
                    }}
                  >
                    Cumpara
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
