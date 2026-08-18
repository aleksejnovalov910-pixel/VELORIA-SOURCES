import { LangString } from "../../modules/lang";
import React, { Component } from "react";
import { SNOW_WAR_MAX_PLAYERS } from "../../../shared/snowWar/main.config";
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
import { CustomEventHandler } from "../../../shared/custom.event";
import { CustomEvent } from "../../modules/custom.event";
import { RegistrationDTO } from "../../../shared/snowWar/dtos";
import { CEF } from "../../modules/CEF";

export class SnowWar extends Component<
	{},
	{
		players: number;
		maxPlayers: number;
		joined: boolean;
		battleStarted: boolean;
		time: number;
	}
> {
	ev: CustomEventHandler;
	ev1: CustomEventHandler;

	constructor(props: any) {
		super(props);

		this.state = {
			battleStarted: true,
			joined: true,
			players: 50,
			maxPlayers: SNOW_WAR_MAX_PLAYERS,
			time: 350,
		};

		this.ev = CustomEvent.register(
			"snowwar:registration:update",
			(DTO: RegistrationDTO) => {
				this.setState({
					...this.state,
					players: DTO.playersQueueLength,
					battleStarted: DTO.battleInProgress,
					time: DTO.timer,
				});
			},
		);

		this.ev1 = CustomEvent.register(
			"snowwar:registration:setJoined",
			(toggle: boolean) => {
				this.setState({ ...this.state, joined: toggle });
			},
		);
	}

	componentWillUnmount() {
		this.ev.destroy();
		this.ev1.destroy();
	}

	register() {
		CustomEvent.triggerServer("snowwar:registerPlayer");
	}

	unregister() {
		CustomEvent.triggerServer("snowwar:unregisterPlayer");
	}

	close() {
		CustomEvent.triggerServer("snowwar:registrationClose");
		CEF.gui.setGui(null);
	}

	getRegisterButton() {
		if (this.state.battleStarted) {
			return (
				<div className="snowWar-block-footer__button snowWar-block-footer__buttonTransparent">
					{LangString(
						"components.SnowWar.SnowWar.b0f24429a64984dfce939702f4ca47ff",
					)}
				</div>
			);
		} else {
			if (this.state.joined) {
				return (
					<div
						className="snowWar-block-footer__button snowWar-block-footer__buttonTransparent"
						onClick={() => this.unregister()}
					>
						<img src={svg["closeCircle"]} alt="" />
						{LangString(
							"components.SnowWar.SnowWar.5def6bed938a538e8d2cbb304501e24c",
						)}
					</div>
				);
			} else {
				return (
					<div
						className="snowWar-block-footer__button"
						onClick={() => this.register()}
					>
						{LangString(
							"components.SnowWar.SnowWar.c8488094cc91580fbb9274471b469b12",
						)}
					</div>
				);
			}
		}
	}

	getTimer(): string {
		let timer = this.state.time,
			minutes: string | number = Math.floor(timer / 60),
			seconds: string | number;

		if (minutes > 0) {
			seconds = timer - minutes * 60;
		} else {
			seconds = timer;
		}

		if (minutes < 10) {
			minutes = `0${minutes}`;
		}

		if (seconds < 10) {
			seconds = `0${seconds}`;
		}

		return `${minutes}:${seconds}`;
	}

	render() {
		return (
			<div className="snowWar">
				<img src={png["background"]} className="snowWar__background" alt="" />
				<img src={png["body"]} className="snowWar__body" alt="" />

				<div className="exit" onClick={() => this.close()}>
					<div className="exit__icon">
						<img src={svg["closeIcon"]} alt="#" />
					</div>
					<div className="exit__title">
						{LangString(
							"components.SnowWar.SnowWar.e23ce6bea50a5c77c45409bc0bb7d57a",
						)}
					</div>
				</div>

				<div className="snowWar-block">
					<div className="snowWar-block__title">
						{LangString(
							"components.SnowWar.SnowWar.65aebc85b78de21499dd00bdd63494cf",
						)}
					</div>

					<div className="snowWar-block__text">
						<span>
							{LangString(
								"components.SnowWar.SnowWar.947c6e3f06990aa7f19c3d872f884d06",
							)}
						</span>
						{LangString(
							"components.SnowWar.SnowWar.e4048f68e9d7cb04f9658897b320af5f",
						)}
					</div>

					<div className="snowWar-block__hr" />

					<div className="snowWar-block-footer">
						<div className="snowWar-block-footer__left">
							<span>
								{LangString(
									"components.SnowWar.SnowWar.6e790cefa0e11c666f4a0663422b04e1",
								)}
							</span>
							<div>
								<img src={svg["personsIcon"]} alt="" />
								{this.state.players}/{this.state.maxPlayers}
							</div>
						</div>

						{this.getRegisterButton()}
					</div>

					<div className="snowWar-block-timer">
						<img src={svg["alarm"]} alt="" />

						<div className="snowWar-block-timer__time">{this.getTimer()}</div>

						<div className="snowWar-block-timer__hr" />

						<div className="snowWar-block-timer__text">
							{this.state.battleStarted
								? LangString(
										"components.SnowWar.SnowWar.2a85e01e676ec2ce1648a85fc5198501",
									)
								: LangString(
										"components.SnowWar.SnowWar.dbe0c985f76ae0829edb371b08124742",
									)}{" "}
							{LangString(
								"components.SnowWar.SnowWar.3f76d5a3a4546e143e0a6c9cff04e294",
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
