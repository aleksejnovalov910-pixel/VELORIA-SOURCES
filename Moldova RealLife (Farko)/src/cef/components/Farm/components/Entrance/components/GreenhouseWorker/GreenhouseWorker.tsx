import { LangString } from "../../../../../../modules/lang";
import React, { Component } from "react";

// @ts-ignore
const png = Object.fromEntries(
	Object.entries(import.meta.glob("../../assets/*.png", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.png$/)[1];
			return [name, value.default];
		},
	),
);
// @ts-ignore
const svg = Object.fromEntries(
	Object.entries(import.meta.glob("../../assets/*.svg", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.svg$/)[1];
			return [name, value.default];
		},
	),
);
import { IEntranceWorkerData } from "../../Entrance";
import { systemUtil } from "../../../../../../../shared/system";
import { CustomEvent } from "../../../../../../modules/custom.event";

export class GreenhouseWorker extends Component<
	{
		data: IEntranceWorkerData;
	},
	{}
> {
	constructor(props: any) {
		super(props);
	}

	startWork(): void {
		CustomEvent.triggerServer("farm:work:start", this.props.data.id);
	}

	render() {
		return (
			<div className="farm-entrance-block-content">
				<img
					src={png["greenhouse"]}
					className="farm-entrance-block-content__greenhouse"
					alt=""
				/>

				<img
					src={png["hat"]}
					className="farm-entrance-block-content__hat"
					alt=""
				/>

				<div className="farm-entrance-block-content__bigName">HITZE</div>

				<div className="farm-entrance-block-content-level">
					<div className="farm-entrance-block-content-level__info">
						<span>{this.props.data.level}</span>
						<img src={svg["level"]} alt="" />
					</div>
					<div className="farm-entrance-block-content-level__name">
						<span>
							{LangString(
								"components.Farm.components.Entrance.components.GreenhouseWorker.GreenhouseWorker.936be06bcca2179e63631ebb640660ad",
							)}
						</span>
						<p>{this.props.data.ownerName}</p>
					</div>
				</div>

				<div className="farm-entrance-block-content__plan">
					<img src={svg["coin"]} alt="" />
					<span>
						{LangString(
							"components.Farm.components.Entrance.components.GreenhouseWorker.GreenhouseWorker.57376073b24bcdd4f099011845aa37bc",
						)}{" "}
						<br />{" "}
						<div>
							${systemUtil.numberFormat(this.props.data.salary)}{" "}
							{LangString(
								"components.Farm.components.Entrance.components.GreenhouseWorker.GreenhouseWorker.5db86bf964e03ec21cc4e2c5b039209c",
							)}
						</div>
					</span>
					<img src={svg["clock"]} alt="" />
					<span>
						{LangString(
							"components.Farm.components.Entrance.components.GreenhouseWorker.GreenhouseWorker.80e0300c52acd581622e05fe7ad01eac",
						)}{" "}
						<br />{" "}
						<div>
							{this.props.data.rentTime[0]}{" "}
							{LangString(
								"components.Farm.components.Entrance.components.GreenhouseWorker.GreenhouseWorker.c99161c5cd3d7c4881ce95260acad514",
							)}{" "}
							{this.props.data.rentTime[1]}{" "}
							{LangString(
								"components.Farm.components.Entrance.components.GreenhouseWorker.GreenhouseWorker.6d7eb80b150db383a37cdd213b86b584",
							)}
						</div>
					</span>
				</div>

				<div className="farm-entrance-block-content__title">
					{LangString(
						"components.Farm.components.Entrance.components.GreenhouseWorker.GreenhouseWorker.ba2b3e1c7f6baf21ccd2c7f0075a2450",
					)}
				</div>

				<div className="farm-entrance-block-content__button">
					<div onClick={() => this.startWork()}>
						{LangString(
							"components.Farm.components.Entrance.components.GreenhouseWorker.GreenhouseWorker.225ef6c22a3980c993243271f1dd5b88",
						)}
					</div>
				</div>
			</div>
		);
	}
}
