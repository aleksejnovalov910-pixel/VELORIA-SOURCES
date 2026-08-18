import React, { Component } from "react";
const icons = Object.fromEntries(
	Object.entries(
		import.meta.glob("../../../shared/icons/*.png", { eager: true }),
	).map(([key, value]: [string, { default: string }]) => {
		const name = key.match(/\/([^/]+)\.png$/)[1];
		return [name, value.default];
	}),
);
import "./style/style.scss";
import { CustomEvent } from "../../modules/custom.event";
import {
	getBaseItemNameById,
	getItemDesc,
	inventoryShared,
	ITEM_TYPE,
	ITEM_TYPE_ARRAY,
} from "../../../shared/inventory";
import deleteIcon from "./img/delete.svg";
import drinksIcon from "./img/drinks.svg";
import foodIcon from "./img/food.svg";
import alcoIcon from "./img/alcohol.svg";
import systemIcon from "./img/system.svg";
import sishaicon from "./img/sisha.svg"
import armeicon from "./img/arme.svg"
import ammoicon from "./img/ammo.svg"
import modificariicon from "./img/modificari.svg"
import iconbags from "./img/bags.svg"
import coins from "../../components/UserMenu/assets/svg/player-stop-white.svg";

import iconmining from "./img/mining.svg"
import { PayBox } from "../PayBox/PayBox";
import "./style.less";
import { CEF } from "../../modules/CEF";
import otherIcon from "./img/others.svg";
import { BUSINESS_SUBTYPE_NAMES } from "../../../shared/business";
const ITEM_IMAGES: Record<number, string> = {
	0: drinksIcon, // Иконка для воды
	1: foodIcon, // Иконка для еды
	6: systemIcon,
	10: alcoIcon,
	17: sishaicon,
	2: armeicon,
	3: ammoicon,
	12: modificariicon,
	13: iconbags,
	14: iconmining,

};
export class ShopBlock extends Component<
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	{},
	{
		active?: boolean;
		name?: string;
		shopId?: number;
		items?: {
			item_id: number;
			count: number;
			price: number;
			inCart?: number;
		}[];
		donate?: number;
		shopType: Array<number>;
		/** Выбранный раздел */
		selectType: number;
		selectItem: number;
		showPay?: boolean;
	}
> {
	initEvent: import("../../../shared/custom.event").CustomEventHandler;
	_child: React.RefObject<PayBox>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	constructor(props: any) {
		super(props);

		this.state = {
			active: true,
			name: "Premium Deluxe Shoper",
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
			shopType: [2, 0],
			selectType: 0,
			selectItem: -1
		};
		this._child = React.createRef<PayBox>();

		this.initEvent = CustomEvent.register(
			"cef:item_shop:init",
			(
				shopId: number,
				shopName: string,
				items: { item_id: number; count: number; price: number }[],
				donate: number,
				shopType: number,
				shopCategory: number,
			) => {
				this.setState({
					shopId,
					name: shopName,
					items,
					donate,
					active: true,
					shopType: [shopType, shopCategory],
					showPay: false,
				});
			},
		);
	}
	componentDidMount = () => {
		document.addEventListener("keydown", this.handleKeyDown);
	};
	componentWillUnmount = () => {
		if (this.initEvent) this.initEvent.destroy();
		document.removeEventListener("keydown", this.handleKeyDown);
	};
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	handleKeyDown = (e: any) => {
		switch (e.keyCode) {
			case 27: {
				CustomEvent.triggerClient("shop::closeButton");
				CEF.playSound("exitmagazin"); // ruleaza instant
			
				if (this.state.showPay && this.state.showPay === true)
					this.setState({ ...this.state, showPay: false });
				else this.setState({ ...this.state, active: false });
				return;
			}
		}
	};
	buyItem = () => {
		const result = this.state.donate
			? { paytype: 150, pin: "" }
			: this._child.current.canPay(this.getAllPrice());
		if (!result) return;
		const data = [...this.state.items]
			.filter((q) => q.inCart > 0)
			.map((q) => {
				return [q.item_id, q.inCart];
			});
		if (data.length === 0) return;
		// Переделать, брать из items где есть в корзине ( inCart )
		this.setState({ showPay: false });
		CustomEvent.triggerServer(
			"server:item_shop:buy_item",
			this.state.shopId,
			data,
			result.paytype,
			result.pin,
		);		
	};
	selectType = (type: number) => {
		this.setState({ ...this.state, selectType: type });
	};
	putInCart = (itemid: number, ammount: number) => {
	if (ammount > 0) {
		const current = this.state.items.find(
		(item) => item.item_id === itemid,
		).count;
		const inCurrent =
		this.state.items.find((item) => item.item_id === itemid).inCart || 0;

		if (current <= inCurrent) {
		return CEF.alert.setAlert(
			"error",
			`${getBaseItemNameById(itemid)} nu mai este in stoc!`
		);
		}
	}

	const items = this.state.items.map((obj) => {
		if (obj.item_id === itemid)
		return { ...obj, inCart: obj.inCart ? obj.inCart + ammount : ammount };
		return obj;
	});

	if (ammount > 0) {
		CEF.playSound("addbasket");
	}
	if (ammount < 0) {
		CEF.playSound("errorClick");
	}

	this.setState({ ...this.state, items });
	};
	// putInCart = (itemid: number, ammount: number) => {
	// 	if (ammount > 0) {
	// 		const current = this.state.items.find(
	// 			(item) => item.item_id === itemid,
	// 		).count;
	// 		const inCurrent =
	// 			this.state.items.find((item) => item.item_id === itemid).inCart || 0;
	// 		if (current <= inCurrent) return;
	// 	}
	// 	const items = this.state.items.map((obj) => {
	// 		if (obj.item_id === itemid)
	// 			return { ...obj, inCart: obj.inCart ? obj.inCart + ammount : ammount };
	// 		return obj;
	// 	});
	// 	// ----> Redă sunetul la adăugare în coș
	// 	// Sunet la adăugare
	// 	if (ammount > 0) {
	// 		CEF.playSound("addbasket"); // sau "success", după cum vrei tu
	// 	}
	// 	// Sunet la remove
	// 	if (ammount < 0) {
	// 		CEF.playSound("errorClick"); // sau "remove", după cum vrei tu
	// 	}
	// 	this.setState({ ...this.state, items });
	// };
	getAllPrice = () => {
		let allprice = 0;
		this.state.items.map((obj) => {
			if (obj.inCart) allprice += obj.inCart * obj.price;
		});
		return allprice;
	};
	getCategorys = () => {
		const categorys: Array<{ index: number; name: string }> = [];
		this.state.items.map((obj) => {
			const cfg = inventoryShared.get(obj.item_id);
			if (!cfg) return console.log("getCategorys ITEM SHOP WRONG ITEM");
			if (
				categorys.some((data) => data.name === ITEM_TYPE_ARRAY[cfg.type]) ===
				false
			)
				categorys.push({ index: cfg.type, name: ITEM_TYPE_ARRAY[cfg.type] });
		});
		return categorys;
	};

	formatTitle() {

		const splited = BUSINESS_SUBTYPE_NAMES[this.state.shopType[0]][this.state.shopType[1]].split(" ");
		if (!splited) return <>Shop</>;

		return (
			<>
				{splited[0]}
				<span> {splited.slice(1).join(" ")}</span>
			</>
		)
	}
	render = () => {
		const { active, name, items, selectType } = this.state;

		// Получение элементов, добавленных в корзину
		const inCart = items?.filter((data) => data.inCart > 0) || [];

		// Получение списка категорий
		const category = this.getCategorys();

		// Фильтрация элементов по выбранной категории
		const filteredItems =
			items?.filter((data) => {
				const item = inventoryShared.get(data.item_id);
				return item && item.type === category[selectType].index;
			}) || [];
		if (!active) return <></>;
		return (
			<>
				<div className="shop-container-box">
					<div className="shop">
						<div className="top">
							<div className="title">
								<h1>
									{this.formatTitle()}
								</h1>
								<p>{name}</p>
							</div>
						</div>
						<div className="all-shop">
							<div className="shop-menu-items">
								{category.length > 1 &&
									category.map((data, index) => {
										return (
											<div
												key={data.index}
												className={`item ${index === this.state.selectType ? "selected" : ""}`}
												onClick={() => this.selectType(index)}
												onKeyDown={() => this.selectType(index)}
											>
												<div className="item-image">
													<img
														src={ITEM_IMAGES[data.index] || otherIcon}
														alt={data.name}
														className="item-icon"
													/>
												</div>
												{data.name}
											</div>
										);
									})}
							</div>
							<div className="shop-items">
								{filteredItems.map((data, index) => {
									const desc = getItemDesc(data.item_id);
									const cfg = inventoryShared.get(data.item_id);
									const content = (
										<div
											key={data.item_id}
											className={`item ${index === this.state.selectType ? "shop_item_select" : ""}`}
										>
											<div className="item-info">
												<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
													<path d="M8.33333 8.33333L8.37021 8.31489C8.87965 8.06018 9.45326 8.52031 9.31512 9.07287L8.68488 11.5938C8.54674 12.1464 9.12035 12.6065 9.62979 12.3518L9.66667 12.3333M17 9C17 13.4183 13.4183 17 9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9ZM9 5.66667H9.00667V5.67333H9V5.66667Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
												</svg>
												<p>
													{desc
														? desc
														: [ITEM_TYPE.WATER, ITEM_TYPE.FOOD].includes(
															cfg.type,
														)
															? `${cfg.default_count} ${cfg.type === ITEM_TYPE.WATER ? "" : ""}`
															: "Fara descriere"}
												</p>
											</div>
											<div>
												<div className="item-image">
													<img src={icons[`Item_${data.item_id}`]} alt="" />
												</div>
											</div>
											<div className="item-description">
												<div className="item-details">
													<h2 className="item-title">
														{getBaseItemNameById(data.item_id) || "N/A"}
													</h2>

												</div>
												<div className="item-price">
													<p>
													{this.state.donate ? (
														<>
														<img
															src={coins}
															width={16}
															height={16}
															style={{ verticalAlign: "middle", marginRight: "4px" }}
														/>
														{data.price.toLocaleString()}
														</>
													) : (
														<>${data.price.toLocaleString()}</>
													)}
													</p>

												</div>
											</div>
											<button
												type="button"
												className="item-button"
												onClick={() => this.putInCart(data.item_id, 1)}
											>
												Adauga in cos
											</button>
										</div>
									);
									return content;
								})}
							</div>
							<div className="shopping-cart">
								<div className="cart-items">
									<p>Cosul de cumparaturi</p>
									{inCart.map((data, index) => {
										return (
											<div key={data.item_id} className="cart-item">
												<div className="cart-img">
													<img src={icons[`Item_${data.item_id}`]} alt="" />
												</div>
												<h2 className="item-title">{`${getBaseItemNameById(data.item_id)} x ${data.inCart}`}</h2>
												<button
													type="button"
													className="item-remove-button"
													onClick={() => this.putInCart(data.item_id, -1)}
												>
													<img src={deleteIcon} alt="Remove" />
												</button>
											</div>
										);
									})}
								</div>
								<div className="cart-total">
									<hr />
									<p>Total</p>
									<h1>
									Cost total:{" "}
									{this.state.donate ? (
										<>
										<img
											src={coins}
											width={18}
											height={18}
											style={{ verticalAlign: "middle", marginRight: "4px" }}
										/>
										{this.getAllPrice().toLocaleString()}
										</>
									) : (
										<>${this.getAllPrice().toLocaleString()}</>
									)}
									</h1>
									<button
										onClick={(e) => {
											e.preventDefault();
											if (this.state.donate) {
												this.buyItem();
											} else {
												this.setState({ ...this.state, showPay: true });
											}
										}}
										type="button"
										className="checkout-button"
									>
										Plateste
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="shop_browser">
					{this.state.showPay && this.state.showPay === true ? (
						<div className="shop_paybox">
							<div className="shop_paybox_box">
								<PayBox ref={this._child} />
								<div
									className="shop_buy"
									onClick={this.buyItem}
									onKeyDown={this.buyItem}
								>
									{/* <img src={check} /> */}
									Buy
								</div>
							</div>
						</div>
					) : null}
				</div>
				{/* {this.state.showPay && this.state.showPay === true ? (
					<div className="paybox">
						<div className="payment-box">
							<div className="payment">
								<PayBox ref={this._child} />

								<button
									type="button"
									className="buy"
									onClick={this.buyItem}
									onKeyDown={this.buyItem}
								>
									Buy
								</button>
							</div>
						</div>
					</div>
				) : null} */}
			</>
		);
	};
}
