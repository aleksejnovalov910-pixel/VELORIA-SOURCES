import { LangString } from "../../../../modules/lang";
import React, { Component } from "react";

// @ts-ignore
const png = Object.fromEntries(
	Object.entries(import.meta.glob("./assets/*.png", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.png$/)[1];
			return [name, value.default];
		},
	),
);
// @ts-ignore
const svg = Object.fromEntries(
	Object.entries(import.meta.glob("./assets/*.svg", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.svg$/)[1];
			return [name, value.default];
		},
	),
);
import { CustomEvent } from "../../../../modules/custom.event";
import {
	ACTIVITY_RENT_TIME_IN_HOURS,
	ANIMATION_FACTOR_FROM_PROGRESS,
	DEFAULT_LANDING_TIME,
	FARMER_LEVELS,
} from "../../../../../shared/farm/progress.config";
import { systemUtil } from "../../../../../shared/system";
import {
	getFarmerLevelByExp,
	getLandingTime,
} from "../../../../../shared/farm/helpers";
import { CEF } from "../../../../modules/CEF";

interface farmLevel {
	currentLevel: number;
	currentEXP: number;
	totalEXP: number;
	rating: number;
	percent: number;
}

export class Statistic extends Component<
	{},
	{
		owner: string;
		ownerEXP: number;
		workPlace: string;
		money: number;
		rentTime: [number, number];
		farmLevel: farmLevel;
	}
> {
	constructor(props: any) {
		super(props);

		this.state = {
			owner: "Borz_Borz",
			ownerEXP: 228,
			workPlace: "HITZE",
			money: 2000,
			rentTime: [0, 0],
			farmLevel: {
				currentLevel: 5,
				currentEXP: 23,
				totalEXP: 126,
				rating: 100,
				percent: 70,
			},
		};

		CustomEvent.register(
			"farm:stats:open",
			(
				ownerName: string,
				ownerExp: number,
				activityName: string,
				totalEarned: number,
				rentedAt: number,
				farmerExp: number,
			) => {
				this.setState({
					rentTime: [
						Math.floor(
							(rentedAt +
								ACTIVITY_RENT_TIME_IN_HOURS * 3600 -
								systemUtil.timestamp) /
								3600,
						),
						Math.floor(
							((rentedAt +
								ACTIVITY_RENT_TIME_IN_HOURS * 3600 -
								systemUtil.timestamp) %
								3600) /
								60,
						),
					],
					owner: ownerName,
					ownerEXP: ownerExp,
					workPlace: activityName,
					money: totalEarned,
					farmLevel: {
						currentLevel: getFarmerLevelByExp(farmerExp),
						currentEXP: farmerExp,
						totalEXP:
							FARMER_LEVELS[getFarmerLevelByExp(farmerExp)]?.requiredExp ??
							FARMER_LEVELS[FARMER_LEVELS.length - 1].requiredExp,
						percent:
							(farmerExp /
								FARMER_LEVELS[getFarmerLevelByExp(farmerExp)]?.requiredExp) *
							100,
						rating: 10000,
					},
				});
			},
		);
	}

	close() {
		CEF.gui.setGui(null);
	}

	leave() {
		CustomEvent.triggerServer("farm:work:leave");
		CEF.gui.setGui(null);
	}

	zeroNumber(value: number) {
		if (value < 10) return `0${value}`;
		return value.toString();
	}

	render() {
		return (
			<div className="farm-statistic">
				<div className="exit" onClick={() => this.close()}>
					<div className="exit__icon">
						<img src={svg["closeIcon"]} alt="#" />
					</div>
					<div className="exit__title">
						{LangString(
							"components.Farm.components.Statistic.Statistic.d43197762ba9a9d1f19f2ea5b4f0ad1b",
						)}
					</div>
				</div>

				<img src={png["logo"]} className="farm-entrance__logo" alt="" />
				<img src={png["dot"]} className="farm-entrance__dot" alt="" />

				<img src={svg["block"]} alt="" className="farm-statistic__block" />
				<img src={png["shovel"]} alt="" className="farm-statistic__shovel" />

				<div className="farm-statistic-body">
					<img
						src={svg["statTitle"]}
						className="farm-statistic-body__statTitle"
						alt=""
					/>

					<div className="farm-statistic-body-owner">
						<span>
							{LangString(
								"components.Farm.components.Statistic.Statistic.ba6b497a12dd2f5b765991473bdbb42f",
							)}{" "}
							<div> {this.state.ownerEXP} exp </div>
						</span>
						<p>{this.state.owner}</p>
					</div>

					<div className="farm-statistic-body-information">
						<div>
							<span>
								{LangString(
									"components.Farm.components.Statistic.Statistic.452533ea4d22b39c2ceff3b4789497a6",
								)}
							</span>
							<p>{this.state.workPlace}</p>
						</div>
						<hr />
						<img src={svg["coin"]} alt="" />
						<div>
							<span>
								{LangString(
									"components.Farm.components.Statistic.Statistic.d3b0d5d8b72167d13f2266ab36e47057",
								)}
							</span>
							<p>{systemUtil.numberFormat(this.state.money)} $</p>
						</div>
						<img src={svg["timer"]} alt="" />
						<div>
							<span>
								{LangString(
									"components.Farm.components.Statistic.Statistic.f1ffa0e3cfe640852d8e2340e7adea1d",
								)}
							</span>
							<p>
								{this.state.rentTime[0]}{" "}
								{LangString(
									"components.Farm.components.Statistic.Statistic.6dad74631824ab7a9ac83846564b2fae",
								)}{" "}
								{this.state.rentTime[1]}{" "}
								{LangString(
									"components.Farm.components.Statistic.Statistic.b17ec493f55e47280b4760d9e50ad22f",
								)}
							</p>
						</div>
					</div>

					<div
						className="farm-statistic-body__button"
						onClick={() => this.leave()}
					>
						{LangString(
							"components.Farm.components.Statistic.Statistic.dc265a303af6276727e1aba7d3c928ba",
						)}
					</div>

					<img
						src={png["dotted"]}
						className="farm-statistic-body__dotted"
						alt=""
					/>

					<div className="farm-statistic-body__title">
						{LangString(
							"components.Farm.components.Statistic.Statistic.e2683f7f5057349cd651c4533a71e798",
						)}
					</div>

					<div className="farm-statistic-body-level">
						<div className="farm-statistic-body-level__lvl">
							<span>{this.zeroNumber(this.state.farmLevel.currentLevel)}</span>
							{LangString(
								"components.Farm.components.Statistic.Statistic.6d7dff6d36bf7690df2ea497de600242",
							)}
						</div>

						<div className="farm-statistic-body-level-rate">
							<img src={svg["stat"]} alt="" />
							<span>
								{this.state.farmLevel.rating}{" "}
								{LangString(
									"components.Farm.components.Statistic.Statistic.eb97b7bf868924abbf4389738cc7dbf1",
								)}
								<p>
									{LangString(
										"components.Farm.components.Statistic.Statistic.11d2805f05a4c7897738a0f74bf2afe7",
									)}
								</p>
							</span>
						</div>

						<div className="farm-statistic-body-level__bar">
							<div style={{ width: `${this.state.farmLevel.percent}%` }} />
						</div>

						<img
							src={svg["ellipse"]}
							alt=""
							className="farm-statistic-body-level__ellipse0"
						/>

						<div className="farm-statistic-body-level__exp0">
							{this.state.farmLevel.currentEXP} exp
						</div>

						<div className="farm-statistic-body-level-description0">
							<div className="farm-statistic-body-level-description0__lvl">
								<span>
									{this.state.farmLevel.currentLevel}{" "}
									{LangString(
										"components.Farm.components.Statistic.Statistic.89844d9302cc99ebf3d2e0704ee9489b",
									)}
								</span>
							</div>
							<div className="farm-statistic-body-level-description0__mission">
								{LangString(
									"components.Farm.components.Statistic.Statistic.90d299bfdcbdd714b4b402c1d2bc85fc",
								)}{" "}
								{20 - this.state.farmLevel.currentLevel * 2}{" "}
								{LangString(
									"components.Farm.components.Statistic.Statistic.76a5c234ac8e1367a52640f9a2cd218c",
								)}
							</div>
							<div className="farm-statistic-body-level-description0__mission">
								{LangString(
									"components.Farm.components.Statistic.Statistic.ad44e3bbc7f259a5f268a589ad9798ec",
								)}{" "}
								{getLandingTime(this.state.farmLevel.currentLevel)}{" "}
								{LangString(
									"components.Farm.components.Statistic.Statistic.e086a7fa99e8c6729c0447db144aaa81",
								)}
							</div>
						</div>

						<img
							src={svg["ellipse"]}
							alt=""
							className="farm-statistic-body-level__ellipse1"
						/>

						<div className="farm-statistic-body-level__exp1">
							{this.state.farmLevel.totalEXP} exp
						</div>

						<div className="farm-statistic-body-level-description1">
							<div className="farm-statistic-body-level-description0__lvl">
								<span>
									{this.state.farmLevel.currentLevel == 5
										? 5
										: this.state.farmLevel.currentLevel + 1}{" "}
									{LangString(
										"components.Farm.components.Statistic.Statistic.af6f3f3b5defddfc15aee04385f839aa",
									)}
								</span>
							</div>
							<div className="farm-statistic-body-level-description0__mission">
								{LangString(
									"components.Farm.components.Statistic.Statistic.3a2cf1f3ca839bf32d1619b5acd01deb",
								)}{" "}
								{20 - (this.state.farmLevel.currentLevel + 1) * 2}{" "}
								{LangString(
									"components.Farm.components.Statistic.Statistic.753467de070927077e2a12c9b55a1e98",
								)}
							</div>
							<div className="farm-statistic-body-level-description0__mission">
								{LangString(
									"components.Farm.components.Statistic.Statistic.4d8362ba61f33f1b34d3c28d621e2438",
								)}{" "}
								{getLandingTime(
									this.state.farmLevel.currentLevel == 5
										? 5
										: this.state.farmLevel.currentLevel + 1,
								)}{" "}
								{LangString(
									"components.Farm.components.Statistic.Statistic.179c035ddc35d536ff142d8c3f9e7626",
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
