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
import { CustomEventHandler } from "../../../../../shared/custom.event";
import { CustomEvent } from "../../../../modules/custom.event";
import { ActivityType, FieldStage } from "../../../../../shared/farm/config";

export class Hud extends Component<
	{},
	{
		show: boolean;
		stage: 0 | 1 | 2;
		activity: string;
	}
> {
	_ev: CustomEventHandler;
	_ev2: CustomEventHandler;
	constructor(props: any) {
		super(props);

		this.state = {
			stage: 2,
			show: false,
			activity: LangString(
				"components.Farm.components.Hud.Hud.d746bfc93a411b6c992557d035d96177",
			),
		};

		this._ev = CustomEvent.register(
			"farmHud:show",
			(activity: ActivityType, stage: FieldStage) => {
				this.setState({
					show: true,
					stage: stage,
					activity: ActivityType[activity].toString(),
				});
			},
		);
		this._ev2 = CustomEvent.register("farmHud:hide", () => {
			this.setState({
				show: false,
			});
		});
	}

	public componentWillUnmount() {
		if (this._ev) this._ev.destroy;
		if (this._ev2) this._ev2.destroy;
	}

	render() {
		if (!this.state.show) return null;
		return (
			<div className="farm-hud">
				<img
					src={svg[`${this.state.activity + this.state.stage}`]}
					className="farm-hud__stage"
					alt=""
				/>
			</div>
		);
	}
}
