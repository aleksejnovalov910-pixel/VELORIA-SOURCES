import { LangString } from "../../modules/lang";
import React, { Component } from "react";
import {
	itemConfig,
	inventoryShared,
	ITEM_TYPE,
} from "../../../shared/inventory";
import { CustomEvent } from "../../modules/custom.event";
import { MarketDto } from "../../../shared/market/dtos/marketDto";
import { MarketItemChangesDto } from "../../../shared/market/dtos/marketItemChangesDto";
import { systemUtil } from "../../../shared/system";
import {
	getMarketRentCompensation,
	MAX_RENT_TIME_MINUTES,
	RENT_TICK_MINUTES,
} from "../../../shared/market/config";
import { MarketHistoryItemDto } from "../../../shared/market/dtos/marketHistoryItemDto";


import "./style.less";
import "./assets/style.scss";
import exitIcon from "./assets/img/exit.svg";
import clockIcon from "./assets/img/clock.png";
import { CEF } from "../../modules/CEF";

const iconImages = Object.fromEntries(
	Object.entries(
		import.meta.glob("../../../shared/icons/*.png", { eager: true }),
	).map(([key, value]: [string, { default: string }]) => {
		const name = key.match(/\/([^/]+)\.png$/)[1];
		return [name, value.default];
	}),
);

const png = Object.fromEntries(
	Object.entries(import.meta.glob("./assets/*.png", { eager: true })).map(
		([key, value]: [string, { default: string }]) => {
			const name = key.match(/\/([^/]+)\.png$/)[1];
			return [name, value.default];
		},
	),
);
const svg = Object.fromEntries(
	Object.entries(import.meta.glob("./assets/*.svg", { eager: true })).map(
		([key, value]: [string, { default: string }]) => {
			const name = key.match(/\/([^/]+)\.svg$/)[1];
			return [name, value.default];
		},
	),
);


interface itemForCustomer {
	itemId: number;
	itemConfigId: number;
	price: number;
	priceView: number;
	countToBuy: number;
	onStockCount: number;
	name: string;
}

interface itemForSeller {
	activeDump: boolean;
	active: boolean;
	itemId: number;
	itemConfigId: number;
	priceDump: number;
	price: number;
	countForSellDump: number;
	countForSell: number;
	inventoryCount: number;
	name: string;
}

interface itemInHistory {
	configId: number;
	buyer: string;
	proceeds: number;
	amount: number;
	itemName: string;
}

interface sellerPanel {
	endTime: string;
	backMoney: number;
}

export class Market extends Component<
	{},
	{
		tentId: number;
		attentionShow: boolean;
		attentionBoldText: string;
		attentionBasicText: string;
		type: "seller" | "customer";
		sellerName?: string;
		itemsForCustomer?: itemForCustomer[];
		itemsInHistory?: MarketHistoryItemDto[];
		itemsForSeller?: itemForSeller[];
		sellerPanel?: sellerPanel;
		attentionRent: boolean;
		attentionRentValue: number;
		isPolice?: boolean;
	}
> {
	public itemsList: itemConfig[];
	private rentTimeInterval: any;
	private rentTimeSeconds: number;
	private attentionInputRef: React.RefObject<any>;
	private containerRef: React.RefObject<HTMLDivElement>;


	constructor(props: any) {
		super(props);
		console.log("market:init console check 0");

		this.state = {
			tentId: 0,
			attentionShow: false,
			attentionBoldText: "Alle ausgestellten Artikel verkauft,",
			attentionBasicText: "Sie wollen etwas anderes verkaufen?",
			type: "customer",
			sellerName: "Kevin Mackalister",
			itemsForCustomer: [
				{
					itemId: 1,
					itemConfigId: 1,
					price: 100,
					priceView: 100,
					countToBuy: 1,
					onStockCount: 10,
					name: "Item 1",

				},
				{
					itemId: 1,
					itemConfigId: 1,
					price: 100,
					priceView: 100,
					countToBuy: 1,
					onStockCount: 10,
					name: "Item 1",

				},
			],
			itemsInHistory: [
				{
					itemConfigId: 1,
					itemName: "Item 1",
					moneyIncome: 100,
					buyerName: "Test1",
					amount: 1
				}
			],
			itemsForSeller: [
				{
					activeDump: true,
					active: true,
					itemId: 1,
					itemConfigId: 1,
					priceDump: 200,
					price: 500,
					countForSellDump: 3,
					countForSell: 2,
					inventoryCount: 2,
					name: "Test 1"
				},
				{
					activeDump: true,
					active: true,
					itemId: 1,
					itemConfigId: 1,
					priceDump: 200,
					price: 500,
					countForSellDump: 3,
					countForSell: 2,
					inventoryCount: 2,
					name: "Test 1"
				}
			],
			sellerPanel: {
				endTime: "00:45",
				backMoney: 1200,
			},
			attentionRent: false,
			attentionRentValue: 1,
			isPolice: true
		};

		this.itemsList = inventoryShared.items;
		this.containerRef = React.createRef();
		this.adjustZoom = this.adjustZoom.bind(this);

		CustomEvent.register("market:init", (dto: MarketDto) => {
			console.log(`market:init console check ${dto}`);

			if (dto.rentTimeS) {
				this.setState({
					tentId: dto.id,
					type: "seller",
					sellerName: dto.ownerName,
					itemsForSeller: dto.marketItems.map((marketItem) => {
						const isActive = marketItem.count > 0;

						return {
							activeDump: isActive,
							active: isActive,
							itemId: marketItem.itemId,
							itemConfigId: marketItem.itemConfigId,
							priceDump: marketItem.price,
							price: marketItem.price,
							countForSell: marketItem.count,
							countForSellDump: marketItem.count,
							inventoryCount: marketItem.inventoryCount,
							name: marketItem.itemName,
						};
					}),
					itemsInHistory: dto.history,
				});

				this.rentTimeSeconds = dto.rentTimeS;
				this.rentTimeInterval = setInterval(
					this.updateRentTime.bind(this),
					1000,
				);
			} else {
				this.setState({
					tentId: dto.id,
					type: "customer",
					sellerName: dto.ownerName,
					itemsForCustomer: dto.marketItems.map((marketItem) => {
						return {
							itemId: marketItem.itemId,
							itemConfigId: marketItem.itemConfigId,
							price: marketItem.price,
							priceView: marketItem.price,
							countToBuy: 1,
							onStockCount: marketItem.count,
							name: marketItem.itemName,
						};
					}),
					isPolice: dto.isPolice,
				});
			}
		});
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.adjustZoom);
	}

	adjustZoom() {
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
	}

	updateRentTime() {
		this.rentTimeSeconds--;

		const sellerPanel = this.state.sellerPanel;
		sellerPanel.endTime = systemUtil.formatTime(this.rentTimeSeconds);
		sellerPanel.backMoney = getMarketRentCompensation(this.rentTimeSeconds);

		this.setState({
			sellerPanel: this.state.sellerPanel,
		});
	}

	getInventoryItem(id: number): itemConfig {
		for (let el in this.itemsList) {
			if (this.itemsList[el].item_id === id) return this.itemsList[el];
		}

		return null;
	}

	previewItem(key: number) {
		const item: itemForCustomer = this.state.itemsForCustomer[key];
		CustomEvent.triggerServer(
			"market::clothPreview",
			this.state.tentId,
			item.itemId,
		);
	}

	buyItem(key: number) {
		const item: itemForCustomer = this.state.itemsForCustomer[key];
		if (item.countToBuy === 0) return;

		CustomEvent.triggerServer(
			"market::purchase",
			this.state.tentId,
			item.itemId,
			item.countToBuy,
		);
	}

	applySellerChanges() {
		const changes = this.state.itemsForSeller
			.map<MarketItemChangesDto>((item) => {
				if (!item.activeDump && !item.active) {
					return null;
				}

				return {
					itemId: item.itemId,
					itemConfigId: item.itemConfigId,
					oldActive: item.activeDump,
					newActive: item.active,
					oldPrice: item.priceDump,
					newPrice: item.price,
					oldCount: item.countForSellDump,
					newCount: item.countForSell,
				};
			})
			.filter((item) => item);

		CustomEvent.triggerServer("market::applyChanges", changes);
	}

	hireSeller() {
		// client
	}

	extendRent() {
		this.setState({ attentionRent: true, attentionRentValue: 0 });
	}

	finishRent() {
		CustomEvent.triggerServer("market::finishRent");
	}

	previewForSeller(key: number) {
		const item: itemForSeller = this.state.itemsForSeller[key];
		CustomEvent.triggerServer(
			"market::clothPreview",
			this.state.tentId,
			item.itemId,
		);
	}

	onClickAttention(toggle: boolean) {
		// client
	}

	showAttention(boldText: string, basicText: string) {
		this.setState({
			attentionShow: true,
			attentionBoldText: boldText,
			attentionBasicText: basicText,
		});
	}

	closeAttention() {
		this.setState({ attentionShow: false });
	}

	customerChangeCount(key: number, value: string) {
		let items = [...this.state.itemsForCustomer];
		let count = Math.trunc(Number(value));
		if (isNaN(count)) count = 0;
		if (count < 0) {
			return;
		}

		items[key].priceView = items[key].price * count;
		items[key].countToBuy = count;
		this.setState({ ...this.state, itemsForCustomer: items });
	}

	sellerChangeCount(key: number, value: string) {
		let items = [...this.state.itemsForSeller];
		let count = Math.trunc(Number(value));
		if (isNaN(count)) count = 0;
		if (count < 0) {
			return;
		}

		const item = items[key];
		// if (item.countForSell > item.countForSellDump
		//     && item.countForSell - item.countForSellDump < item.inventoryCount) {
		//     return;
		// }

		item.countForSell = count;
		this.setState({ ...this.state, itemsForSeller: items });
	}

	sellerChangePrice(key: number, value: string) {
		let items = [...this.state.itemsForSeller];
		const price = Number(value);
		if (price < 0) {
			return;
		}

		items[key].price = price;
		this.setState({ ...this.state, itemsForSeller: items });
	}

	changeActive(key: number) {
		let items = this.state.itemsForSeller;
		items[key].active = !this.state.itemsForSeller[key].active;
		this.setState({ ...this.state, itemsForSeller: items });
	}

	componentDidMount() {

		this.adjustZoom();
		window.addEventListener("resize", this.adjustZoom);

		this.attentionInputRef = React.createRef();
		if (this.attentionInputRef.current) {
			this.attentionInputRef.current.value = this.state.attentionRentValue;
		}
	}

	attentionInputChange(event: any) {
		this.setState({ attentionRentValue: event.target.value });
	}

	closeAttentionRent() {
		this.setState({ attentionRent: false });
	}

	extendClick() {
		const minutes = this.state.attentionRentValue * RENT_TICK_MINUTES;
		this.setState({ attentionRent: false, attentionRentValue: 0 });

		if (minutes <= 0) {
			return;
		}

		CustomEvent.triggerServer("market::expandRent", minutes);
	}

	getMaxExtendValue(): number {
		const rentMinutesLeft = Math.floor(this.rentTimeSeconds / 60);
		const availableRentMinutes = MAX_RENT_TIME_MINUTES - rentMinutesLeft;

		return Math.floor(availableRentMinutes / RENT_TICK_MINUTES);
	}

	callSeller() {
		CustomEvent.triggerServer("market::callSeller", this.state.tentId);
	}

	render() {
		const { sellerPanel, itemsInHistory, itemsForSeller } = this.state;

		if (this.state.type === "seller") return (
			<div className="trading-market-container-box">
				<div className="trading-market-box" ref={this.containerRef}>
					<div className="trading-market-exit">
						<p>Exit</p>
						<div className="exit-img" onClick={() => CEF.gui.setGui(null)}>
							<img src={exitIcon} alt="Exit" />
						</div>
					</div>

					<div className="top">
						<div className="title">
							<div className="title-left">
								{this.state.type !== "seller" ?
									<>
										<h1>
											{LangString(
												"components.Market.Market.2550d4f99eb081349521a03272982d44",
											)}
										</h1>
										<p>{LangString(
											"components.Market.Market.683fd58e255bbc1e6b54d514c2c0d48e",
										)}</p>
									</>
									:
									<>
										<h1>
											{LangString(
												"components.Market.Market.d559b8d9c347e6d8787d31566d86bd79",
											)} <span>
												{LangString(
													"components.Market.Market.964d89b01ac68de8fbb42ef0c4805d15",
												)}
											</span>
										</h1>
										<p>
											{LangString(
												"components.Market.Market.d559b8d9c347e6d8787d31566d86bd79"
											)}
										</p>
									</>
								}
							</div>

							<div className="clock">
								<img src={clockIcon} alt="clockIcon" />
								<h2>{sellerPanel.endTime}</h2>
							</div>
						</div>

						<div className="controls">
							<button
								className="red"
								onClick={() => this.finishRent()}>
								{LangString(
									"components.Market.Market.5f861b061373d7444c4514c283d4ca46",
								)}
							</button>
							<button
								className="yellow"
								onClick={() => this.extendRent()}
							>
								{LangString(
									"components.Market.Market.885ea869db971f693af2ba2c990433c3",
								)}
							</button>
							{/* <button
								className="blue"
								onClick={() => this.hireSeller()}
							>
								{LangString(
									"components.Market.Market.5e55a0f0fea29a2898af2d664da8c708",
								)}
							</button> */}
							<button
								className="green"
								onClick={() => this.applySellerChanges()}>
								{LangString(
									"components.Market.Market.f647d4dbb66bfbd7f1a4b82ea9bf812d",
								)}
							</button>
						</div>
					</div>

					<div className="content-market">
						<div className="content-left">
							<h1>
								{LangString(
									"components.Market.Market.6da121fae8448febfc55ce58fff18076"
								)}
							</h1>
							<div className="elements">
								{itemsInHistory.map((el: MarketHistoryItemDto, key: number) => {
									const item = this.getInventoryItem(el.itemConfigId);
									if (item === null) return null;

									return (
										<div className="element" key={key}>
											<div className="element-left">
												<div className="element-img">
													<img src={iconImages[`Item_${el.itemConfigId}`]} alt="" />
												</div>
												<div className="element-content">
													<h1>{el.itemName}</h1>
													<h2>{el.buyerName}</h2>
												</div>
											</div>
											<h3>x {el.amount ?? ''}</h3>
										</div>
									)
								})}
							</div>
						</div>

						<div className="content-right">
							<h1>Articole disponibile</h1>
							<div className="elements">
								{itemsForSeller.map((el: itemForSeller, key: number) => {
									const itemConfig = inventoryShared.get(el.itemConfigId);
									if (itemConfig === null) return null;

									return (
										<div className="element-box" key={key}>
											<div
												className="circle"
												onClick={() => this.changeActive(key)}
											>
												{el.active && <div className="middle"></div>}
											</div>
											<div className="element" onClick={() => this.changeActive(key)}>
												<div className="element-left">
													<div className="element-img">
														<img src={iconImages[`Item_${el.itemConfigId}`]} alt="" />
													</div>
													<div className="element-content">
														<h1>{el.name}</h1>
														<h2>{this.state.sellerName}</h2>
													</div>
												</div>
												<div className="element-controls">
													<div className="element-price">
														<h1>
															{LangString(
																"components.Market.Market.d1251645f95ce2edaf76138df6f455b7"
															)}
														</h1>
														<div className="">
															<span style={{ color: "#FF6F7D" }}>$</span>
															<input
																type="number"
																defaultValue={el.price}
																value={el.price}
																onChange={(e) =>
																	this.sellerChangePrice(key, e.target.value)
																}
															/>
														</div>
													</div>
													<div className="element-qty">
														<h1>
															{LangString(
																"components.Market.Market.01f28086cb674041ee6683e88de67fbb"
															)}
														</h1>
														<input
															type="number"
															defaultValue={el.countForSell}
															value={el.countForSell}
															onChange={(e) =>
																this.sellerChangeCount(key, e.target.value)
															}
														/>
													</div>
												</div>
											</div>
										</div>
									)
								})}


							</div>
						</div>
					</div>

					{this.state.isPolice && (
						<div
							className="market-left__closeButton"
							onClick={() => this.callSeller()}
						>
							<img src={svg["null"]} alt="" />
							{LangString(
								"components.Market.Market.ad63385d6b589341f4b7954c9a496aed",
							)}
						</div>
					)}

					{this.state.attentionRent && (
						<div className="modal-market">
							<div className="modal-box">
								<div className="title">
									<h1>
										<span>EXTINDE</span> INCHIRIEREA
									</h1>
									<div className="img-box"
										onClick={() => this.closeAttentionRent()}>
										<img src={exitIcon} alt="" />
									</div>
								</div>
								<div className="time">
									<h1>Durata prelungirii</h1>
									<h2>
										{this.state.attentionRentValue * RENT_TICK_MINUTES}{" "}
										{LangString(
											"components.Market.Market.adf67d8faeccb4e806ff8554c20b3122",
										)}
									</h2>
								</div>
								<input
									type="range"
									ref={this.attentionInputRef}
									min="0"
									max={this.getMaxExtendValue()}
									onClick={(event) => this.attentionInputChange(event)}
									className="custom-slider"
								/>
								<button
									type="button"
									onClick={() => this.extendClick()}
								>
									{LangString(
										"components.Market.Market.f55672dc0cf5522d6dbfe9b079854a3e",
									)}
								</button>
							</div>
						</div>
					)}


				</div>
			</div >
		)
		if (this.state.type === "customer") return (
				<div className={`market market-${this.state.type}`}>
					{this.state.attentionRent && (
						<div className="market-attention">
							<img
								src={svg["closeIcon"]}
								className="market-attention__close"
								alt=""
								onClick={() => this.closeAttentionRent()}
							/>

							<div className="market-attention__text market-attention__bold">
								{LangString(
									"components.Market.Market.726adab85878809d89caef76659ab73d",
								)}
							</div>
							<div className="market-attention__text">
								{LangString(
									"components.Market.Market.dc0f3e2cdd4f6d1c89d234cca25c4213",
								)}
							</div>

							<input
								type="range"
								ref={this.attentionInputRef}
								min="0"
								max={this.getMaxExtendValue()}
								onClick={(event) => this.attentionInputChange(event)}
							/>

							<div className="market-attention__rangeTest">
								{this.state.attentionRentValue * RENT_TICK_MINUTES}{" "}
								{LangString(
									"components.Market.Market.adf67d8faeccb4e806ff8554c20b3122",
								)}
							</div>

							<div className="market-attention-buttons">
								<div
									className="market-attention-buttons__green"
									onClick={() => this.extendClick()}
								>
									{LangString(
										"components.Market.Market.f55672dc0cf5522d6dbfe9b079854a3e",
									)}
								</div>
							</div>
						</div>
					)}

					{this.state.attentionShow && (
						<div className="market-attention">
							<img
								src={svg["closeIcon"]}
								className="market-attention__close"
								alt=""
								onClick={() => this.closeAttention()}
							/>

							<div className="market-attention__icon">
								<img src={png["pizza"]} alt="" />
							</div>

							<div className="market-attention__text market-attention__bold">
								{this.state.attentionBoldText}
							</div>
							<div className="market-attention__text">
								{this.state.attentionBasicText}
							</div>

							<div className="market-attention-buttons">
								<div
									className="market-attention-buttons__green"
									onClick={() => this.onClickAttention(true)}
								>
									{LangString(
										"components.Market.Market.5c3c758ed7f3ff09e4d27239e3d4370c",
									)}
								</div>
								<div
									className="market-attention-buttons__gray"
									onClick={() => this.onClickAttention(false)}
								>
									{LangString(
										"components.Market.Market.a7542e38c7c615e66117f2e6de5cedd3",
									)}
								</div>
							</div>
						</div>
					)}

					<div className="market-left">
						{this.state.type === "customer" && (
							<div className="market-left__name market-seller__hidden">
								<img src={svg["marketIcon"]} alt="" />
								<div>
									{LangString(
										"components.Market.Market.35612eda86850184abca62afaad23921",
									)}
									<span>
										{LangString(
											"components.Market.Market.8267deacefc921661b9f17a5c90d6202",
										)}
										<span>{this.state.sellerName}</span>
									</span>
								</div>
							</div>
						)}						

						{this.state.isPolice && (
							<div
								className="market-left__closeButton"
								onClick={() => this.callSeller()}
							>
								<img src={svg["null"]} alt="" />
								{LangString(
									"components.Market.Market.ad63385d6b589341f4b7954c9a496aed",
								)}
							</div>
						)}
					</div>

					<div className="market-right">
						
						{this.state.type === "customer" && (
							<div className="market-right-scroll">
								{this.state.itemsForCustomer.map((el: itemForCustomer, key: number) => {
									const item = this.getInventoryItem(el.itemConfigId);
									if (item === null) return null;
									
									return (
										<div className="market-right-scroll-block" key={key}>
											<div className="market-part">
												<div
													className={
														"market-right-scroll-block__mark  market-customer__hidden market-active"
													}
												>
													<img src={svg["mark"]} alt="" />
												</div>

												<div className="market-right-scroll-block__icon">
													<img
														src={iconImages[`Item_${el.itemConfigId}`]}
														alt=""
													/>
													<span>
														{el.onStockCount === 1 ? "" : el.onStockCount}
													</span>
												</div>
												<div className="market-right-scroll-block__text">
													{el.name}
												</div>
											</div>

											<div className="market-part market-seller__hidden">
												{item.type === ITEM_TYPE.CLOTH && (
													<img
														className="market-right-scroll-block__reviewButton"
														src={svg["reviewButton"]}
														alt=""
														onClick={() => this.previewItem(key)}
													/>
												)}

												<div className="market-right-scroll-block__inputs">
													<p>
														{el.priceView
															.toString()
															.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}
														$
													</p>
													<div>
														<input
															type="number"
															defaultValue={el.countToBuy}
															value={el.countToBuy}
															onChange={(e) =>
																this.customerChangeCount(key, e.target.value)
															}
														/>
														<span>
															{LangString(
																"components.Market.Market.01f28086cb674041ee6683e88de67fbb",
															)}
														</span>
													</div>
												</div>
												<div
													className={`market-right-scroll-block__buyButton ${el.countToBuy > 0 ? "market-active-buyButton" : ""}`}
													onClick={() => this.buyItem(key)}
												>
													<img src={svg["cart"]} alt="" />
													<span>
														{LangString(
															"components.Market.Market.68bac95ba42fcf6a80d2f3f00350caa4",
														)}
													</span>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}

					</div>
				</div>
			);
	}
}
