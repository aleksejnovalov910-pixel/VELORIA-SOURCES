import { LangString } from "../../modules/lang";
import React, { Component } from "react";
import { CustomEvent } from "../../modules/custom.event";

import "./assets/style.scss";
import exit from "./assets/img/exit.svg";
import moneyIcon from "./assets/img/money.png";
import chipsIcon from "./assets/img/chips.png";
import characterImg from "./assets/img/character.png";


import { CustomEventHandler } from "../../../shared/custom.event";
import { systemUtil } from "../../../shared/system";
import { CEF } from "../../modules/CEF";
import {
	CASINO_BUY_CHIPS_INTERFACE,
	CHIP_COST,
	CHIP_MIN_SELL,
	CHIP_SELL_COST,
} from "../../../shared/casino/main";
import { system } from "../../modules/system";

type CasinoType = {
	buyModal: number;
	sellCoins: number;
	sellPrice: number;
	bet: number;
};

/** Шаг ставки рулетки */
const BET_UP = 100;

export class Casino extends Component<{}, CasinoType> {
	private readonly ev2: CustomEventHandler;
	private readonly ev3: CustomEventHandler;
	private containerRef: React.RefObject<HTMLDivElement>;

	constructor(props: any) {
		super(props);
		this.state = {
			buyModal: 0,
			sellCoins: 0,
			sellPrice: 0,
			bet: 0,
		};

		this.ev2 = CustomEvent.register("cef:hud:setMoney", (money: number) =>
			this.setState({ ...this.state }),
		);
		this.ev3 = CustomEvent.register("cef:hud:setChips", (money: number) =>
			this.setState({ ...this.state }),
		);

		this.containerRef = React.createRef();
		this.adjustZoom = this.adjustZoom.bind(this);
	}

	componentDidMount() {
		this.adjustZoom();
		window.addEventListener("resize", this.adjustZoom);
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.adjustZoom);
		if (this.ev2) this.ev2.destroy();
		if (this.ev3) this.ev3.destroy();
	}


	adjustZoom() {
		const container = this.containerRef.current;
		if (container) {
			const zoomCountOne = window.innerWidth / 1920;
			const zoomCountTwo = window.innerHeight / 1080;

			if (zoomCountOne < zoomCountTwo) {
				container.style.zoom = zoomCountOne.toString();
			} else {
				container.style.zoom = zoomCountTwo.toString();
			}
		}
	}

	buyCoin = (coins: number) => {
		if (!coins) return this.setState({ buyModal: 0 });
		const cost = CHIP_COST * coins;
		if (cost > CEF.user.money)
			return CEF.alert.setAlert(
				"error",
				LangString("components.Casino.index.fce6200fcebc28d7f1502ac671b2aca0"),
			);
		this.setState({ buyModal: 0 });
		CustomEvent.callServer("casino:chips:buy", coins);
	};

	sellCoin = (coins: number) => {
		if (coins > CEF.user.chips)
			return CEF.alert.setAlert(
				"error",
				LangString("components.Casino.index.1ca5e04aeb2822b9d1ac322873a3bf31"),
			);
		if (coins < CHIP_MIN_SELL)
			return CEF.alert.setAlert(
				"error",
				LangString(
					"components.Casino.index.3dd559ae3e78196b41bf637e5fd1ebf5",
					CHIP_MIN_SELL,
				),
			);
		CustomEvent.callServer("casino:chips:sell", coins);
	};
	render() {
		return (
			<div className="casino-container-box">
				<div className="casino-box" ref={this.containerRef}>
					<div className="casino-exit">
						<p>Exit</p>
						<div className="exit-img" onClick={() => CEF.gui.setGui(null)}>
							<img src={exit} alt="Exit" />
						</div >
					</div>
					<img className="character-img" src={characterImg} alt="" />
					<div className="chips">
						<div className="buy-chips">
							<div className="top">
								<div className="title">
									<h1>
										{LangString(
											"components.Casino.index.c6c637ee39aa81e966efedc83342a161",
										) + ' '}
										<span>
											{LangString(
												"components.Casino.index.0677c2a278928f2aaf461b74ba4860be",
											)}
										</span>
									</h1>
									<p>Alege numarul de jetoane pe care vrei sa le cumperi</p>
								</div>
								<div className="balance">
									<h1>{LangString(
										"components.Casino.index.74f0655609ddf643e6465b7b1eb6cedf",
									)}</h1>
									<div className="balance-box">
										<img src={chipsIcon} alt="" />
										<h2>{systemUtil.numberFormat(CEF.user.chips)}</h2>
									</div>
									<div className="balance-box">
										<img src={moneyIcon} alt="" />
										<h2>{systemUtil.numberFormat(CEF.user.money)}</h2>
									</div>
								</div>
							</div>
							<div className="buy-sell">
								<div className="buy-sell-box">
									<h1>{LangString(
										"components.Casino.index.c6c637ee39aa81e966efedc83342a161"
									)}</h1>
									<div className="math">
										<h2>1</h2>
										<img src={chipsIcon} alt="" />
										<h3>= $ {CHIP_COST}</h3>
									</div>
								</div>
								<div className="buy-sell-box">
									<h1>
										{LangString(
											"components.Casino.index.794ddbb395b28065767c4ee61e1b4fe8"
										)}
									</h1>
									<div className="math">
										<h2>1</h2>
										<img src={chipsIcon} alt="" />
										<h3>= $ {CHIP_SELL_COST}</h3>
									</div>
								</div>
							</div>
							<div className="offers">
								{CASINO_BUY_CHIPS_INTERFACE.map((item) => (
									<div className="offer">
										<div className="offer-qty">
											<img src={chipsIcon} alt="" />
											<h1>{item.count}</h1>
										</div>
										<div className="offer-price">
											<h1>$ {systemUtil.numberFormat(item.count * CHIP_COST)}</h1>
											<button
												type="button"
												onClick={() => this.buyCoin(item.count)}
											>{LangString(
												"components.Casino.index.c6c637ee39aa81e966efedc83342a161",
											)}</button>
										</div>
									</div>
								))}
							</div>
						</div>
						<div className="sell-chips">
							<div className="title">
								<h1>
									{LangString(
										"components.Casino.index.794ddbb395b28065767c4ee61e1b4fe8",
									)}
									<span>{" "}
										{LangString(
											"components.Casino.index.a3b0f78f01d1dda62d262a3158f0e52c",
										)}
									</span>
								</h1>
							</div>
							<p>
								{LangString(
									"components.Casino.index.9d642ff304338dd61ab19fa645f8d894",
								)}
							</p>
							<div className="controls">
								<div className="element">
									<img src={chipsIcon} alt="" />
									<input
										type="number"
										value={this.state.sellCoins > 0 ? this.state.sellCoins : ""}
										placeholder="000 000"
										onChange={(e: any) => {
											if (
												e.target.valueAsNumber < 0 ||
												e.target.valueAsNumber >= 999999
											)
												return;
											if (e.target.valueAsNumber > CEF.user.chips)
												e.target.valueAsNumber = CEF.user.chips;
											this.setState({
												sellCoins: e.target.valueAsNumber,
												sellPrice: e.target.valueAsNumber * CHIP_SELL_COST,
											});
										}}
									/>
								</div>
								<div className="element">
									<img src={moneyIcon} alt="" />
									<h1>{this.state.sellPrice > 0 ? this.state.sellPrice : "0"}</h1>
								</div>
								<button
									type="button"
									onClick={() => this.sellCoin(this.state.sellCoins)}
								>
									{LangString(
										"components.Casino.index.25ecdc830328402b1db2f6b8cecd44b9",
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
