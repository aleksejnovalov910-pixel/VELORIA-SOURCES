import { LangString } from "../../../../modules/lang";
import React, { Component } from "react";
import "./style.less";

const png = Object.fromEntries(
  Object.entries(import.meta.glob("./assets/*.png", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.png$/)[1];
      // @ts-ignore
      return [name, value.default];
    }
  )
);
const svg = Object.fromEntries(
  Object.entries(import.meta.glob("./assets/*.svg", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.svg$/)[1];
      // @ts-ignore
      return [name, value.default];
    }
  )
);

const productImages = Object.fromEntries(
  Object.entries(
    import.meta.glob("../../../../../shared/icons/*.png", { eager: true })
  ).map(([key, value]) => {
    const name = key.match(/\/([^/]+)\.png$/)[1];
    //@ts-ignore
    return [name, value.default];
  })
);
import { CustomEvent } from "../../../../modules/custom.event";
import { CustomEventHandler } from "../../../../../shared/custom.event";
import { CEF } from "../../../../modules/CEF";
import { getBaseItemNameById, inventoryShared } from "../../../../../shared/inventory";
import { FEED_LIST, SUPPLIES_LIST } from "../../../../../shared/farm/config";
import { PayBox } from "../../../PayBox/PayBox";
import check from "../../../ClothShop/assets/check.svg";

type category = "seeds" | "feed";
type subCat = "field" | "greenhouse";

interface Product {
  item_id: number;
  count: number;
  price: number;
  inCart?: number;
}

export class Shop extends Component<
  {},
  {
    name?: string;
    shopId?: number;
    items?: Product[];
    donate?: number;
    showPay?: boolean;

    cat: category;
    subCat: subCat;
    basket: Product[];
  }
> {
  _child: React.RefObject<PayBox>;
  initEvent: CustomEventHandler;
  containerRef: React.RefObject<HTMLDivElement>;
  constructor(props: any) {
    super(props);

    this.state = {
      items: CEF.test
        ? [
            ...inventoryShared.items.map((q) => {
              return {
                item_id: q.item_id,
                count: 10,
                price: q.defaultCost || 1000,
              };
            }),
          ]
        : [],

      cat: "seeds",
      subCat: "greenhouse",
      basket: [],
    };

    this.containerRef = React.createRef<HTMLDivElement>();
    this._child = React.createRef<PayBox>();

    this.initEvent = CustomEvent.register(
      "cef:item_shop:init",
      (
        shopId: number,
        shopName: string,
        items: Product[],
        donate: number,
        _: number,
        __: number
      ) => {
        this.setState({
          shopId,
          items,
          donate,
        });
      }
    );
  }

  componentDidMount = () => {
    document.addEventListener("keydown", this.handleKeyDown);
    this.adjustZoom();
    window.addEventListener("resize", this.adjustZoom);
  };

  componentWillUnmount = () => {
    if (this.initEvent) this.initEvent.destroy();
    window.removeEventListener("resize", this.adjustZoom);
    document.removeEventListener("keydown", this.handleKeyDown);
  };
  handleKeyDown = (e: any) => {
    switch (e.keyCode) {
      case 27: {
        if (this.state.showPay && this.state.showPay === true)
          this.setState({ ...this.state, showPay: false });
        return;
      }
    }
  };
  buy() {
    let result = this._child.current.canPay(this.getTotalAmount());

    if (!result) return;
    let data = [...this.state.basket]
      .filter((q) => q.count > 0)
      .map((q) => {
        return [q.item_id, q.count];
      });

    if (data.length === 0) return;
    this.setState({ showPay: false });

    CustomEvent.triggerServer(
      "server:item_shop:buy_item",
      this.state.shopId,
      data,
      result.paytype,
      result.pin
    );
  }

  setCat(cat: category) {
    this.setState({ ...this.state, cat });
  }

  setSubCat(subCat: subCat) {
    this.setState({ ...this.state, subCat });
  }

  getCurrentShop(): Product[] {
    if (this.state.cat === "seeds") {
      if (this.state.subCat === "greenhouse") {
        return this.state.items.filter((i) => {
          const supply = SUPPLIES_LIST.find(
            (s) => s.inventoryItemId == i.item_id
          );
          if (!supply) return false;
          return supply.type == "greenhouse" || supply.type == "all";
        });
      } else {
        return this.state.items.filter((i) => {
          const supply = SUPPLIES_LIST.find(
            (s) => s.inventoryItemId == i.item_id
          );
          if (!supply) return false;
          return supply.type == "field" || supply.type == "all";
        });
      }
    } else {
      return this.state.items.filter((i) => {
        const supply = FEED_LIST.find((s) => s.inventoryItemId == i.item_id);
        return !!supply;
      });
    }
  }

  // addToBasket(key: number) {
  //   const obj = { ...this.getCurrentShop()[key] };
  //   let inBasket = false;
  //   const basket = [...this.state.basket].map((item) => {
  //     if (item.item_id === obj.item_id) {
  //       inBasket = true;
  //       return { ...item, count: item.count + 1 };
  //     }
  //     return item;
  //   });

  //   // obj.inCart = obj.inCart ? obj.inCart + 1 : 1;
  //   if (!inBasket) {
  //     obj.count = 1;
  //     basket.push(obj);
  //   }
  //   this.setState({ ...this.state, basket });
  // }
  // // addToBasket(key: number) {
  // //   const obj = { ...this.getCurrentShop()[key] },
  // //     basket = [...this.state.basket];

  // //   obj.count = 1;
  // //   obj.inCart = obj.inCart ? obj.inCart + 1 : 1;

  // //   basket.push(obj);
  // //   this.setState({ ...this.state, basket });
  // // }
  addToBasket(key: number) {
    const obj = { ...this.getCurrentShop()[key] };

    // verificam daca produsul mai are stoc
    if (obj.count <= 0) {
      CEF.playSound("errorClick");
      CEF.alert.setAlert(
        "error",
        `${getBaseItemNameById(obj.item_id)} nu mai este in stoc!`
      );
      return;
    }

    let inBasket = false;
    const basket = [...this.state.basket].map((item) => {
      if (item.item_id === obj.item_id) {
        // verificam sa nu depaseasca stocul
        if (item.count + 1 > obj.count) {
          CEF.playSound("errorClick");
          CEF.alert.setAlert(
            "error",
            `${getBaseItemNameById(obj.item_id)} nu mai este in stoc!`
          );
          return item; // 🔹 returnam item-ul ca sa nu intoarca void
        }
        inBasket = true;
        CEF.playSound("addbasket");
        return { ...item, count: item.count + 1 };
      }
      return item;
    });

    if (!inBasket) {
      obj.count = 1;
      basket.push(obj);
      CEF.playSound("addbasket");
    }

    this.setState({ ...this.state, basket });
  }
  changeBasketCount(toggle: boolean, key: number) {
    let basket = [...this.state.basket];
    let el: Product = basket[key];

    if (toggle) {
      if (el.count === 50) {
        el.count = 0;
      } else {
        el.count++;
      }
    } else {
      if (el.count === 0) {
        el.count = 50;
      } else {
        el.count--;
      }
    }

    this.setState({ ...this.state, basket });
  }

  getTotalAmount(): number {
    let amount = 0;

    this.state.basket.forEach((el) => {
      amount += el.price * el.count;
    });

    return amount;
  }

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

  close() {
    CEF.gui.setGui(null);
  }

  render() {
    return (
      <div className="farm-shop">
        <div className="farm-shop__bg">
        </div>

        {this.state.showPay && this.state.showPay === true ? (
          <div className="shop_paybox">
            <div className="shop_paybox_box">
              <PayBox ref={this._child} />
              <div className="shop_buy" onClick={() => this.buy()}>
                <img src={check} />
                {LangString(
                  "components.Farm.components.Shop.Shop.2d04017469248ea871b064be06219652"
                )}
              </div>
            </div>
          </div>
        ) : null}

        <div className="farm-shop__wrapper" ref={this.containerRef}>
          <div className="farm-shop__top">
            <div className="farm-shop__top__title">
              <h1>
                farm <span>shop</span>
              </h1>
              <p>Magazin de ferma cu seminte, furaje si unelte pentru cresterea animalelor si lucrul pamantului. Tot ce ai nevoie, intr-un singur loc</p>
            </div>
            <div className="farm-shop__top__exit">
              <p>Exit</p>
              <div
                className="farm-shop__top__exit-img"
                onClick={() => this.close()}
              >
                <img src={svg["exit"]} alt="Exit" />
              </div>
            </div>
          </div>
          <div className="farm-shop__main">
            <div className="farm-shop__main__categories">
              <div
                className={`farm-shop__main__category ${
                  this.state.cat === "seeds" ? "active" : null
                }`}
                onClick={() => this.setCat("seeds")}
              >
                <div className="farm-shop__main__category__img">
                  <img src={svg["seeds"]} alt="" />
                </div>
                <h2>Seminte</h2>
              </div>

              <div
                className={`farm-shop__main__category ${
                  this.state.cat === "feed" ? "active" : null
                }`}
                onClick={() => this.setCat("feed")}
              >
                <div className="farm-shop__main__category__img">
                  <img src={svg["fodder"]} alt="" />
                </div>
                <h2>Furaj</h2>
              </div>
            </div>
            <div className="farm-shop__main__content">
              {this.state.cat === "seeds" ? (
                <div className="farm-shop__main__content__categories">
                  <div
                    className={`farm-shop__main__content__category ${
                      this.state.subCat === "greenhouse" ? "selected" : null
                    }`}
                    onClick={() => this.setSubCat("greenhouse")}
                  >
                    {LangString(
                      "components.Farm.components.Shop.Shop.5f351b0c7ab9886271b8a14d541a5768"
                    )}
                  </div>
                  <div
                    className={`farm-shop__main__content__category ${
                      this.state.subCat === "field" ? "selected" : null
                    }`}
                    onClick={() => this.setSubCat("field")}
                  >
                    {LangString(
                      "components.Farm.components.Shop.Shop.5b53f1d69aec8e1640099cbb3eaff9ad"
                    )}
                  </div>
                </div>
              ) : (
                <div className="farm-shop__main__content__categories">
                  <div
                    className={`farm-shop__main__content__category selected`}
                  >
                    Hrana animale
                  </div>
                </div>
              )}
              <div className="farm-shop__main__content__items">
                {this.getCurrentShop().map((el, key) => {
                  return (
                    <div key={key} className="farm-shop__main__content__item">
                      <div className="farm-shop__main__content__item-img">
                        <img src={productImages[`Item_${el.item_id}`]} alt="" />
                      </div>
                      <div className="farm-shop__main__content__item-description">
                        <h2 className="farm-shop__main__content__item-title">
                          {inventoryShared.get(el.item_id).name}
                        </h2>
                        <p className="farm-shop__main__content__item-price">
                          ${el.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        className="farm-shop__main__content__item-button"
                        onClick={() => this.addToBasket(key)}
                      >
                        Adauga in cos
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="farm-shop__main__cart">
              <p>Cosul de cumparaturi</p>
              <div className="farm-shop__main__cart-items">
                {this.state.basket.map((el, index) => (
                  <div key={index} className="farm-shop__main__cart-item">
                    <div className="farm-shop__main__cart-item-img">
                      <img src={productImages[`Item_${el.item_id}`]} alt="" />
                    </div>
                    <h2 className="farm-shop__main__cart-item-title">{`${
                      inventoryShared.get(el.item_id).name
                    } x ${el.count}`}</h2>
                    <button
                      className="farm-shop__main__cart-item-btn"
                      onClick={() => this.removeFromBasket(el.item_id)}
                    >
                      <img src={svg["delete"]} alt="Remove" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="farm-shop__main__cart-total">
                <hr />
                <p>Total cost</p>
                <h1>$ {this.getTotalAmount().toFixed(2)}</h1>
                <button
                  type="button"
                  className="farm-shop__main__cart-btn"
                  onClick={() => {
                    this.setState({
                      ...this.state,
                      showPay: true,
                    });
                  }}
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// return (
// 	<div className="farm-shop">
// 		<img src={png["logo"]} className="farm-shop__logo" alt="" />
//MБ вернуть тварь 		{this.state.showPay && this.state.showPay === true ? (
// 			<div className="shop_paybox">
// 				<div className="shop_paybox_box">
// 					<PayBox ref={this._child} />
// 					<div className="shop_buy" onClick={() => this.buy()}>
// 						<img src={check} />
// 						{LangString(
// 							"components.Farm.components.Shop.Shop.2d04017469248ea871b064be06219652"
// 						)}
// 					</div>
// 				</div>
// 			</div>
// 		) : null}
// 		<div className="farm-shop-left">
// 			<div
// 				className={`farm-shop-left__button ${
// 					this.state.cat === "seeds" ? "farm-active" : null
// 				}`}
// 				onClick={() => this.setCat("seeds")}
// 			>
// 				<img src={svg["seeds"]} alt="" />
// 				{LangString(
// 					"components.Farm.components.Shop.Shop.ba5e9268210b2ca22c7f768fe9ffc2b8"
// 				)}
// 			</div>

// 			<div
// 				className={`farm-shop-left__button ${
// 					this.state.cat === "feed" ? "farm-active" : null
// 				}`}
// 				onClick={() => this.setCat("feed")}
// 			>
// 				<img src={svg["box"]} alt="" />
// 				{LangString(
// 					"components.Farm.components.Shop.Shop.484ccbd7a5c2526355feb36048aa952d"
// 				)}
// 			</div>
// 		</div>

// 		<div className="farm-shop-middle">
// 			{this.state.cat === "seeds" && (
// 				<div className="farm-shop-middle__nav">
// 					<div
// 						className={`${
// 							this.state.subCat === "greenhouse" ? "farm-active" : null
// 						}`}
// 						onClick={() => this.setSubCat("greenhouse")}
// 					>
// 						<span>
// 							{LangString(
// 								"components.Farm.components.Shop.Shop.5f351b0c7ab9886271b8a14d541a5768"
// 							)}
// 						</span>
// 					</div>
// 					<div
// 						className={`${
// 							this.state.subCat === "field" ? "farm-active" : null
// 						}`}
// 						onClick={() => this.setSubCat("field")}
// 					>
// 						<span>
// 							{LangString(
// 								"components.Farm.components.Shop.Shop.5b53f1d69aec8e1640099cbb3eaff9ad"
// 							)}
// 						</span>
// 					</div>
// 				</div>
// 			)}

// 			<div className="farm-shop-middle-scroll">
// 				{this.getCurrentShop().map((el, key) => {
// 					return (
// 						<div className="farm-shop-middle-scroll-block" key={key}>
// 							<img
// 								src={productImages[`Item_${el.item_id}`]}
// 								className="farm-shop-middle-scroll-block__image"
// 								alt=""
// 							/>
// 							<div className="farm-shop-middle-scroll-block-inform">
// 								<div className="farm-shop-middle-scroll-block-inform__name">
// 									{inventoryShared.get(el.item_id).name}
// 								</div>
// 								<div className="farm-shop-middle-scroll-block-inform__price">
// 									${" "}
// 									{el.price
// 										.toString()
// 										.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}
// 								</div>
// 								<div
// 									className="farm-shop-middle-scroll-block-inform__button"
// 									onClick={() => this.addToBasket(key)}
// 								>
// 									<img src={svg["cart"]} alt="" />
// 									<span>
// 										{LangString(
// 											"components.Farm.components.Shop.Shop.c493ec65e6dea24bd3c71881dc533d98"
// 										)}
// 									</span>
// 								</div>
// 							</div>
// 						</div>
// 					);
// 				})}
// 			</div>
// 		</div>

// 		<div className="farm-shop-right">
// 			<div className="farm-shop-right-top">
// 				<div className="farm-shop-right-top__balance">
// 					<div>
// 						{LangString(
// 							"components.Farm.components.Shop.Shop.5e60345f5c5de4807d3e7267b1ea0964"
// 						)}
// 					</div>
// 					<span>
// 						${" "}
// 						{CEF.user.money
// 							.toString()
// 							.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}
// 					</span>
// 					<p>
// 						${" "}
// 						{CEF.user.bank
// 							.toString()
// 							.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}
// 					</p>
// 				</div>

// 				<div className="farm-shop-right-top__result">
// 					<div>
// 						{LangString(
// 							"components.Farm.components.Shop.Shop.54d8a6f639be7580f6573879cfd5bdb8"
// 						)}
// 					</div>
// 					<span>
// 						${" "}
// 						{this.getTotalAmount()
// 							.toString()
// 							.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}
// 					</span>
// 				</div>

// 				<div
// 					className="farm-shop-right-top__button"
// 					onClick={() => {
// 						this.setState({
// 							...this.state,
// 							showPay: true,
// 						});
// 					}}
// 				>
// 					<img src={svg["mark"]} alt="" />
// 					<span>
// 						{LangString(
// 							"components.Farm.components.Shop.Shop.db8d04bc3ddff856612984d2e6cbad0c"
// 						)}
// 					</span>
// 				</div>
// 			</div>

// 			<div className="farm-shop-right__title">
// 				<img src={svg["cart"]} alt="" />
// 				{LangString(
// 					"components.Farm.components.Shop.Shop.0a5f14c4d96357e7b7332888e75da2fb"
// 				)}{" "}
// 				<span>SHOP</span>
// 			</div>

// 			<div className="farm-shop-right-scroll">
// 				{this.state.basket.map((el, key) => {
// 					return (
// 						<div className="farm-shop-right-scroll-block" key={key}>
// 							<img
// 								src={productImages[`Item_${el.item_id}`]}
// 								className="farm-shop-right-scroll-block__image"
// 								alt=""
// 							/>

// 							<div className="farm-shop-right-scroll-block-right">
// 								<div className="farm-shop-right-scroll-block-right__price">
// 									${" "}
// 									{(el.price * el.count)
// 										.toString()
// 										.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}
// 								</div>

// 								<div className="farm-shop-right-scroll-block-right__name">
// 									{inventoryShared.get(el.item_id).name}
// 								</div>

// 								<div className="farm-shop-right-scroll-block-right__quantity">
// 									<img
// 										src={svg["plus"]}
// 										alt=""
// 										onClick={() => this.changeBasketCount(true, key)}
// 									/>
// 									<span>{el.count}</span>
// 									<img
// 										src={svg["minus"]}
// 										alt=""
// 										onClick={() => this.changeBasketCount(false, key)}
// 									/>
// 								</div>
// 							</div>
// 						</div>
// 					);
// 				})}
// 			</div>
// 		</div>
// 	</div>
// );
