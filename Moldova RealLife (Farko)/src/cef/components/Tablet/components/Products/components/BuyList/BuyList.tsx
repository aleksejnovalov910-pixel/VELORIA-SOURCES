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

export class BuyList extends Component<{}, {}> {
	constructor(props: any) {
		super(props);
	}

	render() {
		return (
			<div className="tp-basket">
				<div className="tp-basket-top">
					<img src={svg["cross"]} className="tp-basket-top__close" alt="" />
					<div className="tp-basket-top__title">
						{LangString(
							"components.Tablet.components.Products.components.BuyList.BuyList.253164a10bbf9e92337cc5a042952f0e",
						)}{" "}
						<br />
						{LangString(
							"components.Tablet.components.Products.components.BuyList.BuyList.44ced47431948bc95e506633ed27b6db",
						)}
					</div>
					<div className="tp-basket-top-list">
						<div className="tp-basket-top-list-block">
							<div className="tp-basket-top-list-block__name">
								{LangString(
									"components.Tablet.components.Products.components.BuyList.BuyList.f9809b6fe9571be3e7603a67daf85bb7",
								)}
							</div>
							<div className="tp-basket-top-list-block__value">
								{LangString(
									"components.Tablet.components.Products.components.BuyList.BuyList.2e2ef456c5da15ec40d5215d4f56b59d",
								)}
							</div>
							<div className="tp-basket-top-list-block__sum">
								{LangString(
									"components.Tablet.components.Products.components.BuyList.BuyList.9a11c4a44b8c5c8ee975e10041cd6fa4",
								)}
								<img src={svg["trash"]} alt="" />
							</div>
						</div>
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
							"components.Tablet.components.Products.components.BuyList.BuyList.63bfff7b32cc287832ed8d405a6a07d4",
						)}
					</h1>
					<span>
						{LangString(
							"components.Tablet.components.Products.components.BuyList.BuyList.b2cc6f785d4fc7d4f7de098acee7cc97",
						)}
					</span>
					<div className="tp-basket-bottom__button">
						{LangString(
							"components.Tablet.components.Products.components.BuyList.BuyList.0b720ecc9fa99581c85a36affe02915d",
						)}
					</div>
				</div>
			</div>
		);
	}
}
