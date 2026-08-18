import { LangString } from "../../../../modules/lang";
import React, { Component } from "react";
import {
	DIVING_LOCK_GAME_MAX_ROT,
	DIVING_LOCK_GAME_MIN_ROT,
	Gear,
} from "../../../../../shared/diving/minigames.config";
import "../../style.less";
import { CustomEvent } from "../../../../modules/custom.event";

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

export class LockGame extends Component<
	{},
	{
		gears: Gear[];
		currentGear: number;
		gearRefs: React.RefObject<any>[];
	}
> {
	private arrowUpPressed: boolean = false;
	private interval: number;

	componentDidMount() {
		document.addEventListener("keydown", this.listenerKeyDown);
		document.addEventListener("keyup", this.listenerKeyUp);

		this.interval = setInterval(() => {
			if (this.arrowUpPressed) {
				const gears = this.state.gears;
				if (gears[this.state.currentGear].rotation !== 720) {
					gears[this.state.currentGear].rotation += 5;
					this.state.gearRefs[this.state.currentGear].current.style.transform =
						`rotate(${gears[this.state.currentGear].rotation}deg)`;
				}

				if (
					!gears[this.state.currentGear].success &&
					gears[this.state.currentGear].rotation >=
						gears[this.state.currentGear].neededRotation
				) {
					gears[this.state.currentGear].success = true;
				}
				this.setState({ ...this.state, gears });
			}
		}, 50);
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.listenerKeyDown);
		document.removeEventListener("keyup", this.listenerKeyUp);

		clearInterval(this.interval);
	}

	constructor(props: any) {
		super(props);

		this.state = {
			currentGear: 0,
			gears: [
				{
					id: 0,
					success: false,
					rotation: 0,
					neededRotation: LockGame.getRandomRotation(),
				},
				{
					id: 1,
					success: false,
					rotation: 0,
					neededRotation: LockGame.getRandomRotation(),
				},
				{
					id: 2,
					success: false,
					rotation: 0,
					neededRotation: LockGame.getRandomRotation(),
				},
				{
					id: 3,
					success: false,
					rotation: 0,
					neededRotation: LockGame.getRandomRotation(),
				},
				{
					id: 4,
					success: false,
					rotation: 0,
					neededRotation: LockGame.getRandomRotation(),
				},
				{
					id: 5,
					success: false,
					rotation: 0,
					neededRotation: LockGame.getRandomRotation(),
				},
			],
			gearRefs: [
				React.createRef(),
				React.createRef(),
				React.createRef(),
				React.createRef(),
				React.createRef(),
				React.createRef(),
			],
		};
	}

	private listenerKeyDown = (e: any): void => {
		if (e.keyCode === 38) {
			this.arrowUpPressed = true;
		}

		if (e.keyCode === 32) {
			this.lockGear();
		}
	};

	private listenerKeyUp = (e: any): void => {
		if (e.keyCode === 38) {
			this.arrowUpPressed = false;
		}
	};

	private lockGear() {
		const currGear = this.state.currentGear;

		if (currGear === 5) {
			CustomEvent.triggerClient(
				"diving:chestGame:finish",
				this.state.gears.filter((el) => el.success).length ===
					this.state.gears.length,
			);

			return;
		}

		this.setState({ ...this.state, currentGear: currGear + 1 });
	}

	private static getRandomRotation(): number {
		return (
			Math.random() * (DIVING_LOCK_GAME_MAX_ROT - DIVING_LOCK_GAME_MIN_ROT) +
			DIVING_LOCK_GAME_MIN_ROT
		);
	}

	render() {
		return (
			<>
				<div className="divingGame__title">
					{LangString(
						"components.DivingGames.components.LockGame.LockGame.54688a0a54280bae8dfd7b2174136098",
					)}
				</div>

				<div className="divingGame__text">
					{LangString(
						"components.DivingGames.components.LockGame.LockGame.68ab249a0f080be63b5e641ef5cfcbb5",
					)}
				</div>

				<div className="divingGame__instruction">
					<div>
						<img src={svg["arrow"]} alt="" />
					</div>
					<span>
						{LangString(
							"components.DivingGames.components.LockGame.LockGame.c0e6f58d8775b9b2007a813e64bd998b",
						)}{" "}
						<br />{" "}
						{LangString(
							"components.DivingGames.components.LockGame.LockGame.27d56c6801e545210000131d1567823c",
						)}
					</span>

					<div>
						<span>
							{LangString(
								"components.DivingGames.components.LockGame.LockGame.8dbe9217b1e15aa9e8b639f597d23640",
							)}
						</span>
					</div>
					<span>
						{LangString(
							"components.DivingGames.components.LockGame.LockGame.f5a89081519d9f4ac9901dae77687abb",
						)}{" "}
						<br />{" "}
						{LangString(
							"components.DivingGames.components.LockGame.LockGame.069f84ee7de5d39fb5ced995e8a6f77d",
						)}
					</span>
				</div>

				<div className="lockGame">
					<div className="lockGame-gears">
						{this.state.gears
							.filter((el) => el.id < 3)
							.map((el, i) => {
								return (
									<div
										className={`lockGame-gears__block ${this.state.currentGear === el.id ? "lockGame-focus" : ""} ${el.success ? "lockGame-green" : ""}`}
										key={i}
										ref={this.state.gearRefs[el.id]}
									>
										<img src={png["gear"]} alt="" />
									</div>
								);
							})}
					</div>

					<img src={png["lock"]} alt="" className="lockGame__lock" />

					<div className="lockGame-gears">
						{this.state.gears
							.filter((el) => el.id >= 3)
							.map((el, i) => {
								return (
									<div
										className={`lockGame-gears__block ${this.state.currentGear === el.id ? "lockGame-focus" : ""} ${el.success ? "lockGame-green" : ""}`}
										key={i}
										ref={this.state.gearRefs[el.id]}
									>
										<img src={png["gear"]} alt="" />
									</div>
								);
							})}
					</div>
				</div>
			</>
		);
	}
}
