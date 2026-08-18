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
import Draggable from "react-draggable";
import {
	DICE_PLAY_COUNT,
	DICE_PLAY_START_TIME,
	DICE_PLAY_TIME,
	DICE_TABLES_LIST,
	DiceData,
	DicePlayer,
	getDiceBetClassName,
} from "../../../shared/casino/dice";
import { SocketSync } from "../SocketSync";
type rollSide = "front" | "top" | "left" | "right" | "bottom" | "back";
export const ROLL_SIDES: rollSide[] = [
	"front",
	"top",
	"left",
	"right",
	"bottom",
	"back",
];

export class CasinoDice extends Component<
	{},
	{
		roll: {
			count: number;
			res: number;
			prev: rollSide;
			curr: rollSide;
			same: boolean;
			score: number[];
			delay: boolean;
		};
		showwin: number;
		showwinCr: number;
		showwinname?: string;
		showwinme?: boolean;
		seconds: number;
		selectedBet: number;
		data: DiceData;
		show: boolean;
		ready: boolean;
		player: boolean;
	}
> {
	private readonly ev: CustomEventHandler;
	private readonly ev2: CustomEventHandler;
	private readonly ev3: CustomEventHandler;
	private readonly ev4: CustomEventHandler;
	private readonly int: any;
	private int2: any;
	private int3: any;

	constructor(props: any) {
		super(props);
		this.state = {
			selectedBet: 0,
			roll: {
				delay: false,
				count: 0,
				res: 0,
				prev: "front",
				curr: "front",
				same: false,
				score: [0, 0],
			},
			showwin: 0,
			showwinCr: 0,
			seconds: CEF.test ? 100 : 0,
			data: CEF.test
				? {
						players: [
							{ name: "Xander Test", id: 11, stage: "wait" },
							null,
							{
								name: "Xander Second",
								id: 1,
								stage: "dice",
								time: DICE_PLAY_TIME,
							},
							{ name: "Xander Test", id: 3, stage: "ok" },
						],
						id: 0,
						stage: "dice",
						bet: 1000,
						betsum: 1000,
					}
				: null,
			show: CEF.test,
			ready: CEF.test,
			player: true,
		};
		this.ev = CustomEvent.register(
			"casino:dice:data",
			(data: DiceData, player: boolean) => {
				this.setState({ data, show: true, player });
			},
		);
		this.ev2 = CustomEvent.register(
			"casino:dice:win",
			(sum: number, name: string, me: boolean) => {
				this.notifyWin(sum, name, me);
			},
		);
		this.ev3 = CustomEvent.register("casino:dice:crRew", (sum: number) => {
			this.notifyWinCr(sum);
		});
		this.ev4 = CustomEvent.register("casino:dice:ready", () => {
			this.setState({ ready: true });
		});

		this.int = setInterval(() => {
			if (this.state.seconds > 0)
				this.setState({ seconds: this.state.seconds - 1 });
			let data = this.state.data;
			data.players.map((player) => {
				if (player && player.stage == "dice" && player.time > 0) {
					player.time--;
				}
			});
			this.setState({ data });
		}, 1000);

		if (CEF.test) {
			setTimeout(() => {
				this.notifyWin(10000, "Xander Test", true);
			}, 5000);
			// setInterval(() => {
			//   this.rollGen()
			// }, 3000)
		}
	}

	drawPlayerData(player: DicePlayer, i: number) {
		return (
			<div
				className={`dice-player-item seat-${i} ${player ? `dpi-${player.stage}` : ""}`}
				key={`dice_player_${i}`}
			>
				{player ? (
					<>
						{player.stage === "dice" ? (
							<div className="dpi-timer">
								<div>
									{LangString(
										"components.CasinoRoulette.dice.095e2e5cbcfc18199bc9ab3f51b8ee4a",
									)}
								</div>
								<div>{system.secondsToString(player.time)}</div>
							</div>
						) : (
							<></>
						)}
						{player.stage !== "wait" ? (
							<div className="dpi-bid animated fadeInUp">
								<div className="casino-chips small mb40">
									<img src={png["chip"]} alt="" />
									<p>{system.numberFormat(this.state.data.bet)}</p>
								</div>
							</div>
						) : (
							<></>
						)}

						<div className="dpi-name mb24">
							{player.name.split(" ")[0]}
							<br />
							{player.name.split(" ")[1]}
						</div>
						<p className="casino-mini-font mb40">
							{LangString(
								"components.CasinoRoulette.dice.3f2bc0b08770e7f0b21c0849e8a4f072",
							)}{" "}
							{player.id}
						</p>
						{player.scoreArr && player.scoreArr.length > 0 ? (
							<div className="dpi-enter">
								{player.scoreArr.map((q, s) => {
									return (
										<div
											className="dice-my-img"
											key={`player_${player.id}_roll_res_${s}`}
										>
											<img src={svg[`dice-${q}`]} alt="" />
										</div>
									);
								})}
							</div>
						) : (
							<div className="dpi-enter">
								{CEF.id === player.id ? (
									<>
										{player.stage === "wait" &&
										this.state.data.stage === "wait" ? (
											<>
												{this.state.data.stage === "wait" ? (
													<button
														className="dpi-button"
														onClick={(e) => {
															e.preventDefault();
															CustomEvent.triggerServer(
																"casino:dice:bet",
																this.state.data.id,
															);
														}}
													>
														<p>
															{LangString(
																"components.CasinoRoulette.dice.948e42f0a6ce5ed8c33da7bae09d08b0",
															)}
														</p>
													</button>
												) : (
													<></>
												)}
											</>
										) : (
											<></>
										)}
										{player.stage === "wait" &&
										this.state.data.stage !== "wait" ? (
											<button className="dpi-button border" disabled>
												<p>
													{LangString(
														"components.CasinoRoulette.dice.5b790962ec8a5a80c3116470ee779396",
													)}
												</p>
											</button>
										) : (
											<></>
										)}
										{player.stage === "ready" ? (
											<>
												{["wait", "ready"].includes(this.state.data.stage) ? (
													<button
														className="dpi-button border"
														onClick={(e) => {
															e.preventDefault();
															CustomEvent.triggerServer(
																"casino:dice:betCancel",
																this.state.data.id,
															);
														}}
													>
														<p>
															{LangString(
																"components.CasinoRoulette.dice.25f4d66477f95870a903efb78011302a",
															)}
														</p>
													</button>
												) : (
													<button className="dpi-button border">
														<p>
															{LangString(
																"components.CasinoRoulette.dice.684a86c5a2a6c58fa2a3b267fa8f7e40",
															)}
														</p>
													</button>
												)}
											</>
										) : (
											<></>
										)}
									</>
								) : (
									<>
										{player.stage === "wait" ? (
											<>
												{this.state.data.stage === "wait" ? (
													<button className="dpi-button border" disabled>
														<p>
															{LangString(
																"components.CasinoRoulette.dice.7c95a599cf33c7344aae838ae4052e36",
															)}
														</p>
													</button>
												) : (
													<button className="dpi-button border" disabled>
														<p>
															{LangString(
																"components.CasinoRoulette.dice.ac46bf8736c3ef0a8f0b2d85b0cc925f",
															)}
														</p>
													</button>
												)}
											</>
										) : (
											<></>
										)}
										{player.stage === "ready" ? (
											<button className="dpi-button border" disabled>
												<p>
													{LangString(
														"components.CasinoRoulette.dice.623f7e7b272479bc9dcd4bc193fdad2c",
													)}
												</p>
											</button>
										) : (
											<></>
										)}
										{player.stage === "ok" ? (
											<button className="dpi-button border to-success" disabled>
												<img src={svg["success"]} alt="" />
												<p>
													{LangString(
														"components.CasinoRoulette.dice.5ce927d2c0e1034ecb91f47bb122817f",
													)}
												</p>
											</button>
										) : (
											<></>
										)}
									</>
								)}
							</div>
						)}
					</>
				) : (
					<>
						<div className="dpi-enter">
							<button className="dpi-button border" disabled>
								<p>
									{LangString(
										"components.CasinoRoulette.dice.3c4b51c93a6a0073c8c10bfa1f25e6bf",
									)}
								</p>
							</button>
						</div>
					</>
				)}
			</div>
		);
	}

	rollDice(res: number) {
		const side = ROLL_SIDES[res - 1];
		let old = this.state.roll.curr;
		let scoreArr = this.state.roll.score;
		scoreArr.push(res);
		this.setState(
			{
				roll: {
					delay: this.state.roll.delay,
					count: this.state.roll.count + 1,
					res: this.state.roll.res + res,
					prev: old,
					curr: side,
					same: old == side ? !this.state.roll.same : false,
					score: scoreArr,
				},
			},
			() => {
				if (!this.myData?.time) return;
				if (this.myData?.stage !== "dice") return;
				if (this.state.roll.count > DICE_PLAY_COUNT) return;
				if (this.state.roll.count === DICE_PLAY_COUNT) {
					this.setState({ roll: { ...this.state.roll, delay: true } });
					setTimeout(() => {
						this.setState({ roll: { ...this.state.roll, delay: false } });
					}, 4000);
				}
				CustomEvent.triggerServer("casino:dice:roll", this.state.data.id, res);
			},
		);
	}

	clearRoll() {
		this.setState({
			roll: {
				delay: false,
				count: 0,
				res: 0,
				prev: "front",
				curr: "front",
				same: false,
				score: [],
			},
		});
	}

	rollGen() {
		this.rollDice(system.getRandomInt(1, 6));
	}

	notifyWin(sum: number, name: string, me: boolean) {
		if (this.int2) clearTimeout(this.int2);
		this.setState({ showwin: sum, showwinname: name, showwinme: me });
		this.int2 = setTimeout(() => {
			this.setState({ showwin: 0 });
		}, 5000);
	}

	notifyWinCr(sum: number) {
		if (this.int3) clearTimeout(this.int3);
		this.setState({ showwinCr: sum });
		this.int3 = setTimeout(() => {
			this.setState({ showwinCr: 0 });
		}, 5000);
	}

	get table() {
		return DICE_TABLES_LIST[this.state.data?.id];
	}

	get myData() {
		return this.state.data?.players.find((q) => q?.id === CEF.id);
	}

	componentWillUnmount() {
		if (this.ev) this.ev.destroy();
		if (this.ev2) this.ev2.destroy();
		if (this.ev3) this.ev3.destroy();
		if (this.ev4) this.ev4.destroy();
		if (this.int) clearInterval(this.int);
		if (this.int2) clearTimeout(this.int2);
		if (this.int3) clearTimeout(this.int3);
	}

	updateData(datas: DiceData) {
		const old = this.state.data;
		let data: DiceData = { ...datas };
		if (data.stage === "ready" && old.stage == "wait") {
			this.setState({
				seconds: DICE_PLAY_START_TIME,
			});
			this.clearRoll();
		}
		data.players.map((player, id) => {
			if (!player) return;
			let oldPlayer = old.players[id];
			if (!oldPlayer) return;
			let stage = player.stage;
			let oldstage = oldPlayer.stage;
			if (["ready", "wait"].includes(data.stage)) {
				player.score = 0;
				player.scoreArr = [];
			}
			if (stage === "dice" && oldstage === "ready") {
				player.time = DICE_PLAY_TIME * DICE_PLAY_COUNT;
				if (player.id === CEF.id) this.clearRoll();
			} else if (stage == "dice" && oldstage === "dice")
				player.time = oldPlayer.time;
		});
		this.setState({
			data,
			show: true,
			selectedBet: data.stage === "wait" ? this.state.selectedBet : 0,
		});
	}

	renderCroupier() {
		return (
			<>
				<div className="cg1-buttons-grid-left animated fadeInLeft waiteone">
					<div className="casino-button-info-item">
						<p className="cg1-keyboard mr24">
							{LangString(
								"components.CasinoRoulette.dice.a74ff414b7dbb515834f3e846a876d8c",
							)}
						</p>
						<p>
							{LangString(
								"components.CasinoRoulette.dice.e4cc4a6808f56534a7a64a8a023d62d8",
							)}
						</p>
					</div>
				</div>
				<div className="casino-balance">
					<p className="casino-mini-font mb24">
						{LangString(
							"components.CasinoRoulette.dice.b4540eab90c6f925df92c4b08ab73e56",
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
									"components.CasinoRoulette.dice.d134e6f9a81243d0067777da7de915e1",
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
					{[...this.state.data.players]
						.reverse()
						.map((player, i) => this.drawPlayerData(player, i))}
				</div>

				{this.state.data.stage === "wait" ? (
					<>
						<div className="croupier-enter-bid-wrapper">
							<p className="casino-mini-font mb40">
								{LangString(
									"components.CasinoRoulette.dice.420f6ca0e6f76122de2df9d9bd5be097",
								)}
							</p>
							<div className="croupier-enter-bid-grid mb40">
								{DICE_TABLES_LIST[this.state.data.id].betsSum.map((sum) => {
									return (
										<button
											key={`dice_bet_list_${sum}`}
											className={`${this.state.selectedBet === sum ? "bid-enter" : ""}`}
											onClick={(e) => {
												e.preventDefault();
												if (this.state.data.stage !== "wait")
													return CEF.alert.setAlert(
														"error",
														LangString(
															"components.CasinoRoulette.dice.05f5ff2be3ea690554b137e884772a73",
														),
													);
												if (
													this.state.data.players.find(
														(q) => q && q.stage !== "wait",
													)
												)
													return CEF.alert.setAlert(
														"error",
														LangString(
															"components.CasinoRoulette.dice.710cc8d5950cea219d796f7d3e7cd0e6",
														),
													);
												this.setState({ selectedBet: sum });
												CustomEvent.triggerServer(
													"casino:dice:setBet",
													this.state.data.id,
													sum,
												);
											}}
										>
											<div className="casino-chips">
												<img src={png[getDiceBetClassName(sum)]} alt="" />
												<p>{system.numberFormat(sum)}</p>
											</div>
										</button>
									);
								})}
							</div>
							<button
								className="dpi-button"
								onClick={(e) => {
									e.preventDefault();
									if (!this.state.selectedBet)
										return CEF.alert.setAlert(
											"error",
											LangString(
												"components.CasinoRoulette.dice.5f171be61fb02948042c6fd443ebbc82",
											),
										);
									if (this.state.data.players.filter((q) => q).length < 2)
										return CEF.alert.setAlert(
											"error",
											LangString(
												"components.CasinoRoulette.dice.8c9c35dba25e6db3727f6f70c852dad9",
											),
										);
									if (
										this.state.data.players.filter(
											(q) => q && q.stage === "ready",
										).length === 0
									)
										return CEF.alert.setAlert(
											"error",
											LangString(
												"components.CasinoRoulette.dice.2cdfa29de69adf7bf1d0b92c314340de",
											),
										);
									CustomEvent.triggerServer(
										"casino:dice:start",
										this.state.data.id,
									);
								}}
							>
								<p>
									{LangString(
										"components.CasinoRoulette.dice.a4eda09d4dfce2ed7379ad85e74ed860",
									)}
								</p>
							</button>
						</div>
					</>
				) : (
					<></>
				)}
				{this.state.showwinCr ? (
					<div className="croupier-chips">
						<p className="casino-mini-font mb8">
							{LangString(
								"components.CasinoRoulette.dice.6ac27531bee5f7ed8a5ca68dcd44ba33",
							)}
						</p>
						<div className="casino-chips">
							<img src={png["chip"]} alt="" />
							<p>{system.numberFormat(this.state.showwinCr)}</p>
						</div>
					</div>
				) : (
					<></>
				)}
			</>
		);
	}

	renderPlayer() {
		return (
			<>
				<div className="cg1-buttons-grid-left animated fadeInLeft waiteone">
					<div className="casino-button-info-item">
						<p className="cg1-keyboard mr24">
							{LangString(
								"components.CasinoRoulette.dice.54f99953c0d9ff65a89231a50625fbc0",
							)}
						</p>
						<p>
							{LangString(
								"components.CasinoRoulette.dice.02ec8d7fe4d97b6d0b178d1965ec5a4f",
							)}
						</p>
					</div>
					<div className="casino-button-info-item">
						<p className="cg1-keyboard">
							{LangString(
								"components.CasinoRoulette.dice.4afd5cc7e805bc087f723ae35501e731",
							)}
						</p>
						<p>
							{LangString(
								"components.CasinoRoulette.dice.2f1516e8f3bcf701287256552321bfe9",
							)}
						</p>
					</div>
				</div>
				<div className="casino-balance">
					<p className="casino-mini-font mb24">
						{LangString(
							"components.CasinoRoulette.dice.98e2f0a3bb523d5ae25f8957b2e6f8eb",
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
									"components.CasinoRoulette.dice.0f94c988bd4c53068b99d552a9c59d8a",
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
				{["dice"].includes(this.myData?.stage) ? (
					<div className="cg-timer cg-dice-z animated fadeIn">
						<p className="casino-mini-font mb8">
							{LangString(
								"components.CasinoRoulette.dice.41ed26e32e5052add827e9b9a9b942a2",
							)}
						</p>
						<p className="casino-timer-font">
							{DICE_PLAY_COUNT - this.state.roll.count} / {DICE_PLAY_COUNT}
						</p>
					</div>
				) : (
					<></>
				)}
				{this.state.data.bet ? (
					<div className="dice-bid">
						<p className="casino-mini-font mb8">
							{LangString(
								"components.CasinoRoulette.dice.d11e4cbf2a1eddd381cd29781c4d619f",
							)}
						</p>
						<div className="casino-chips">
							<img src={png["chip"]} alt="" />
							<p>{system.numberFormat(this.state.data.bet)}</p>
						</div>
					</div>
				) : (
					<></>
				)}
				<div className="dice-players">
					<i className="fly-dice-shadow" />
					{/* Разные состояния карточки. Личная карточка игрока (не всегда отображается первой, показывать по тем местам где сидит человек) */}
					{this.state.data.players.map((player, i) =>
						this.drawPlayerData(player, i),
					)}
				</div>

				{["dice"].includes(this.myData?.stage) || this.state.roll.delay ? (
					<>
						{/* Würfelrolle JS + SOUND muss gemacht werden https://codepen.io/alexerlandsson/pen/yyWdLE */}
						{this.rollItem}
					</>
				) : (
					<></>
				)}
			</>
		);
	}

	get rollItem() {
		return (
			<div className={"dice_roll_shadow animated fadeIn"}>
				<Draggable
					key={"dice_roll_item"}
					positionOffset={{ x: `${45}%`, y: "47%" }}
					disabled={this.myData?.stage === "ok"}
					onStop={(e) => {
						if (!this.myData?.time) return;
						if (this.myData?.stage !== "dice") return;
						if (this.state.roll.count >= DICE_PLAY_COUNT) return;
						this.rollGen();
					}}
				>
					<div className="dice-cast-wrapper">
						<section className="dice-container">
							<div
								className={`dice-item show-${this.state.roll.curr}${this.state.roll.same ? " show-same" : ""}`}
							>
								<figure className="front" />
								<figure className="back" />
								<figure className="right" />
								<figure className="left" />
								<figure className="top" />
								<figure className="bottom" />
							</div>
						</section>
					</div>
				</Draggable>
			</div>
		);
		let q: JSX.Element[] = [];
		new Array(1).fill("item").map((_, i, arr) => {
			q.push(
				<Draggable
					key={`dice_roll_item_${i}`}
					positionOffset={{ x: `${(100 / arr.length) * (i + 1)}%`, y: "47%" }}
					disabled={this.myData?.stage === "ok"}
					onStop={(e) => {
						if (!this.myData?.time) return;
						if (this.myData?.stage !== "dice") return;
						if (this.state.roll.count >= DICE_PLAY_COUNT) return;
						this.rollGen();
					}}
				>
					<div className="dice-cast-wrapper">
						<section className="dice-container">
							<div
								className={`dice-item show-${this.state.roll.curr}${this.state.roll.same ? " show-same" : ""}`}
							>
								<figure className="front" />
								<figure className="back" />
								<figure className="right" />
								<figure className="left" />
								<figure className="top" />
								<figure className="bottom" />
							</div>
						</section>
					</div>
				</Draggable>,
			);
		});
		return q;
	}

	render() {
		if (!this.state.data) return <></>;
		return (
			<SocketSync
				path={`dice_${this.state.data.id}`}
				data={(e) => {
					if (!e) return;
					const data = JSON.parse(e);
					if (!data) return;
					this.updateData(data);
				}}
			>
				{!this.state.show || !this.state.ready ? (
					<></>
				) : (
					<section
						className={`dice-section-wrapper ${!this.state.player ? "croupier-wrapper" : ""} animated fadeIn`}
					>
						{this.state.player ? this.renderPlayer() : this.renderCroupier()}
						<div
							className={`dice-wintask-wrapper animated ${this.state.showwin ? "zoomIn" : "zoomOut"}`}
						>
							<i className="fly-win-lines">
								<img src={svg["win-lines"]} alt="" />
							</i>
							<div
								className={`dice-wintask ${!this.state.showwinme && this.state.player ? "lose" : ""}`}
							>
								<p className="dice-win-title">
									{LangString(
										"components.CasinoRoulette.dice.6bc59488caa4e435f64ee640994412d4",
									)}
									<br />
									<span>{this.state.showwinname}</span>
								</p>
								<div className="dice-win-size">
									<div className="casino-chips">
										<img src={png["chip"]} alt="" />
										<p>{system.numberFormat(this.state.showwin)}</p>
									</div>
								</div>
							</div>
						</div>
					</section>
				)}
			</SocketSync>
		);
	}
}
