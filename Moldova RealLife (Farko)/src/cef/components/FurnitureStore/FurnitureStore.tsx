import { LangString } from "../../modules/lang";
import React, { Component } from "react";
import "./style.less";

const png = Object.fromEntries(
  Object.entries(import.meta.glob("./assets/*.png", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.png$/)[1];
      return [name, value.default];
    }
  )
);
const svg = Object.fromEntries(
  Object.entries(import.meta.glob("./assets/*.svg", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.svg$/)[1];
      return [name, value.default];
    }
  )
);
import FurnitureShopStore from "../../stores/FurnitureShopStore";
import {
  FurnitureAllCategories,
  FurnitureCategory,
  FurnitureCategoryNames,
  furnitureList,
} from "../../../shared/houses/furniture/furniture.config";
import classNames from "classnames";
import { observer } from "mobx-react";
import { CEF } from "../../modules/CEF";
import { CustomEvent } from "../../modules/custom.event";
import { CloseButton } from "../CloseButton";
import { systemUtil } from "../../../shared/system";

@observer
export class FurnitureStore extends Component<
  {
    store: FurnitureShopStore;
  },
  { inputQuery: string }
> {
  store: FurnitureShopStore = this.props.store;

  constructor(props: any) {
    super(props);
    this.state = {
      inputQuery: "",
    };
  }

  getCategoryName(cat: FurnitureCategory) {
    return FurnitureCategoryNames[cat] ? FurnitureCategoryNames[cat] : "";
  }

  setCategory(cat: FurnitureCategory) {
    this.store.setState({
      cat,
      item: null,
    });
  }

  setItem(id: number) {
    CustomEvent.triggerClient("furnitureShop:select", id);
    this.store.setState({
      item: id,
    });
  }

  getItemsByCategory(cat: FurnitureCategory) {
    return furnitureList.filter((el) => el.cat === cat);
  }

  getCurrentItem() {
    return furnitureList.find((item) => item.id === this.store.item);
  }

  close = () => {
    CustomEvent.triggerClient("furnitureShop:close");
    CEF.gui.setGui(null);
  };

  buy() {
    if (this.store.item === null) return;
    CustomEvent.triggerServer("furniture:buy", this.store.item);
  }

  zoom(toggle: boolean) {
    CustomEvent.triggerClient("furnitureShop:zoomToggle", toggle);
  }

  componentWillUnmount() {
    this.store.setState({
      cat: "wardrobe",
      item: null,
    });
  }

  componentDidMount(): void {
    this.getItemsByCategory("wardrobe")[0] &&
      this.setItem(this.getItemsByCategory("wardrobe")[0]?.id);
  }

  render() {
    return (
      <div
        className="furniture"
        // style={{
        //   backgroundImage: `url(${png["BG"]})`,
        // }}
      >
        <div className="furniture__shadow" />
        <div
          className="furniture__top"
          onMouseEnter={() => this.zoom(false)}
          onMouseLeave={() => this.zoom(true)}
        >
          <div className="furniture__top__title">
            <h1>
              <span>MAGAZIN DE </span> MOBILA
            </h1>
            <p>Mobilier modern si elegant pentru fiecare camera a casei tale</p>
          </div>
          <div className="furniture__top__exit" onClick={() => this.close()}>
            <p>Exit</p>
            <div className="furniture__top__exit__img">
              <img src={svg["exit"]} alt="Exit" />
            </div>
          </div>
        </div>
        <div className="furniture__content">
          <div className="furniture__content__list">
            <div className="furniture__content__list__categories">
              {FurnitureAllCategories.map((cat, key) => {
                return (
                  <div
                    className={`furniture__content__list__category ${
                      this.store.cat === cat ? "selected" : ""
                    }`}
                    key={key}
                    onClick={() => {
                      this.setCategory(cat);
                      const items = this.getItemsByCategory(cat);
                      if (items.length > 0) this.setItem(items[0].id);
                    }}
                  >
                    <img src={svg[`${cat}2`]} alt="" />
                  </div>
                );
              })}
            </div>
            <div className="furniture__content__list__items">
              <div className="furniture__content__search">
                <img src={svg[`search`]} alt="" />
                <input
                  type="text"
                  placeholder="Cauta..."
                  value={this.state.inputQuery}
                  onChange={(e) =>
                    this.setState({ ...this.state, inputQuery: e.target.value })
                  }
                />
              </div>
              <div className="furniture__content__items">
                {this.getItemsByCategory(this.store.cat).length > 0 ? (
                  this.getItemsByCategory(this.store.cat)
                    .filter((item) =>
                      item.name
                        .toLowerCase()
                        .includes(this.state.inputQuery.toLowerCase())
                    )
                    .map((item, key) => {
                      return (
                        <div
                          className={`furniture__content__item ${
                            this.store.item === item.id ? "selected" : ""
                          }`}
                          key={key}
                          onClick={() => this.setItem(item.id)}
                        >
                          <h2>{item.name}</h2>
                          <h3>$ {item.cost}</h3>
                        </div>
                      );
                    })
                ) : (
                  <p>Nu exista mobilier disponibil.</p>
                )}
              </div>
            </div>
          </div>

          <div className="furniture__move">
            <div className="furniture__move__img">
              <img src={svg["move"]} alt="" />
            </div>
            <p>Muta obiectul pentru a-l vedea din toate partile</p>
          </div>

          {this.store.item !== null ? (
            <div className="furniture__content__price__wrapper">
              <h1>{this.getCurrentItem()?.name}</h1>
              <div className="furniture__content__price">
                <div className="furniture__content__price__top">
                  <h1>Pret total:</h1>
                  <h2>
                    ${" "}
                    {systemUtil.numberFormat(
                      this.getCurrentItem() ? this.getCurrentItem()?.cost : 0
                    )}
                  </h2>
                </div>
                <button
                  className="furniture__content__price__btn"
                  type="button"
                  onClick={() => this.buy()}
                >
                  Cumpara
                </button>
              </div>
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }
}

// return (
// 	<div
// 		className="furniture"
// 		style={{
// 			backgroundImage: `url(${png["BG"]})`,
// 		}}
// 	>
// 		{/* <CloseButton onClickAction={this.close} /> */}
// 		<div className="furniture__shadow" />
// 		<div
// 			className="furniture-left"
// 			onMouseEnter={() => this.zoom(false)}
// 			onMouseLeave={() => this.zoom(true)}
// 		>
// 			<div className="furnitureStore-left-catalog">
// 				<div className="furnitureStore-left-catalog__title">
// 					{LangString(
// 						"components.FurnitureStore.FurnitureStore.7a94de89c61c63830051777ea7d59d1b"
// 					)}
// 				</div>

// 				<div className="furnitureStore-left-catalog-list">
// 					{FurnitureAllCategories.map((cat, key) => {
// 						return (
// 							<div
// 								className={classNames({
// 									"furnitureStore-left-catalog-list-active":
// 										this.store.cat === cat,
// 								})}
// 								key={key}
// 								onClick={() => this.setCategory(cat)}
// 							>
// 								<img src={svg[cat]} alt="" />
// 							</div>
// 						);
// 					})}
// 				</div>
// 			</div>

// 			<div className="furnitureStore-left-items">
// 				<div className="furnitureStore-left-items-name">
// 					<h1>
// 						{LangString(
// 							"components.FurnitureStore.FurnitureStore.fe472a90eb57d71fa6d95631b2cd10f9"
// 						)}
// 					</h1>
// 					<span>{this.getCategoryName(this.store.cat)}</span>
// 				</div>

// 				<div className="furnitureStore-left-items-list">
// 					{this.getItemsByCategory(this.store.cat).map((item, key) => {
// 						return (
// 							<div
// 								className={classNames(
// 									"furnitureStore-left-items-list-block",
// 									{
// 										"furnitureStore-left-items-list-block-active":
// 											this.store.item === item.id,
// 									}
// 								)}
// 								key={key}
// 								onClick={() => this.setItem(item.id)}
// 							>
// 								<span>{item.name}</span>
// 								<h1>{item.cost}$</h1>
// 							</div>
// 						);
// 					})}
// 				</div>
// 			</div>
// 		</div>

// 		<div className="furnitureStore-center">
// 			<div className="furnitureStore-center__name">
// 				{LangString(
// 					"components.FurnitureStore.FurnitureStore.22e15f4affe087a431305e4f82e09646"
// 				)}
// 			</div>
// 			<div className="furnitureStore-center__title">
// 				{LangString(
// 					"components.FurnitureStore.FurnitureStore.2c998a5191663ffb7a64d39aa58edddb"
// 				)}
// 			</div>

// 			<div className="furnitureStore-center-description">
// 				<div className="furnitureStore-center-description__image">
// 					<img src={svg["move"]} alt="" />
// 				</div>
// 				<span>
// 					{LangString(
// 						"components.FurnitureStore.FurnitureStore.446ff5ece5a19bf0afd612338a99b5de"
// 					)}
// 				</span>
// 			</div>
// 		</div>

// 		{this.store.item !== null && (
// 			<div className="furnitureStore-right">
// 				<div className="furnitureStore-right__name">
// 					{this.getCurrentItem().name}
// 				</div>
// 				<div className="furnitureStore-right__price">
// 					{this.getCurrentItem().cost}$
// 				</div>

// 				<div
// 					className="furnitureStore-right__button"
// 					onClick={() => this.buy()}
// 				>
// 					<img src={svg["mark"]} alt="" />
// 					<span>
// 						{LangString(
// 							"components.FurnitureStore.FurnitureStore.f45850dea8b9bbd4ab843ea08b5518cb"
// 						)}
// 					</span>
// 				</div>
// 			</div>
// 		)}
// 	</div>
// );
