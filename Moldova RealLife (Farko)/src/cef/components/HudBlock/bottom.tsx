import "./bottom.scss";
// biome-ignore lint/style/useImportType: <explanation>
import React, { Component } from "react";
import { CustomEvent } from "../../modules/custom.event";

import armourIcon from "./img/armour.svg";
import healthIcon from "./img/heart.svg";
import dropIcon from "./img/drop.svg";
import foodIcon from "./img/food.svg";
import micIcon from "./img/mic.svg";
import locationIcon from "./img/location.svg";

export class HudBottomClass extends Component<
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	{},
	{
		sumChange?: number;
		armour: number;
		health: number;
		food: number;
		water: number;
		zone: string;
		street: string;
		customZone1: string;
		customZone2: string;
		customZoneIcon?: "ok" | "no";
		money: number;
		bank: number;
		microphone: boolean;
		style: React.CSSProperties;
		inSaveZone?: boolean;
		inRedZone?: boolean;
		chips: number;
		inCasino: boolean;
		candyCount?: number;
		lollipopCount?: number;
	}
> {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	constructor(props: any) {
		super(props);

		this.state = {
			lollipopCount: 0,
			candyCount: 0,
			microphone: false,
			money: 0,
			bank: 0,
			chips: 0,
			zone: "Зона",
			street: "Улица",
			customZone1: "Зелёная",
			customZone2: "зона",
			customZoneIcon: "ok",
			style: null,
			inCasino: false,
			armour: 50,
			health: 80,
			food: 100,
			water: 15
		};

		CustomEvent.register("hud:zone", (zone: string, street: string) => {
			const decodedZone = unescape(zone);
			const decodedStreet = unescape(street);

			this.setState({ zone: decodedZone, street: decodedStreet });
		});

		CustomEvent.register("hud:incasino", (inCasino: boolean) => {
			this.setState({ inCasino });
		});

		CustomEvent.register("hud:setMicrophone", (status) => {
			this.setState({ microphone: status });
		});

		CustomEvent.register("hud:updateCandy", (count) => {
			this.setState({ candyCount: count });
		});
		CustomEvent.register("hud:updateLollipops", (count) => {
			this.setState({ lollipopCount: count });
		});

		CustomEvent.register(
			"cef:alert:setSafezoneInfo",
			(width: number, height: number, left: number, bottom: number) => {
				this.setState({
					style: {
						bottom: `${bottom}px`,
						left: `${left + width + 42}px`,
						display: "flex",
						position: "absolute",
					},
				});
			},
		);

		CustomEvent.register(
			"hud:updateStats",
			(health: number, armour: number, food: number, water: number) => {
				this.setState({
					health: health,
					armour: armour,
					food: food,
					water: water,
				});
			},
		);

		CustomEvent.register("savezone:set", (inSaveZone) => {
			this.setState({ inSaveZone });
		});
		CustomEvent.register("redzone:set", (inRedZone) => {
			this.setState({ inRedZone });
		});
	}

	render() {
		return (
			<>
				<div className="hud-bottom-left">
					<div className="section">
						<div className="utils">
							<div className="util">
								<div className="img-container">
									<img src={armourIcon} alt="" />
								</div>
								<div className="bar-container">
									<div className="bar">
										<div
											className="line"
											style={{
												background:
													"radial-gradient(50% 50% at 50% 50%, #00D5FF 0%, #0194EF 100%)",
												width: `${this.state.armour}%`,
											}}
										/>
									</div>
								</div>
							</div>
							<div className="util">
								<div className="img-container">
									<img src={healthIcon} alt="" />
								</div>
								<div className="bar-container">
									<div className="bar">
										<div
											className="line"
											style={{
												background:
													"radial-gradient(50% 50% at 50% 50%, #FF4949 0%, #C52828 100%)",
												width: `${this.state.health}%`,
											}}
										/>
									</div>
								</div>
							</div>
							<div className="util">
								<div className="img-container">
									<img src={foodIcon} alt="" />
								</div>
								<div className="bar-container">
									<div className="bar">
										<div
											className="line"
											style={{
												background:
													"radial-gradient(50% 50% at 50% 50%, #FF9D00 0%, #EF7C01 100%)",
												width: `${this.state.food}%`,
											}}
										/>
									</div>
								</div>
							</div>
							<div className="util">
								<div className="img-container">
									<img src={dropIcon} alt="" />
								</div>
								<div className="bar-container">
									<div className="bar">
										<div
											className="line"
											style={{
												background:
													"radial-gradient(50% 50% at 50% 50%, #01A8EF 0%, #0178EF 100%)",
												width: `${this.state.water}%`,
											}}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="mic-location">
							<div
								className={`mic-icon ${this.state.microphone ? "speak" : ""}`}
							>
								<div className="point" />
								<img className="mic-icon" src={micIcon} alt="" />
							</div>
							<div className="location-text">
								<img src={locationIcon} alt="" />
								<span>
									{this.state.street} {this.state.zone}
								</span>
							</div>


							{this.state.inRedZone && (
								<div className="hud-greenzone redzone">
									Red Zone
								</div>
							)}

							{this.state.inSaveZone && (
								<div className="hud-greenzone">
									Green Zone
								</div>
							)}
						</div>
					</div>
				</div>
			</>
		);
	}
}
