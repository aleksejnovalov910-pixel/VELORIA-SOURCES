import { LangString } from "../../../../../../modules/lang";
import React, { Component } from "react";
import "../../style.less";

const png = Object.fromEntries(
	Object.entries(import.meta.glob("../../assets/*.png", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.png$/)[1];
			return [name, value.default];
		},
	),
);
const svg = Object.fromEntries(
	Object.entries(import.meta.glob("../../assets/*.svg", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.svg$/)[1];
			return [name, value.default];
		},
	),
);
import classNames from "classnames";
import ReactTooltip from "react-tooltip";
import { IOrderCatalogDTO } from "../../../../../../../shared/tablet/business.config";
import { ORDER_CONFIG } from "../../../../../../../shared/order.system";
import { system } from "../../../../../../modules/system";

export class Basket extends Component<
	{
		show: (toggle: boolean) => void;
		catalog: IOrderCatalogDTO[];
		remove: (item: number) => void;
		order: () => void;
		discount: () => number;
		upgrade: number;
	},
	{}
> {
	constructor(props: any) {
		super(props);
	}

	getDeliveryAmount() {
		return Math.floor((this.getTotalAmount() / 100) * ORDER_CONFIG.COMISSION);
	}

	getTotalAmount() {
		let amount = 0;

		this.props.catalog.forEach((el) => {
			amount += el.orderCount * el.price;
		});

		if (this.props.discount() !== 0) {
			return amount - Math.floor((amount / 100) * this.props.discount());
		}

		return amount;
	}

	render() {
		return (
			<div className="tp-basket">
				<div className="tp-basket-top">
					<img
						src={svg["cross"]}
						className="tp-basket-top__close"
						alt=""
						onClick={() => this.props.show(false)}
					/>
					<div className="tp-basket-top__title">
						{LangString(
							"components.Tablet.components.Products.components.Basket.Basket.a1a185efed301bbe63816103660512c4",
						)}
					</div>
					<div className="tp-basket-top-list">
						{this.props.catalog.map((el, key) => {
							return (
								<div className="tp-basket-top-list-block" key={key}>
									<div className="tp-basket-top-list-block__name">
										{el.name}
									</div>
									<div className="tp-basket-top-list-block__value">
										x{el.orderCount}
									</div>
									<div className="tp-basket-top-list-block__sum">
										{system.numberFormat(el.orderCount * el.price)} $
										<img
											src={svg["trash"]}
											alt=""
											onClick={() => this.props.remove(el.item)}
										/>
									</div>
								</div>
							);
						})}
					</div>
					<div className="tp-basket-top__line" />
					<div className="tp-basket-top__order">
						<span>
							{LangString(
								"components.Tablet.components.Products.components.Basket.Basket.0e3ffff5cb6419ab678cbaef73c50a34",
							)}
						</span>
						<h1>{this.getDeliveryAmount()} $</h1>
					</div>
				</div>
				<div className="tp-basket-bottom">
					<img
						src={svg["basketBottom"]}
						className="tp-basket-bottom__background"
						alt=""
					/>
					<h1>
						{LangString(
							"components.Tablet.components.Products.components.Basket.Basket.c4e493315ff0e7be1574698922afebae",
						)}
					</h1>
					{this.props.upgrade > 0 && (
						<h2>
							{LangString(
								"components.Tablet.components.Products.components.Basket.Basket.133ab0604fa6316b099371353f72ceb9",
							)}{" "}
							{this.props.upgrade}{" "}
							{LangString(
								"components.Tablet.components.Products.components.Basket.Basket.c39a7873fbf3a9a7051591b0d1292f0c",
							)}
						</h2>
					)}
					<span>
						{system.numberFormat(
							this.getTotalAmount() + this.getDeliveryAmount(),
						)}{" "}
						$
					</span>
					<div
						className="tp-basket-bottom__button"
						onClick={() => this.props.order()}
					>
						{LangString(
							"components.Tablet.components.Products.components.Basket.Basket.812131f1253fc0d201bed06ae7d5b286",
						)}
					</div>
				</div>
			</div>
		);
	}
}
