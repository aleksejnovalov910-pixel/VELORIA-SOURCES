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
import { IBusinessCatalogRating } from "../../../../../../../shared/tablet/business.config";

export class Statistics extends Component<
	{
		rating: IBusinessCatalogRating[];
	},
	{}
> {
	constructor(props: any) {
		super(props);
	}

	render() {
		return (
			<div className="tp tp-statitic">
				<div className="tp-cat tp-statitic-grid tp-statitic-cat">
					<div style={{ marginRight: "0.885416vw" }}>Nr</div>
					<div>Nume</div>
					<div className="tp-statitic-cat__bold">Cumparate:</div>
					<div>Recente</div>
					<div>Intr-o saptamana</div>
					<div>Luna aceasta</div>
				</div>
				<div className="tp-list tp-statitic-list">
					{this.props.rating && (
						<>
							{this.props.rating.map((el, key) => {
								return (
									<div className="tp-list-block tp-statitic-grid" key={key}>
										<div className="tp-statitic-list__number">{key + 1}</div>
										<div className="tp-statitic-list__name">{el.name}</div>
										<div />
										<div className="tp-statitic-list__day">{el.day}</div>
										<div className="tp-statitic-list__week">{el.week}</div>
										<div className="tp-statitic-list__month">{el.month}</div>
										<img
											src={svg["star"]}
											className="tp-statitic-list__star"
											alt=""
										/>
									</div>
								);
							})}
						</>
					)}
				</div>
			</div>
		);
	}
}
