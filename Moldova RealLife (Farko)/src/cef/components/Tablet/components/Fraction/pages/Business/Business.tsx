import { LangString } from "../../../../../../modules/lang";
import React from "react";
const bizImg = Object.fromEntries(
	Object.entries(
		import.meta.glob("../../../../images/businesses/*.png", { eager: true }),
	).map(([key, value]) => {
		const name = key.match(/\/([^/]+)\.png$/)[1];
		return [name, value.default];
	}),
);
import { systemUtil } from "../../../../../../../shared/system";
import { familyFractionPayDayRewardPercent } from "../../../../../../../shared/economy";
import {
	BUSINESS_SUBTYPE_NAMES,
	BUSINESS_TYPE_NAMES,
} from "../../../../../../../shared/business";

export class Business extends React.Component<
	{
		mafiaData: {
			id: number;
			name: string;
			price: number;
			type: number;
			stype: number;
		}[];
	},
	{}
> {
	constructor(props: any) {
		super(props);

		this.state = {};
	}

	render() {
		return (
			<div className="tablet-fraction-body">
				<div className="tablet-fraction-body__title">
					{LangString(
						"components.Tablet.components.Fraction.pages.Business.Business.2c7ebe9637728e6b770fd8d3cab46d59",
					)}
					{this.props.mafiaData.length}{" "}
					{LangString(
						"components.Tablet.components.Fraction.pages.Business.Business.23bb8a588693dfdba2fcc910b7b30b7f",
					)}
				</div>

				<div className="tablet-fraction-business">
					{this.props.mafiaData.map((biz, key) => {
						return (
							<div className="tablet-fraction-business-block" key={key}>
								<img
									src={bizImg[biz.type]}
									alt=""
									className="tablet-fraction-business-block__img"
								/>
								<div className="tablet-fraction-business-block__title">
									{biz.name} #{biz.id}
								</div>
								<div className="tablet-fraction-business-block__description">
									{BUSINESS_TYPE_NAMES[biz.type]} (
									{BUSINESS_SUBTYPE_NAMES[biz.type][biz.stype]})
								</div>
								<div className="tablet-fraction-business-block-flex">
									<div className="tablet-fraction-business-block-flex__button">
										${biz.price}
									</div>
									<div className="tablet-fraction-business-block-flex__text">
										{LangString(
											"components.Tablet.components.Fraction.pages.Business.Business.05b8d14c3c7c9c0949100ed15d5b0be7",
										)}{" "}
										<br />$
										{systemUtil.numberFormat(
											Math.floor(
												((biz.price / 100) *
													familyFractionPayDayRewardPercent) /
													24,
											),
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}
