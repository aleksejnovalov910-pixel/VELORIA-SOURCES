import { LangString } from "../../../../../../modules/lang";
import React from "react";

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
import {
	FRACTION_RIGHTS,
	IFractionGarageDTO,
} from "../../../../../../../shared/fractions/ranks";
import classNames from "classnames";
import { fractionCfg } from "../../../../../../modules/fractions";
import { CEF } from "../../../../../../modules/CEF";
import { CustomEvent } from "../../../../../../modules/custom.event";

export class Cars extends React.Component<
	{
		garages: IFractionGarageDTO[];
		fractionId: number;
		update: Function;
		rights: FRACTION_RIGHTS[];
	},
	{
		chooseRankIdGarage: number;
		chooseRankId: number;
	}
> {
	constructor(props: any) {
		super(props);

		this.state = {
			chooseRankId: -1,
			chooseRankIdGarage: -1,
		};
	}

	chooseRank(id: number, garageId: number) {
		if (
			this.state.chooseRankId === id &&
			this.state.chooseRankIdGarage === garageId
		)
			return;
		this.setState({ chooseRankId: id, chooseRankIdGarage: garageId });
	}

	chooseRankClose(id: number, garageId: number) {
		if (
			this.state.chooseRankId !== id &&
			this.state.chooseRankIdGarage !== garageId
		)
			return;
		this.setState({ chooseRankId: -1, chooseRankIdGarage: -1 });
	}

	changeRank(garageId: number, carId: number, rank: number) {
		this.setState({ chooseRankId: -1, chooseRankIdGarage: -1 });

		CustomEvent.callServer("tablet:setRankForCar", garageId, carId, rank).then(
			(res) => {
				if (res) this.props.update();
			},
		);
	}

	getBackCar(
		garageId: number,
		car: [
			string,
			string,
			number,
			number,
			number,
			number,
			number,
			number,
			number,
			number,
			number,
		],
	) {
		CustomEvent.triggerServer("tablet:getBackCar", garageId, car);
	}

	render() {
		return (
			<div className="tablet-fraction-body">
				<div className="tablet-fraction-body__title">
					{LangString(
						"components.Tablet.components.Fraction.pages.Cars.Cars.36119c0a54aa68cc33a798ed684a5051",
					)}
				</div>

				<div className="tablet-fraction-cars">
					{this.props.garages.map((garage, garageId) => {
						return (
							<React.Fragment key={garageId}>
								{garage.cars.map((car, carId) => {
									return (
										<div className="tablet-fraction-cars-block" key={carId}>
											<img
												src={CEF.getVehicleURL(car[0])}
												alt=""
												className="tablet-fraction-cars-block__img"
											/>
											<div className="tablet-fraction-cars-block__title">
												{car[0]}
											</div>
											<div className="tablet-fraction-cars-block__description">
												{car[1]}
											</div>
											<div className="tablet-fraction-cars-block-flex">
												{this.props.rights.includes(
													FRACTION_RIGHTS.VEHICLES,
												) && (
													<div
														className={classNames(
															"tablet-fraction-cars-block-flex-rank",
															{
																"tablet-fraction-cars-block-flex-rank__active":
																	this.state.chooseRankId === carId &&
																	this.state.chooseRankIdGarage === garageId,
															},
														)}
														onClick={() => this.chooseRank(carId, garageId)}
													>
														<div
															className="tablet-fraction-cars-block-flex-rank__name"
															onClick={() =>
																this.chooseRankClose(carId, garageId)
															}
														>
															{fractionCfg.getRankName(
																this.props.fractionId,
																car[3],
															)}
															<img src={svg["back"]} alt="" />
														</div>
														<div className="tablet-fraction-cars-block-flex-rank-list">
															{fractionCfg
																.getFraction(this.props.fractionId)
																.ranks.map((rankName, rankId) => {
																	return (
																		<div
																			key={rankId}
																			onClick={() =>
																				this.changeRank(
																					garage.id,
																					carId,
																					rankId,
																				)
																			}
																		>
																			{rankName}
																		</div>
																	);
																})}
														</div>
													</div>
												)}

												{this.props.rights.includes(
													FRACTION_RIGHTS.BACK_CAR,
												) && (
													<div
														className="tablet-fraction-cars-block-flex__button"
														onClick={() => this.getBackCar(garage.id, car)}
													>
														{LangString(
															"components.Tablet.components.Fraction.pages.Cars.Cars.149257cce9f3a94670e9d1bba30e6e88",
														)}
													</div>
												)}
											</div>
										</div>
									);
								})}
							</React.Fragment>
						);
					})}
				</div>
			</div>
		);
	}
}
