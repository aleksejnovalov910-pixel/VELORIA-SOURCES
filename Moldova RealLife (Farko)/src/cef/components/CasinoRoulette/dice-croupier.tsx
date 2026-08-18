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
import { system } from "../../modules/system";
import { CustomEvent } from "../../modules/custom.event";
import { CustomEventHandler } from "../../../shared/custom.event";
import { systemUtil } from "../../../shared/system";
import {
	mapWinDesc,
	mapWinMultiplier,
	mapWinName,
	redNumbers,
	ROULETTE_MAX_BETS,
	ROULETTE_TABLE_POSITIONS,
} from "../../../shared/casino/roulette";

export class CasinoDiceCroupier extends Component<
	{},
	{
		bet: number;
		allbet: number;
		allbetcount: number;
		seconds: number;
		tableId: number;
		show: boolean;
		showhelp: boolean;
		showwin: number;
		lastResults: number[];
	}
> {
	private readonly ev: CustomEventHandler;
	private readonly ev2: CustomEventHandler;
	private readonly ev3: CustomEventHandler;
	private readonly int: any;
	private int2: any;

	constructor(props: any) {
		super(props);
		this.state = {
			bet: 0,
			allbet: 0,
			allbetcount: 0,
			show: CEF.test,
			showhelp: false,
			showwin: 0,
			seconds: CEF.test ? 120 : 0,
			tableId: 0,
			lastResults: [0, 1, 2, 3, 4, 17, 18],
		};
		this.ev = CustomEvent.register(
			"casino:roulette:data",
			(
				bet: number,
				lastResults: number[],
				tableId: number,
				allbet: number,
				allbetcount: number,
			) => {
				this.setState({
					bet,
					show: true,
					lastResults,
					tableId,
					allbet,
					allbetcount,
				});
			},
		);
		this.ev2 = CustomEvent.register("casino:roulette:win", (sum: number) => {
			this.notifyWin(sum);
		});
		this.ev3 = CustomEvent.register(
			"casino:roulette:timer",
			(seconds: number) => {
				this.setState({ seconds });
			},
		);
		if (CEF.test) {
			setTimeout(() => {
				this.notifyWin(10000);
			}, 1000);
		}
		this.int = setInterval(() => {
			if (this.state.seconds > 0)
				this.setState({ seconds: this.state.seconds - 1 });
			if (CEF.test) {
				let lastResults = [...this.state.lastResults];
				lastResults.push(system.getRandomInt(0, 63));
				if (lastResults.length > 7) lastResults.splice(0, 1);
				this.setState({ lastResults });
			}
		}, 1000);
	}

	notifyWin(sum: number) {
		if (this.int2) clearTimeout(this.int2);
		this.setState({ showwin: sum });
		this.int2 = setTimeout(() => {
			this.setState({ showwin: 0 });
		}, 5000);
	}

	get table() {
		return ROULETTE_TABLE_POSITIONS[this.state.tableId];
	}

	componentWillUnmount() {
		if (this.ev) this.ev.destroy();
		if (this.ev2) this.ev2.destroy();
		if (this.ev3) this.ev3.destroy();
		if (this.int) clearInterval(this.int);
		if (this.int2) clearTimeout(this.int2);
		document.removeEventListener("keyup", this.handleKeyUp.bind(this));
	}

	componentDidMount() {
		document.addEventListener("keyup", this.handleKeyUp.bind(this));
	}

	handleKeyUp(ev: KeyboardEvent) {
		let keyCode = ev.keyCode;
		if (keyCode === 17) this.setState({ showhelp: !this.state.showhelp });
	}

	render() {
		if (!this.state.show) return <></>;
		return (
			<section className="dice-section-wrapper croupier-wrapper animated fadeIn">
				<div className="cg1-buttons-grid-left animated fadeInLeft waiteone">
					<div className="casino-button-info-item">
						<p className="cg1-keyboard mr24">
							{LangString(
								"components.CasinoRoulette.dice-croupier.26c7954956f9e975aab8a7ed856d56df",
							)}
						</p>
						<p>
							{LangString(
								"components.CasinoRoulette.dice-croupier.2f991ffc81af9dc3fccd22c5801cf34d",
							)}
						</p>
					</div>
					<div className="casino-button-info-item">
						<p className="cg1-keyboard">
							{LangString(
								"components.CasinoRoulette.dice-croupier.aaa842619696d3629663b6907eedae83",
							)}
						</p>
						<p>
							{LangString(
								"components.CasinoRoulette.dice-croupier.ec669a4efc7c057a713ac447530d0f46",
							)}
						</p>
					</div>
				</div>
				<div className="casino-balance">
					<p className="casino-mini-font mb24">
						{LangString(
							"components.CasinoRoulette.dice-croupier.af23ce8d4094c952649c18c3c76af186",
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
				{this.state.seconds ? (
					<div className="animated zoomIn">
						<div className="cg-timer">
							<p className="casino-mini-font mb8">
								{LangString(
									"components.CasinoRoulette.dice-croupier.722d246ded5f1dd469a85c8cc4422177",
								)}
							</p>
							<p className="casino-timer-font">
								{system.secondsToString(this.state.seconds)}
							</p>
						</div>
					</div>
				) : (
					<></>
				)}
				<div className="dice-players">
					<i className="fly-dice-shadow"></i>
					{/* Verschiedene Kartenzustände. Persönliche Karte des Spielers (wird nicht immer zuerst angezeigt, sondern zeigt an, wo die Person sitzt) */}
					<div className="dice-player-item dpi-active">
						<div className="dpi-timer">
							<div>
								{LangString(
									"components.CasinoRoulette.dice-croupier.35f30045f887b9391396da7d62ada6d8",
								)}
							</div>
							<div>
								{LangString(
									"components.CasinoRoulette.dice-croupier.90a8b3144958cbd47d474cd5820cc1e8",
								)}
							</div>
						</div>
						<div className="dpi-enter mb40">
							<div className="dice-my-img">
								<img src={svg["dice-3"]} alt="" />
							</div>
							<div className="dice-my-img">
								<img src={svg["dice-3"]} alt="" />
							</div>
						</div>
						<div className="dpi-name mb24">
							{LangString(
								"components.CasinoRoulette.dice-croupier.15964155adf9ce0d4a30ea5b4d32c526",
							)}
							<br />
							{LangString(
								"components.CasinoRoulette.dice-croupier.8b0c557b3d4af8754915af9a5a57e2b1",
							)}
						</div>
						<p className="casino-mini-font mb40">
							{LangString(
								"components.CasinoRoulette.dice-croupier.914e01b3aa778106a3ff383685277054",
							)}
						</p>
						<div className="dpi-bid animated fadeInDown">
							<div className="casino-chips small">
								<img src={png["chip"]} alt="" />
								<p>
									{LangString(
										"components.CasinoRoulette.dice-croupier.6b0dd6db4fcc4e9804029d0b7a29f36f",
									)}
								</p>
							</div>
						</div>
					</div>
					{/* Карточка другого игрока: Только пришел, не нажал играть принял игру */}
					<div className="dice-player-item green">
						<div className="dpi-enter mb40">
							<button className="dpi-button border" disabled>
								<p>
									{LangString(
										"components.CasinoRoulette.dice-croupier.30f4f000a8f52ff4834c6a742b335feb",
									)}
								</p>
							</button>
						</div>
						<div className="dpi-name mb24">
							{LangString(
								"components.CasinoRoulette.dice-croupier.81c8468e12444a37f92c0ecfa13a56a5",
							)}
							<br />
							{LangString(
								"components.CasinoRoulette.dice-croupier.c90e66c3453b2d69abef7dfe0c2abb41",
							)}
						</div>
						<p className="casino-mini-font mb40">
							{LangString(
								"components.CasinoRoulette.dice-croupier.2ae979fda16a07029f885d1c63bdd6a6",
							)}
						</p>
					</div>
					{/* Карточка другого игрока: нажал "Поставить" */}
					<div className="dice-player-item blue">
						<div className="dpi-enter mb40">
							<button className="dpi-button border to-success" disabled>
								<img src={svg["success"]} alt="" />
								<p>
									{LangString(
										"components.CasinoRoulette.dice-croupier.c5c9dcc42298d6b5fb109699917b336d",
									)}
								</p>
							</button>
						</div>
						<div className="dpi-name mb24">
							{LangString(
								"components.CasinoRoulette.dice-croupier.8c30a9d41498e818b2c346b36bf94aef",
							)}
							<br />
							{LangString(
								"components.CasinoRoulette.dice-croupier.bdcffc94ab95ecc73b39c643e05dc493",
							)}
						</div>
						<p className="casino-mini-font mb40">
							{LangString(
								"components.CasinoRoulette.dice-croupier.44f7a0d9733bb9532b88710fb81c03b4",
							)}
						</p>
						<div className="dpi-bid animated fadeInDown">
							<div className="casino-chips small">
								<img src={png["chip"]} alt="" />
								<p>
									{LangString(
										"components.CasinoRoulette.dice-croupier.9fbb71cf107a61f24c2a9341d8a83db4",
									)}
								</p>
							</div>
						</div>
					</div>
					{/* Карточка другого игрока: другой цвет (для варианта отображения на личной карточке появляется кнопка "Abbrechen") */}
					<div className="dice-player-item red">
						<div className="dpi-enter mb40">
							<button className="dpi-button border">
								<p>
									{LangString(
										"components.CasinoRoulette.dice-croupier.5ba26583a71c5fc583bdfc589f1a599b",
									)}
								</p>
							</button>
						</div>
						<div className="dpi-name mb24">
							{LangString(
								"components.CasinoRoulette.dice-croupier.3265f578b6b7560660249d8b082753e6",
							)}
							<br />
							{LangString(
								"components.CasinoRoulette.dice-croupier.2d5303ff06999a09f18e9b1e4df109a4",
							)}
						</div>
						<p className="casino-mini-font mb40">
							{LangString(
								"components.CasinoRoulette.dice-croupier.a50851a9b3e7b090ebb5512c36b7e0a4",
							)}
						</p>
						<div className="dpi-bid animated fadeInDown">
							<div className="casino-chips small">
								<img src={png["chip"]} alt="" />
								<p>
									{LangString(
										"components.CasinoRoulette.dice-croupier.2987e8337f3eabc8929ebe0a1ec4a1b8",
									)}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="croupier-enter-bid-wrapper">
					<p className="casino-mini-font mb40">
						{LangString(
							"components.CasinoRoulette.dice-croupier.3039cfa1d2bfe82ec58309a186d6b0fa",
						)}
					</p>
					<div className="croupier-enter-bid-grid mb40">
						<button>
							<div className="casino-chips">
								<img src={png["chip-green"]} alt="" />
								<p>100</p>
							</div>
						</button>
						<button>
							<div className="casino-chips">
								<img src={png["chip-pink"]} alt="" />
								<p>300</p>
							</div>
						</button>
						<button className="bid-enter">
							<div className="casino-chips">
								<img src={png["chip-red"]} alt="" />
								<p>500</p>
							</div>
						</button>
						<button>
							<div className="casino-chips">
								<img src={png["chip-white"]} alt="" />
								<p>
									{LangString(
										"components.CasinoRoulette.dice-croupier.af1c4b6d8067100a76e768b0dba71ded",
									)}
								</p>
							</div>
						</button>
						<button>
							<div className="casino-chips">
								<img src={png["chip-yellow"]} alt="" />
								<p>
									{LangString(
										"components.CasinoRoulette.dice-croupier.1e4a50d6938df1ed7b93ef022b735929",
									)}
								</p>
							</div>
						</button>
						<button>
							<div className="casino-chips">
								<img src={png["chip"]} alt="" />
								<p>
									{LangString(
										"components.CasinoRoulette.dice-croupier.56254ab1b0def6c6a1d2b91a2fae41f7",
									)}
								</p>
							</div>
						</button>
					</div>
					<button className="dpi-button">
						<p>
							{LangString(
								"components.CasinoRoulette.dice-croupier.6af81ff1b60710db129ec3ec36ed2723",
							)}
						</p>
					</button>
				</div>
				{/* WINTASK Появляется на 4 секунды и пропадает, можно попробовать добавить класс zoomOut после 4ех секунд */}
				<div className="dice-wintask-wrapper animated zoomIn">
					<i className="fly-win-lines">
						<img src={svg["win-lines"]} alt="" />
					</i>
					<div className="dice-wintask">
						<p className="dice-win-title">
							{LangString(
								"components.CasinoRoulette.dice-croupier.17de8864bcbfb03b26e77db52e88f11e",
							)}
							<br />
							<span>
								{LangString(
									"components.CasinoRoulette.dice-croupier.0047cbb00d3e2e9362631fb741ddd054",
								)}
							</span>
						</p>
						<div className="dice-win-size">
							<div className="casino-chips">
								<img src={png["chip"]} alt="" />
								<p>
									{LangString(
										"components.CasinoRoulette.dice-croupier.e6ea8a6c7c5b9efb350d9d05c847196b",
									)}
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="croupier-chips">
					<p className="casino-mini-font mb8">
						{LangString(
							"components.CasinoRoulette.dice-croupier.c7fd3f8c0bdefe1bf448c5311c69ffa6",
						)}
					</p>
					<div className="casino-chips">
						<img src={png["chip"]} alt="" />
						<p>
							{LangString(
								"components.CasinoRoulette.dice-croupier.cc9e5514a0fb7b6490d32a8a4e08411d",
							)}
						</p>
					</div>
				</div>
			</section>
		);
	}
}
