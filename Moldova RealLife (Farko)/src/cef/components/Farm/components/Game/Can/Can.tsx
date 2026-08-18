import { LangString } from "../../../../../modules/lang";
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

import "../../../style.less";
import { CEF } from "../../../../../modules/CEF";
import { CustomEvent } from "../../../../../modules/custom.event";
import { CustomEventHandler } from "../../../../../../shared/custom.event";

type key = "A" | "D";

export class Can extends Component<
	{},
	{
		id: number;
		currentKey: key;
		fill: number;
		speed: number;
	}
> {
	_ev: CustomEventHandler;
	constructor(props: any) {
		super(props);

		this.state = {
			id: 0,
			currentKey: "A",
			fill: 0,
			speed: 5,
		};

		this._ev = CustomEvent.register(
			"game:speed",
			(id: number, speed: number) => {
				this.setState({
					id,
					speed,
				});
			},
		);
	}

	public componentDidMount() {
		addEventListener("keyup", this.handleKeyUp);
	}

	public componentWillUnmount() {
		removeEventListener("keyup", this.handleKeyUp);
	}

	finishGame(): void {
		CustomEvent.triggerServer("waterGame:finish", true, this.state.id);
		this.close();
	}

	handleKeyUp = (e: KeyboardEvent) => {
		if (this.state.fill >= 100) return;

		if (e.keyCode == 65) {
			// A
			if (this.state.currentKey == "A") {
				this.setState({
					currentKey: "D",
					fill: this.state.fill + this.state.speed,
				});
			}
		} else if (e.keyCode == 68) {
			// D
			if (this.state.currentKey == "D") {
				this.setState({
					currentKey: "A",
					fill: this.state.fill + this.state.speed,
				});
			}
		}
		if (this.state.fill >= 100) this.finishGame();
	};

	close() {
		CEF.gui.setGui(null);
	}

	render() {
		return (
			<div className="farm-dotGame">
				<div className="exit" onClick={() => this.close()}>
					<div className="exit__icon">
						<img src={svg["closeIcon"]} alt="#" />
					</div>
					<div className="exit__title">
						{LangString(
							"components.Farm.components.Game.Can.Can.b1fca58082ae39808b38653ea8f89403",
						)}
					</div>
				</div>

				<img src={png["logo"]} className="farm-entrance__logo" alt="" />
				<img src={png["dot"]} className="farm-entrance__dot" alt="" />

				<div className="farm-dotGame-block">
					<img
						src={svg["block"]}
						className="farm-dotGame-block__background"
						alt=""
					/>

					<div className="farm-dotGame-block__logo farm-canImage">
						<img src={png["can"]} alt="" />
					</div>

					<div className="farm-dotGame-block-content">
						<div className="farm-dotGame-block-content-nav">
							<div className="farm-dotGame-block-content-nav__title">
								<span>
									{LangString(
										"components.Farm.components.Game.Can.Can.dfe0adfc0f21e8be77aef55186f213b1",
									)}
								</span>
								{LangString(
									"components.Farm.components.Game.Can.Can.54518c505b6558c26939d88435672ea6",
								)}
							</div>

							<div className="farm-dotGame-block-content-nav__line" />

							<div className="farm-dotGame-block-content-nav__description">
								{LangString(
									"components.Farm.components.Game.Can.Can.e25bea70e820abc3e507136f70b2ec16",
								)}{" "}
								<br />
								{LangString(
									"components.Farm.components.Game.Can.Can.a3ec30f8f435f88b93bfb39548b39737",
								)}
							</div>
						</div>
					</div>

					<div className="farm-milkGame-buttons">
						<div className={this.state.currentKey == "A" ? "can-active" : ""}>
							A
						</div>
						<div className={this.state.currentKey == "D" ? "can-active" : ""}>
							D
						</div>
					</div>

					<div className="farm-milkGame-container">
						<img
							src={png["dash"]}
							className="farm-milkGame-container__dash"
							alt=""
						/>

						<div
							className={"fuel_water fuel_can"}
							style={{ top: `${100 - this.state.fill}%` }}
						/>
						<div
							className={"fuel_water fuel_can"}
							style={{ top: `${100 - this.state.fill}%` }}
						/>

						<span className="farm-milkGame-container__percent">
							{this.state.fill}%
						</span>
						<span className="farm-milkGame-container__title">
							{LangString(
								"components.Farm.components.Game.Can.Can.f5bea49f0d17ed618bb6367b914e3f66",
							)}{" "}
							<br />{" "}
							{LangString(
								"components.Farm.components.Game.Can.Can.94481199d4424216cc6761b081509ecc",
							)}
						</span>
					</div>
				</div>
			</div>
		);
	}
}
