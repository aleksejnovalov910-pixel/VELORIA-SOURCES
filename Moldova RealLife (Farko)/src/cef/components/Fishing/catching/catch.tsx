import { LangString } from "../../../modules/lang";
import "./style.less";
import React, { Component } from "react";
import rodImg from "../assets/images/fishing_rod.png";
import { Circle } from "rc-progress";
import { CustomEvent } from "../../../modules/custom.event";
import { CustomEventHandler } from "../../../../shared/custom.event";
const png = Object.fromEntries(
	Object.entries(import.meta.glob("./*.png", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.png$/)[1];
			return [name, value.default];
		},
	),
);

export class FishCatching extends Component<
	{},
	{
		show: boolean;
		percent: number;
		resultSended: boolean;
	}
> {
	private _interval: number;
	private _ev: CustomEventHandler;

	constructor(props: any) {
		super(props);

		this.state = {
			show: false,
			percent: 1,
			resultSended: false,
		};

		this._ev = CustomEvent.register("fish:catching:start", () => {
			this.startGame();
		});
	}

	private startGame() {
		if (this._interval) clearInterval(this._interval);

		this.addEventListener();

		this._interval = setInterval(() => {
			if (this.state.percent >= 100) {
				this.stopGame();
			}
			this.setState({
				percent: this.state.percent + 0.7,
			});
		}, 25);

		this.setState({
			show: true,
			percent: 1,
		});
	}

	private stopGame() {
		clearInterval(this._interval);
		this.removeEventListener();
		this.setState({
			show: false,
		});
		CustomEvent.triggerClient("fishing:catching:done", this.state.percent);
	}

	private addEventListener() {
		document.addEventListener("keyup", this.handleKeyUp);
	}
	private removeEventListener() {
		document.removeEventListener("keyup", this.handleKeyUp);
	}
	private handleKeyUp = (ev: KeyboardEvent) => {
		if (ev.keyCode === 32) this.stopGame();
	};

	public componentWillUnmount() {
		this.stopGame();
		this._ev?.destroy();
	}

	render() {
		return (
			<>
				{this.state.show && (
					<div className="fishing">
						<div className="fishing__helpImage">
							<img src={png["helpImage"]} alt="" />
							<span>
								{LangString(
									"components.Fishing.catching.catch.0bfa92ee5d436c9fb75105e5c231197f",
								)}
							</span>
						</div>

						<div className="fishing__help">
							{LangString(
								"components.Fishing.catching.catch.63b21ca6eb2db09a1fe7a56bb51f0c5b",
							)}{" "}
							<span>
								{LangString(
									"components.Fishing.catching.catch.6a66e1ef8558c50e87b9e30a650abaaf",
								)}
							</span>{" "}
							{LangString(
								"components.Fishing.catching.catch.865c4fb4255d863b29161283cabdaf9e",
							)}
						</div>

						<div className="hud-fishing-catch">
							<div className="bg-circle"></div>
							<div className="fish-circle-wrap">
								<Circle
									percent={this.state.percent}
									strokeWidth={10}
									trailWidth={0}
									strokeColor="#6FCF97"
									trailColor="rgba(196, 196, 196, 0)"
								/>
							</div>
							<img src={rodImg} className="fish-rod-img" />
						</div>
					</div>
				)}
			</>
		);
	}
}
