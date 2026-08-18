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

export class CattleWorker extends Component<
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
					src={png["cow"]}
					className="farm-entrance-block-content__cow"
					alt=""
				/>

				<img
					src={png["hat"]}
					className="farm-entrance-block-content__hat"
					alt=""
				/>

				<div className="farm-entrance-block-content__bigName">
					{LangString(
						"components.Farm.components.Entrance.components.CattleWorker.CattleWorker.a46d438f1170dcbf928e9df62fe9ae13",
					)}
				</div>

				<div className="farm-entrance-block-content-level">
					<div className="farm-entrance-block-content-level__info">
						<span>{this.props.data.level}</span>
						<img src={svg["level"]} alt="" />
					</div>
					<div className="farm-entrance-block-content-level__name">
						<span>
							{LangString(
								"components.Farm.components.Entrance.components.CattleWorker.CattleWorker.5a5ba68d6785b5af572c66ed0b573dd9",
							)}
						</span>
						<p>{this.props.data.ownerName}</p>
					</div>
				</div>

				<div className="farm-entrance-block-content__plan">
					<img src={svg["coin"]} alt="" />
					<span>
						{LangString(
							"components.Farm.components.Entrance.components.CattleWorker.CattleWorker.fbdb4866a7eadaaa191a47ef8456893a",
						)}{" "}
						<br />{" "}
						<div>
							${systemUtil.numberFormat(this.props.data.salary)}{" "}
							{LangString(
								"components.Farm.components.Entrance.components.CattleWorker.CattleWorker.55401824bc41de92394bbd7b2420a1e5",
							)}
						</div>
					</span>
					<img src={svg["clock"]} alt="" />
					<span>
						{LangString(
							"components.Farm.components.Entrance.components.CattleWorker.CattleWorker.6ab593a5d199517053e931bd8b1b00e4",
						)}{" "}
						<br />{" "}
						<div>
							{this.props.data.rentTime[0]}{" "}
							{LangString(
								"components.Farm.components.Entrance.components.CattleWorker.CattleWorker.46d3963e9d7d04a5e43680d5ddfc8b1b",
							)}{" "}
							{this.props.data.rentTime[1]}{" "}
							{LangString(
								"components.Farm.components.Entrance.components.CattleWorker.CattleWorker.c7771445199e2eba1a2a0d602ca0c5d8",
							)}
						</div>
					</span>
				</div>

				<div className="farm-entrance-block-content__title">
					{LangString(
						"components.Farm.components.Entrance.components.CattleWorker.CattleWorker.cb5d3917a9249c023126673f322157bb",
					)}
				</div>

				<div className="farm-entrance-block-content__button">
					<div onClick={() => this.startWork()}>
						{LangString(
							"components.Farm.components.Entrance.components.CattleWorker.CattleWorker.96dc84713cd60b180249a10d7298da39",
						)}
					</div>
				</div>
			</div>
		);
	}
}
