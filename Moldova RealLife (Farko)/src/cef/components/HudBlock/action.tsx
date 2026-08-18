import { LangString } from "../../modules/lang";
import "./action.scss";
import React, { Component } from "react";


import { CustomEvent } from "../../modules/custom.event";
import { CustomEventHandler } from "../../../shared/custom.event";
import "../../assets/less/animate.less";
import "../../assets/less/uikit.less";
import coin from "./images/svg/coin.svg";
import { CEF } from "../../modules/CEF";
import actionBg from "./images/coins-action.png";
export class HudActions extends Component<
	{},
	{
		show: boolean;
		actions?: Array<{
			type: number;
			time: number;
			desc?: string;
			amount?: number;
			pic: string;
		}>;
		current: number;
		notShow: boolean;
	}
> {
	ev: CustomEventHandler;
	timer: NodeJS.Timeout;
	constructor(props: any) {
		super(props);

		this.state = {
			show: false,
			notShow: false,
			actions: [
				{type:0, time: 5, desc: 'Акция действительна с 14:00 до 23:00', amount: 200, pic: 'coins-action' },
				{type:1, time: 20, desc:'Mercedes W140', pic: 'car-action' }
			],
			current: 0,
		};
		this.ev = CustomEvent.register(
			"hud:actions",
			(
				list: {
					type: number;
					time: number;
					desc?: string;
					amount?: number;
					pic: string;
				}[],
			) => {
				this.setState({
					...this.state,
					show: true,
					current: 0,
					actions: list,
					notShow: false,
				});
				CEF.gui.enableCusrsor();
			},
		);
	}

	componentWillUnmount() {
		if (this.ev) this.ev.destroy();
	}
	render() {
		if (this.state.show === false) return null;
		if (!this.state.actions.length) return null;
		let cur = this.state.current;

		return (
			<div className="bonus-box-container-box">
				<div className="bonus-box-box">
					<div className="bonus-box">
						<div className="left">
							<img src={actionBg} alt="" />
							<h1>{this.state.actions[cur].amount || 0} Coins</h1>
						</div>

						<div className="right">
							<div className="right-top">
								{this.state.actions[cur].type === 0 ? (
									<>
										<h1>
											{LangString(
												"components.HudBlock.action.d16c18413e0cf5238d29bef69cdc41a4",
											)}<span>
												{" " + this.state.actions[cur].time + " "}

												{LangString(
													"components.HudBlock.action.ab7ff89fb33a2fab3c1bd2792102b2bb"
												)}

											</span> 
											<br />

										    SI PRIMESTI 
											<span>{" " + this.state.actions[cur].amount + " "}
												{LangString(
													"components.HudBlock.action.945e1ec09a4354a145e27ac99d155e3c",
												)}</span>

										</h1>


									</>

								) : null}

								{this.state.actions[cur].type === 1 ? (
									<h1>
										{LangString(
											"components.HudBlock.action.ad3ce1aee78ed52d5435749f580a86f9",
										)}{" "}
										<span>
											{this.state.actions[cur].time + " "}
											{LangString(
												"components.HudBlock.action.ab7ff89fb33a2fab3c1bd2792102b2bb",
											)}
										</span>
									</h1>
								) : null}
								<p>
									{this.state.actions[cur].type === 0 ? (
										<>
											{this.state.actions[cur].desc}
											<br />
											{LangString(
												"components.HudBlock.action.96e5b5ab8e73aa33ea371b261e079d0e",
											)}{" "}
											<strong>M</strong>
										</>

									) : null}
									{this.state.actions[cur].type === 1 ? (
										<>
											{LangString(
												"components.HudBlock.action.d293a4f23b7b9bdd1ffd987c5ac746ed",
											)}{" "}
											<strong>{this.state.actions[cur].desc}</strong>
											{LangString(
												"components.HudBlock.action.73d01afd354a1f591e02d10b37acfbed",
											)}
											<br />
											{LangString(
												"components.HudBlock.action.bd4c8c64eb57219fcaed632f7cf61686",
											)}{" "}
											<strong>M</strong>
										</>

									) : null}
								</p>
							</div>
							<div className="right-controls">
								<button type="button"
									onClick={() => {
										if (this.state.notShow)
											CustomEvent.triggerServer(
												"wintaskevent:setnotshow",
												this.state.actions[cur].type,
											);
										if (this.state.actions.length <= cur + 1) {
											this.setState({ show: false });
											CEF.gui.disableCusrsor();
										} else {
											this.setState({ current: cur + 1, notShow: false });
										}
									}}
								>
									{LangString(
										"components.HudBlock.action.d7fd989fb6cfb27d5348ed903a4d8ecd",
									)}
								</button>

								<div className="dont-show">
									<div
										className={`dont-show-box ${this.state.notShow ? "show-more" : ""}`}
										onClick={(e) => {
											e.preventDefault();
											this.setState({ notShow: !this.state.notShow });
										}}
									>
										<div className="dont-show-circle"></div>
									</div>
									<h3>
										{LangString(
											"components.HudBlock.action.2097edc30f16fe0b6d41b09474b0b2b1",
										)}
									</h3>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div >
		)		
	}
}
