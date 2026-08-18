import "./speedometer.scss";
// biome-ignore lint/style/useImportType: <explanation>
import React, { Component, ErrorInfo, useEffect, useState } from "react";
// @ts-ignore
import type ProgressBar from "progressbar.js";
import { CEF } from "../../modules/CEF";
import { CustomEvent } from "../../modules/custom.event";
import type { defaultHotkeys } from "../../../shared/hotkeys";

import fuelWhiteIcon from "./img/fuel-white.svg";
import fuelIcon from "./img/fuelIcon.svg";
import beltActive from "./img/beltActive.svg";
import beltUnactive from "./img/beltUnactive.svg";
import lightActive from "./img/lightActive.svg";
import lightUnactive from "./img/lightUnactive.svg";
import doorActive from "./img/doorActive.svg";
import doorUnactive from "./img/doorUnactive.svg";
import engineActive from "./img/engineActive.svg";
import engineUnactive from "./img/engineUnactive.svg";
import engineWhiteIcon from "./img/engine-white.svg";
import engineRedIcon from "./img/engine-red-ico.svg";

export class HudSpeedometerClass extends Component<
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	{},
	{
		speed: number;
		show: boolean;
		fuel: number;
		locked: boolean;
		engine: boolean;
		engineHealth: number;
		strapped: boolean;
		headLight: boolean;
		mileage: number;
		data?: typeof defaultHotkeys;
	}
> {
	bar: ProgressBar.SemiCircle;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	constructor(props: any) {
		super(props);

		this.state = {
			show: !!CEF.test,
			speed: 540,
			fuel: 20,
			mileage: 0,
			engineHealth: 0,
			headLight: true,
			locked: false,
			engine: true,
			strapped: false,
		};
		CustomEvent.register(
			"hud:speedometer",
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			(data: { [param: string]: any }) => {
				if (JSON.stringify(data).length < 5)
					return this.setState({ show: false });
				this.setState({
					show: true,
					speed: data.s,
					fuel: data.f,
					locked: data.l,
					engine: data.e,
					engineHealth: data.eh,
					strapped: data.x,
				});
				if (this.bar) this.bar.animate(this.getBarLevel);
			},
		);
		CustomEvent.register("currentHotkeys", (data: typeof defaultHotkeys) => {
			this.setState({ data });
		});
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.log("WE GOT ERROR");
		CustomEvent.trigger("react:error", error, errorInfo);
	}

	get speed() {
		if (!this.state.speed) return 0;
		return Math.min(this.state.speed, 540);
	}

	get getBarLevel() {
		if (!this.speed) return 0.0;
		return Math.max(0, Math.min(Math.abs(this.speed) / 540, 1.0));
	}

	get fuelPercentage() {
		if (this.state.fuel < 0) return 0;
		if (this.state.fuel > 100) return 100;
		return Math.round(this.state.fuel);
	}

	get engineHealthPercentage() {
		if (this.state.engineHealth < 0) return 0;
		if (this.state.engineHealth > 1000) return 100;
		return Math.round((this.state.engineHealth / 1000) * 100);
	}

	render() {
		if (!this.state.show) return <></>;
		const formatSpeed = (speed: number) => {
			const formattedSpeed = speed.toString().padStart(3, "0");
			const greyPart = formattedSpeed.slice(0, 3 - speed.toString().length);
			const whitePart = formattedSpeed.slice(3 - speed.toString().length);
			return { greyPart, whitePart };
		};

		const { greyPart, whitePart } = formatSpeed(this.speed);

		const radius = 90;
		const circumference = 2 * Math.PI * radius;
		const strokeDashoffset =
			circumference - (circumference * this.state.speed) / 720;
		return (
			<div className="speedo-container-box">
				<div className="speedometer">
					<div className="svg-speed">
						<svg
							viewBox="0 0 200 200"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>svg</title>
							<circle
								cx="100"
								cy="100"
								r="90"
								fill="none"
								stroke="#167c08"
								strokeWidth="6"
								strokeDasharray={circumference}
								strokeDashoffset={strokeDashoffset}
								transform="rotate(-90 100 100)"
							/>
						</svg>
					</div>
					<div className="svg-speed-bg">
						<svg
							viewBox="0 0 200 200"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>svg</title>
							<circle
								cx="100"
								cy="100"
								r="90"
								fill="none"
								stroke="rgba(255, 255, 255, 0.1)"
								strokeWidth="5.2"
								strokeDasharray="565.48"
								strokeDashoffset="141.37"
								transform="rotate(-90 100 100)"
							/>
						</svg>
					</div>

					<div className="svg-speed-yellow">
						<svg
							viewBox="0 0 200 200"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>svg</title>
							<circle
								cx="100"
								cy="100"
								r="90"
								fill="none"
								stroke="#0e5205"
								strokeWidth="30"
								strokeDasharray={circumference}
								strokeDashoffset={strokeDashoffset}
								transform="rotate(-90 100 100)"
							/>
						</svg>
					</div>
					<div className="svg-speed-yellow">
						<svg
							width="230"
							height="215"
							viewBox="0 0 200 200"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>svg</title>
							<circle
								cx="100"
								cy="100"
								r="90"
								fill="none"
								stroke="#"
								strokeWidth="30"
								strokeDasharray="565.48"
								strokeDashoffset="388"
								transform="rotate(-90 100 100)"
							/>
							<defs>
								<radialGradient id="paint0_radial_576_1713" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(115 115) rotate(88.893) scale(207.039 221.588)">
								<stop stop-color="rgb(4, 73, 10)" stop-opacity="0"/>
								<stop offset="1" stop-color="#167c08"/>
								</radialGradient>
							</defs>
						</svg>
					</div>
					<div className="fuel-box">
						<div className="box">
							<div
								className="fill"
								style={{
									height: `${this.fuelPercentage}%`,
								}}
							/>
							{/* <img
								className="empty"
								src={fuelWhiteIcon}
								alt="Empty container"
							/> */}
						</div>
						<img src={fuelIcon} alt="" />
					</div>
					<div className="middle">
						<div className="speed">
							<h1 className="speed-value">
								<span style={{ color: "grey" }}>{greyPart}</span>
								<span style={{ color: "white" }}>{whitePart}</span>
							</h1>
							<p className="unit">km/h</p>
						</div>
						<div className="controls">
							<div data-name="control-1" className="control">
								{this.state.strapped ? (
									<img
										style={{ width: 40, height: 25 }}
										src={beltActive}
										alt="Door Open"
									/>
								) : (
									<img
										style={{ width: 40, height: 25 }}
										src={beltUnactive}
										alt="Door Closed"
									/>
								)}
							</div>
							<div data-name="control-2" className="control">
								{this.state.headLight ? (
									<img src={lightActive} alt="Door Open" />
								) : (
									<img src={lightUnactive} alt="Door Closed" />
								)}
							</div>
							<div data-name="control-3" className="control">
								{this.state.locked ? (
									<img src={doorActive} alt="Door Open" />
								) : (
									<img className="ico" src={doorUnactive} alt="Door Closed" />
								)}
							</div>
							<div data-name="control-4" className="control">
								{this.state.engine ? (
									<img src={engineActive} alt="Door Open" />
								) : (
									<img className="ico" src={engineUnactive} alt="Door Closed" />
								)}
							</div>
						</div>
					</div>
					<div className="engine-box">
						<div className="box">
							<div
								className="fill"
								style={{
									height: `${this.engineHealthPercentage}%`,
								}}
							/>
							<img
								className="empty"
								src={engineWhiteIcon}
								alt="Engine health indicator"
							/>
						</div>
						<img src={engineRedIcon} alt="Engine icon" />
					</div>
				</div>
			</div>
		);
	}
}