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

export class FieldWorker extends Component<
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
					src={png["shovel"]}
					className="farm-entrance-block-content__shovel"
					alt=""
				/>

				<img
					src={png["hat"]}
					className="farm-entrance-block-content__hat"
					alt=""
				/>

				<div className="farm-entrance-block-content__bigName">
					{LangString(
						"components.Farm.components.Entrance.components.FieldWorker.FieldWorker.85219dfe982f0fb46684b2cb06fb7d33",
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
								"components.Farm.components.Entrance.components.FieldWorker.FieldWorker.5a5ba68d6785b5af572c66ed0b573dd9",
							)}
						</span>
						<p>{this.props.data.ownerName}</p>
					</div>
				</div>

				<div className="farm-entrance-block-content__plan">
					<img src={svg["coin"]} alt="" />
					<span>
						{LangString(
							"components.Farm.components.Entrance.components.FieldWorker.FieldWorker.fbdb4866a7eadaaa191a47ef8456893a",
						)}{" "}
						<br />{" "}
						<div>
							${systemUtil.numberFormat(this.props.data.salary)}{" "}
							{LangString(
								"components.Farm.components.Entrance.components.FieldWorker.FieldWorker.072e12d1a4f87a7d9b7751143fcaa35a",
							)}
						</div>
					</span>
					<img src={svg["clock"]} alt="" />
					<span>
						{LangString(
							"components.Farm.components.Entrance.components.FieldWorker.FieldWorker.d28d467a4f8da9b9f226477378b0ecde",
						)}{" "}
						<br />{" "}
						<div>
							{this.props.data.rentTime[0]}{" "}
							{LangString(
								"components.Farm.components.Entrance.components.FieldWorker.FieldWorker.3a2d8581db0f4d2f92bf0e3cbd7746d1",
							)}{" "}
							{this.props.data.rentTime[1]}{" "}
							{LangString(
								"components.Farm.components.Entrance.components.FieldWorker.FieldWorker.52e8e14a6c1dbceff32197030e492399",
							)}
						</div>
					</span>
				</div>

				<div className="farm-entrance-block-content__title">
					{LangString(
						"components.Farm.components.Entrance.components.FieldWorker.FieldWorker.09db0c9402831562a27d13a4df75acf2",
					)}
				</div>

				<div className="farm-entrance-block-content__button">
					<div onClick={() => this.startWork()}>
						{LangString(
							"components.Farm.components.Entrance.components.FieldWorker.FieldWorker.67c595df1e5d878c5dd73857e3fffa10",
						)}
					</div>
				</div>
			</div>
		);
	}
}
