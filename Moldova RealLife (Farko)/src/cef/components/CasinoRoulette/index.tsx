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
	mapWinIcon,
	mapWinMultiplier,
	mapWinName,
	redNumbers,
	ROULETTE_MAX_BETS,
	ROULETTE_TABLE_POSITIONS,
} from "../../../shared/casino/roulette";

export class CasinoRoulette extends Component<
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
			<section className="roulette-section-wrapper animated fadeIn">
				<div className="cg1-buttons-grid-left animated fadeInLeft waiteone">
					<div className="casino-button-info-item">
						<p className="cg1-keyboard mr24">
							{LangString(
								"components.CasinoRoulette.index.1540b3e7e501cd7233a7468f0c87560d",
							)}
						</p>
						<p>
							{LangString(
								"components.CasinoRoulette.index.72e76f0db5e376f3b3ff957fa7211d75",
							)}
						</p>
					</div>
					<div className="casino-button-info-item">
						<p className="cg1-keyboard">
							{LangString(
								"components.CasinoRoulette.index.703e856786dcc9b168cbd0691210fd91",
							)}
						</p>
						<p>
							{LangString(
								"components.CasinoRoulette.index.29c128aaf41086d3099efe57438e0eb9",
							)}
						</p>
					</div>
					<div className="casino-button-info-item">
						<p className="cg1-keyboard">
							{LangString(
								"components.CasinoRoulette.index.1c8ffd3ad71b06d6e829aac8856656f6",
							)}
						</p>
						<p>
							{LangString(
								"components.CasinoRoulette.index.f48b6c1f657d2b37202b9df231f6ad97",
							)}
						</p>
					</div>
					<div className="casino-button-info-item">
						<p className="cg1-keyboard">
							{LangString(
								"components.CasinoRoulette.index.a2ea28e7eb5c06004c8bde57b230d815",
							)}
						</p>
						<p>
							{LangString(
								"components.CasinoRoulette.index.d2ad53a2b6b5f0da35fce21bb2955ebc",
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
								"components.CasinoRoulette.index.2caffe94aa9d2242546d4db427efd934",
							)}
						</p>
					</div>
				</div>
				<div className="casino-balance">
					<p className="casino-mini-font mb24">
						{LangString(
							"components.CasinoRoulette.index.b86812941b94246f526d468821d2d094",
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
				{/* <div className="cg1-right-bottom-wrapper">
          <div className="cg1-up-down animated fadeInDown waitthree">
            <div className="casino-chips">
              <img src={png["chip"]} alt="" />
              <p>{system.numberFormat(this.state.bet)}</p>
            </div>
            <p className="casino-mini-font ml12">Ставка</p>
          </div>
        </div> */}
				<div className="cg-bottom-middle">
					<div>
						<p className="casino-mini-font ml12 mb8">
							{LangString(
								"components.CasinoRoulette.index.e492788a586e8dd6784eb27dc2a75662",
							)}
						</p>
						<div className="casino-chips">
							<img src={png["chip"]} alt="" />
							<p>{system.numberFormat(this.state.allbet)}</p>
						</div>
					</div>
					<div className="mid-line-count">
						<p className="casino-mini-font op4 mb8">
							{" "}
							{LangString(
								"components.CasinoRoulette.index.023204f346dcc9bd5047711b6a170932",
							)}{" "}
							<br />{" "}
							{LangString(
								"components.CasinoRoulette.index.031a5a5a7147b6abe35d51565dca8503",
							)}{" "}
						</p>
						<span>
							{Math.max(0, ROULETTE_MAX_BETS - this.state.allbetcount)}
						</span>
						<i></i>
					</div>
					<div>
						<p className="casino-mini-font ml12 mb8">
							{LangString(
								"components.CasinoRoulette.index.aca1613a8bcdb38ebb53782007b109fb",
							)}
						</p>
						<div className="casino-chips">
							<img src={png["chip"]} alt="" />
							<p>{system.numberFormat(this.state.bet)}</p>
						</div>
					</div>
				</div>
				<div className="cg-left-bottom">
					<div className="cg-maxandmin">
						<div className="casino-chips small">
							<img src={png["chip"]} alt="" />
							<p>
								{system.numberFormat(
									Math.min(...(this.table?.chipTypePrices || [0])),
								)}
							</p>
						</div>
						<p className="casino-mini-font op4">
							{LangString(
								"components.CasinoRoulette.index.c85a9fc7a0cc207ff0369819fa754617",
							)}
							<br />
							{LangString(
								"components.CasinoRoulette.index.7a5ef22d1c51665df8464436a76abb5f",
							)}
						</p>
					</div>
					<div className="cg-maxandmin">
						<div className="casino-chips small">
							<img src={png["chip"]} alt="" />
							<p>
								{system.numberFormat(
									Math.max(...(this.table?.chipTypePrices || [0])),
								)}
							</p>
						</div>
						<p className="casino-mini-font op4">
							{LangString(
								"components.CasinoRoulette.index.2e843bb974cf6246d545a07d9e23a3cb",
							)}
							<br />
							{LangString(
								"components.CasinoRoulette.index.71808f403532440fdc30820b6ff01960",
							)}
						</p>
					</div>
				</div>
				{this.state.seconds ? (
					<div className="animated zoomIn">
						<div className="cg-timer">
							<p className="casino-mini-font mb8">
								{LangString(
									"components.CasinoRoulette.index.89345172ed1b0603d90bb6c632bd9d7c",
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
				<div
					className={`cg-roulette-wintask ${this.state.showwin < 0 ? "loss" : ""} animated fadeInUp w`}
					style={{
						display: this.state.showwin ? "flex" : "none",
					}}
				>
					<p className="cg-r-win-title">
						<span>
							{this.state.showwin < 0
								? LangString(
										"components.CasinoRoulette.index.ccc9ff8643a5c6c58b73cad8f25973ce",
									)
								: LangString(
										"components.CasinoRoulette.index.b274790c7f62e1f9a150cf5d041ae086",
									)}
						</span>
						<br />
						{LangString(
							"components.CasinoRoulette.index.993463ff3c1dacf4aa8791d201a7c624",
						)}{" "}
						{this.state.showwin < 0
							? LangString(
									"components.CasinoRoulette.index.e6254ef41c9af103da6fd3e901881e29",
								)
							: LangString(
									"components.CasinoRoulette.index.52095cb102947897aa058ab94b62ff11",
								)}
						:
					</p>
					<div className="casino-chips large">
						<img src={png["chip"]} alt="" />
						<p>{system.numberFormat(Math.abs(this.state.showwin))}</p>
					</div>
				</div>
				{this.state.showhelp ? (
					<div className="modal-rules-roulette-wrapper">
						<div className="casino-button-info-item">
							<p>
								{LangString(
									"components.CasinoRoulette.index.df765521ae046cfe849a953b134cf137",
								)}
							</p>
							<p className="cg1-keyboard m0 ml12">
								{LangString(
									"components.CasinoRoulette.index.66f52c63b23350b9491c920d6915e889",
								)}
							</p>
						</div>
						<div className="modal-rules-roulette">
							<div>
								<p className="font32 fontw600 mb24">
									{LangString(
										"components.CasinoRoulette.index.73d1966a031f0abfda6527ad7f95342b",
									)}
									<br />
									{LangString(
										"components.CasinoRoulette.index.ab918d18352d7476c48b1bb11e3882dc",
									)}
								</p>
								<p className="font24 ln-1-4 fontw400">
									{LangString(
										"components.CasinoRoulette.index.10f9ac39eb4a52fefd21e5affcfe7405",
									)}
								</p>
							</div>
							<div>
								<p className="font32 fontw600 mb24">
									{LangString(
										"components.CasinoRoulette.index.30fc9960fc923f1ef86e71e423494a08",
									)}
								</p>
								<div className="rules-roulette-table">
									<div className="rr-t-line-hr">
										<div>
											<p className="op4 font16 fontw400">
												{LangString(
													"components.CasinoRoulette.index.4523c1f09dc0a8bc45058351b6008451",
												)}
											</p>
										</div>
										<div>
											<p className="op4 font16 fontw400">
												{LangString(
													"components.CasinoRoulette.index.545c1b05c18116eb17c30ece5296b9b3",
												)}
											</p>
										</div>
										<div>
											<p className="op4 font16 fontw400">
												{LangString(
													"components.CasinoRoulette.index.c05696cc3170446c4cc375e1a6685c85",
												)}
											</p>
										</div>
									</div>
									{Object.keys(mapWinName).map((key) => {
										const name = mapWinName[key];
										const desc = mapWinDesc[key];
										const icon = mapWinIcon[key];
										return (
											<div
												className="rr-t-line"
												key={`roulette_help_win_${key}`}
											>
												<div>
													<p className="font24 fontw400 strong-in">
														<strong>{name}</strong>
													</p>
												</div>
												<div>
													<p className="font24 fontw600">
														{mapWinMultiplier[key]}*X+X
													</p>
												</div>
												<div>
													<img src={png[icon]} alt="" />
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				) : (
					<></>
				)}
			</section>
		);
	}
}
