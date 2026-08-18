import { LangString } from "../../../../modules/lang";
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
import { fractionCfg } from "../../../../modules/fractions";
import classNames from "classnames";
import { CEF } from "../../../../modules/CEF";

import { Order } from "./pages/Order";
import { Prices } from "./pages/Prices";
import { Top } from "./pages/Top";
import { Statistics } from "./pages/Statistics";
import { Taxes } from "./pages/Taxes";

import { Basket } from "./components/Basket";
import { BuyList } from "./components/BuyList";
import { PriceControl } from "./components/PriceControl";
import { CustomEvent } from "../../../../modules/custom.event";
import {
	IBaseBusinessInfo,
	IBusinessCatalogRating,
	IBusinessTaxLog,
	ILastSells,
	IOrderCatalogDTO,
	IPricesCatalog,
	ITaxes,
	IUserBuyerRating,
} from "../../../../../shared/tablet/business.config";
import { CustomEventHandler } from "../../../../../shared/custom.event";
import { system } from "../../../../modules/system";

export class Products extends Component<
	{
		back: Function;
	},
	{
		page: string;
		catalog: IOrderCatalogDTO[] | null;
		baseInfo: IBaseBusinessInfo | null;
		pricesCatalog: IPricesCatalog[] | null;
		taxData: ITaxes | null;
		weekRating: IUserBuyerRating[] | null;
		monthRating: IUserBuyerRating[] | null;
		catalogRating: IBusinessCatalogRating[] | null;
		lastSells: ILastSells[] | null;
	}
> {
	ev: CustomEventHandler;
	ev2: CustomEventHandler;

	constructor(props: any) {
		super(props);

		this.state = {
			page: "order",
			catalog: null,
			baseInfo: null,
			pricesCatalog: null,
			taxData: null,
			weekRating: null,
			monthRating: null,
			catalogRating: null,
			lastSells: null,
		};

		this.ev = CustomEvent.register(
			"tablet:business:update:pricesCatalog",
			this.updatePricesCatalog,
		);
		this.ev2 = CustomEvent.register(
			"tablet:business:update:taxData",
			this.updateTaxData,
		);
	}

	async componentDidMount() {
		const baseInfo = await CustomEvent.callServer("tablet:business:baseInfo");
		const catalog = await CustomEvent.callServer("tablet:business:loadCatalog");
		const pricesCatalog = await CustomEvent.callServer(
			"tablet:business:pricesCatalog",
		);
		const taxData = await CustomEvent.callServer("tablet:business:taxData");
		const weekRating = await CustomEvent.callServer(
			"tablet:business:rating:week",
		);
		const monthRating = await CustomEvent.callServer(
			"tablet:business:rating:month",
		);
		const catalogRating = await CustomEvent.callServer(
			"tablet:business:catalog:rating",
		);
		const lastSells = await CustomEvent.callServer("tablet:business:lastSells");

		this.setState({
			catalog,
			baseInfo,
			pricesCatalog,
			taxData,
			weekRating,
			monthRating,
			catalogRating,
			lastSells,
		});
	}

	componentWillUnmount() {
		this.ev.destroy();
		this.ev2.destroy();
	}

	updatePricesCatalog = async () => {
		const pricesCatalog = await CustomEvent.callServer(
			"tablet:business:pricesCatalog",
		);

		this.setState({
			pricesCatalog,
		});
	};

	updateTaxData = async () => {
		const taxData = await CustomEvent.callServer("tablet:business:taxData");

		this.setState({
			taxData,
		});
	};

	switchPage(el: string) {
		this.setState({ page: el });
	}

	render() {
		return (
			<div className="tablet-products">
				<div className="tablet-products-navigation">
					<div
						className="tablet-products-navigation__back"
						onClick={() => this.props.back()}
					>
						<img src={svg["back"]} alt="" />{" "}
						{LangString(
							"components.Tablet.components.Products.Products.d50a2a56d0f79a84a92f68d23d157482",
						)}
					</div>
					<div className="tablet-products-navigation-list">
						<div
							onClick={() => {
								this.switchPage("order");
							}}
							className={classNames({
								"tablet-products-navigation-list__active":
									this.state.page === "order",
							})}
						>
							{LangString(
								"components.Tablet.components.Products.Products.4a1e5ee49d13e7867f5d8a45399feed0",
							)}
						</div>
						<div
							onClick={() => {
								this.switchPage("statistics");
							}}
							className={classNames({
								"tablet-products-navigation-list__active":
									this.state.page === "statistics",
							})}
						>
							{LangString(
								"components.Tablet.components.Products.Products.c279fba9cd9cf3d73e8ae10b7324cd89",
							)}
						</div>
						<div
							onClick={() => {
								this.switchPage("prices");
							}}
							className={classNames({
								"tablet-products-navigation-list__active":
									this.state.page === "prices",
							})}
						>
							{LangString(
								"components.Tablet.components.Products.Products.65e114f2bf84689df4b9d73f272d0629",
							)}
						</div>
						<div
							onClick={() => {
								this.switchPage("top");
							}}
							className={classNames({
								"tablet-products-navigation-list__active":
									this.state.page === "top",
							})}
						>
							{LangString(
								"components.Tablet.components.Products.Products.20f5742b6040a3af3bf86eeeb8abd321",
							)}
						</div>
						<div
							onClick={() => {
								this.switchPage("taxes");
							}}
							className={classNames({
								"tablet-products-navigation-list__active":
									this.state.page === "taxes",
							})}
						>
							{LangString(
								"components.Tablet.components.Products.Products.b9a799e2c154d1bc07ba49f5564cb9cd",
							)}
						</div>
					</div>

					{this.state.baseInfo !== null && (
						<>
							<div className="tablet-products-navigation__title">
								{this.state.baseInfo.name}
							</div>

							<div className="tablet-products-navigation__title">
								{system.numberFormat(this.state.baseInfo.cost)} $
								<span>
									{LangString(
										"components.Tablet.components.Products.Products.111fed424459f978a63a3192a12be941",
									)}
								</span>
							</div>

							<div className="tablet-products-navigation__title">
								{system.numberFormat(this.state.baseInfo.money)} $
								<span>
									{LangString(
										"components.Tablet.components.Products.Products.44b7d28ef26b8f2d3c173ecf7825bcdf",
									)}
								</span>
							</div>
						</>
					)}
				</div>
				<div className="tablet-products-body">
					{/*
                    <Basket/>
                    <BuyList/>
                    <PriceControl/>
                */}

					<div className="tablet-products-body__title">
						{this.state.page === "order" && (
							<>
								<img src={svg["bag"]} alt="" />
								{LangString(
									"components.Tablet.components.Products.Products.b28985bbc6cdb89d52e494dae8d435dd",
								)}
							</>
						)}
						{this.state.page === "statistics" && (
							<>
								<img src={svg["stats"]} alt="" />
								{LangString(
									"components.Tablet.components.Products.Products.c1f84bac73ad6d167dd850d6922a1ee6",
								)}
							</>
						)}
						{this.state.page === "prices" && (
							<>
								<img src={svg["key"]} alt="" />
								{LangString(
									"components.Tablet.components.Products.Products.06bfb0511790e36f40dd9ac08f301162",
								)}
							</>
						)}
						{this.state.page === "top" && (
							<>
								<img src={svg["user"]} alt="" />
								{LangString(
									"components.Tablet.components.Products.Products.9a3d5eca72103f2d5bf57e1fa7e82e2d",
								)}
							</>
						)}
						{this.state.page === "taxes" && (
							<>
								<img src={svg["document"]} alt="" />
								{LangString(
									"components.Tablet.components.Products.Products.16c72e0bfb99dd2bd6ec4430938d4732",
								)}
							</>
						)}
					</div>

					{this.state.page === "order" && (
						<Order
							catalog={this.state.catalog}
							baseInfo={this.state.baseInfo}
							catalogRating={this.state.catalogRating}
						/>
					)}
					{this.state.page === "statistics" && (
						<Statistics rating={this.state.catalogRating} />
					)}
					{this.state.page === "prices" && (
						<Prices
							catalog={this.state.pricesCatalog}
							baseInfo={this.state.baseInfo}
						/>
					)}
					{this.state.page === "top" && (
						<Top
							week={this.state.weekRating}
							month={this.state.monthRating}
							lastSells={this.state.lastSells}
						/>
					)}
					{this.state.page === "taxes" && <Taxes data={this.state.taxData} />}
				</div>
			</div>
		);
	}
}
