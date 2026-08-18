import { LangString } from "../../modules/lang";
import React, { Component } from "react";
import "./style.less";

const png = Object.fromEntries(
	Object.entries(import.meta.glob("./assets/*.png", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.png$/)[1];
			return [name, value.default];
		},
	),
);
const svg = Object.fromEntries(
	Object.entries(import.meta.glob("./assets/*.svg", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.svg$/)[1];
			return [name, value.default];
		},
	),
);

import { CloseButton } from "../CloseButton";

import { CustomEvent } from "../../modules/custom.event";
import { CEF } from "../../modules/CEF";
import classNames from "classnames";
import HomeMenuStore from "../../stores/HomeMenu";
import { observer } from "mobx-react";
import {
	IInteriorData,
	ILayout,
	interiorsData,
	layoutsData,
} from "../../../shared/houses/menu/interiors.config";
import {
	FurnitureCategory,
	furnitureList,
} from "../../../shared/houses/furniture/furniture.config";
import { IMyInteriorData } from "../../../shared/houses/menu/menu.web";

@observer
export class InteriorControl extends Component<
	{
		store: HomeMenuStore;
	},
	{
		currentLayout: number;
		layoutState: number;
		personalLayout: number;
	}
> {
	store: HomeMenuStore;

	constructor(props: any) {
		super(props);

		this.state = {
			currentLayout: null,
			layoutState: 0,
			personalLayout: 0,
		};

		this.store = this.props.store;
	}

	close = () => {
		CEF.gui.setGui(null);
	};

	changePage = (page: "configurator" | "interior" | "furniture") => {
		this.store.setState({ page });
	};

	changeLayout = (id: number) => {
		this.store.setState({
			layout: id,
			variation: null,
		});
	};

	changeVariation = (id: number) => {
		this.store.setState({
			variation: id,
		});
	};

	changeFurnitureCategory(cat: FurnitureCategory) {
		this.store.setState({
			category: cat,
		});
	}

	changeFurnitureItem(id: number) {
		this.store.setState({ furnitureItem: id });
	}

	getCategories() {
		const array: FurnitureCategory[] = [];

		this.store.furniture.forEach((item) => {
			const cfg = furnitureList.find((el) => el.id === item.cfgId);

			if (!cfg) return;

			if (array.find((el) => el === cfg.cat) === undefined) array.push(cfg.cat);
		});

		return array;
	}

	getFurnitureByCategory() {
		return this.store.furniture.filter((el) => {
			const cfg = furnitureList.find((item) => el.cfgId === item.id);

			if (!cfg) return false;

			return cfg.cat === this.store.category;
		});
	}

	currentFurnitureItemPlaced() {
		const item = this.store.furniture.find(
			(el) => el.id === this.store.furnitureItem,
		);

		if (!item) return false;

		return item.placed;
	}

	getSellFurnitureAmount() {
		const item = this.store.furniture.find(
			(el) => el.id === this.store.furnitureItem,
		);

		if (!item) return 0;

		const cfg = furnitureList.find((el) => item.cfgId === el.id);

		if (!cfg) return 0;

		return cfg.cost * 0.2;
	}

	getVariationCost() {
		const cfg = interiorsData.find((el) => el.id === this.store.variation);

		if (!cfg) return 0;

		return cfg.cost;
	}

	variationIsDonate() {
		const cfg = interiorsData.find((el) => el.id === this.store.variation);

		if (!cfg) return false;

		return cfg.isDonate;
	}

	getCurrentInteriorData(): null | IMyInteriorData {
		if (this.store.interiorId === null) return null;

		const interior: IInteriorData = interiorsData.find(
			(el) => el.interiorId === this.store.interiorId,
		);

		if (!interior) return null;

		const layout: ILayout = layoutsData.find(
			(el) => el.id === interior.layoutId,
		);

		if (!layout) return null;

		return {
			name: interior.name,
			cost: interior.cost,
			isDonate: interior.isDonate,
			image: interior.img,
			layoutName: layout.name,
			layoutImage: this.getPersonalLayoutImage(layout),
		};
	}

	getPersonalLayoutImage(layout: ILayout) {
		if (typeof layout.img === "string") return layout.img;
		return layout.img[this.state.personalLayout];
	}

	changePersonalLayoutImage() {
		const interior: IInteriorData = interiorsData.find(
			(el) => el.interiorId === this.store.interiorId,
		);

		if (!interior) return;

		const layout: ILayout = layoutsData.find(
			(el) => el.id === interior.layoutId,
		);

		if (!layout) return;

		if (typeof layout.img === "string") return;

		if (layout.img.length - 1 === this.state.personalLayout) {
			this.setState({
				personalLayout: 0,
			});
		} else {
			this.setState({
				personalLayout: this.state.personalLayout + 1,
			});
		}
	}

	buyInterior() {
		const interior = interiorsData.find((el) => el.id === this.store.variation);

		if (!interior) return;

		CustomEvent.triggerServer("homeMenu:buyInterior", interior.interiorId);
		this.close();
	}

	sellFurniture() {
		const id = this.store.furnitureItem;

		CustomEvent.triggerServer("furniture:sell", id);

		this.store.setState({
			furnitureItem: null,
		});
	}

	placeFurniture(toggle: boolean) {
		const id = this.store.furnitureItem;

		CustomEvent.triggerServer("furniture:placement", id, toggle);
	}

	getConfiguratorImage() {
		const interior = interiorsData.find((el) => el.id === this.store.variation);

		if (!interior) return "";

		return interior.img;
	}

	componentWillUnmount() {
		this.store.setState({
			layout: null,
			variation: null,
			category: null,
			furnitureItem: null,
		});
	}

	getImageForShopLayout(item: ILayout) {
		if (typeof item.img === "string") return item.img;

		if (this.state.layoutState === item.id) {
			return item.img[this.state.currentLayout];
		} else {
			return item.img[0];
		}
	}

	changeImageForShopLayout(item: ILayout) {
		if (typeof item.img === "string") return;

		if (this.state.layoutState !== item.id) {
			this.setState({
				layoutState: item.id,
				currentLayout: 1,
			});
		} else {
			this.setState({
				layoutState: item.id,
				currentLayout:
					this.state.currentLayout === item.img.length - 1
						? 0
						: this.state.currentLayout + 1,
			});
		}
	}

	render() {
		return (
			<div className="interiorControl">
				<CloseButton onClickAction={this.close} />

				<div className="interiorControl-left">
					<div className="interiorControl-left-head">
						<h1>
							{LangString(
								"components.InteriorControl.InteriorControl.721a6d28e8321616f3109654db46ff0b",
							)}
						</h1>
						<span>
							{LangString(
								"components.InteriorControl.InteriorControl.a002b17ac3a005ddf183e6f31c27a581",
							)}
						</span>

						<div className="interiorControl-left-head-navigation">
							<div
								onClick={() => this.changePage("configurator")}
								className={classNames({
									"interiorControl-left-head-navigation-active":
										this.store.page === "configurator",
								})}
							>
								{LangString(
									"components.InteriorControl.InteriorControl.eb9e95c5a54f115b201755c2d633fb5b",
								)}
							</div>

							<div
								onClick={() => this.changePage("interior")}
								className={classNames({
									"interiorControl-left-head-navigation-active":
										this.store.page === "interior",
								})}
							>
								{LangString(
									"components.InteriorControl.InteriorControl.f0179d6806b78ecccd633f58631e4029",
								)}
							</div>

							<div
								onClick={() => this.changePage("furniture")}
								className={classNames({
									"interiorControl-left-head-navigation-active":
										this.store.page === "furniture",
								})}
							>
								{LangString(
									"components.InteriorControl.InteriorControl.b9833c258c0db5bd2ebfa66c117898b6",
								)}
							</div>
						</div>
					</div>

					{this.store.page === "configurator" && (
						<div className="interiorControl-left-configurator">
							<div className="interiorControl-left-configurator-title">
								<h1>
									{LangString(
										"components.InteriorControl.InteriorControl.b6c97865c6a5aba71017349417bf44e8",
									)}
								</h1>
								<span>
									{LangString(
										"components.InteriorControl.InteriorControl.0073d0cb332f6f27e92a15f953d455ac",
									)}
								</span>
							</div>

							{layoutsData.map((el, key) => {
								return (
									<div
										className="interiorControl-left-configurator-block"
										key={key}
									>
										<img
											src={svg[this.getImageForShopLayout(el)]}
											className={
												"interiorControl-left-configurator-block__image"
											}
											alt=""
											onClick={() => this.changeImageForShopLayout(el)}
										/>

										<div className="interiorControl-left-configurator-block__name">
											<h1>
												{LangString(
													"components.InteriorControl.InteriorControl.b49abc4bcd99a06b44c2848fea94fae6",
												)}
											</h1>
											<span>{el.name}</span>
										</div>

										{typeof el.img !== "string" && (
											<span
												className={
													"interiorControl-left-configurator-block__description"
												}
											>
												{LangString(
													"components.InteriorControl.InteriorControl.9fc47908e87183ee2b315d768dfe4440",
												)}
											</span>
										)}

										<div
											className={classNames(
												"interiorControl-left-configurator-block__switcher",
												{
													"interiorControl-left-configurator-block__switcher-active":
														this.store.layout === el.id,
												},
											)}
											onClick={() => this.changeLayout(el.id)}
										>
											<div />
										</div>
									</div>
								);
							})}

							{this.store.layout !== null && (
								<>
									<div className="interiorControl-left-configurator-title">
										<h1>
											{LangString(
												"components.InteriorControl.InteriorControl.c8f6ef0a1ae09eed83348270485893a9",
											)}
										</h1>
										<span>
											{LangString(
												"components.InteriorControl.InteriorControl.7b1ecd7201441e9adf3e8ebde6c697a7",
											)}
										</span>
									</div>

									{interiorsData
										.filter((el) => el.layoutId === this.store.layout)
										.map((el, key) => {
											return (
												<div
													className="interiorControl-left-configurator-block"
													key={key}
												>
													<img
														src={png[el.img]}
														className={
															"interiorControl-left-configurator-block__image"
														}
														alt=""
													/>

													<div className="interiorControl-left-configurator-block__name">
														<h1>
															{LangString(
																"components.InteriorControl.InteriorControl.86b930bf87e1a012388cb1e028afbe2b",
															)}
														</h1>
														<span>{el.name}</span>
													</div>

													<div className="interiorControl-left-configurator-block__price">
														<h1>
															{LangString(
																"components.InteriorControl.InteriorControl.9668d893bf728b2785404bb47baca9ec",
															)}
														</h1>
														<span>
															{el.isDonate ? (
																<img src={svg["coinIcon"]} alt="" />
															) : (
																"$"
															)}{" "}
															{el.cost}
														</span>
													</div>

													<div
														className={classNames(
															"interiorControl-left-configurator-block__switcher",
															{
																"interiorControl-left-configurator-block__switcher-active":
																	this.store.variation === el.id,
															},
														)}
														onClick={() => this.changeVariation(el.id)}
													>
														<div />
													</div>
												</div>
											);
										})}
								</>
							)}
						</div>
					)}

					{this.store.page === "interior" && (
						<div className="interiorControl-left-configurator interiorControl-left-margin">
							{this.getCurrentInteriorData() !== null && (
								<div className="interiorControl-left-configurator-block">
									<img
										src={svg[this.getCurrentInteriorData().layoutImage]}
										className={"interiorControl-left-configurator-block__image"}
										alt=""
										onClick={() => this.changePersonalLayoutImage()}
									/>

									<div className="interiorControl-left-configurator-block__name">
										<h1>
											{LangString(
												"components.InteriorControl.InteriorControl.70f57808961307bc035a314c8c55c2b8",
											)}
										</h1>
										<span>{this.getCurrentInteriorData().layoutName}</span>
									</div>
								</div>
							)}

							{this.getCurrentInteriorData() !== null && (
								<div className="interiorControl-left-configurator-block">
									<img
										src={png[this.getCurrentInteriorData().image]}
										className={"interiorControl-left-configurator-block__image"}
										alt=""
									/>

									<div className="interiorControl-left-configurator-block__name">
										<h1>
											{LangString(
												"components.InteriorControl.InteriorControl.3d201a3fbc8b4d8edabc3a863bc887cb",
											)}
										</h1>
										<span>{this.getCurrentInteriorData().name}</span>
									</div>

									<div className="interiorControl-left-configurator-block__price">
										<h1>
											{LangString(
												"components.InteriorControl.InteriorControl.60b6a196b83bd1bce9cd7af67443aa39",
											)}
										</h1>
										<span>
											{this.getCurrentInteriorData().isDonate ? (
												<img src={svg["coinIcon"]} alt="" />
											) : (
												"$"
											)}{" "}
											{this.getCurrentInteriorData().cost}
										</span>
									</div>
								</div>
							)}
						</div>
					)}

					{this.store.page === "furniture" && (
						<div className="interiorControl-left-furniture">
							<div className="interiorControl-left-furniture-categories">
								{this.getCategories().map((el, key) => {
									return (
										<div
											className={classNames({
												"interiorControl-left-furniture-categories-active":
													el === this.store.category,
											})}
											key={key}
											onClick={() => this.changeFurnitureCategory(el)}
										>
											<img src={svg[el]} alt="" />
										</div>
									);
								})}
							</div>

							{this.store.category !== null && (
								<div className="interiorControl-left-furniture-list">
									{this.getFurnitureByCategory().map((el, key) => {
										const cfg = furnitureList.find(
											(item) => item.id === el.cfgId,
										);

										if (!cfg) return null;

										return (
											<div
												className="interiorControl-left-furniture-list-block"
												key={key}
												onClick={() => this.changeFurnitureItem(el.id)}
											>
												<div className="interiorControl-left-furniture-list-block__name">
													{cfg.name}
												</div>
												<div className="interiorControl-left-furniture-list-block__price">
													{cfg.cost} $
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>
					)}
				</div>

				{this.store.page === "configurator" &&
					this.store.variation !== null && (
						<div className="interiorControl-center">
							<div className="interiorControl-center-block">
								<img
									src={svg["ellipse"]}
									alt=""
									className="interiorControl-center-block__background"
								/>
								<img
									src={png[this.getConfiguratorImage()]}
									alt=""
									className="interiorControl-center-block__image"
								/>
							</div>

							<div className="interiorControl-center-eye">
								<img src={svg["eye"]} alt="" />
							</div>
						</div>
					)}

				{this.store.page === "interior" &&
					this.getCurrentInteriorData() !== null && (
						<div className="interiorControl-center">
							<div className="interiorControl-center-block">
								<img
									src={svg["ellipse"]}
									alt=""
									className="interiorControl-center-block__background"
								/>
								<img
									src={png[this.getCurrentInteriorData().image]}
									alt=""
									className="interiorControl-center-block__image"
								/>
							</div>

							<div className="interiorControl-center-eye">
								<img src={svg["eye"]} alt="" />
							</div>
						</div>
					)}

				{this.store.page === "furniture" &&
					this.store.furnitureItem !== null && (
						<div className="interiorControl-center">
							{this.currentFurnitureItemPlaced() && (
								<div
									className="interiorControl-center__button interiorControl-buttonTransparent"
									onClick={() => this.placeFurniture(false)}
								>
									<img src={svg["cross"]} alt="" />
									<span>
										{LangString(
											"components.InteriorControl.InteriorControl.9b48e12bf4bc7b7fcae49dee89cf3667",
										)}
									</span>
								</div>
							)}

							{!this.currentFurnitureItemPlaced() && (
								<div
									className="interiorControl-center__button"
									onClick={() => this.placeFurniture(true)}
								>
									<img src={svg["mark"]} alt="" />
									<span>
										{LangString(
											"components.InteriorControl.InteriorControl.6969012f18e6e6e028eb64c10bf570b6",
										)}
									</span>
								</div>
							)}
						</div>
					)}

				<div className="interiorControl-rightTop">
					<div className="interiorControl-rightTop__cash">
						$ {this.store.cash}
					</div>
					<div className="interiorControl-rightTop__bank">
						$ {this.store.wallet}
					</div>
					<div className="interiorControl-rightTop__coins">
						<img src={svg["coinIcon"]} alt="" />
						<span>{this.store.coins}</span>
					</div>
				</div>

				{this.store.page === "configurator" &&
					this.store.variation !== null && (
						<div className="interiorControl-rightBottom">
							<div className="interiorControl-rightBottom__title">
								{LangString(
									"components.InteriorControl.InteriorControl.df19437b0f9857e49b019cc607313f0b",
								)}
							</div>

							<div className="interiorControl-rightBottom__price">
								{this.variationIsDonate() ? (
									<img src={svg["coinIcon"]} alt="" />
								) : (
									"$"
								)}{" "}
								{this.getVariationCost()}
							</div>

							<div
								className="interiorControl-rightBottom__button"
								onClick={() => this.buyInterior()}
							>
								<img src={svg["mark"]} alt="" />
								<span>
									{LangString(
										"components.InteriorControl.InteriorControl.2760ec9e2d16572f9781cbf74d080102",
									)}
								</span>
							</div>
						</div>
					)}

				{this.store.page === "furniture" &&
					this.store.furnitureItem !== null && (
						<div className="interiorControl-rightBottom">
							<div className="interiorControl-rightBottom__percent">
								{LangString(
									"components.InteriorControl.InteriorControl.efebc6d9221b1d78d996b4bfe1e5f107",
								)}
							</div>
							<div className="interiorControl-rightBottom__title">
								{LangString(
									"components.InteriorControl.InteriorControl.dff92d20527826b2a008ca49c5af0871",
								)}
							</div>

							<div className="interiorControl-rightBottom__price">
								{this.getSellFurnitureAmount()}$
							</div>

							<div
								className="interiorControl-rightBottom__button interiorControl-buttonTransparent"
								onClick={() => this.sellFurniture()}
							>
								<span>
									{LangString(
										"components.InteriorControl.InteriorControl.f28257c793eb6f0104d4d050eb5f038b",
									)}
								</span>
							</div>
						</div>
					)}
			</div>
		);
	}
}
