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

import "../../style.less";
import { CEF } from "../../../../modules/CEF";
import { IBestFarmer } from "../../../../../shared/farm/dtos";
import { CustomEventHandler } from "../../../../../shared/custom.event";
import { CustomEvent } from "../../../../modules/custom.event";

export class Best extends Component<
	{},
	{
		bestFarmers: IBestFarmer[];
	}
> {
	_ev: CustomEventHandler;
	constructor(props: any) {
		super(props);

		this.state = {
			bestFarmers: [
				{
					id: 1,
					name: "TEst Test",
					exp: 12,
				},
				{
					id: 1,
					name: "TEst Test",
					exp: 12,
				},
				{
					id: 1,
					name: "TEst Test",
					exp: 12,
				},
			],
		};

		this._ev = CustomEvent.register("farm:best:init", (data: IBestFarmer[]) => {
			this.setState({
				bestFarmers: data,
			});
		});
	}

	close() {
		CEF.gui.setGui(null);
	}

	render() {
		return (
			<div className="farm-best">
				<div className="exit" onClick={() => this.close()}>
					<div className="exit__icon">
						<img src={svg["closeIcon"]} alt="#" />
					</div>
					<div className="exit__title">
						{LangString(
							"components.Farm.components.Best.Best.b1f8c35e6c2a0f5b214cf59b8082a3b9",
						)}
					</div>
				</div>

				<div className="farm-best-content">
					<img
						src={png["background"]}
						alt=""
						className="farm-best-content__background"
					/>

					<div className="farm-best-content-block farm-best-content-block_0">
						<div className="farm-best-content-block__id">
							{LangString(
								"components.Farm.components.Best.Best.cc6a93113183ea41ea61a958a8141f33",
							)}{" "}
							{this.state.bestFarmers[0].id}
						</div>
						<div className="farm-best-content-block__name">
							{this.state.bestFarmers[0].name}
						</div>
						<div className="farm-best-content-block__exp">
							{this.state.bestFarmers[0].exp}
							<span>exp</span>
						</div>
					</div>

					<div className="farm-best-content-block farm-best-content-block_1">
						<div className="farm-best-content-block__id">
							{LangString(
								"components.Farm.components.Best.Best.6a3f0686aed10aa6e165995e52b6d967",
							)}{" "}
							{this.state.bestFarmers[1].id}
						</div>
						<div className="farm-best-content-block__name">
							{this.state.bestFarmers[1].name}
						</div>
						<div className="farm-best-content-block__exp">
							{this.state.bestFarmers[1].exp}
							<span>exp</span>
						</div>
					</div>

					<div className="farm-best-content-block farm-best-content-block_2">
						<div className="farm-best-content-block__id">
							{LangString(
								"components.Farm.components.Best.Best.e66df8b8c11c2d365fa7c4c7850bcda9",
							)}{" "}
							{this.state.bestFarmers[2].id}
						</div>
						<div className="farm-best-content-block__name">
							{this.state.bestFarmers[2].name}
						</div>
						<div className="farm-best-content-block__exp">
							{this.state.bestFarmers[2].exp}
							<span>exp</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
