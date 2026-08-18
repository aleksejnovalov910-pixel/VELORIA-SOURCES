import React, { ChangeEvent, Component } from "react";
import "../../style.less";
const svg = Object.fromEntries(
	Object.entries(import.meta.glob("../../assets/*.svg", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.svg$/)[1];
			return [name, value.default];
		},
	),
);
import {
	IBaseBusinessInfo,
	IPricesCatalog,
} from "../../../../../../../shared/tablet/business.config";
import { system } from "../../../../../../modules/system";
import { PriceControl } from "../../components/PriceControl";
import { BUSINESS_TYPE } from "../../../../../../../shared/business";

export class Prices extends Component<
	{
		catalog: IPricesCatalog[];
		baseInfo: IBaseBusinessInfo;
	},
	{
		showControl: boolean;
		item: IPricesCatalog | null;
		searchText: string;
	}
> {
	constructor(props: any) {
		super(props);

		this.state = {
			showControl: false,
			item: null,
			searchText: "",
		};
	}

	toggleControl = (data?: IPricesCatalog) => {
		if (!data) {
			this.setState({ item: null });
			return;
		}

		this.setState({ item: data });
	};

	onChangeSearch(event: ChangeEvent<HTMLInputElement>) {
		this.setState({
			searchText: event.currentTarget.value,
		});
	}

	filtering() {
		if (this.state.searchText === "") return this.props.catalog;

		return this.props.catalog.filter((el) =>
			el.name.includes(this.state.searchText),
		);
	}

	render() {
		if (!this.props.catalog) return <></>;
		return (
			<div className="tp tp-prices">
				{this.state.item !== null && (
					<PriceControl
						item={this.state.item}
						toggleControl={this.toggleControl}
						baseInfo={this.props.baseInfo}
					/>
				)}
				<div className="tp-search">
					<input
						type="text"
						placeholder="Cauta"
						value={this.state.searchText}
						onChange={(event) => this.onChangeSearch(event)}
					/>
					<img src={svg["search"]} alt="" />
				</div>
				<div className="tp-small-title">Lista produselor</div>
				<div className="tp-cat tp-prices-grid">
					<div>Nume</div>
					<div>Cantitate in stoc</div>
					<div>Pret</div>
					<div />
				</div>
				<div className="tp-list tp-prices-list">
					{this.filtering().map((el, key) => {
						return (
							<div className="tp-list-block tp-prices-grid" key={key}>
								<div className="tp-prices-list__name">{el.name}</div>
								<div className="tp-prices-list__value">
									{el.count}/{el.maxCount}
								</div>
								<div className="tp-prices-list__price">
									{system.numberFormat(el.price)}
									{this.props.baseInfo.type === BUSINESS_TYPE.TUNING
										? "%"
										: "$"}
								</div>
								<div
									className="tp-prices-list__button"
									onClick={() => this.toggleControl(el)}
								>
									Editeaza
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}
