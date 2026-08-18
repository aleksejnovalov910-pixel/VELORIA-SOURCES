import { LangString } from "../../modules/lang";
import React, { Component } from "react";
import "./style.scss";
import { CEF } from "../../modules/CEF";
const iconsItems = Object.fromEntries(
	Object.entries(
		import.meta.glob("../../../shared/icons/*.png", { eager: true }),
	).map(([key, value]: [key: string, value: any]) => {
		const name = key.match(/\/([^/]+)\.png$/)[1];
		return [name, value.default];
	}),
);
import { inventoryShared } from "../../../shared/inventory";
import { CustomEvent } from "../../modules/custom.event";
import { CustomEventHandler } from "../../../shared/custom.event";

import bottomPng from './img/bottom.png';
import topPng from './img/top.png';
import exitIcon from './img/exit.svg';

enum WinTaskEnum {
	MONEY = 9999,
	COINS = 10000,
}

export class WinTask extends Component<
	{},
	{
		taskInfo: Array<string>;
		taskName: string;
		item: Array<{ type: number; ammount: number; desc?: string }>;
	}
> {
	ev: CustomEventHandler;
	constructor(props: any) {
		super(props);

		(this.state = {
			taskInfo: [
				LangString("components.Wintask.index.9646663c619b12c3e4e5bb3964fae4be"),
				LangString("components.Wintask.index.18cc8ed88cee9ff4197f013bfcc7265c"),
			],
			taskName: LangString(
				"components.Wintask.index.896fe6717b457cc6c811da6ac6c14fbf",
			),
			item: [ // TODO: add at new layout
				// {type: WinTaskEnum.MONEY, ammount: 100},
				// {type: WinTaskEnum.COINS, ammount: 100},
				// {type: 950, ammount: 1, desc: 'Тестовая'},
				// {type: 952, ammount: 1, desc: 'Тестовые'}
			],
		}),
			(this.ev = CustomEvent.register(
				"wintask:show",
				(
					taskName: string,
					item: Array<{ type: number; ammount: number; desc?: string }>,
				) => {
					this.setState({ ...this.state, taskName, item });
				},
			));
	}

	itemCfg = (item_id: number) => {
		return inventoryShared.get(item_id);
	};

	closeTask = () => {
		CEF.gui.setGui(null);
	};

	componentWillUnmount = () => {
		if (this.ev) this.ev.destroy();
	};

	render = () => {
		return (
			<div className="congratulations-container-box">
				<div className="congratulations-box">
					<div className="congratulations-exit">
						<p>Exit</p>
						<div className="exit-img" onClick={this.closeTask}>
							<img src={exitIcon} alt="Exit" />
						</div>
					</div>

					<div className="congratulations">
						<h1>
							{LangString(
								"components.Wintask.index.8bb72438521890e26c43c1d393512294",
							)}
						</h1>
						<p>
							{this.state.taskInfo[0]} <span>“{this.state.taskName}”</span>{" "}
							{this.state.taskInfo[1]}
						</p>
						<button type="button" onClick={this.closeTask}>
							Accept
							{/* {
								LangString(
									"components.Wintask.index.62cec8c3c1515e22dff7ab5aeeb05b0c",
								)
							} */}
						</button >
					</div>

					<img className="top" src={topPng} alt="topPng" />
					<img className="bottom" src={bottomPng} alt="bottomPng" />
				</div>
			</div>
		)

	};
}
