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
import { CustomEventHandler } from "../../../../../../shared/custom.event";
import { CustomEvent } from "../../../../../modules/custom.event";

type key = "A" | "D";

export class Milk extends Component<
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
							"components.Farm.components.Game.Milk.Milk.e49c60dc6fe3c9be6aa3e691708c08ce",
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

					<div className="farm-dotGame-block__logo">
						<img src={png["bucket"]} alt="" />
					</div>

					<div className="farm-dotGame-block-content">
						<div className="farm-dotGame-block-content-nav">
							<div className="farm-dotGame-block-content-nav__title">
								<span>
									{LangString(
										"components.Farm.components.Game.Milk.Milk.a3eefd55cee0cb66e319db46098f63ef",
									)}
								</span>
								{LangString(
									"components.Farm.components.Game.Milk.Milk.c2f60b880df6598ea59cfb690d306a66",
								)}
							</div>

							<div className="farm-dotGame-block-content-nav__line" />

							<div className="farm-dotGame-block-content-nav__description">
								{LangString(
									"components.Farm.components.Game.Milk.Milk.27a5cc774cefe9af8865078e4e232c47",
								)}{" "}
								<br />
								{LangString(
									"components.Farm.components.Game.Milk.Milk.aa0b5738fd4ae03d01e93f4a2a9f5951",
								)}
							</div>
						</div>
					</div>

					<div className="farm-milkGame-buttons">
						<div className={this.state.currentKey == "A" ? "milk-active" : ""}>
							A
						</div>
						<div className={this.state.currentKey == "D" ? "milk-active" : ""}>
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
							className={"fuel_water"}
							style={{ top: `${100 - this.state.fill}%` }}
						/>
						<div
							className={"fuel_water"}
							style={{ top: `${100 - this.state.fill}%` }}
						/>

						<span className="farm-milkGame-container__percent">
							{this.state.fill}%
						</span>
						<span className="farm-milkGame-container__title">
							{LangString(
								"components.Farm.components.Game.Milk.Milk.5cc81ed0066029c26af6edd7ef5c8143",
							)}{" "}
							<br />{" "}
							{LangString(
								"components.Farm.components.Game.Milk.Milk.2e4e5f9029bf40ff5fe25643a7eaeb0e",
							)}
						</span>
					</div>
				</div>
			</div>
		);
	}
}
