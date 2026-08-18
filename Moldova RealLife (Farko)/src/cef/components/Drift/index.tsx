import { LangString } from "../../modules/lang";
import React, { Component } from "react";
import { CustomEvent } from "../../modules/custom.event";
import "./style.less";
import { CEF } from "../../modules/CEF";
import svgClose from "../UserMenu/assets/svg/close.svg";
const svg = Object.fromEntries(
	Object.entries(import.meta.glob("./images/*.svg", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.svg$/)[1];
			return [name, value.default];
		},
	),
);
import Draggable from "react-draggable";
// @ts-ignore
import ProgressBar from "progressbar.js";
import { system } from "../../modules/system";
import { SocketSync } from "../SocketSync";

export class DriftCounterScreen extends Component<
	{},
	{
		status: boolean;
		score: number;
		multiple: number;
		text: string[];
		data?: {
			my: [number, number];
			today: { name: string; score: number }[];
			alltime: [string, number][];
		};
	}
> {
	progress: any;
	constructor(props: any) {
		super(props);
		this.state =
			CEF.test && location.href.includes("=hud")
				? { score: 0, multiple: 10, text: ["asf"], status: false }
				: { score: 0, multiple: 0, text: [], status: false };

		setTimeout(() => {
			CustomEvent.register(
				"drift:score",
				(score: number, multiple: number, text: string[]) => {
					this.setState({ score, multiple, text });
				},
			);
			CustomEvent.register("driftmap", (status) => {
				this.setState({ status });
			});
		}, 5000);

		// if(CEF.test && (location.href.includes("=hud"))){
		//     setInterval(() => {
		//         this.setState({score: this.state.score + 100})
		//     }, 1000)
		// }
	}

	componentDidUpdate() {}

	render() {
		return (
			<>
				<section className="section-driftmod-wrapper">
					{this.state.score ? (
						<div className="drift-counter-wrap">
							<div className="drift-x animated flipInX">
								x{this.state.multiple.toFixed(1)}
							</div>
							<div className="drift-size">
								{system.numberFormat(this.state.score)}
							</div>
							<div className="drift-styles">
								{this.state.text.map((text, i) => {
									return (
										<div className="" key={`drift_text_${i}`}>
											<p>{text}</p>
										</div>
									);
								})}
							</div>
						</div>
					) : (
						<></>
					)}
					{this.state.status ? (
						<SocketSync
							path={"drift:hud"}
							data={(e) => {
								const data = JSON.parse(e);
								this.setState({ data });
							}}
						>
							{this.state.data ? (
								<div className="drift-reputation">
									<div className="drift-reputation-box first-large">
										<p className="drift-r-title">
											{LangString(
												"components.Drift.index.9ab40ba9c2b93a384d49fcfa20378eb1",
											)}{" "}
											<strong>
												{LangString(
													"components.Drift.index.2c6485cf6313121f8ef1f4fe7912d0db",
												)}
											</strong>
										</p>
										<div className="drift-r-text">
											<p>{CEF.user.name}</p>
											<img src={svg["star"]} alt="" />
										</div>
										<div className="drift-r-text">
											<div className="bage">
												<small>
													{LangString(
														"components.Drift.index.7286676c2d15932300476b2375b79123",
													)}
												</small>{" "}
												{system.numberFormat(this.state.data.my[1])}
											</div>
											<div className="bage ml18">
												<small>
													{LangString(
														"components.Drift.index.819170505b7c3fa1157d4fcf40a9fda1",
													)}
												</small>{" "}
												{system.numberFormat(this.state.data.my[0])}
											</div>
										</div>
									</div>
									<div className="drift-reputation-box">
										<p className="drift-r-title">
											{LangString(
												"components.Drift.index.1e5350bfcc80bd7fd072343b309a62f9",
											)}{" "}
											<strong>
												{LangString(
													"components.Drift.index.bf08ae8722a8a332edbe8fdb254110f6",
												)}
											</strong>
										</p>
										{this.state.data.today.map((q, i) => {
											return (
												<div key={`today_${i}`} className="drift-r-text">
													<p>{q.name}</p>
													<div className="bage">
														{system.numberFormat(q.score)}
													</div>
												</div>
											);
										})}
									</div>
									<div className="drift-reputation-box">
										<p className="drift-r-title">
											{LangString(
												"components.Drift.index.414e52610ead2671736a1e7941650b22",
											)}{" "}
											<strong>
												{LangString(
													"components.Drift.index.0adfd3bd7cb3607d68a31c8574a22e0f",
												)}
											</strong>
										</p>
										{this.state.data.alltime.map((q, i) => {
											return (
												<div key={`all_${i}`} className="drift-r-text">
													<p>{q[0]}</p>
													<div className="bage">
														{system.numberFormat(q[1])}
													</div>
												</div>
											);
										})}
									</div>
								</div>
							) : (
								<></>
							)}
						</SocketSync>
					) : (
						<></>
					)}
				</section>
			</>
		);
	}
}

export class DriftScreen extends Component<
	{},
	{
		block: boolean;
		show: boolean;
		ids?: number;
		status?: boolean;
		angle?: number;
		speed?: number;
	}
> {
	constructor(props: any) {
		super(props);
		this.state = {
			show: false,
			block: false,
		};

		setTimeout(() => {
			CustomEvent.register(
				"drift:setting",
				(driftData: {
					ids: number;
					status: boolean;
					angle: number;
					speed: number;
				}) => {
					this.setState({ ...driftData, show: true });
					CEF.gui.enableCusrsor();
				},
			);
		}, 5000);
	}

	componentDidMount() {
		document.addEventListener("keydown", this.handleKeyDown.bind(this));
	}
	componentWillUnmount() {
		document.removeEventListener("keydown", this.handleKeyDown.bind(this));
	}

	handleKeyDown(ev: KeyboardEvent) {
		if (this.state.block) return;
		if (!this.state.show) return;
		if (!this.state.status) return;
		const key: number = ev.keyCode;
		// W 38
		// S 40
		// A 37
		// D 39

		let { ids, status, angle, speed } = this.state;

		if (key === 38) {
			angle = Math.min(angle + 5, 100);
		}
		if (key === 40) {
			angle = Math.max(angle - 5, 0);
		}
		if (key === 39) {
			speed = Math.min(speed + 5, 100);
		}
		if (key === 37) {
			speed = Math.max(speed - 5, 0);
		}
		if (angle === this.state.angle && speed === this.state.speed) return;

		this.setState({ angle, speed, block: true }, () => {
			CustomEvent.triggerServer("drift:set", { ids, status, angle, speed });
			setTimeout(() => {
				this.setState({ block: false });
			}, 200);
		});
	}

	render() {
		if (!this.state.show) return <></>;
		return (
			<Draggable handle="#driftHeader">
				<div className="driftmod-box">
					<i
						className="driftmod-box-close-button"
						onClick={(e) => {
							this.setState({ show: false });
							CEF.gui.disableCusrsor();
						}}
					>
						<img src={svgClose} alt="" />
					</i>
					<h2 id={"driftHeader"}>
						{LangString(
							"components.Drift.index.29b3d7d41281eb188064b07b83adfbe5",
						)}
						<br />
						{LangString(
							"components.Drift.index.0a7847aa1016e4ce1170da62c16dc36e",
						)}
					</h2>
					<div className="switch-wrapper flex-line mb16">
						<div className="switch-wrap">
							<input
								type="checkbox"
								id="switchCheck"
								checked={!!this.state.status}
								onChange={(e) => {
									e.preventDefault();
									let { ids, status, angle, speed } = this.state;
									status = !status;
									this.setState({ status }, () => {
										setTimeout(() => {
											this.setState({ status });
										}, 100);
									});
									CustomEvent.triggerServer("drift:set", {
										ids,
										status,
										angle,
										speed,
									});
								}}
							/>
							<label htmlFor="switchCheck" />
						</div>
						<p className="title ml8">
							<span style={{ whiteSpace: "nowrap" }}>
								{LangString(
									"components.Drift.index.570339c0eae6de648a4d249dce452d34",
								)}
							</span>
						</p>
					</div>
					<div className="driftmod-buttons flex-line">
						<div>
							<img src={svg["arrow-mini-white-top"]} alt="" />
						</div>
						<div>
							<img src={svg["arrow-mini-white-bottom"]} alt="" />
						</div>
						<div>
							<img src={svg["arrow-mini-white-left"]} alt="" />
						</div>
						<div>
							<img src={svg["arrow-mini-white-right"]} alt="" />
						</div>
						<p>
							{LangString(
								"components.Drift.index.e746d33caee177c390ac71afbb9c3d17",
							)}
						</p>
					</div>
					<div className="drift-grid-wrap">
						<p>
							{LangString(
								"components.Drift.index.16c501bad050b1e37daf6449a0e1cd9c",
							)}
						</p>
						<p>
							{LangString(
								"components.Drift.index.a3136c3b97236c549663554c62374398",
							)}
						</p>
						<div className="drift-grid">
							<div
								className="drift-mod-regulator"
								style={{
									bottom: `${this.state.angle}%`,
									left: `${this.state.speed}%`,
								}}
							/>
							<img src={svg["drift-grid"]} alt="" />
						</div>
					</div>
				</div>
			</Draggable>
		);
	}
}
