import { LangString } from "../../modules/lang";
import React, { Component } from "react";
import { CustomEvent } from "../../modules/custom.event";
import "./assets/style.less";
import "./assets/style.scss";

const svg = Object.fromEntries(
	Object.entries(import.meta.glob("./assets/*.svg", { eager: true })).map(
		([key, value] : [string, any]) => {
			const name = key.match(/\/([^/]+)\.svg$/)[1];
			return [name, value.default];
		},
	),
);
const png = Object.fromEntries(
	Object.entries(import.meta.glob("./assets/png/*.png", { eager: true })).map(
		([key, value] : [string, any]) => {
			const name = key.match(/\/([^/]+)\.png$/)[1];
			return [name, value.default];
		},
	),
);
import { CustomEventHandler } from "../../../shared/custom.event";
import { systemUtil } from "../../../shared/system";
import { CaptureType } from "../../../shared/deathmatch";

const MAX_KILL_LIST = 5;

export class Capture extends Component<{}, CaptureType> {
	private ev: CustomEventHandler;
	private ev2: CustomEventHandler;
	private ev3: CustomEventHandler;
	timer: any;
	constructor(props: any) {
		super(props);
		this.state = {
			show: false,
			capture: [
				{
					name: LangString(
						"components.Capture.index.339b18df3da3b1093834e3b9a333a93a",
					),
					image: "f8",
					score: 0,
				},
				{ name: "LCN", image: "f9", score: 0 },
			],
			killist: [{ killer: "Player Name", killed: "Player Name" }],
			time: 120,
			type: LangString(
				"components.Capture.index.27ac5d41486d9c6d1773713483339199",
			),
			start: false,
		};

		(this.ev = CustomEvent.register("capture:update", (data: CaptureType) => {
			if (data.show === true && this.state.show === false) {
				// Анимация при старте
				data.start = true;
				setTimeout(() => {
					this.setState({ ...this.state, start: false });
				}, 3000);
			}
			this.setState({ ...this.state, ...data });
		})),
			(this.ev2 = CustomEvent.register(
				"capture:kill",
				(
					killer: string,
					killed: string,
					team1: number,
					team2: number,
					time: number,
				) => {
					let killist = this.state.killist;
					let capture = this.state.capture;
					capture[0].score = team1;
					capture[1].score = team2;
					killist.push({ killer, killed });
					let tm = typeof time === "number" ? time : this.state.time;
					this.setState({ killist, capture, time: tm });
				},
			));
		this.ev3 = CustomEvent.register("capture:stop", () => {
			this.setState({ show: false });
		});
	}
	componentDidMount = () => {
		this.timer = setInterval(() => {
			if (this.state.time > 0) this.setState({ time: this.state.time - 1 });
		}, 1000);
	};
	componentWillUnmount = () => {
		if (this.ev) this.ev.destroy();
		if (this.ev2) this.ev2.destroy();
		if (this.ev3) this.ev3.destroy();
		if (this.timer) clearInterval(this.timer);
	};

	render() {
		if (!this.state.show) return <></>;
		return (
			<div className="section-fight">
				<div className={`capture_start${this.state.start ? " show" : ""}`}>
					<img src={png["capt2"]} alt="" />
					<img className="capture_img" src={png["capt1"]} alt="" />
					<h1>{this.state.type}</h1>
				</div>
				<div className="killist-wrapper">
					<ul>
						{this.state.killist
							? this.state.killist.map((d, id) => {
								if (id < this.state.killist.length - MAX_KILL_LIST)
									return null;
								return (
									<li className="animated fadeInRight" key={id}>
										<p>{d.killer}</p>
										<i></i>
										<p>{d.killed}</p>
									</li>
								);
							})
							: null}
					</ul>
				</div>			

				<div className="hud-warr-box animated fadeIn">
					<div className="hud-warr">
						<div className="team">
							<h1>{this.state.capture[0].name}</h1>
							<div className="team-details">
								<div className="deaths">
									<img src={png["deths"]} alt="" />
									<h2>{this.state.capture[0].score}</h2>
								</div>
								{/* <div className="players">
									<img src={png["players"]} alt="" />
									<h2>12</h2>
								</div> */}
							</div>
						</div>
						<img className="team-logo" src={png[`${this.state.capture[0].image}`]} alt="" />
						<div className="middle">
							<img src={png["triangle-1"]} alt="" />
							<img src={png["triangle-2"]} alt="" />
							<h1>{systemUtil.secondsToString(this.state.time)}</h1>
						</div>
						<img className="team-logo" style={{ marginLeft: "-3.704vh" }} src={png[`${this.state.capture[1].image}`]} alt="" />
						<div className="team away">
							<h1>{this.state.capture[1].name}</h1>
							<div className="team-details">
								<div className="deaths">
									<img src={png["deths"]} alt="" />
									<h2>{this.state.capture[1].score}</h2>
								</div>
								{/* <div className="players">
									<img src={png["players"]} alt="" />
									<h2>0</h2>
								</div> */}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export class CaptureMinimal extends Component<
	{},
	{ show: boolean; killist: { killer: string; killed: string }[] }
> {
	private ev: CustomEventHandler;
	private ev2: CustomEventHandler;

	constructor(props: any) {
		super(props);
		this.state = {
			show: false,
			killist: [],
		};

		this.ev = CustomEvent.register("captureMinimal:show", (show: boolean) => {
			this.setState({ show, killist: [] });
		});
		this.ev2 = CustomEvent.register(
			"captureMinimal:kill",
			(killer: string, killed: string) => {
				let killist = this.state.killist;
				killist.push({ killer, killed });
				this.setState({ killist });
			},
		);
	}

	componentWillUnmount = () => {
		if (this.ev) this.ev.destroy();
		if (this.ev2) this.ev2.destroy();
	};

	render() {
		if (!this.state.show) return <></>;
		return (
			<div className="section-fight">
				<div className="killist-wrapper">
					<ul>
						{this.state.killist
							? this.state.killist.map((d, id) => {
								if (id < this.state.killist.length - MAX_KILL_LIST)
									return null;
								return (
									<li className="animated fadeInRight" key={id}>
										<p>{d.killer}</p>
										<i></i>
										<p>{d.killed}</p>
									</li>
								);
							})
							: null}
					</ul>
				</div>
			</div>
		);
	}
}
