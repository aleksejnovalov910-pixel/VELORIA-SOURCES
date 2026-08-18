import { LangString } from "../../modules/lang";
import React, { Component } from "react";
import "./style.less";

const png = Object.fromEntries(
	Object.entries(import.meta.glob("./assets/*.png", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.png$/)[1];
			return [name, value.default];
		},
	),
);
const svg = Object.fromEntries(
	Object.entries(import.meta.glob("./assets/*.svg", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.svg$/)[1];
			return [name, value.default];
		},
	),
);

import { LockGame } from "./components/LockGame";
import { ChestGame } from "./components/ChestGame";
import { NetGame } from "./components/NetGame";
import { CEF } from "../../modules/CEF";
import { DivingGameComponent } from "../../../shared/diving/minigames.config";
import { CustomEvent } from "../../modules/custom.event";
import { CustomEventHandler } from "../../../shared/custom.event";

export class DivingGames extends Component<
	{},
	{
		component: DivingGameComponent;
	}
> {
	ev: CustomEventHandler;

	constructor(props: any) {
		super(props);

		this.state = {
			component: null,
		};

		this.ev = CustomEvent.register(
			"divingGame:setComponent",
			(component: DivingGameComponent) =>
				this.setState({ ...this.state, component }),
		);
	}

	componentWillUnmount() {
		this.ev.destroy();
	}

	private static close() {
		CEF.gui.setGui(null);
		CustomEvent.triggerClient("diving:unfreeze");
	}

	render() {
		return (
			<div className="divingGame">
				{this.state.component !== null && (
					<>
						<img
							src={svg["background"]}
							alt=""
							className="divingGame__background"
						/>

						<div className="exit" onClick={() => DivingGames.close()}>
							<div className="exit__icon">
								<img src={svg["closeIcon"]} alt="#" />
							</div>
							<div className="exit__title">
								{LangString(
									"components.DivingGames.DivingGames.df1d2740732888a16e481232c66681e3",
								)}
							</div>
						</div>
					</>
				)}

				{this.state.component === "lock" && <LockGame />}
				{this.state.component === "chest" && <ChestGame />}
				{this.state.component === "net" && <NetGame />}
			</div>
		);
	}
}
