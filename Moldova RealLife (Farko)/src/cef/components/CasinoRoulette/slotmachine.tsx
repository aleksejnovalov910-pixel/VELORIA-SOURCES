import { LangString } from "../../modules/lang";
import React, { Component } from "react";
import "./buttons.less";
import { CEF } from "../../modules/CEF";
const png = Object.fromEntries(
	Object.entries(import.meta.glob("./assets/img/*.png", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.png$/)[1];
			return [name, value.default];
		},
	),
);
const svg = Object.fromEntries(
	Object.entries(import.meta.glob("./assets/img/*.svg", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.svg$/)[1];
			return [name, value.default];
		},
	),
);
const gif = Object.fromEntries(
	Object.entries(import.meta.glob("./assets/img/*.gif", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.gif$/)[1];
			return [name, value.default];
		},
	),
);
import { system } from "../../modules/system";
import { CustomEvent } from "../../modules/custom.event";
import { CustomEventHandler } from "../../../shared/custom.event";
import { systemUtil } from "../../../shared/system";
import { CASINO_SLOT_BETS_LIST } from "../../../shared/casino/slots";

export class SlotMachine extends Component<
	{},
	{
		bet: number;
	}
> {
	private readonly ev: CustomEventHandler;
	private readonly ev2: CustomEventHandler;
	private readonly ev3: CustomEventHandler;
	private readonly int: any;
	private int2: any;

	constructor(props: any) {
		super(props);
		this.state = { bet: 0 };
		this.ev = CustomEvent.register("casino:slots:data", (bet: number) =>
			this.setState({ bet }),
		);
		this.ev2 = CustomEvent.register("cef:hud:setMoney", (money: number) =>
			this.setState({ ...this.state }),
		);
		this.ev3 = CustomEvent.register("cef:hud:setChips", (money: number) =>
			this.setState({ ...this.state }),
		);
	}

	componentWillUnmount() {
		if (this.ev) this.ev.destroy();
		if (this.ev2) this.ev2.destroy();
		if (this.ev3) this.ev3.destroy();
	}

	increaseBet() {
		CustomEvent.triggerClient("casino:slotmachine:changeBet", true);
	}

	decreaseBet() {
		CustomEvent.triggerClient("casino:slotmachine:changeBet", false);
	}

	render() {
		if (!this.state.bet) return <></>;
		return (
			<section className="slot-section-wrapper animated fadeIn">
				<div className="cg1-buttons-grid-left animated fadeInLeft waiteone">
					<div className="casino-button-info-item">
						<p className="cg1-keyboard mr24">
							{LangString(
								"components.CasinoRoulette.slotmachine.0d0e1bf6a9016f0377050bcabb03ce50",
							)}
						</p>
						<p>
							{LangString(
								"components.CasinoRoulette.slotmachine.872cb68183d868ea662b693864862384",
							)}
						</p>
					</div>
					<div className="casino-button-info-item">
						<p className="cg1-keyboard">
							{LangString(
								"components.CasinoRoulette.slotmachine.a111da90f23109142c65ffc975a5ba37",
							)}
						</p>
						<p>
							{LangString(
								"components.CasinoRoulette.slotmachine.0d1388490d11f6b564664ed618e02f91",
							)}
						</p>
					</div>
					<div className="casino-button-info-item">
						<p className="cg1-keyboard">
							{LangString(
								"components.CasinoRoulette.slotmachine.5fc3eea65e9bc0cf9e566e4b2a7c78c7",
							)}
						</p>
						<p>
							{LangString(
								"components.CasinoRoulette.slotmachine.4954ecd19f8c05a5e5fd55ad670fec1b",
							)}
						</p>
					</div>
					<div className="casino-button-info-item">
						<p className="cg1-keyboard cube mr8">
							<img src={svg["cg1-up"]} alt="" />
						</p>
						<p className="cg1-keyboard cube mr16">
							<img src={svg["cg1-down"]} alt="" />
						</p>
						<p>
							{LangString(
								"components.CasinoRoulette.slotmachine.8d49170ed212d8d3bbc3ebe7e311dae2",
							)}
						</p>
					</div>
				</div>

				<div className="cg1-middle-bottom-wrapper">
					<div className="cg1-up-down animated fadeInDown waitthree">
						<p className="casino-mini-font mr12">
							{LangString(
								"components.CasinoRoulette.slotmachine.3b9bfca23ee6db214a6e55fcc1375c2c",
							)}
						</p>
						<div className="casino-chips mr24">
							<img src={png["chip"]} alt="" />
							<p>{system.numberFormat(this.state.bet)}</p>
						</div>
						<div className="cg1-but-icon">
							<img
								src={svg["cg1-down"]}
								alt=""
								onClick={() => this.decreaseBet()}
							/>
						</div>
						<div className="cg1-but-icon">
							<img
								src={svg["cg1-up"]}
								alt=""
								onClick={() => this.increaseBet()}
							/>
						</div>
					</div>
					<button className="casino-game-main-button animated fadeInDown waittwo">
						<p>
							{LangString(
								"components.CasinoRoulette.slotmachine.21fb53c247dc2833669e871e5f63f9cb",
							)}
							<small>
								{LangString(
									"components.CasinoRoulette.slotmachine.388e4e4950e521f30c56afabd56ae7c7",
								)}
							</small>
						</p>
						<span>
							<i>
								<img src={svg["circle-lines"]} className="rotation360" alt="" />
							</i>
						</span>
						<img src={gif["blink"]} alt="" />
					</button>
				</div>

				<div className="casino-balance">
					<p className="casino-mini-font mb24">
						{LangString(
							"components.CasinoRoulette.slotmachine.73bacb2a6751d55f929a56180159c749",
						)}
					</p>
					<div className="casino-chips large mb24">
						<img src={png["chip"]} alt="" />
						<p>{systemUtil.numberFormat(CEF.user.chips)}</p>
					</div>
					<p className="cgc-count-buy">
						${systemUtil.numberFormat(CEF.user.money)}
					</p>
				</div>
			</section>
		);
	}
}
