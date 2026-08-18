import { LangString } from "../../modules/lang";
import type React from "react";
import { Component, createRef } from "react";
import { TENCODES_LIST } from "../../../shared/fractions";
import { CustomEventHandler } from "../../../shared/custom.event";
import { getInteriorGarageById } from "../../../shared/inrerriors";
import { systemUtil } from "../../../shared/system";
import { CEF } from "../../modules/CEF";
import { CustomEvent } from "../../modules/custom.event";
import "./style.less";
import Select from "react-select";
import { ChatDialogClass } from "../Chat/chatBlock";
import {
	getCategoryName,
	NEWS_CATEGORY,
	NEWS_POST_COST,
} from "../../../shared/news";
import {
	BUSINESS_SUBTYPE_NAMES,
	BUSINESS_TYPE_NAMES,
} from "../../../shared/business";
import { familyFractionPayDayRewardPercent } from "../../../shared/economy";
import { FINE_CAR_POS } from "../../../shared/fine.car";
const svgs = Object.fromEntries(
	Object.entries(
		import.meta.glob("./images/svg/tablet/*.svg", { eager: true }),
	).map(([key, value]) => {
		const name = key.match(/\/([^/]+)\.svg$/)[1];
		return [name, value.default];
	}),
);
import { MAX_WANTED_LEVEL } from "../../../shared/jail";
const factionBackground = Object.fromEntries(
	Object.entries(
		import.meta.glob("./images/factions_background/*.png", { eager: true }),
	).map(([key, value]) => {
		const name = key.match(/\/([^/]+)\.png$/)[1];
		return [name, value.default];
	}),
);
import {
	LicenceType,
	LicenseName,
	REMOVE_LICENSE_RANK,
} from "../../../shared/licence";
import { system } from "../../modules/system";
const iconsItems = Object.fromEntries(
	Object.entries(
		import.meta.glob("../../../shared/icons/*.png", { eager: true }),
	).map(([key, value]) => {
		const name = key.match(/\/([^/]+)\.png$/)[1];
		return [name, value.default];
	}),
);
import {
	family_max_rank,
	FAMILY_TO_ORGANIZATION_MIN_LEVEL,
	FamilyContractWinTypes,
	FamilyExtraTaskTypes,
	FamilyPermissions,
	FamilyReputationType,
	FamilyTasksInterface,
	FamilyUpgrade,
	getFamilyUpgradeLevelPrice,
	LevelInfo,
	newRankRules,
	rankData,
	Timetable,
} from "../../../shared/family";
import gruz from "./images/gruz.png";
import famosob from "./images/fam-osob.png";
const bizImg = Object.fromEntries(
	Object.entries(
		import.meta.glob("./images/businesses/*.png", { eager: true }),
	).map(([key, value]) => {
		const name = key.match(/\/([^/]+)\.png$/)[1];
		return [name, value.default];
	}),
);
import { SocketSync } from "../SocketSync";
import {
	CircularProgress,
	CircularProgressProps,
	createMuiTheme,
} from "@material-ui/core";
import { styled } from "@material-ui/styles";
import { Fraction } from "./components/Fraction";
import { fractionCfg } from "../../modules/fractions";
import { Products } from "./components/Products";
import { StorageAlertData } from "../../../shared/alertsSettings";
import classNames from "classnames";

const TabletCircleLoader = styled(CircularProgress)<CircularProgressProps>(
	({ theme }) => {
		return {
			size: "50rem",
			color: "#FFF",
		};
	},
);

let news: {
	id: number;
	name: string;
	time: number;
	cat: string;
	text: string;
	number: number;
}[] = [];
setTimeout(() => {
	CustomEvent.register(
		"tablet:addnews",
		(
			data: {
				id: number;
				name: string;
				time: number;
				cat: string;
				text: string;
				number: number;
			}[],
		) => {
			data.map((q) => {
				news.push(q);
			});
		},
	);
}, 1000);

export class TabletClass extends Component<
	{
		enableRenderFamilyPlayerBlips: boolean;
	},
	{
		loaded: boolean;
		speed: number;
		fuel: number;
		engine: boolean;
		lock: boolean;
		lights: boolean;
		realDate: string;
		realTime: string;
		gameTime: string;
		currentPage:
			| "main"
			| "house"
			| "vehicles"
			| "fraction"
			| "lifeinvader"
			| "bussiness"
			| "gosfraction"
			| "mafiabiz"
			| "family"
			| "loader";
		houseData?: {
			carInt: number;
			name: string;
			id: number;
			owner: string;
			price: number;
			tax: number;
			tax_max?: number;
			cars: { name: string; number: string; model: string }[];
			pos: { x: number; y: number };
		};
		vehicles: {
			name: string;
			model: string;
			number: string;
			x: number;
			y: number;
			onSpawn: boolean;
			id: number;
		}[];
		lifeinvaderPage: number;
		lifeinvaderCategory?: string;
		fractionData?: {
			id: number;
			members: {
				id: number;
				name: string;
				rank: number;
				tag: string;
				lastSeen: number;
				tracker: boolean;
				tracking?: boolean;
			}[];
			messages: { name: string; id: number; time: number; text: string }[];
			alerts?: {
				id: number;
				actual: boolean;
				name: string;
				text: string;
				timestamp: number;
				type: number;
				callAnswered?: string;
				code?: number;
				isGlobal: boolean;
				pos: [number, number];
			}[];
			playerPosition: { x: number; y: number; z: number; h: number; d: number };
			mafiabiz?: {
				id: number;
				name: string;
				price: number;
				type: number;
				stype: number;
			}[];
		};
		fractionPage: number;
		fractionKickId?: number;
		fractionSearch: string;
		fractionTag?: string;
		fractionSelected?: number;
		fractionChatText: string;
		lifeInvaderCat: string;
		lifeInvaderText?: string;
		lifeInvaderNumber?: number;
		myNumbers: number[];
		lifeInvaderModerate?: {
			id: number;
			ids: number;
			name: string;
			time: number;
			cat: string;
			text: string;
			number: number;
			res?: string;
		}[];
		lifeInvaderSelect?: number;
		lifeInvaderSelectType?: number;
		lifeInvaderCancel?: string;
		bussinessData?: {
			name: string;
			money: number;
			cost: number;
			tax: number;
			taxMax: number;
			logs: {
				text: string;
				type: "add" | "remove";
				sum: number;
				time: number;
			}[];
		};
		gosSearchResult?: { id: number; name: string }[];
		gosSearchItem?: {
			id: number;
			name: string;
			bank: string;
			social: string;
			house: string;
			vehs: {
				id: number;
				model: string;
				name: string;
				number: string;
			}[];
			wanted_level?: number;
			wanted_level_new?: number;
			wanted_reason?: string;
			wanted_reason_new?: string;
			licenses?: [LicenceType, number, string][];
			history?: { text: string; time: number }[];
		};
		gosSearchVehicle?: string;
		gosSearchVehicleData?: {
			model: string;
			name: string;
			number: string;
			owner: number;
			ownername: string;
		}[];

		gosPage?: number;
		gosTenCodeSelected?: { value: string; label: JSX.Element };
		gosSuspectSearch?: string;
		gosSuspects?: { id: number; name: string; wanted: number }[];
		trackSuspect?: number;

		pos?: { x: number; y: number; z: number };
		familyData?: {
			id: number;
			name: string;
			money: number;
			scores: number;
			season_scores: number;
			level: number;
			type: FamilyReputationType;
			win: number;
			members: {
				id: number;
				name: string;
				rank: number;
				lastSeen: number;
				tracker: boolean;
				tracking?: boolean;
				scores: number;
			}[];
			ranks: rankData[];
			changeRank: rankData;
			bio: string;
			cargoData: {
				/** Количество груза у семьи */
				amount: number;
				/** Максимальное количество груза, доступное для этой семьи */
				max: number;
			};
			extraTasks: {
				id: number;
				/** Тип, настройки для которого в shared/family FamilyExtraTaskTypes */
				type: keyof typeof FamilyExtraTaskTypes;
				/** 1- идет ожидание (нет координат), 2 - мероприятие запущено, координаты есть */
				active: number;
				/** Время для ожидания */
				time: number;
			}[];
			familyTasks: FamilyTasksInterface[];
			vehicles: {
				name: string;
				model: string;
				number: string;
				x: number;
				y: number;
				onSpawn: boolean;
				id: number;
				rank: number;
			}[];
			house?: {
				id: number;
				name: string;
				forTp: boolean;
				pos: { x: number; y: number; z: number };
				price: number;
			};
			upgrades: { [key: number]: number };
			donate: number;
			donateLog?: {
				date: number;
				amount: number;
				name: string;
				reason: string;
				type: number;
			}[];
			cargoNeedTime: number;
			contract: {
				id: number;
				name: string;
				desc: string;
				status: number;
				win: { type: number; amount?: number; desc?: string }[];
			}[];
		};
		familyPage: number;
		familyKickId?: number;
		familyKickRank?: number;
		familySearch: string;
		familySelected?: number;
		familyChatText: string;
		familyInputPay?: number;
		familyInputPayMoney?: number;
		familyAccept?: boolean;
		familyCarEdit?: number;
	}
> {
	speed: any;
	circle: HTMLElement;
	speedometer: HTMLElement;
	backgound: React.RefObject<HTMLDivElement>;
	ev: CustomEventHandler;
	ev2: CustomEventHandler;
	ev3: CustomEventHandler;
	ev4: CustomEventHandler;
	famTime: number;
	constructor(props: any) {
		super(props);
		this.backgound = createRef<HTMLDivElement>();
		this.state = {
			lifeInvaderNumber: CEF.test ? 123123 : null,
			myNumbers: CEF.test ? [123123, 2352355, 235555, 6577777] : [],
			lifeInvaderCat: NEWS_CATEGORY[0][0],
			lifeInvaderModerate: CEF.test
				? [
						{
							id: 1,
							ids: 3,
							name: "test",
							time: 1,
							cat: "other",
							text: "test",
							number: 1,
						},
						{
							id: 2,
							ids: 4,
							name: "test",
							time: 1,
							cat: "other",
							text: "test",
							number: 1,
						},
					]
				: [],
			fractionChatText: "",
			fractionSearch: "",

			gosTenCodeSelected: {
				value: "-1",
				label: (
					<>
						LangString("components.Tablet.index.dc80a65e1ace59fbb474a1cd1c7536f2")
					</>
				),
			},
			gosSuspects: [
				{ id: 1, name: "Test One", wanted: 1 },
				{ id: 1234, name: "Test Two", wanted: 3 },
			],
			gosSuspectSearch: "",
			trackSuspect: 1,

			fractionData: null,
			fractionPage: 0,
			lifeinvaderPage: 0,
			vehicles: CEF.test
				? [
						{
							name: "xafas",
							model: "xa21",
							number: "DDDDDDDD",
							x: 0,
							y: 1,
							onSpawn: false,
							id: 1,
						},
						{
							name: "xafas",
							model: "xa21",
							number: "DDDDDDDD",
							x: 0,
							y: 1,
							onSpawn: true,
							id: 1,
						},
					]
				: [],
			loaded: true, //CEF.test,
			speed: 0,
			fuel: 0,
			engine: false,
			lock: false,
			lights: false,
			realDate: CEF.test ? "00.00.0000" : "",
			realTime: CEF.test ? "00:00" : "",
			gameTime: CEF.test ? "00:00" : "",
			currentPage: "main",
			houseData: !CEF.test
				? null
				: {
						carInt: 16,
						name: "Тестовый адрес",
						id: 123,
						owner: "Xander Test",
						price: 200000,
						tax: 1000,
						cars: [{ name: "Xa21", number: "ASFASFAS", model: "xa21" }],
						pos: { x: 10, y: 10 },
						tax_max: 1000,
					},
			familyData: !CEF.test
				? null
				: {
						id: 2,
						name: "Семья Family Family",
						money: 999999000,
						scores: 9999000,
						season_scores: 11111110,
						level: 1,
						type: FamilyReputationType.CRIME,
						win: 1001100,
						bio: "",
						members: [
							{
								id: 1,
								name: "Xander Test",
								rank: 1,
								lastSeen: 0,
								tracker: true,
								scores: 0,
							},
							{
								id: 1,
								name: "Xander Test",
								rank: 1,
								lastSeen: 0,
								tracker: true,
								scores: 0,
							},
							{
								id: 1,
								name: "Xander Test",
								rank: 1,
								lastSeen: 0,
								tracker: true,
								scores: 0,
							},
							{
								id: 1,
								name: "Xander Test",
								rank: 1,
								lastSeen: 0,
								tracker: true,
								scores: 0,
							},
							{
								id: 1,
								name: "Xander Test",
								rank: 1,
								lastSeen: 0,
								tracker: true,
								scores: 0,
							},
							{
								id: 1,
								name: "Xander Test",
								rank: 1,
								lastSeen: 0,
								tracker: true,
								scores: 0,
							},
							{
								id: 1,
								name: "Xander Test",
								rank: 1,
								lastSeen: 0,
								tracker: true,
								scores: 0,
							},
							{
								id: 1,
								name: "Xander Test",
								rank: 1,
								lastSeen: 0,
								tracker: true,
								scores: 0,
							},
							{
								id: 1,
								name: "Xander Test",
								rank: 1,
								lastSeen: 0,
								tracker: true,
								scores: 0,
							},
							{
								id: 1,
								name: "Xander Test",
								rank: 1,
								lastSeen: 0,
								tracker: true,
								scores: 0,
							},
							{
								id: 1,
								name: "Xander Test",
								rank: 1,
								lastSeen: 0,
								tracker: true,
								scores: 0,
							},
							{
								id: 2,
								name: "Anton Test",
								rank: 2,
								lastSeen: 1601583141,
								tracker: true,
								scores: 1,
							},
						],
						ranks: [
							{ id: 0, name: "Участник", rules: [], isPermament: true },
							{ id: 1, name: "Сотрудник", rules: [1, 2, 3, 4, 5] },
							{ id: 5, name: "Управляющий", rules: [1, 2, 3] },
							{
								id: 2,
								name: "Заместитель",
								rules: [1, 2, 3, 4, 5],
								isSoOwner: true,
							},
							{
								id: 3,
								name: "Besitzer",
								rules: [1, 2, 3, 4, 5],
								isOwner: true,
							},
						],
						changeRank: { id: -1 },
						// gruzTask: {
						//     amount: 100,
						//     max: 200,
						//     active: 0,
						//     pos: {x:1, y: 1, z:1},
						//     time: 300
						// },
						/** Из gruzTask два значения вынес, они тут постоянные не зависимо от особых заданий */
						cargoData: {
							amount: 100,
							max: 200,
						},
						/** Массив особых заданий. В обьект нужно добавить картинку, это лучше тебе сделать, не знаю ни ее названия и ничего */
						extraTasks: [
							{
								id: 1,
								type: "cargoBattle",
								active: 1, // 1 - ожидание старта (идет таймер и нет координат), 2 - проходит в данный момент (нет таймера но есть координаты)
								time: 30, // секунд ожидания до начала
							},
							{
								id: 2,
								type: "cargoBattle",
								active: 2, // 1 - ожидание старта (идет таймер и нет координат), 2 - проходит в данный момент (нет таймера но есть координаты)
								time: 0, // секунд ожидания до начала
							},
						],
						familyTasks: [],
						vehicles: [
							{
								name: "xafas",
								model: "xa21",
								number: "DDDDDDDD",
								x: 0,
								y: 1,
								onSpawn: false,
								id: 1,
								rank: 0,
							},
							{
								name: "xafas",
								model: "xa21",
								number: "DDDDDDDD",
								x: 0,
								y: 1,
								onSpawn: true,
								id: 2,
								rank: 2,
							},
						],
						house: {
							name: "Дом №1",
							id: 1,
							forTp: true,
							// desc: 'Особняк элитного класса',
							pos: { x: 1, y: 1, z: 1 },
							price: 10000,
						},
						upgrades: {
							1: 38,
							2: 0,
							3: 0,
							4: 0,
						},
						donate: 0,
						donateLog: [
							{
								amount: 100,
								date: 1611715185,
								name: "Player Name",
								reason: "Покупка авто",
								type: 0,
							},
							{
								amount: 100,
								date: 1611715185,
								name: "Player Name",
								reason: "Покупка авто",
								type: 1,
							},
							{
								amount: 100,
								date: 1611715185,
								name: "Player Name",
								reason: "Покупка авто",
								type: 0,
							},
						],
						cargoNeedTime: 0,
						contract: [
							{
								id: 1,
								name: "Название 1",
								desc: "Beschreibung 1",
								status: -1,
								win: [
									{ type: FamilyContractWinTypes.COINS, amount: 30 },
									{ type: FamilyContractWinTypes.MONEY, amount: 5000 },
									{ type: 2051 },
									{ type: -1, desc: "Леденец" },
								],
							},
							{
								id: 2,
								name: "Название 2",
								desc: "Beschreibung 1",
								status: 50,
								win: [
									{ type: FamilyContractWinTypes.COINS, amount: 30 },
									{ type: FamilyContractWinTypes.MONEY, amount: 5000 },
									{ type: 2051 },
									{ type: -1, desc: "Леденец" },
								],
							},
						],
					},
			familyPage: 0,
			familyChatText: "",
			familySearch: "",
			familyInputPay: null,
			familyInputPayMoney: null,
		};

		this.ev2 = CustomEvent.register(
			"phone:synctime",
			(realDate: string, realTime: string, gameTime: string) => {
				this.setState({
					realDate,
					realTime,
					gameTime,
				});
			},
		);
		this.ev3 = CustomEvent.register(
			"news:setOrderStatus",
			(id: number, res: string, newText?: string) => {
				if (!this.state.lifeInvaderModerate) return;
				const data = [...this.state.lifeInvaderModerate];
				let q = data.find((q) => q.ids === id);
				if (q) {
					q.res = res;
					if (newText) q.text = newText;
				} else return;
				this.setState({ lifeInvaderModerate: data });
			},
		);

		this.ev = CustomEvent.register(
			"tablet:open",
			(
				houseData: {
					carInt: number;
					name: string;
					id: number;
					owner: string;
					price: number;
					tax: number;
					tax_max: number;
					cars: {
						name: string;
						number: string;
						model: string;
					}[];
					pos: {
						x: number;
						y: number;
					};
				},
				vehicles: {
					name: string;
					model: string;
					number: string;
					x: number;
					y: number;
					onSpawn: boolean;
					id: number;
				}[],
				fractionData,
				myNumbers: number[],
				lifeInvaderModerate: any,
				bussinessData: any,
				familyData,
				gosSuspects,
				trackSuspect,
			) => {
				console.log(`1 ${gosSuspects}`);
				this.setState({
					houseData,
					loaded: true,
					vehicles,
					fractionData,
					myNumbers,
					lifeInvaderNumber:
						myNumbers && myNumbers.length > 0 ? myNumbers[0] : null,
					lifeInvaderModerate,
					bussinessData,
					familyData,
					gosSuspects,
					trackSuspect,
				});
				this.famTimerUpdate();
			},
		);

		this.ev4 = CustomEvent.register(
			"phone:syncpos",
			(x: number, y: number, z: number) => {
				this.setState({ pos: { x, y, z } });
			},
		);
		this.famTimerUpdate();
		// this.ev3 = CustomEvent.register('tablet:faction:newMessage')
	}
	componentWillUnmount() {
		if (this.ev) this.ev.destroy();
		if (this.ev2) this.ev2.destroy();
		if (this.ev3) this.ev3.destroy();
		if (this.famTime) clearInterval(this.famTime);
	}
	famTimerUpdate = () => {
		if (this.state.familyData && this.state.familyData.extraTasks) {
			if (this.famTime) clearInterval(this.famTime);
			this.famTime = setInterval(() => {
				for (let i = 0; i < this.state.familyData.extraTasks.length; i++) {
					if (this.state.familyData.extraTasks[i].active == 1) {
						let extraTasks = this.state.familyData.extraTasks;
						if (this.state.familyData.extraTasks[i].time <= 0) {
							extraTasks[i].active = 2;
							this.setState({
								...this.state,
								familyData: { ...this.state.familyData, extraTasks },
							});
							return;
							//                            return clearInterval(this.famTime);
						}
						extraTasks[i].time -= 1;
						this.setState({
							...this.state,
							familyData: { ...this.state.familyData, extraTasks },
						});
					}
				}
			}, 1000);
		}
	};
	familyLeader = (rank: number) => {
		//isLeader
		if (this.state.familyData)
			return !!this.state.familyData.ranks.find(
				(data) => data.id === rank && data.isOwner === true,
			);
		return false;
	};
	familySubLeader = (rank: number) => {
		if (this.state.familyData)
			return !!this.state.familyData.ranks.find(
				(data) =>
					data.id === rank &&
					(data.isSoOwner === true || data.isOwner === true),
			);
		return false;
	};
	familyGetRankName = (rank: number) => {
		if (
			this.state.familyData &&
			this.state.familyData.ranks.find((data) => data.id === rank)
		)
			return this.state.familyData.ranks.find((data) => data.id === rank).name;
		return "";
	};

	backToMain = () => {
		this.setState({ currentPage: "main" });
	};

	getSuspectsPage = () => {
		console.log(this.state.gosSuspects);
		if (!this.state.gosSuspects) return <></>;
		const gosSuspects = this.state.gosSuspects.filter((suspect) => {
			return (
				suspect.name.toLowerCase().indexOf(this.state.gosSuspectSearch) != -1 ||
				String(suspect.id).indexOf(this.state.gosSuspectSearch) != -1
			);
		});
		return (
			<div className="member-list-wrap plrb30 wanteds-users">
				<div className="online-size mb24">
					<p className="font40 fontw300 mr12">{gosSuspects.length}</p>
					<p className="op4 font16">
						{LangString(
							"components.Tablet.index.cda1c376194e3c610920a17eee3e8c43",
						)}
						<br />
						{this.state.gosSuspectSearch.length
							? LangString(
									"components.Tablet.index.d77b6025ae79d1719cfd7de44bfb2e43",
								)
							: LangString(
									"components.Tablet.index.8d25be38fe28fced7a123e0ee3d8aa68",
								)}
					</p>
				</div>

				{gosSuspects.map((suspect) => {
					return (
						<div className="item-wanted-wrapper">
							<button
								className={`easy-button mini ${suspect.id == this.state.trackSuspect ? "green" : ""}`}
								onClick={(e) => {
									CustomEvent.triggerClient(
										"tablet:suspect:track",
										suspect.id == this.state.trackSuspect ? -1 : suspect.id,
									);
									this.setState({
										trackSuspect:
											suspect.id == this.state.trackSuspect ? -1 : suspect.id,
									});
								}}
							>
								<p>
									{suspect.id == this.state.trackSuspect
										? LangString(
												"components.Tablet.index.471216b1e75376b24bf828fe73a85f39",
											)
										: LangString(
												"components.Tablet.index.1c649bd742c577bc3449943cc798f57f",
											)}
								</p>
							</button>
							<div
								key={`suspect_${suspect.id}`}
								className="member-list-item item-online item-wanted"
								onClick={(e) => {
									if (CEF.test) {
										this.setState({
											gosSearchItem: {
												id: 1,
												name: "Xander Test",
												bank: "QWEQWEQWE",
												social: "QWEQWE",
												house: "QWEQWEQWE",
												vehs: [
													{
														id: 1,
														model: "xa21",
														name: "xa21",
														number: "xa21",
													},
												],
												wanted_level: 4,
												wanted_reason: "asfasfas",
											},
										});
										return;
									}
									CustomEvent.callServer(
										"faction:database:data",
										suspect.id,
									).then((status) => {
										if (!status) return;
										this.setState({ gosSearchItem: status });
									});
								}}
							>
								<div className="leftside">
									<p className="num fixwidth">{suspect.id}</p>
									<div className="r-stars-size mr12">
										{[1, 2, 3, 4, 5].map((w) => {
											return (
												<img
													src={
														suspect.wanted >= w
															? svgs["fill-star_on"]
															: svgs["fill-star_off"]
													}
													alt=""
												/>
											);
										})}
									</div>
									<p className="name">{suspect.name}</p>
								</div>
								<div className="rightside"></div>
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	gosSearchModal = () => {
		return (
			<>
				{this.state.gosSearchItem ? (
					<SocketSync
						path={`tablet_gosSearchItem_${this.state.gosSearchItem.id}`}
						data={(data: string) => {
							const d = JSON.parse(data);
							this.setState({ gosSearchItem: d });
						}}
					>
						<div className="in-results-wrap">
							<button
								className="close"
								onClick={(e) => {
									e.preventDefault();
									this.setState({ gosSearchItem: null });
								}}
							>
								<span className="icon-wrap">
									<svg
										width="30"
										height="30"
										viewBox="0 0 30 30"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<g id="24 / basic / plus">
											<path
												id="icon"
												fillRule="evenodd"
												clipRule="evenodd"
												d="M14.9996 13.5858L21.3635 7.22183L22.7777 8.63604L16.4138 15L22.7777 21.364L21.3635 22.7782L14.9996 16.4142L8.6356 22.7782L7.22138 21.364L13.5853 15L7.22138 8.63604L8.6356 7.22183L14.9996 13.5858Z"
												fill="#141B1F"
											></path>
										</g>
									</svg>
								</span>
							</button>
							<p className="title-big">
								{this.state.gosSearchItem.name} #{this.state.gosSearchItem.id}
							</p>
							<div className="info-user-wrap">
								<div className={"info-user-wanted-info"}>
									<div>
										<span className={"title"}>
											{LangString(
												"components.Tablet.index.b63a967abeec5969f9cea1effeda172b",
											)}
										</span>
										<button
											className={"clear"}
											onClick={(e) => {
												e.preventDefault();
												if (
													!fractionCfg.getFraction(this.state.fractionData.id)
														.police
												)
													return;
												this.state.gosSearchItem.wanted_level = null;
												this.state.gosSearchItem.wanted_reason = "";
												this.state.gosSearchItem.wanted_level_new = null;
												this.state.gosSearchItem.wanted_reason_new = "";
												this.setState({
													gosSearchItem: this.state.gosSearchItem,
												});
												CustomEvent.triggerServer(
													"tablet:clearWanted",
													this.state.gosSearchItem.id,
												);
											}}
										>
											{LangString(
												"components.Tablet.index.bd3dd5ae3de4d4c7e40cac3a70f2478f",
											)}
										</button>
									</div>
									<div className={"stars"}>
										{[...Array(MAX_WANTED_LEVEL)].map((x, iq) => {
											const i = iq + 1;
											let displayLevel = this.state.gosSearchItem.wanted_level;
											if (
												typeof this.state.gosSearchItem.wanted_level_new ==
												"number"
											)
												displayLevel =
													this.state.gosSearchItem.wanted_level_new;
											return (
												<img
													src={svgs[displayLevel >= i ? "star_on" : "star_off"]}
													onClick={(e) => {
														e.preventDefault();
														if (
															!fractionCfg.getFraction(
																this.state.fractionData.id,
															).police
														)
															return;
														this.state.gosSearchItem.wanted_level_new = i;
														if (
															this.state.gosSearchItem.wanted_level_new ===
															this.state.gosSearchItem.wanted_level
														)
															this.state.gosSearchItem.wanted_level_new = null;
														this.setState({
															gosSearchItem: this.state.gosSearchItem,
														});
													}}
												/>
											);
										})}
									</div>
								</div>
								{typeof this.state.gosSearchItem.wanted_level_new ==
								"number" ? (
									<div className={"info-user-wanted-info input"}>
										<div>
											<input
												maxLength={100}
												placeholder={LangString(
													"components.Tablet.index.728e9e7fe000ad7c7fc98a22bf09278a",
												)}
												value={this.state.gosSearchItem.wanted_reason_new || ""}
												onChange={(e) => {
													e.preventDefault();
													if (
														!fractionCfg.getFraction(this.state.fractionData.id)
															.police
													)
														return;
													this.state.gosSearchItem.wanted_reason_new =
														e.currentTarget.value;
													this.setState({
														gosSearchItem: this.state.gosSearchItem,
													});
												}}
											/>
											<button
												onClick={(e) => {
													e.preventDefault();
													if (
														!fractionCfg.getFraction(this.state.fractionData.id)
															.police
													)
														return;
													CustomEvent.triggerServer(
														"tablet:setWanted",
														this.state.gosSearchItem.id,
														this.state.gosSearchItem.wanted_level_new,
														this.state.gosSearchItem.wanted_reason_new,
													);
													this.state.gosSearchItem.wanted_level =
														this.state.gosSearchItem.wanted_level_new;
													this.state.gosSearchItem.wanted_reason =
														this.state.gosSearchItem.wanted_reason_new;
													this.state.gosSearchItem.wanted_level_new = null;
													this.state.gosSearchItem.wanted_reason_new = "";
													this.setState({
														gosSearchItem: this.state.gosSearchItem,
													});
												}}
											>
												<img src={svgs["ok_button"]} />
											</button>
										</div>
									</div>
								) : (
									<></>
								)}
							</div>
							<div className="info-user-wrap">
								{this.state.gosSearchItem.wanted_reason &&
								this.state.gosSearchItem.wanted_level ? (
									<div className="info-user-item">
										<p className="mini-title">
											{LangString(
												"components.Tablet.index.3d70bf5d64d7b97a3b891449a262df11",
											)}
										</p>
										<p className="name">
											{this.state.gosSearchItem.wanted_reason}
										</p>
									</div>
								) : (
									<></>
								)}
								<div className="info-user-item">
									<p className="mini-title">
										{LangString(
											"components.Tablet.index.fce5f54e1746b961340fffdfbbf42400",
										)}
									</p>
									<p className="name">
										{this.state.gosSearchItem.bank ||
											LangString(
												"components.Tablet.index.79a40147416e9622df855ffb1b06ae51",
											)}
									</p>
								</div>
								<div className="info-user-item">
									<p className="mini-title">
										{LangString(
											"components.Tablet.index.60e0f69a346d74b47410977cdc74a350",
										)}
									</p>
									<p className="name">
										{this.state.gosSearchItem.social ||
											LangString(
												"components.Tablet.index.3236b8af1887441c0b24711dd4aa902c",
											)}
									</p>
								</div>
								<div className="info-user-item">
									<p className="mini-title">
										{LangString(
											"components.Tablet.index.910b768dbc8b5ce351eb8ebf51ef6705",
										)}
									</p>
									<p className="name">
										{this.state.gosSearchItem.house ||
											LangString(
												"components.Tablet.index.37a8a17654e73ca23250b20bee321b21",
											)}
									</p>
								</div>
							</div>
							<div className="info-transport-wrapper">
								<div className="info-transport-wrap">
									<p className="mini-title">
										{LangString(
											"components.Tablet.index.5e4428c74f08f760cc723d89b120297e",
										)}
									</p>
									{this.state.gosSearchItem.vehs.map((veh) => {
										return (
											<div className="info-transport-item">
												<div className="text-wrap">
													<p className="title-big">{veh.name}</p>
												</div>
												<div className="bage-gps bage-white">
													<p>
														{veh.number ||
															LangString(
																"components.Tablet.index.3dcf736368dc73f3d073d3e5e202ef38",
															)}
													</p>
												</div>
											</div>
										);
									})}
								</div>
							</div>
							{this.state.gosSearchItem.licenses ? (
								<div className="info-transport-wrapper">
									<div className="info-transport-wrap">
										<p className="mini-title">
											{LangString(
												"components.Tablet.index.82402a297e5e603037d18e073f0eec3e",
											)}
										</p>
										{this.state.gosSearchItem.licenses.map((license, index) => {
											return (
												<div className="info-transport-item">
													<div className="text-wrap">
														<p>
															{LicenseName[license[0]]}{" "}
															{LangString(
																"components.Tablet.index.57aa02e17b9e6dd421f8c66bfd582f7c",
															)}{" "}
															{system.timeStampString(license[1])}
														</p>
													</div>
													<div
														className="bage-gps bage-white"
														onClick={(e) => {
															e.preventDefault();
															if (CEF.user.rank < REMOVE_LICENSE_RANK)
																return CEF.alert.setAlert(
																	"error",
																	LangString(
																		"components.Tablet.index.2240978a9806f6b4e0e29592e8f13f2d",
																	),
																);
															CustomEvent.triggerServer(
																"faction:removeLicense",
																this.state.gosSearchItem.id,
																license[0],
															);
															// this.state.gosSearchItem.licenses.splice(index, 1);
															// this.setState({gosSearchItem: this.state.gosSearchItem});
														}}
													>
														<p>
															{LangString(
																"components.Tablet.index.43583195827b9652a5fd4182ac8092c2",
															)}
														</p>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							) : (
								<></>
							)}
							{this.state.gosSearchItem.history ? (
								<div className="info-transport-wrapper">
									<div className="info-transport-wrap">
										<p className="mini-title">
											{LangString(
												"components.Tablet.index.47e554d9f8690a160744bd5c4b674c70",
											)}
										</p>
										{this.state.gosSearchItem.history.map((item, index) => {
											return (
												<div className="info-transport-item">
													<div className="text-wrap">
														<p>{item.text}</p>
													</div>
													<div className="bage-gps bage-white">
														<p>{system.timeStampString(item.time)}</p>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							) : (
								<></>
							)}
						</div>
					</SocketSync>
				) : (
					<></>
				)}
			</>
		);
	};

	get loader() {
		return (
			<>
				<div className="topline-mainscreen">
					<div className="battery-icon">
						<svg
							width="1.822916666666667vw"
							height=".833335vw"
							viewBox="0 0 35 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g clipPath="url(#clip0)">
								<rect
									x="-0.5"
									y="0.5"
									width="31.2771"
									height="15.248"
									rx="2.5"
									transform="matrix(1 0 0 -1 1.08508 16.124)"
									stroke="white"
								></rect>
								<path
									d="M33.1432 10.3683C34.1687 10.3683 35 9.53703 35 8.51155V7.18527C35 6.15979 34.1687 5.32848 33.1432 5.32848V10.3683Z"
									fill="white"
								></path>
								<path
									d="M1.97559 12.2335C1.97559 13.3381 2.87102 14.2335 3.97559 14.2335H24.2382V1.76648H3.97559C2.87102 1.76648 1.97559 2.66191 1.97559 3.76648V12.2335Z"
									fill="white"
								></path>
							</g>
							<defs>
								<clipPath id="clip0">
									<rect width="35" height="16" fill="white"></rect>
								</clipPath>
							</defs>
						</svg>
					</div>
				</div>
				<div className="tablet-loader">
					<TabletCircleLoader />
				</div>
			</>
		);
	}

	render() {
		if (!this.state.loaded) return <></>;
		if (!this.state.realDate) return <></>;
		return (
			<>
				<section className="tablet">
					<div className="ipad">
						<div className="ipad-border" />
						<div
							className="ipad-bg"
							ref={this.backgound}
							onMouseMove={(e) => {
								if (this.state.currentPage !== "main") return;
								$(this.backgound.current).css({
									backgroundPositionX: `${-e.pageX / 25}px`,
									backgroundPositionY: `${-e.pageY / 25}px`,
								});
							}}
						>
							{this.state.currentPage === "main" ? this.mainPage : <></>}
							{this.state.currentPage === "house" ? this.housePage : <></>}
							{this.state.currentPage === "vehicles" ? (
								this.vehiclesPage
							) : (
								<></>
							)}
							{this.state.currentPage === "lifeinvader" ? (
								this.lifeinvaderPage
							) : (
								<></>
							)}
							{this.state.currentPage === "fraction" ? (
								<Fraction back={this.backToMain} />
							) : (
								<></>
							)}
							{this.state.currentPage === "bussiness" ? (
								<Products back={this.backToMain} />
							) : (
								<></>
							)}
							{this.state.currentPage === "gosfraction" ? (
								this.gosFractionPage
							) : (
								<></>
							)}
							{this.state.currentPage === "mafiabiz" ? (
								this.mafiabizPage
							) : (
								<></>
							)}
							{this.state.currentPage === "family" ? this.familyPage : <></>}
							{this.state.currentPage === "loader" ? this.loader : <></>}
						</div>
					</div>
				</section>
			</>
		);
	}
	getFractionMember(id: number) {
		if (!this.state.fractionData) return null;
		return this.state.fractionData.members.find((q) => q.id === id);
	}
	getFamilyMember(id: number) {
		if (!this.state.familyData) return null;
		return this.state.familyData.members.find((q) => q.id === id);
	}

	get mafiabizPage() {
		return (
			<div className="tablet-home">
				<div className="grid-in-tablet">
					<div className="tablet-info tablet-info-jsb tablet-info-mafia">
						<div className="topline">
							<button
								className="return-btn"
								onClick={(e) => {
									this.setState({ currentPage: "fraction", familyPage: 3 });
								}}
							>
								<span className="icon">
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M9.41424 12L16.7071 19.2929L15.2929 20.7071L6.58582 12L15.2929 3.29291L16.7071 4.70712L9.41424 12Z"
											fill="white"
										/>
									</svg>
								</span>
								<p>
									{LangString(
										"components.Tablet.index.f2280a3c039cbeb9d6986e7c8795ffe9",
									)}
								</p>
							</button>

							<div className="title-wrap">
								<div className="title">
									<div className="icon">
										<svg
											width="36"
											height="36"
											viewBox="0 0 36 36"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M14.4844 21.875V22.4296C14.4844 24.3712 16.0584 25.9452 18 25.9452C19.9416 25.9452 21.5156 24.3712 21.5156 22.4296V21.875C20.4192 22.279 19.2349 22.4999 18 22.4999C16.765 22.4999 15.5808 22.279 14.4844 21.875Z"
												fill="white"
											/>
											<path
												d="M29.1764 10.2155L26.6902 8.22656L29.1764 6.23763C29.6312 5.87377 29.705 5.21009 29.3411 4.75523C28.9771 4.30038 28.3136 4.22655 27.8587 4.59049L26.0859 6.0087V5.97656C26.0859 2.68109 23.4049 0 20.1094 0H15.8906C12.5951 0 9.91406 2.68109 9.91406 5.97656V7.21448C9.99485 6.71217 10.429 6.32812 10.9541 6.32812H17.9706H24.9872C25.5696 6.32812 26.0419 6.80034 26.0419 7.38281V8.08594C26.0419 10.606 23.9916 12.6562 21.4715 12.6562C20.0673 12.6562 18.8096 12.0191 17.9706 11.0194C17.1316 12.0191 15.8739 12.6562 14.4697 12.6562C12.0672 12.6562 10.0932 10.7925 9.91406 8.43511V12.3047C9.91406 16.7633 13.5414 20.3906 18 20.3906C22.4586 20.3906 26.0859 16.7633 26.0859 12.3047V10.4444L27.8587 11.8626C28.0531 12.0182 28.2858 12.0938 28.5169 12.0938C28.8262 12.0938 29.1328 11.9582 29.3411 11.6978C29.705 11.243 29.6312 10.5794 29.1764 10.2155Z"
												fill="white"
											/>
											<path
												d="M16.9204 8.4375H12.0486C12.2197 9.62852 13.2468 10.5469 14.4845 10.5469C15.7221 10.5469 16.7493 9.62852 16.9204 8.4375Z"
												fill="white"
											/>
											<path
												d="M23.9516 8.4375H19.0798C19.251 9.62852 20.2781 10.5469 21.5157 10.5469C22.7534 10.5469 23.7805 9.62852 23.9516 8.4375Z"
												fill="white"
											/>
											<path
												d="M23.6251 21.4453V22.4297C23.6251 23.7592 23.1605 24.9815 22.3865 25.9453H32.049C31.1434 23.3291 28.6548 21.4453 25.7345 21.4453H23.6251Z"
												fill="white"
											/>
											<path
												d="M12.3751 22.4297V21.4453H10.2657C7.34537 21.4453 4.8568 23.3291 3.95117 25.9453H13.6137C12.8397 24.9815 12.3751 23.7592 12.3751 22.4297Z"
												fill="white"
											/>
											<path
												d="M3.58594 34.9453C3.58594 35.5278 4.05816 36 4.64062 36H31.3594C31.9418 36 32.4141 35.5278 32.4141 34.9453V32.5547H3.58594V34.9453Z"
												fill="white"
											/>
											<path
												d="M32.4131 28.0547H3.58685C3.58664 28.0781 3.58594 28.1015 3.58594 28.125V30.4453H32.4141V28.125C32.4141 28.1015 32.4134 28.0781 32.4131 28.0547Z"
												fill="white"
											/>
										</svg>
									</div>
									<p className="tablet-title-main">
										{fractionCfg.getFraction(this.state.fractionData.id).name}
									</p>
								</div>
							</div>
						</div>

						<ul className="extra-info-tablet-wrap">
							<li className="extra-info-tablet-item">
								<p className="big">
									{this.state.fractionData.mafiabiz?.length || 0}
								</p>
								<p className="descr">
									{LangString(
										"components.Tablet.index.113aaeb9c7a8392324c90dc1b7ac4098",
									)}
								</p>
							</li>
							{/* <li className="extra-info-tablet-item">
                            <p className="big">32</p>
                            <p className="descr">Мафиози</p>
                        </li> */}
						</ul>
					</div>

					<div className="mafia-wrapper">
						<div className="tabs-submittedads-wrapper">
							<p className="tablet-title-main">
								{LangString(
									"components.Tablet.index.e8b77f5a5b60b041302550ede0f659ad",
								)}
							</p>
							{/* <div className="tabs-submittedads-caption-wrapper">
                            <ul className="tabs-submittedads-caption" id="yourDiv">
                                <li className="active">
                                    <p>Все</p>
                                </li>
                                <li className="">
                                    <p>Продажа</p>
                                    <button className="more">
                                        <svg width="14" height="4" viewBox="0 0 14 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect y="0.384613" width="3.23077" height="3.23077" rx="1.61538" fill="white"></rect>
                                            <rect x="5.38477" y="0.384613" width="3.23077" height="3.23077" rx="1.61538" fill="white"></rect>
                                            <rect x="10.7695" y="0.384613" width="3.23077" height="3.23077" rx="1.61538" fill="white"></rect>
                                        </svg>
                                    </button>
                                    <ul className="submittedads-extra-menu">
                                        <li>
                                            <p>Покупка</p>
                                        </li>
                                        <li>
                                            <p>Продажа</p>
                                        </li>
                                        <li>
                                            <p>Аренда</p>
                                        </li>
                                        <li>
                                            <p>Покупка</p>
                                        </li>
                                    </ul>
                                </li>
                                <li className="">
                                    <p>Закупка</p>
                                </li>
                                <li className="">
                                    <p>Проституция</p>
                                </li>
                                <li className="">
                                    <p>Покупка</p>
                                </li>
                                <li>
                                    <p>Аренда</p>
                                </li>
                                <li>
                                    <p>Последний</p>
                                </li>
                            </ul>
                        </div> */}
							<div className="tabs-submittedads-content-wrapper">
								<div className="tabs-submittedads-content-item active">
									<div className="garage-wrap gasstation-wrap">
										{this.state.fractionData.mafiabiz ? (
											this.state.fractionData.mafiabiz.map((biz) => {
												return (
													<a
														href="#"
														className="garage-item"
														onClick={(e) => {
															e.preventDefault();
														}}
													>
														<div className="img-wrap">
															<img src={bizImg[biz.type]} />
														</div>
														<div className="info-wrap">
															<div className="topline">
																<p className="name">{biz.name}</p>
																<p className="descr">
																	{BUSINESS_TYPE_NAMES[biz.type]} (
																	{BUSINESS_SUBTYPE_NAMES[biz.type][biz.stype]})
																</p>
															</div>
															<div className="downline">
																<div className="bage-gps bage-price bage-white">
																	<p>${biz.price}</p>
																</div>
																<p className="status">
																	{LangString(
																		"components.Tablet.index.6eb20f76a07f51a180f353faea6c408a",
																	)}{" "}
																	<span>
																		$
																		{systemUtil.numberFormat(
																			Math.floor(
																				((biz.price / 100) *
																					familyFractionPayDayRewardPercent) /
																					24,
																			),
																		)}
																	</span>
																</p>
															</div>
														</div>
													</a>
												);
											})
										) : (
											<></>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	get gosFractionPage() {
		if (!this.state.fractionData) return <></>;
		return (
			<SocketSync
				path={`tablet_${this.state.fractionData.id}`}
				data={(data: string) => {
					const d = JSON.parse(data);
					this.setState({ fractionData: d });
				}}
			>
				<div className="tablet-home">
					<div className="grid-in-tablet">
						<div className="tablet-info tablet-info-jcs tablet-info-statefunctions">
							<div className="topline">
								<button
									className="return-btn"
									onClick={(e) => {
										this.setState({ currentPage: "fraction", fractionPage: 0 });
									}}
								>
									<span className="icon">
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M9.41424 12L16.7071 19.2929L15.2929 20.7071L6.58582 12L15.2929 3.29291L16.7071 4.70712L9.41424 12Z"
												fill="white"
											/>
										</svg>
									</span>
									<p>
										{LangString(
											"components.Tablet.index.64f66869eb82d187fe7aa1439b2bbbec",
										)}
									</p>
								</button>

								<div className="title-wrap">
									<div className="title">
										<div className="icon">
											<svg
												width="64"
												height="64"
												viewBox="0 0 64 64"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M50.6003 43.2376C49.6877 43.4431 48.9806 43.7148 48.4206 44.0022C50.1743 41.766 51.4942 39.2351 52.404 36.7866C52.4323 36.8103 52.4681 36.8371 52.5215 36.8681C53.1256 37.212 54.4199 37.2578 56.0778 36.2549C57.6792 35.2856 58.5946 33.6054 59 32.6832C57.9939 32.6193 56.0676 32.6586 54.4504 33.6366C53.8497 34.001 53.4076 34.3689 53.0809 34.7204C53.3166 33.9014 53.5093 33.1033 53.6505 32.347C53.6587 32.3035 53.65 32.2616 53.6488 32.2195C54.1492 31.9043 54.8132 31.1726 55.1711 29.6955C55.5749 28.0321 55.0855 26.3779 54.7369 25.5008C54.0274 26.126 52.8255 27.3896 52.4238 29.0444C52.0712 30.5006 52.2757 31.4273 52.5715 31.9378C52.5351 31.9975 52.5057 32.0625 52.4913 32.135C52.2116 33.6316 51.7352 35.2909 51.0693 36.9752C51.0868 36.6898 51.0908 36.383 51.0727 36.0482C50.9569 33.9139 49.7092 32.0912 49.0159 31.2342C48.4228 32.147 47.3786 34.0807 47.4956 36.2368C47.6354 38.8239 48.724 39.639 49.054 39.8278C49.2953 39.9651 49.4487 39.9687 49.4908 39.9665C49.5479 39.964 49.6264 39.9375 49.7171 39.8898C48.242 42.6213 46.2129 45.1975 43.5915 47.037C44.0252 46.4115 44.4278 45.5585 44.7092 44.4075C45.3797 41.6681 44.4326 38.9276 43.9221 37.7384C42.9256 38.5561 40.8188 40.5565 40.1441 43.3196C39.3318 46.6378 40.456 48.121 41.0547 48.4934C38.7071 49.5378 36.2135 49.8835 33.5972 49.5292C33.8193 49.4474 34.04 49.3713 34.2632 49.2812C34.2835 49.2731 34.3041 49.2633 34.3222 49.253C34.5827 49.1133 34.7005 48.7997 34.5858 48.5221C34.4621 48.2253 34.1191 48.0822 33.8176 48.2033C32.9607 48.5495 32.1165 48.8273 31.2841 49.041C30.458 48.8064 29.6212 48.5076 28.7736 48.1402C28.4752 48.0114 28.1285 48.1458 27.9974 48.4393C27.8754 48.7138 27.9856 49.0304 28.2416 49.1766C28.2596 49.1872 28.2803 49.1975 28.2998 49.2062C28.5207 49.3016 28.7397 49.3833 28.9595 49.4709C26.3353 49.7593 23.851 49.3509 21.5314 48.2479C22.1394 47.8909 23.302 46.4361 22.5754 43.0986C21.9716 40.3194 19.9176 38.2668 18.9423 37.4243C18.4012 38.6004 17.3836 41.3164 17.9834 44.0716C18.2351 45.2293 18.6157 46.0921 19.033 46.7282C16.4605 44.8234 14.4981 42.197 13.0941 39.4295C13.1831 39.4794 13.2611 39.5076 13.3179 39.5118C13.3597 39.5151 13.5134 39.5154 13.7581 39.3843C14.0932 39.2041 15.2018 38.416 15.4087 35.8334C15.5807 33.681 14.5871 31.7219 14.0177 30.7943C13.3027 31.6334 12.0084 33.4243 11.8377 35.555C11.8109 35.8892 11.8069 36.1961 11.8171 36.482C11.1944 34.7818 10.7613 33.1111 10.52 31.6078C10.5076 31.535 10.4796 31.4691 10.4448 31.4086C10.7539 30.9056 10.9822 29.9842 10.6675 28.52C10.3084 26.8554 9.14011 25.5622 8.44678 24.9195C8.07553 25.7876 7.5438 27.429 7.90431 29.1019C8.22414 30.5876 8.86944 31.3355 9.36105 31.6633C9.35879 31.7054 9.34918 31.747 9.35597 31.7908C9.47802 32.5501 9.64952 33.3529 9.86424 34.1775C9.54639 33.818 9.11412 33.4389 8.52334 33.0597C6.93184 32.0418 5.00751 31.954 4 31.9927C4.38142 32.9247 5.25331 34.6275 6.82928 35.6365C8.46118 36.6809 9.75575 36.6675 10.3683 36.3389C10.4228 36.3091 10.4587 36.2834 10.4878 36.2602C11.3343 38.7304 12.5884 41.294 14.2836 43.5734C13.7315 43.2719 13.0317 42.9826 12.1248 42.7541C9.36246 42.057 6.56794 42.9583 5.3635 43.442C6.19189 44.446 8.20323 46.5516 10.9619 47.2453C13.3869 47.8563 14.8097 47.3779 15.4411 47.0386C16.0449 46.7137 16.2763 46.3496 16.3145 46.2015C16.3331 46.1301 16.3379 46.0391 16.3283 45.9379C17.4556 47.059 18.7163 48.0554 20.1357 48.8443C20.9344 49.2887 21.7526 49.6542 22.5864 49.9418C21.8433 50.0893 20.8929 50.4372 19.7498 51.1887C19.5322 51.3321 19.3161 51.4891 19.1081 51.6571C17.1389 53.2494 16.1339 55.5165 15.7384 56.608C17.0454 56.6736 19.9772 56.6103 22.3519 55.0487C22.6432 54.8578 22.9172 54.6576 23.1678 54.4548C25.243 52.7774 25.4063 51.1678 25.2182 50.5775C27.1563 50.8581 29.1781 50.7393 31.268 50.2389C33.3452 50.7915 35.3625 50.9611 37.3077 50.7295C37.1046 51.3151 37.2266 52.9283 39.2572 54.657C39.5024 54.8657 39.7717 55.0732 40.0582 55.271C42.3922 56.8917 45.3209 57.0287 46.6296 56.9961C46.2617 55.895 45.3158 53.6034 43.3881 51.962C43.185 51.789 42.9731 51.6264 42.7589 51.4777C41.6353 50.698 40.6942 50.3264 39.9551 50.1602C40.7964 49.8938 41.6226 49.5487 42.4334 49.1247C43.8729 48.3718 45.1585 47.4071 46.3143 46.315C46.3022 46.4157 46.3041 46.5069 46.3211 46.5786C46.3555 46.7279 46.5771 47.0975 47.1729 47.4376C47.7953 47.7921 49.2057 48.3068 51.646 47.757C54.4218 47.1329 56.4866 45.0778 57.3404 44.0956C56.1498 43.5809 53.3793 42.6099 50.6003 43.2376Z"
													fill="white"
												></path>
												<path
													d="M31.5025 18.4832C31.5051 18.5012 31.4865 18.3654 31.5006 18.4708C31.5065 18.5153 31.5039 18.4984 31.5025 18.4832Z"
													fill="white"
												></path>
												<path
													d="M23.2981 19.0658C24.5271 18.8114 25.0015 17.7396 24.9187 16.6151C24.7546 14.3946 24.7786 14.7768 24.4972 12.5641C24.1613 9.91874 20.0597 10.7821 20.3945 13.4149C20.6748 15.6215 20.6514 15.2488 20.8158 17.466C20.8989 18.5927 22.2948 19.2728 23.2981 19.0658Z"
													fill="white"
												></path>
												<path
													d="M25.9598 9.94998C25.9115 12.6815 26.0061 12.8007 26.237 15.523C26.4635 18.1773 30.5769 17.3672 30.3518 14.7327C30.152 12.3789 30.0961 12.6299 30.1379 10.268C30.1859 7.61175 26.0081 7.27979 25.9598 9.94998Z"
													fill="white"
												></path>
												<path
													d="M35.8264 13.909C35.8366 11.4276 35.9657 11.5412 35.6874 9.06904C35.5608 7.94818 34.8299 7 33.5916 7C32.5459 7 31.3689 7.94595 31.496 9.06904C31.7749 11.5409 31.6458 11.4279 31.635 13.909C31.6249 16.578 35.8151 16.5769 35.8264 13.909Z"
													fill="white"
												></path>
												<path
													d="M41.1364 9.96309C41.068 8.83805 40.3682 7.85863 39.1375 7.80339C38.0862 7.75681 36.882 8.64892 36.949 9.77703C37.095 12.1705 36.8958 11.9593 37.0416 14.3528C37.1097 15.4778 37.8096 16.4575 39.0405 16.5125C40.0913 16.5588 41.296 15.6667 41.2282 14.5391C41.0835 12.1451 41.2813 12.3571 41.1364 9.96309Z"
													fill="white"
												></path>
												<path
													d="M24.2717 30.9949C24.5926 31.1285 24.926 31.2474 25.2693 31.3531L25.2761 38.726H36.4807L36.5681 31.0236C37.1241 30.7321 37.6408 30.3893 38.0909 29.9784C39.4553 28.8561 40.4712 27.615 41.0468 26.4987C42.2407 23.8045 43.7709 20.7577 41.3109 19.0265C38.7314 17.2102 33.7673 17.2018 30.8067 18.0443C30.4543 18.145 30.1684 18.3034 29.9413 18.5003C28.3079 19.2706 28.6744 21.5162 30.2891 21.8057C31.3692 21.9993 32.1964 21.8783 34.177 21.9508C34.1838 21.9511 36.5909 21.7329 36.5986 21.7335C35.9016 22.2864 33.2237 23.3272 32.1964 24.4862C31.9258 24.7914 31.3587 25.3226 31.0335 25.6316C29.8404 23.7342 27.1049 22.2741 25.1738 21.6671C24.0166 21.3039 21.9453 20.5487 21.2477 21.7873C19.3994 25.5365 21.0816 28.6067 24.2717 30.9949Z"
													fill="white"
												></path>
											</svg>
										</div>
										<p className="tablet-title-main">
											{LangString(
												"components.Tablet.index.76e5902b4492659302ebde36d71abd2c",
											)}
										</p>
									</div>
									<p className="op40"></p>
								</div>
							</div>

							<div className="tabs-tablet-wrapper">
								<ul className="tabs-tablet-caption">
									{/*<li className={this.state.fractionPage === 0 ? "active" : ""} onClick={e => { e.preventDefault(); this.setState({ fractionPage: 0 }) }}>*/}
									{/*    <button className="btn-tablet white">*/}
									{/*        <span className="icon-wrapper">*/}
									{/*            <span className="icon-wrap">*/}
									{/*                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
									{/*                    <path fillRule="evenodd" clipRule="evenodd" d="M7.00016 25.4383L14.1014 21H23.3335C24.6222 21 25.6668 19.9554 25.6668 18.6667V4.66671C25.6668 3.37804 24.6222 2.33337 23.3335 2.33337H4.66683C3.37817 2.33337 2.3335 3.37804 2.3335 4.66671V18.6667C2.3335 19.9554 3.37817 21 4.66683 21H7.00016V25.4383ZM13.4322 18.6667L9.3335 21.2284V18.6667H4.66683V4.66671H23.3335V18.6667H13.4322Z" fill="#141B1F"></path>*/}
									{/*                </svg>*/}
									{/*            </span>*/}
									{/*        </span>*/}
									{/*        <p>Ситуационные-коды</p>*/}
									{/*    </button>*/}
									{/*</li>*/}
									<li
										className={this.state.fractionPage === 3 ? "active" : ""}
										onClick={(e) => {
											e.preventDefault();
											this.setState({ fractionPage: 3 });
										}}
									>
										<button className="btn-tablet white">
											<span className="icon-wrapper">
												<span className="icon-wrap">
													<svg
														width="28"
														height="28"
														viewBox="0 0 28 28"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															d="M22.6794 15.1669C22.4227 15.1669 22.1544 15.0853 21.8977 15.0269C21.3779 14.9124 20.8672 14.7603 20.3694 14.5719C19.8282 14.375 19.2332 14.3852 18.6991 14.6006C18.1649 14.816 17.7293 15.2213 17.4761 15.7386L17.2194 16.2636C16.0831 15.6315 15.0389 14.8464 14.1161 13.9303C13.1999 13.0074 12.4148 11.9632 11.7827 10.8269L12.2727 10.5003C12.79 10.247 13.1953 9.81137 13.4107 9.27723C13.6261 8.74308 13.6363 8.14815 13.4394 7.60692C13.2541 7.10808 13.1021 6.59752 12.9844 6.07859C12.9261 5.82192 12.8794 5.55359 12.8444 5.28525C12.7027 4.46348 12.2723 3.71929 11.6306 3.1867C10.9889 2.65411 10.1782 2.36813 9.34438 2.38025H5.84439C5.34159 2.37553 4.84368 2.4792 4.38455 2.68421C3.92542 2.88921 3.51585 3.19073 3.18372 3.56825C2.85159 3.94577 2.60471 4.39041 2.45987 4.87192C2.31503 5.35343 2.27564 5.86049 2.34439 6.35859C2.96591 11.2462 5.19809 15.7874 8.68831 19.265C12.1785 22.7425 16.7279 24.9582 21.6177 25.5619H22.0611C22.9214 25.5632 23.752 25.2475 24.3944 24.6753C24.7635 24.3451 25.0583 23.9405 25.2594 23.488C25.4605 23.0355 25.5633 22.5454 25.5611 22.0503V18.5503C25.5468 17.7399 25.2517 16.9596 24.7261 16.3425C24.2006 15.7255 23.4772 15.31 22.6794 15.1669V15.1669ZM23.2627 22.1669C23.2625 22.3326 23.227 22.4963 23.1586 22.6471C23.0902 22.798 22.9905 22.9326 22.8661 23.0419C22.7357 23.1545 22.5833 23.2386 22.4185 23.2888C22.2538 23.339 22.0804 23.3543 21.9094 23.3336C17.5401 22.7734 13.4817 20.7745 10.3742 17.6523C7.26678 14.53 5.2872 10.4621 4.74772 6.09025C4.72915 5.91936 4.74542 5.74647 4.79555 5.58204C4.84568 5.41761 4.92863 5.26506 5.03939 5.13359C5.14871 5.00914 5.28329 4.9094 5.43416 4.84101C5.58503 4.77261 5.74874 4.73713 5.91439 4.73692H9.41438C9.68569 4.73088 9.95061 4.81961 10.1636 4.98784C10.3765 5.15606 10.5241 5.39325 10.5811 5.65859C10.6277 5.97748 10.6861 6.29247 10.7561 6.60359C10.8908 7.21859 11.0702 7.82296 11.2927 8.41192L9.65938 9.17025C9.51973 9.23433 9.39411 9.32536 9.28974 9.43811C9.18536 9.55087 9.10429 9.68314 9.05117 9.82731C8.99805 9.97149 8.97393 10.1247 8.98021 10.2783C8.98648 10.4318 9.02302 10.5826 9.08772 10.7219C10.7668 14.3185 13.6578 17.2095 17.2544 18.8886C17.5384 19.0053 17.857 19.0053 18.1411 18.8886C18.2865 18.8365 18.4203 18.7561 18.5344 18.652C18.6486 18.5478 18.7409 18.422 18.8061 18.2819L19.5294 16.6486C20.1325 16.8643 20.7481 17.0435 21.3727 17.1853C21.6838 17.2553 21.9988 17.3136 22.3177 17.3603C22.5831 17.4172 22.8202 17.5648 22.9885 17.7778C23.1567 17.9907 23.2454 18.2556 23.2394 18.5269L23.2627 22.1669ZM25.5027 3.12692C25.3843 2.84185 25.1578 2.61531 24.8727 2.49692C24.7325 2.43714 24.5818 2.40543 24.4294 2.40359H19.7627C19.4533 2.40359 19.1566 2.5265 18.9378 2.7453C18.719 2.96409 18.5961 3.26083 18.5961 3.57025C18.5961 3.87967 18.719 4.17642 18.9378 4.39521C19.1566 4.614 19.4533 4.73692 19.7627 4.73692H21.6061L17.7677 8.58692C17.5504 8.80551 17.4285 9.1012 17.4285 9.40942C17.4285 9.71764 17.5504 10.0133 17.7677 10.2319C17.9863 10.4492 18.282 10.5712 18.5902 10.5712C18.8984 10.5712 19.1941 10.4492 19.4127 10.2319L23.2627 6.39359V8.23692C23.2627 8.54634 23.3856 8.84308 23.6044 9.06188C23.8232 9.28067 24.12 9.40359 24.4294 9.40359C24.7388 9.40359 25.0355 9.28067 25.2543 9.06188C25.4731 8.84308 25.5961 8.54634 25.5961 8.23692V3.57025C25.5942 3.4178 25.5625 3.26718 25.5027 3.12692V3.12692Z"
															fill="#141B1F"
														/>
													</svg>
												</span>
											</span>
											<p>
												{LangString(
													"components.Tablet.index.4dc2ba1be730a1d975b6150c2cd18b8b",
												)}
											</p>
										</button>
									</li>

									{(this.state.fractionData.id === 1 ||
										fractionCfg.getFraction(this.state.fractionData.id)
											.police) &&
									this.state.fractionData.id != 4 ? (
										<>
											<li
												className={
													this.state.fractionPage === 1 ? "active" : ""
												}
												onClick={(e) => {
													e.preventDefault();
													this.setState({
														fractionPage: 1,
														gosSearchResult: null,
														gosSearchItem: null,
													});
												}}
											>
												<button className="btn-tablet white">
													<span className="icon-wrapper">
														<span className="icon-wrap">
															<svg
																width="28"
																height="28"
																viewBox="0 0 28 28"
																fill="none"
																xmlns="http://www.w3.org/2000/svg"
															>
																<path
																	fillRule="evenodd"
																	clipRule="evenodd"
																	d="M13.9998 26.8333C6.91218 26.8333 1.1665 21.0876 1.1665 14C1.1665 6.9123 6.91218 1.16663 13.9998 1.16663C21.0875 1.16663 26.8332 6.9123 26.8332 14C26.8332 21.0876 21.0875 26.8333 13.9998 26.8333ZM22.6326 19.9787C23.8099 18.282 24.4998 16.2216 24.4998 14C24.4998 8.20097 19.7988 3.49996 13.9998 3.49996C8.20085 3.49996 3.49984 8.20097 3.49984 14C3.49984 16.2216 4.18978 18.282 5.36709 19.9787C6.68012 18.2444 9.76554 17.5 13.9998 17.5C18.2341 17.5 21.3196 18.2444 22.6326 19.9787ZM20.9586 21.863C20.6172 20.6352 18.1641 19.8333 13.9998 19.8333C9.83556 19.8333 7.38251 20.6352 7.04104 21.863C8.89369 23.5038 11.3304 24.5 13.9998 24.5C16.6692 24.5 19.106 23.5038 20.9586 21.863ZM13.9998 6.99996C11.1755 6.99996 9.33317 9.04835 9.33317 11.6666C9.33317 15.6652 11.3875 17.5 13.9998 17.5C16.5876 17.5 18.6665 15.7262 18.6665 11.9C18.6665 9.2418 16.8164 6.99996 13.9998 6.99996ZM11.6665 11.6666C11.6665 14.3141 12.6211 15.1666 13.9998 15.1666C15.3738 15.1666 16.3332 14.3481 16.3332 11.9C16.3332 10.4421 15.4181 9.33329 13.9998 9.33329C12.5225 9.33329 11.6665 10.2851 11.6665 11.6666Z"
																	fill="#141B1F"
																/>
															</svg>
														</span>
													</span>
													<p>
														{LangString(
															"components.Tablet.index.1204646d9806d0b204eaa57067acc2fb",
														)}
													</p>
												</button>
											</li>
											<li
												className={
													this.state.fractionPage === 2 ? "active" : ""
												}
												onClick={(e) => {
													e.preventDefault();
													this.setState({ fractionPage: 2 });
												}}
											>
												<button className="btn-tablet white">
													<span className="icon-wrapper">
														<span className="icon-wrap">
															<svg
																width="28"
																height="28"
																viewBox="0 0 28 28"
																fill="none"
																xmlns="http://www.w3.org/2000/svg"
															>
																<g id="24 / music / record">
																	<path
																		id="icon"
																		fillRule="evenodd"
																		clipRule="evenodd"
																		d="M1.16699 14C1.16699 21.0877 6.91267 26.8333 14.0003 26.8333C21.088 26.8333 26.8337 21.0877 26.8337 14C26.8337 6.91234 21.088 1.16666 14.0003 1.16666C6.91267 1.16666 1.16699 6.91234 1.16699 14ZM24.5003 14C24.5003 19.799 19.7993 24.5 14.0003 24.5C8.20133 24.5 3.50033 19.799 3.50033 14C3.50033 8.20101 8.20133 3.5 14.0003 3.5C19.7993 3.5 24.5003 8.20101 24.5003 14Z"
																		fill="#141B1F"
																	/>
																</g>
															</svg>
														</span>
													</span>
													<p>
														{LangString(
															"components.Tablet.index.b266b098494fbe514c57cf3dde80f733",
														)}
													</p>
												</button>
											</li>
										</>
									) : (
										<></>
									)}
									{fractionCfg.getFraction(this.state.fractionData.id).police &&
									this.state.fractionData.id != 4 ? (
										<>
											<li
												className={
													this.state.fractionPage === 4 ? "active" : ""
												}
												onClick={(e) => {
													e.preventDefault();
													this.setState({
														fractionPage: 4,
														gosSearchItem: null,
													});
												}}
											>
												<button className="btn-tablet white">
													<span className="icon-wrapper">
														<span className="icon-wrap">
															<svg
																width="28"
																height="28"
																viewBox="0 0 28 28"
																fill="none"
																xmlns="http://www.w3.org/2000/svg"
															>
																<path
																	fill-rule="evenodd"
																	clip-rule="evenodd"
																	d="M11.6663 20.9999C6.51168 20.9999 2.33301 16.8212 2.33301 11.6666C2.33301 6.51193 6.51168 2.33325 11.6663 2.33325C16.821 2.33325 20.9997 6.51193 20.9997 11.6666C20.9997 13.8234 20.2681 15.8094 19.0395 17.3898L25.3246 23.675L23.6747 25.3249L17.3896 19.0397C15.8091 20.2683 13.8232 20.9999 11.6663 20.9999ZM18.6663 11.6666C18.6663 15.5326 15.5323 18.6666 11.6663 18.6666C7.80035 18.6666 4.66634 15.5326 4.66634 11.6666C4.66634 7.80059 7.80035 4.66659 11.6663 4.66659C15.5323 4.66659 18.6663 7.80059 18.6663 11.6666Z"
																	fill="#141B1F"
																/>
															</svg>
														</span>
													</span>
													<p>
														{LangString(
															"components.Tablet.index.461eff85204d918cef288c20ad6d4b73",
														)}
													</p>
												</button>
											</li>
										</>
									) : (
										<></>
									)}
								</ul>
							</div>
						</div>

						<div className="tabs-tablet-content-wrapper">
							{/*{this.state.fractionPage === 0 ? <div className="tabs-tablet-content-item active">*/}
							{/*    <div className="tencodes-wrap">*/}
							{/*    {TENCODES_LIST.map((code, codeid) => {*/}
							{/*        return <div key={`TENCODE_${code[0]}`} className="tencodes-item">*/}
							{/*            <div className="text-wrap">*/}
							{/*                <p className="num">{code[0]}</p>*/}
							{/*                <p className="name">{code[1]}</p>*/}
							{/*            </div>*/}
							{/*            <div className="buttonsList">*/}
							{/*                <button onClick={e => {*/}
							{/*                    e.preventDefault();*/}
							{/*                    CustomEvent.triggerServer('dispatch:tencode', codeid)*/}
							{/*                }}>*/}
							{/*                    <span className="icon-wrap">*/}
							{/*                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
							{/*                            <g id="24 / chatting / comment-checked">*/}
							{/*                                <path id="icon" fillRule="evenodd" clipRule="evenodd" d="M9.0651 13.5L4.5 16.3532V13.5H3C2.17157 13.5 1.5 12.8284 1.5 12V3C1.5 2.17157 2.17157 1.5 3 1.5H15C15.8284 1.5 16.5 2.17157 16.5 3V12C16.5 12.8284 15.8284 13.5 15 13.5H9.0651ZM6 13.6468L8.6349 12H15V3H3V12H6V13.6468ZM11.4697 4.71967L8.24998 7.93934L6.53031 6.21967L5.46965 7.28033L8.24998 10.0607L12.5303 5.78033L11.4697 4.71967Z" fill="white"></path>*/}
							{/*                            </g>*/}
							{/*                        </svg>*/}
							{/*                    </span>*/}
							{/*                    <p>Сообщить</p>*/}
							{/*                </button>*/}
							{/*                {CEF.user.isSubLeader ? <button onClick={e => {*/}
							{/*                    e.preventDefault();*/}
							{/*                    CustomEvent.triggerServer('dispatch:tencode', codeid, true)*/}
							{/*                }}>*/}
							{/*                    <span className="icon-wrap">*/}
							{/*                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
							{/*                            <g id="24 / chatting / comment-checked">*/}
							{/*                                <path id="icon" fillRule="evenodd" clipRule="evenodd" d="M9.0651 13.5L4.5 16.3532V13.5H3C2.17157 13.5 1.5 12.8284 1.5 12V3C1.5 2.17157 2.17157 1.5 3 1.5H15C15.8284 1.5 16.5 2.17157 16.5 3V12C16.5 12.8284 15.8284 13.5 15 13.5H9.0651ZM6 13.6468L8.6349 12H15V3H3V12H6V13.6468ZM11.4697 4.71967L8.24998 7.93934L6.53031 6.21967L5.46965 7.28033L8.24998 10.0607L12.5303 5.78033L11.4697 4.71967Z" fill="white"></path>*/}
							{/*                            </g>*/}
							{/*                        </svg>*/}
							{/*                    </span>*/}
							{/*                    <p>Сообщить всем структурам</p>*/}
							{/*                </button> : <></>}*/}
							{/*            </div>*/}

							{/*        </div>*/}
							{/*    })}*/}
							{/*        </div>*/}
							{/*</div> : <></>}*/}
							{this.state.fractionPage === 1 ? (
								<div className="tabs-tablet-content-item active">
									<div className="search-citizen-wrapper">
										{!this.state.gosSearchResult &&
										!this.state.gosSearchItem ? (
											<div className="tablet-form-wrapper">
												<form className="tablet-form-wrap">
													<p className="tablet-title-main">
														{LangString(
															"components.Tablet.index.4840cb881466ead0745c98a06d23e9e7",
														)}
													</p>
													<div className="input-wrapper">
														<div className="input-wrap">
															<label htmlFor="searchgosidname">
																{LangString(
																	"components.Tablet.index.395cc95a8568ab9196e90716921d7d18",
																)}
															</label>
															<input
																type="text"
																id="searchgosidname"
																placeholder={LangString(
																	"components.Tablet.index.3e304a0532ffe58402a9374c48639ebc",
																)}
															/>
														</div>
														<div className="input-wrap">
															<label htmlFor="searchgosdocuments">
																{LangString(
																	"components.Tablet.index.cb96bdfdee0060ae9c16c87d470e2ccb",
																)}
															</label>
															<input
																type="text"
																id="searchgosdocuments"
																placeholder={LangString(
																	"components.Tablet.index.7b523fadc0f75126957ae6cfccde4c42",
																)}
															/>
														</div>
														<div className="input-wrap">
															<label htmlFor="searchgosbank">
																{LangString(
																	"components.Tablet.index.3ad5ec9e9f0a5e7021a3c5982e17a834",
																)}
															</label>
															<input
																type="text"
																id="searchgosbank"
																placeholder={LangString(
																	"components.Tablet.index.162c58f37e0791788f8ce654ab8a9d3e",
																)}
															/>
														</div>
														{/* <div className="input-wrap">
                                            <label htmlFor="searchgosveh">Введите номерной знак ТС</label>
                                            <input type="text" id="searchgosveh" placeholder="Например, ABC123DEF" />
                                        </div> */}
													</div>
													<button
														className="btn-primary"
														onClick={(e) => {
															e.preventDefault();
															const id = parseInt(
																$("#searchgosidname").val() as string,
															);
															const name =
																id == $("#searchgosidname").val()
																	? null
																	: ($("#searchgosidname").val() as string);
															const social = $("#searchgosdocuments").val();
															const bank = $("#searchgosbank").val();
															// const veh = $('#searchgosveh').val()
															const veh: string = null;
															if (CEF.test) {
																this.setState({
																	gosSearchResult: [
																		{ id: 1, name: "Xander Test" },
																	],
																});
																return;
															}
															CustomEvent.callServer(
																"faction:database:search",
																id,
																name,
																social,
																bank,
																veh,
															).then(
																(res: {
																	status?: string;
																	data?: { id: number; name: string }[];
																}) => {
																	if (res.status)
																		return CEF.alert.setAlert(
																			"error",
																			res.status,
																		);
																	this.setState({ gosSearchResult: res.data });
																},
															);
														}}
													>
														<p>
															{LangString(
																"components.Tablet.index.9cabfd29de52497f5516791ab8aaef83",
															)}
														</p>
													</button>
												</form>
											</div>
										) : (
											<></>
										)}
										<div
											className="results-wrapper"
											style={{
												display:
													this.state.gosSearchResult &&
													!this.state.gosSearchItem
														? "block"
														: "none",
											}}
										>
											<p className="tablet-title-main">
												{LangString(
													"components.Tablet.index.05ce53644b9e1aa14f1a6d03152a22ee",
												)}
											</p>
											<div className="citizen-database-wrap results-wrap">
												{this.state.gosSearchResult
													? this.state.gosSearchResult.map((item) => {
															return (
																<div
																	key={`citizen_${item.id}`}
																	className="citizen-database-item item-online"
																	onClick={(e) => {
																		e.preventDefault();
																		if (CEF.test) {
																			this.setState({
																				gosSearchItem: {
																					id: 1,
																					name: "Xander Test",
																					bank: "QWEQWEQWE",
																					social: "QWEQWE",
																					house: "QWEQWEQWE",
																					vehs: [
																						{
																							id: 1,
																							model: "xa21",
																							name: "xa21",
																							number: "xa21",
																						},
																					],
																					wanted_level: 4,
																					wanted_reason: "asfasfas",
																				},
																			});
																			return;
																		}

																		CustomEvent.callServer(
																			"faction:database:data",
																			item.id,
																		).then((status) => {
																			if (!status) return;
																			this.setState({ gosSearchItem: status });
																		});
																	}}
																>
																	<p className="name">{item.name}</p>
																	<p className="num">№{item.id}</p>
																</div>
															);
														})
													: ""}
											</div>
										</div>
										<div
											className="in-results-wrapper"
											style={
												this.state.gosSearchItem ? { display: "block" } : {}
											}
										>
											{this.gosSearchModal()}
										</div>
									</div>
								</div>
							) : (
								<></>
							)}
							{this.state.fractionPage === 2 ? (
								<div className="tabs-tablet-content-item active">
									<div className="transport-database-wrapper active">
										<div className="tablet-search-wrap">
											<input
												type="text"
												placeholder={LangString(
													"components.Tablet.index.91cd700358f5b8dcea208f253cdd6921",
												)}
												value={this.state.gosSearchVehicle}
												onChange={(e) => {
													this.setState({
														gosSearchVehicle: e.currentTarget.value,
													});
												}}
												onKeyDown={(e) => {
													if (e.keyCode === 13) {
														e.preventDefault();
														if (!this.state.gosSearchVehicle) return;
														CustomEvent.callServer(
															"faction:database:searchvehicle",
															this.state.gosSearchVehicle,
														).then((data) => {
															if (!data) return;
															this.setState({ gosSearchVehicleData: data });
														});
													}
												}}
											/>
											<button
												className="search-icon"
												onClick={(e) => {
													e.preventDefault();
													if (!this.state.gosSearchVehicle) return;
													CustomEvent.callServer(
														"faction:database:searchvehicle",
														this.state.gosSearchVehicle,
													).then((data) => {
														if (!data) return;
														this.setState({ gosSearchVehicleData: data });
													});
												}}
											>
												<svg
													width="28"
													height="28"
													viewBox="0 0 28 28"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														fillRule="evenodd"
														clipRule="evenodd"
														d="M11.6668 21C6.51217 21 2.3335 16.8213 2.3335 11.6666C2.3335 6.51199 6.51217 2.33331 11.6668 2.33331C16.8215 2.33331 21.0002 6.51199 21.0002 11.6666C21.0002 13.8235 20.2686 15.8094 19.04 17.3899L25.3251 23.675L23.6752 25.3249L17.3901 19.0398C15.8096 20.2684 13.8237 21 11.6668 21ZM18.6668 11.6666C18.6668 15.5326 15.5328 18.6666 11.6668 18.6666C7.80084 18.6666 4.66683 15.5326 4.66683 11.6666C4.66683 7.80065 7.80084 4.66665 11.6668 4.66665C15.5328 4.66665 18.6668 7.80065 18.6668 11.6666Z"
														fill="white"
													></path>
												</svg>
											</button>
										</div>
										<div className="garage-wrap gasstation-wrap">
											{this.state.gosSearchVehicleData ? (
												this.state.gosSearchVehicleData.map((veh, ids) => {
													return (
														<a
															href="#"
															key={`vehgos_${ids}`}
															className="garage-item"
														>
															<div className="img-wrap">
																<img
																	src={CEF.getVehicleURL(veh.model)}
																	alt="gasoline"
																/>
															</div>
															<div className="info-wrap">
																<div className="topline">
																	<p className="name">{veh.name}</p>
																	<p className="descr">
																		{LangString(
																			"components.Tablet.index.4fb9716542041e8d0d9929d17ac262d9",
																		)}{" "}
																		{veh.ownername} #{veh.owner}
																	</p>
																</div>
																<div className="downline">
																	<div className="bage-gps bage-price bage-white">
																		<p>
																			{veh.number ||
																				LangString(
																					"components.Tablet.index.5ab32f003b07a764321a2a7137c4507b",
																				)}
																		</p>
																	</div>
																	{/* <p className="status">Под контролем <span>44 дня</span></p> */}
																</div>
															</div>
														</a>
													);
												})
											) : (
												<></>
											)}
										</div>
									</div>
								</div>
							) : (
								<></>
							)}

							{this.state.fractionPage === 3 ? (
								<div className="tabs-tablet-content-item active">
									<div className="tabs-fractiontag-wrapper tabs-innerall-wrapper">
										{/* Табы для выбора куда отправлять тен-код или какие были выведены */}
										<div className="tabs-fractiontag-caption-wrapper tabs-innerall-caption-wrapper">
											<ul className="tabs-fractiontag-caption tabs-innerall-caption">
												<li
													className={!this.state.gosPage ? "active" : ""}
													onClick={(e) => {
														this.setState({
															gosPage: 0,
															gosTenCodeSelected: {
																value: "-1",
																label: (
																	<>
																		{LangString(
																			"components.Tablet.index.f9f084b961e66ececc224d3ee03d2d23",
																		)}
																	</>
																),
															},
														});
													}}
												>
													<p>
														{LangString(
															"components.Tablet.index.ac2acd9428057f8cb6ba3fb96d2d2715",
														)}
													</p>
												</li>
												<li
													className={this.state.gosPage == 2 ? "active" : ""}
													onClick={(e) => {
														this.setState({
															gosPage: 2,
															gosTenCodeSelected: {
																value: "-1",
																label: (
																	<>
																		{LangString(
																			"components.Tablet.index.0c40960cd2dacc5bb6b076c3d8b1efdb",
																		)}
																	</>
																),
															},
														});
													}}
												>
													<p>
														{LangString(
															"components.Tablet.index.b17baa94c73772651b8b3139bccfb47d",
														)}
													</p>
												</li>
											</ul>
										</div>
										<div className="tabs-innerall-content-wrapper tabs-fractiontag-content-wrapper height-for-inner-tab">
											<div className="tabs-innerall-content-item tabs-fractiontag-content-item plrb30 active">
												{/* Auswählen des zu sendenden Codes */}

												<div className="flex-line ten-code-line">
													<div className="select-all">
														<Select
															onChange={(e) => {
																this.setState({
																	gosTenCodeSelected: {
																		value: (e as any).value,
																		label: (e as any).label,
																	},
																});
															}}
															classNamePrefix={"ten_code"}
															value={this.state.gosTenCodeSelected}
															defaultValue={this.state.gosTenCodeSelected}
															isOptionDisabled={(option, options) => {
																return false;
															}}
															options={TENCODES_LIST.map(
																([codeName, codeDesc], codeID) => {
																	return {
																		value: `${codeID}`,
																		label: (
																			<span
																				dangerouslySetInnerHTML={{
																					__html: `<b>${codeName}</b> — ${codeDesc}`,
																				}}
																			/>
																		),
																	};
																},
															)}
															style={{ zIndex: 9999 }}
														/>
													</div>
													<button
														className="easy-button green"
														onClick={() => {
															CustomEvent.triggerServer(
																"dispatch:tencode",
																Number(
																	this.state.gosTenCodeSelected.value || 0,
																),
																!!this.state.gosPage,
															);
														}}
													>
														<p>
															{LangString(
																"components.Tablet.index.babf309adc0a194ff36ec65f0c6170ec",
															)}
														</p>
													</button>
												</div>
												{/* Список вызовов фракции и тен-кодов от организций (выделены отдельно ниже) */}
												<ul className="fraction-order-list">
													{this.state.fractionData.alerts
														.sort((a, b) => b.id - a.id)
														.map((gosData) => {
															if (gosData.type == 0 && !this.state.gosPage) {
																return (
																	<li className="f-o-l-item">
																		<div>
																			<p>
																				<strong>{gosData.name}</strong> —{" "}
																				{gosData.text}
																			</p>
																			<p>
																				<small>
																					#{gosData.id} |{" "}
																					{systemUtil.timeStampString(
																						gosData.timestamp,
																					)}
																					{gosData.pos[0]
																						? ` | ${Math.round(systemUtil.distanceToPos2D({ x: gosData.pos[0], y: gosData.pos[1] }, { x: this.state.fractionData.playerPosition.x, y: this.state.fractionData.playerPosition.y }))} м.`
																						: ""}
																				</small>
																			</p>
																		</div>
																		<div className="flex-column right">
																			{!gosData.actual ? (
																				<div>
																					<p>
																						<small>
																							{LangString(
																								"components.Tablet.index.ef97a5cef712c9b1d388c78a082e27a7",
																							)}
																						</small>
																					</p>
																				</div>
																			) : (
																				<button
																					className="easy-button mini green"
																					onClick={(e) => {
																						e.preventDefault();
																						CustomEvent.triggerServer(
																							"dispatch:answer",
																							gosData.id,
																						);
																					}}
																				>
																					<p>
																						{LangString(
																							"components.Tablet.index.6c9d932227b71c6fbe616936c15fb3e4",
																						)}
																					</p>
																				</button>
																			)}
																			{gosData.callAnswered ? (
																				<p className="take-order-f-text mt8">
																					<small>
																						{LangString(
																							"components.Tablet.index.7978de1d2deb64c694d85bde5bc7905c",
																						)}
																					</small>{" "}
																					{String(gosData.callAnswered)}
																				</p>
																			) : (
																				<></>
																			)}
																		</div>
																	</li>
																);
															}
															if (gosData.type == 1) {
																if (
																	(gosData.isGlobal && !this.state.gosPage) ||
																	(!gosData.isGlobal && this.state.gosPage)
																)
																	return <></>;
																let tenCode = TENCODES_LIST[gosData.code];
																return tenCode ? (
																	<li className="f-o-l-item f-o-l-item-ten-code">
																		<div>
																			<p>
																				<strong>{tenCode[0]}</strong> —{" "}
																				{tenCode[1]}
																			</p>
																			<p>
																				<small>
																					#{gosData.id} | {gosData.name} |{" "}
																					{systemUtil.timeStampString(
																						gosData.timestamp,
																					)}
																					{gosData.pos[0]
																						? ` | ${Math.round(systemUtil.distanceToPos2D({ x: gosData.pos[0], y: gosData.pos[1] }, { x: this.state.fractionData.playerPosition.x, y: this.state.fractionData.playerPosition.y }))} м.`
																						: ""}
																				</small>
																			</p>
																		</div>
																		<div>
																			<button
																				className="easy-button green"
																				onClick={() => {
																					CEF.setGPS(
																						gosData.pos[0],
																						gosData.pos[1],
																					);
																				}}
																			>
																				<p>
																					{LangString(
																						"components.Tablet.index.289dd410912d5ac1629f535ad31dd58a",
																					)}
																				</p>
																			</button>
																		</div>
																	</li>
																) : (
																	<></>
																);
															}
														})}
												</ul>
											</div>
										</div>
									</div>
								</div>
							) : (
								<></>
							)}

							{this.state.fractionPage === 4 ? (
								<SocketSync
									path={"tablet_gosSuspects"}
									data={(data: string) => {
										const d = JSON.parse(data);
										this.setState({ gosSuspects: d });
									}}
								>
									<div
										className="in-results-wrapper"
										style={this.state.gosSearchItem ? { display: "block" } : {}}
									>
										{this.gosSearchModal()}
									</div>
									<div className="tabs-submittedads-content-item active">
										<div className="tablet-search-wrap fam-size police-search-padding">
											<input
												type="text"
												placeholder={LangString(
													"components.Tablet.index.f593a85dd3008c06e8506f0c4da0dd76",
												)}
												value={this.state.gosSuspectSearch}
												onChange={(e) => {
													e.preventDefault();
													this.setState({
														gosSuspectSearch:
															e.currentTarget.value?.toLowerCase(),
													});
												}}
											/>
											<button className="search-icon fam-size">
												<svg
													width="28"
													height="28"
													viewBox="0 0 28 28"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														fillRule="evenodd"
														clipRule="evenodd"
														d="M11.6668 21C6.51217 21 2.3335 16.8213 2.3335 11.6666C2.3335 6.51199 6.51217 2.33331 11.6668 2.33331C16.8215 2.33331 21.0002 6.51199 21.0002 11.6666C21.0002 13.8235 20.2686 15.8094 19.04 17.3899L25.3251 23.675L23.6752 25.3249L17.3901 19.0398C15.8096 20.2684 13.8237 21 11.6668 21ZM18.6668 11.6666C18.6668 15.5326 15.5328 18.6666 11.6668 18.6666C7.80084 18.6666 4.66683 15.5326 4.66683 11.6666C4.66683 7.80065 7.80084 4.66665 11.6668 4.66665C15.5328 4.66665 18.6668 7.80065 18.6668 11.6666Z"
														fill="white"
													/>
												</svg>
											</button>
										</div>
										{this.getSuspectsPage()}
									</div>
								</SocketSync>
							) : (
								<></>
							)}
						</div>
					</div>
				</div>
			</SocketSync>
		);
	}

	get familyPage() {
		if (!this.state.familyData) return <></>;
		return (
			<SocketSync
				path={`tablet_family_${this.state.familyData.id}`}
				data={(data: string) => {
					const d = JSON.parse(data);
					this.setState({ familyData: d });
				}}
			>
				<>
					<div className="tablet-blur" />
					<div className="tablet-home">
						<div className="grid-in-tablet">
							<div className={"tablet-info tablet-info-jcs tablet-info-family"}>
								<div className="topline">
									<button
										className="return-btn"
										onClick={(e) => {
											this.setState({ currentPage: "main" });
										}}
									>
										<span className="icon">
											<svg
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													fillRule="evenodd"
													clipRule="evenodd"
													d="M9.41424 12L16.7071 19.2929L15.2929 20.7071L6.58582 12L15.2929 3.29291L16.7071 4.70712L9.41424 12Z"
													fill="white"
												/>
											</svg>
										</span>
										<p>
											{LangString(
												"components.Tablet.index.33ebeb4d97bcaaa18a9cdeb893137c90",
											)}
										</p>
									</button>

									<div className="title-wrap">
										<div className="title">
											<div className="icon">
												<img src={svgs["fam-fist"]} alt="" />
											</div>
											<p className="tablet-title-main">
												{this.state.familyData.name}
											</p>
										</div>
										<p className="op40"></p>
									</div>
								</div>

								<div className="tabs-tablet-wrapper">
									<ul className="tabs-tablet-caption">
										<li
											className={
												this.state.familyPage <= 1 ||
												this.state.familyPage == 11
													? "active"
													: ""
											}
											onClick={(e) => {
												e.preventDefault();
												this.setState({ familyPage: 0 });
											}}
										>
											<button className="btn-tablet fam">
												<span className="icon-wrapper">
													<span className="icon-wrap">
														<img src={svgs["fam-icon-1"]} alt="" />
													</span>
												</span>
												<p>
													{LangString(
														"components.Tablet.index.fa32e4ccd7d3b1dbaabbad24f5a9607e",
													)}
												</p>
											</button>
										</li>
										<li
											className={this.state.familyPage === 2 ? "active" : ""}
											onClick={(e) => {
												e.preventDefault();
												this.setState({ familyPage: 2 });
											}}
										>
											<button className="btn-tablet fam">
												<span className="icon-wrapper">
													<span className="icon-wrap">
														<img src={svgs["fam-icon-2"]} alt="" />
													</span>
												</span>
												<p>
													{LangString(
														"components.Tablet.index.462483337e5e869c9eac7e095ab377ca",
													)}
												</p>
											</button>
										</li>
										<li
											className={
												(this.state.familyPage >= 4 &&
													this.state.familyPage <= 5) ||
												(this.state.familyPage >= 12 &&
													this.state.familyPage <= 13)
													? "active"
													: ""
											}
											onClick={(e) => {
												e.preventDefault();
												this.setState({ familyPage: 4 });
											}}
										>
											<button className="btn-tablet fam">
												<span className="icon-wrapper">
													<span className="icon-wrap">
														<img src={svgs["fam-icon-3"]} alt="" />
													</span>
												</span>
												<p>
													{LangString(
														"components.Tablet.index.283c8b280010ccc880a3ca9c2becbc29",
													)}
												</p>
											</button>
										</li>
										<li
											className={
												this.state.familyPage >= 6 &&
												this.state.familyPage <= 10
													? "active"
													: ""
											}
											onClick={(e) => {
												e.preventDefault();
												this.setState({ familyPage: 6 });
											}}
										>
											<button className="btn-tablet fam">
												<span className="icon-wrapper">
													<span className="icon-wrap">
														<img src={svgs["fam-icon-4"]} alt="" />
													</span>
												</span>
												<p>
													{LangString(
														"components.Tablet.index.a291be34de75c5bc112f09368bd94c48",
													)}
												</p>
											</button>
										</li>
										<li
											className={
												this.state.familyPage === 3 ||
												this.state.familyPage === 21
													? "active"
													: ""
											}
											onClick={(e) => {
												e.preventDefault();
												this.setState({ familyPage: 3, familyAccept: false });
											}}
										>
											<button className="btn-tablet fam">
												<span className="icon-wrapper">
													<span className="icon-wrap">
														<img src={svgs["fam-icon-5"]} alt="" />
													</span>
												</span>
												<p>
													{LangString(
														"components.Tablet.index.f1f8748b83f58bf30a7999476288d2b1",
													)}
												</p>
											</button>
										</li>
									</ul>
								</div>
							</div>
							<div className="tabs-tablet-content-wrapper fam-conent-tablet">
								{this.state.familyPage <= 1 || this.state.familyPage == 11 ? (
									<div className="tabs-tablet-content-item active">
										{(!this.state.familyKickId ||
											!this.getFamilyMember(this.state.familyKickId)) &&
										!this.state.familyKickRank ? (
											<section className="submitted-ads">
												<div className="tabs-submittedads-wrapper">
													<div className="tabs-submittedads-caption-wrapper">
														<ul className="tabs-submittedads-caption fam">
															<li
																className={
																	this.state.familyPage == 0 ? "active" : ""
																}
																onClick={(e) => {
																	e.preventDefault();
																	this.setState({ familyPage: 0 });
																}}
															>
																<p>
																	{LangString(
																		"components.Tablet.index.db067908cf03d9958b1505876425649a",
																	)}
																</p>
															</li>
															<li
																className={
																	this.state.familyPage === 1 ? "active" : ""
																}
																onClick={(e) => {
																	e.preventDefault();
																	this.setState({ familyPage: 1 });
																}}
															>
																<p>
																	{LangString(
																		"components.Tablet.index.68f29e3e1b94d4dbddb1baf27e096d20",
																	)}
																</p>
															</li>
															<li
																className={
																	this.state.familyPage === 11 ? "active" : ""
																}
																onClick={(e) => {
																	e.preventDefault();
																	this.setState({
																		familyPage: 11,
																		familyData: {
																			...this.state.familyData,
																			changeRank: { id: -1 },
																		},
																	});
																}}
															>
																<p>
																	{LangString(
																		"components.Tablet.index.24ea61e65c6da6230d3c5f4664b16166",
																	)}
																</p>
															</li>
														</ul>
													</div>
													<div className="tabs-submittedads-content-wrapper">
														{this.state.familyPage === 1 ? (
															<div className="tabs-submittedads-content-item active">
																<div className="member-list-wrap fam-size plrb30">
																	<div className="info-line-garage">
																		<img src={svgs["info"]} alt="" />
																		<p>
																			{LangString(
																				"components.Tablet.index.bf2e19729887865595875ecef215a508",
																			)}
																			<br />
																			{LangString(
																				"components.Tablet.index.e4a7bceffc09989824889edffb07e253",
																			)}{" "}
																		</p>
																	</div>
																	<div className="warehouse-size mb24">
																		<p className="font40 fontw300 mr12">
																			{systemUtil.numberFormat(
																				this.state.familyData.season_scores,
																			)}
																		</p>
																		<p className="op4 font16">
																			{LangString(
																				"components.Tablet.index.42d754aa4662c73724d091a63a55546b",
																			)}
																			<br />
																			{LangString(
																				"components.Tablet.index.a904bd4f2b7e63c8350688403a63d0f5",
																			)}
																		</p>
																	</div>
																	{system
																		.sortArrayObjects(
																			[
																				...this.state.familyData.members
																					.filter(
																						(q) =>
																							!this.state.familySearch ||
																							parseInt(
																								this.state.familySearch,
																							) === q.id ||
																							q.name
																								.toLowerCase()
																								.includes(
																									this.state.familySearch,
																								) ||
																							this.familyGetRankName(q.rank)
																								.toLowerCase()
																								.includes(
																									this.state.familySearch,
																								),
																					)
																					.map((q) => {
																						return {
																							...q,
																							online: !q.lastSeen,
																						};
																					}),
																			],
																			[{ id: "scores", type: "DESC" }],
																		)
																		.map((member, id) => {
																			return (
																				<>
																					<div
																						className={`member-list-item ${member.lastSeen === 0 ? "item-online" : ""}`}
																						key={`member_${id}`}
																					>
																						<div className="leftside">
																							<p className="num">{member.id}</p>
																							<p className="name">
																								{member.name}
																							</p>
																						</div>
																						<div className="rightside">
																							<p className="font24 fontw300">
																								+
																								{systemUtil.numberFormat(
																									member.scores,
																								)}
																							</p>
																						</div>
																					</div>
																				</>
																			);
																		})}
																</div>
															</div>
														) : this.state.familyPage === 0 ? (
															<div className="tabs-submittedads-content-item active">
																<div className="tablet-search-wrap tablet-search-wrap-fam-size fam-size plr30">
																	<input
																		type="text"
																		placeholder={LangString(
																			"components.Tablet.index.c33db93bcab3e537a32dc2ec41d3b1ed",
																		)}
																		value={this.state.familySearch}
																		onChange={(e) => {
																			e.preventDefault();
																			this.setState({
																				familySearch:
																					e.currentTarget.value.toLowerCase(),
																			});
																		}}
																	/>
																	<button className="search-icon fam-size">
																		<svg
																			width="28"
																			height="28"
																			viewBox="0 0 28 28"
																			fill="none"
																			xmlns="http://www.w3.org/2000/svg"
																		>
																			<path
																				fillRule="evenodd"
																				clipRule="evenodd"
																				d="M11.6668 21C6.51217 21 2.3335 16.8213 2.3335 11.6666C2.3335 6.51199 6.51217 2.33331 11.6668 2.33331C16.8215 2.33331 21.0002 6.51199 21.0002 11.6666C21.0002 13.8235 20.2686 15.8094 19.04 17.3899L25.3251 23.675L23.6752 25.3249L17.3901 19.0398C15.8096 20.2684 13.8237 21 11.6668 21ZM18.6668 11.6666C18.6668 15.5326 15.5328 18.6666 11.6668 18.6666C7.80084 18.6666 4.66683 15.5326 4.66683 11.6666C4.66683 7.80065 7.80084 4.66665 11.6668 4.66665C15.5328 4.66665 18.6668 7.80065 18.6668 11.6666Z"
																				fill="white"
																			></path>
																		</svg>
																	</button>
																	<div
																		className="checkbox-wrap"
																		onClick={() =>
																			CustomEvent.triggerClient(
																				"renderFamilyPlayerBlips",
																				!this.props
																					.enableRenderFamilyPlayerBlips,
																			)
																		}
																	>
																		<input
																			type="checkbox"
																			className="tablet-family-checkbox1"
																			checked={
																				this.props.enableRenderFamilyPlayerBlips
																			}
																		/>
																		<label className="tablet-family-checkbox__span">
																			<span>
																				{LangString(
																					"components.Tablet.index.2865af658807ce8c2e85427c279e3e4c",
																				)}{" "}
																				<br />{" "}
																				{LangString(
																					"components.Tablet.index.7523874daa9e76b4caa3af2498ffa4b8",
																				)}{" "}
																				<br />{" "}
																				{LangString(
																					"components.Tablet.index.6628d901a6749fc39a79a9da51db3de8",
																				)}
																			</span>
																		</label>
																	</div>
																</div>
																<div className="member-list-wrap fam-size-b plrb30">
																	<div className="online-size mb24">
																		<p className="font40 fontw300 mr12">
																			{
																				this.state.familyData.members.filter(
																					(q) => q.lastSeen === 0,
																				).length
																			}{" "}
																			<span className="op4">
																				/ {this.state.familyData.members.length}
																			</span>
																		</p>
																		<p className="op4 font16">
																			{LangString(
																				"components.Tablet.index.e06a521bcd1a2058e35cfa504f7b2163",
																			)}
																			<br />
																			{LangString(
																				"components.Tablet.index.8e6c4e1444035992b3e14a77cfb8393d",
																			)}
																		</p>
																	</div>
																	{system
																		.sortArrayObjects(
																			[
																				...this.state.familyData.members
																					.filter(
																						(q) =>
																							!this.state.familySearch ||
																							parseInt(
																								this.state.familySearch,
																							) === q.id ||
																							q.name
																								.toLowerCase()
																								.includes(
																									this.state.familySearch,
																								) ||
																							this.familyGetRankName(q.rank)
																								.toLowerCase()
																								.includes(
																									this.state.familySearch,
																								),
																					)
																					.map((q) => {
																						return {
																							...q,
																							online: !q.lastSeen,
																						};
																					}),
																			],
																			[
																				{ id: "online", type: "DESC" },
																				{ id: "rank", type: "DESC" },
																			],
																		)
																		.sort((k1, k2) => {
																			return (
																				this.state.familyData.ranks.findIndex(
																					(f) => f.id == k2.rank,
																				) -
																				this.state.familyData.ranks.findIndex(
																					(f) => f.id == k1.rank,
																				)
																			);
																			// return -1
																		})
																		.map((member, id) => {
																			return (
																				<div
																					key={`member_${id}`}
																					className={`member-list-item ${member.lastSeen === 0 ? "item-online" : ""}${member.id === this.state.familySelected ? " selected" : ""}`}
																					onClick={(e) => {
																						e.preventDefault();
																						this.setState({
																							familySelected: member.id,
																						});
																					}}
																				>
																					<div className="leftside">
																						<p className="num">{member.id}</p>
																						<p className="name">
																							{member.name}
																						</p>
																					</div>
																					<div className="rightside">
																						{(this.familyLeader(
																							CEF.user.familyRank,
																						) &&
																							!this.familyLeader(
																								member.rank,
																							)) ||
																						(this.state.familyData.ranks.find(
																							(f) =>
																								f.id == CEF.user.familyRank,
																						) &&
																							this.state.familyData.ranks
																								.find(
																									(f) =>
																										f.id == CEF.user.familyRank,
																								)
																								.rules.includes(
																									FamilyPermissions.kick,
																								) &&
																							this.state.familyData.ranks.findIndex(
																								(f) =>
																									f.id == CEF.user.familyRank,
																							) >
																								this.state.familyData.ranks.findIndex(
																									(f) => f.id == member.rank,
																								)) ? (
																							<>
																								{/* {(this.familySubLeader(CEF.user.familyRank) || this.familyLeader(CEF.user.familyRank)) && member.rank < CEF.user.familyRank ? <> */}
																								<div className="block-hidden">
																									<div className="select-wrapper">
																										<Select
																											onChange={(e) => {
																												CustomEvent.triggerServer(
																													"family:setRank",
																													member.id,
																													parseInt(
																														(e as any).value,
																													),
																												);
																											}}
																											classNamePrefix={
																												"user_role"
																											}
																											defaultValue={this.state.familyData.ranks
																												.map((q, i) => {
																													return {
																														value: `${q.id}`,
																														label: q.name,
																													};
																												})
																												.find(
																													(q) =>
																														q.value ==
																														member.rank.toString(),
																												)}
																											isOptionDisabled={(
																												option,
																												options,
																											) => {
																												return (
																													this.state.familyData.ranks.findIndex(
																														(d) =>
																															d.id ==
																															parseInt(
																																option.value,
																															),
																													) >=
																													this.state.familyData.ranks.findIndex(
																														(d) =>
																															d.id ==
																															CEF.user
																																.familyRank,
																													)
																												);
																											}}
																											options={this.state.familyData.ranks.map(
																												(q, i) => {
																													return {
																														value: `${q.id}`,
																														label: q.name,
																													};
																												},
																											)}
																											style={{ zIndex: 9999 }}
																										/>
																									</div>
																									<button
																										onClick={(e) => {
																											e.preventDefault();
																											this.setState({
																												familyKickId: member.id,
																											});
																										}}
																									>
																										<div className="delete-icon">
																											<svg
																												width="24"
																												height="24"
																												viewBox="0 0 24 24"
																												fill="none"
																												xmlns="http://www.w3.org/2000/svg"
																											>
																												<path
																													fillRule="evenodd"
																													clipRule="evenodd"
																													d="M9 1H15C16.1046 1 17 1.89543 17 3V4H20C21.1046 4 22 4.89543 22 6V8C22 9.10457 21.1046 10 20 10H19.9199L19 21C19 22.1046 18.1046 23 17 23H7C5.89543 23 5 22.1046 5.00345 21.083L4.07987 10H4C2.89543 10 2 9.10457 2 8V6C2 4.89543 2.89543 4 4 4H7V3C7 1.89543 7.89543 1 9 1ZM4 6H7H17H20V8H4V6ZM6.08649 10H17.9132L17.0035 20.917L17 21H7L6.08649 10ZM15 3V4H9V3H15Z"
																													fill="white"
																												></path>
																											</svg>
																										</div>
																									</button>
																								</div>
																								<div className="text-wrap">
																									<p className="lastseen">
																										{member.lastSeen > 0
																											? LangString(
																													"components.Tablet.index.9855ae103493b15c58a7313ca210430f",
																													systemUtil.timeStampString(
																														member.lastSeen,
																													),
																												)
																											: ""}
																									</p>
																									<p className="vocation">
																										{this.familyGetRankName(
																											member.rank,
																										)}
																									</p>
																								</div>
																							</>
																						) : (
																							<>
																								<p className="lastseen">
																									{member.lastSeen > 0
																										? LangString(
																												"components.Tablet.index.2bfe0cae2c0edc01a5ffa3f31c5140ce",
																												systemUtil.timeStampString(
																													member.lastSeen,
																												),
																											)
																										: ""}
																								</p>
																								<p className="vocation">
																									{this.familyGetRankName(
																										member.rank,
																									)}
																								</p>
																							</>
																						)}
																					</div>
																				</div>
																			);
																		})}
																</div>
															</div>
														) : (
															<>
																<div className="tabs-submittedads-content-item active">
																	<div className="member-list-wrap plrb30">
																		{this.state.familyData.ranks.length <
																			family_max_rank &&
																		(this.familySubLeader(
																			CEF.user.familyRank,
																		) ||
																			this.familyLeader(
																				CEF.user.familyRank,
																			)) ? (
																			<button
																				className="easy-button rank green"
																				onClick={() => {
																					CustomEvent.triggerServer(
																						"family:addrank",
																					);

																					//     .then( id => {
																					//     if( id < 0 ) return;
																					//     let ranks = this.state.familyData.ranks.slice(),
																					//         first = ranks.shift();
																					//     ranks.unshift( { id, name:'Новый ранг', rules: []/*new Array(rankRules.length).fill( false )*/ })
																					//     ranks.unshift( first );
																					//     this.setState({familyData:{ ...this.state.familyData, ranks }});
																					// }
																					// );
																				}}
																			>
																				<img src={svgs["add"]} alt="" />
																				{LangString(
																					"components.Tablet.index.a36ae8f28d0084e23d33cc8f51c2100f",
																				)}
																			</button>
																		) : null}
																		{this.state.familyData.ranks.map(
																			(data, id) => {
																				return (
																					<div
																						className={`change-rang-box${data.id !== this.state.familyData.changeRank.id ? " success" : ""}`}
																						key={data.id}
																					>
																						{data.id ===
																							this.state.familyData.changeRank
																								.id &&
																						!data.isSoOwner &&
																						!data.isOwner ? (
																							<div className="rang-box-edit">
																								{id > 1 ? (
																									<button
																										onClick={() => {
																											// let ranks = this.state.familyData.ranks,
																											//     _rank = ranks[id];
																											// ranks[id] = ranks[id-1];
																											// ranks[id-1] = _rank;
																											// this.setState({familyData:{ ...this.state.familyData, ranks } });
																											CustomEvent.triggerServer(
																												"family:rankup",
																												data.id,
																											);
																										}}
																									>
																										<img
																											src={svgs["up"]}
																											alt=""
																										/>
																									</button>
																								) : null}
																								{id > 0 &&
																								id <
																									this.state.familyData.ranks
																										.length -
																										this.state.familyData.ranks
																											.slice()
																											.reverse()
																											.findIndex(
																												(d) =>
																													!d.isSoOwner &&
																													!d.isOwner,
																											) -
																										1 ? (
																									<button
																										onClick={() => {
																											// let ranks = this.state.familyData.ranks,
																											// _rank = ranks[id];
																											// ranks[id] = ranks[id+1];
																											// ranks[id+1] = _rank;
																											// this.setState({familyData:{ ...this.state.familyData, ranks } });
																											CustomEvent.triggerServer(
																												"family:rankdown",
																												data.id,
																											);
																										}}
																									>
																										<img
																											src={svgs["down"]}
																											alt=""
																										/>
																									</button>
																								) : null}
																								{!data.isPermament ? (
																									<button
																										onClick={() => {
																											this.setState({
																												familyKickRank: data.id,
																											});
																										}}
																									>
																										<img
																											src={svgs["delete"]}
																											alt=""
																										/>
																									</button>
																								) : null}
																							</div>
																						) : null}
																						{!this.familySubLeader(
																							CEF.user.familyRank,
																						) &&
																						!this.familyLeader(
																							CEF.user.familyRank,
																						) ? null : (
																							<button
																								className="easy-button"
																								onClick={() => {
																									if (
																										!this.familySubLeader(
																											CEF.user.familyRank,
																										) &&
																										!this.familyLeader(
																											CEF.user.familyRank,
																										)
																									)
																										return;
																									if (
																										data.id !==
																										this.state.familyData
																											.changeRank.id
																									)
																										this.setState({
																											familyData: {
																												...this.state
																													.familyData,
																												changeRank: {
																													id: data.id,
																													name: data.name,
																													rules: data.rules,
																												},
																											},
																										});
																									else {
																										CustomEvent.triggerServer(
																											"family:editrank",
																											data.id,
																											this.state.familyData
																												.changeRank.name,
																											this.state.familyData
																												.changeRank.rules,
																										);
																										let ranks =
																											this.state.familyData.ranks.slice();
																										ranks[id].name =
																											this.state.familyData.changeRank.name;
																										ranks[id].rules =
																											this.state.familyData.changeRank.rules;
																										this.setState({
																											familyData: {
																												...this.state
																													.familyData,
																												changeRank: { id: -1 },
																												ranks,
																											},
																										});
																									}
																								}}
																							>
																								{data.id !==
																								this.state.familyData.changeRank
																									.id
																									? LangString(
																											"components.Tablet.index.6f300f92254e3b9e2ae89436128f14a2",
																										)
																									: LangString(
																											"components.Tablet.index.c62cd71e1fb9a3cf01af631e5b2b91ae",
																										)}
																							</button>
																						)}
																						{data.id ===
																						this.state.familyData.changeRank
																							.id ? (
																							<input
																								type="text"
																								className="rang-box-name-input"
																								placeholder={LangString(
																									"components.Tablet.index.70bd57298f6cf750f983c40cc10ca944",
																								)}
																								value={
																									this.state.familyData
																										.changeRank.name
																								}
																								onChange={(e) => {
																									if (
																										e.target.value.match(
																											/^(?!.*([\s])\1)[а-яА-ЯA-Za-z_\s-]{0,20}$/i,
																										)
																									)
																										this.setState({
																											familyData: {
																												...this.state
																													.familyData,
																												changeRank: {
																													...this.state
																														.familyData
																														.changeRank,
																													name: e.target.value,
																												},
																											},
																										});
																								}}
																							/>
																						) : (
																							<p className="rang-box-name">
																								{data.name}
																							</p>
																						)}
																						{newRankRules.map((r, idx) => {
																							//rankData
																							return (
																								<div
																									className="checkbox-wrap"
																									key={idx}
																								>
																									<input
																										type="checkbox"
																										id={`${data.id}_${idx}`}
																										checked={
																											data.id ===
																											this.state.familyData
																												.changeRank.id
																												? this.state.familyData.changeRank.rules.find(
																														(d) => d == r.id,
																													)
																													? true
																													: false
																												: this.state.familyData.ranks[
																															id
																														].rules.find(
																															(d) => d == r.id,
																														)
																													? true
																													: false
																										}
																										//    checked={ data.id === this.state.familyData.changeRank.id ? this.state.familyData.changeRank.rules[idx] : r}
																										disabled={
																											(this.familySubLeader(
																												CEF.user.familyRank,
																											) ||
																												this.familyLeader(
																													CEF.user.familyRank,
																												)) &&
																											!data.isOwner
																												? false
																												: true
																										}
																										onChange={() => {
																											if (data.isOwner === true)
																												return;
																											if (
																												!this.familySubLeader(
																													CEF.user.familyRank,
																												) &&
																												!this.familyLeader(
																													CEF.user.familyRank,
																												)
																											)
																												return;

																											let rules =
																												data.id ===
																												this.state.familyData
																													.changeRank.id
																													? this.state.familyData.changeRank.rules.slice()
																													: this.state.familyData.ranks[
																															id
																														].rules.slice();
																											//                                                                                                rules[idx] = !rules[idx];
																											if (
																												rules.find(
																													(d) => d == r.id,
																												)
																											)
																												rules = rules.filter(
																													(d) => d !== r.id,
																												);
																											else rules.push(r.id);

																											if (
																												data.id !==
																												this.state.familyData
																													.changeRank.id
																											)
																												this.setState({
																													familyData: {
																														...this.state
																															.familyData,
																														changeRank: {
																															id: data.id,
																															name: data.name,
																															rules,
																														},
																													},
																												});
																											else
																												this.setState({
																													familyData: {
																														...this.state
																															.familyData,
																														changeRank: {
																															...this.state
																																.familyData
																																.changeRank,
																															rules,
																														},
																													},
																												});
																										}}
																									/>
																									<label
																										htmlFor={`${data.id}_${idx}`}
																									>
																										{newRankRules[idx].name}
																									</label>
																								</div>
																							);
																						})}
																					</div>
																				);
																			},
																		)}
																	</div>
																</div>
															</>
														)}
													</div>
												</div>
											</section>
										) : (
											<div className="modal-sure-wrapper">
												<div className="modal-sure-wrap">
													<button
														className="close"
														onClick={(e) => {
															e.preventDefault();
															this.setState({
																familyKickId: null,
																familyKickRank: null,
															});
														}}
													>
														<span className="icon-wrap">
															<svg
																width="30"
																height="30"
																viewBox="0 0 30 30"
																fill="none"
																xmlns="http://www.w3.org/2000/svg"
															>
																<g id="24 / basic / plus">
																	<path
																		id="icon"
																		fillRule="evenodd"
																		clipRule="evenodd"
																		d="M14.9996 13.5858L21.3635 7.22183L22.7777 8.63604L16.4138 15L22.7777 21.364L21.3635 22.7782L14.9996 16.4142L8.6356 22.7782L7.22138 21.364L13.5853 15L7.22138 8.63604L8.6356 7.22183L14.9996 13.5858Z"
																		fill="#141B1F"
																	></path>
																</g>
															</svg>
														</span>
													</button>
													<div className="text-wrap">
														{this.state.familyKickRank ? (
															<p>
																Bist du sicher, dass du den Rang löschen willst?{" "}
																<span>
																	{
																		this.state.familyData.ranks.find(
																			(d) => d.id === this.state.familyKickRank,
																		).name
																	}
																	?
																</span>
																<br />
																Teilnehmer mit diesem Rang werden einen Rang
																aufgerückt{" "}
																<span>
																	{
																		this.state.familyData.ranks.find(
																			(d) => d.isPermament,
																		).name
																	}
																</span>
															</p>
														) : (
															<p>
																{LangString(
																	"components.Tablet.index.2e7af47e01378651a67763b644740675",
																)}{" "}
																<span>
																	{
																		this.getFamilyMember(
																			this.state.familyKickId,
																		).name
																	}
																	?
																</span>
															</p>
														)}
													</div>
													<div className="button-wrap">
														<button
															className="btn-primary"
															onClick={(e) => {
																e.preventDefault();
																if (this.state.familyKickRank) {
																	// let members = this.state.familyData.members,
																	//     vehicles = this.state.familyData.vehicles;
																	// members.map( (d) => { if(d.rank == this.state.familyKickRank ) d.rank = this.state.familyData.ranks.find( d=> d.isPermament ).id });
																	// vehicles.map( (d) => { if(d.rank == this.state.familyKickRank ) d.rank = this.state.familyData.ranks.find( d=> d.isPermament ).id } )
																	// this.setState({
																	// ranks: this.state.familyData.ranks.filter( (d) => d.id !== this.state.familyKickRank ),
																	// changeRank:{ id: -1 },
																	// members, vehicles },
																	// familyKickRank: null });
																	this.setState({ familyKickRank: null });
																	CustomEvent.triggerServer(
																		"family:deleterank",
																		this.state.familyKickRank,
																	);
																} else {
																	let fd = this.state.familyData;
																	const ind = fd.members.findIndex(
																		(fm) => fm.id == this.state.familyKickId,
																	);
																	if (ind != -1) {
																		fd.members.splice(ind, 1);
																		CustomEvent.triggerServer(
																			"family:kick",
																			this.state.familyKickId,
																		);
																	}
																	this.setState({
																		familyKickId: null,
																		familyData: fd,
																	});
																}
															}}
														>
															<p>
																{LangString(
																	"components.Tablet.index.5ba6e445bf1c0bd63c10f06a9f2a026a",
																)}
															</p>
														</button>
														<button
															className="btn-primary gray"
															onClick={(e) => {
																e.preventDefault();
																this.setState({
																	familyKickId: null,
																	familyKickRank: null,
																});
															}}
														>
															<p>
																{LangString(
																	"components.Tablet.index.72c9d3557c4703e50a12e4d654162404",
																)}
															</p>
														</button>
													</div>
												</div>
											</div>
										)}
									</div>
								) : (
									<></>
								)}
								{this.state.familyPage == 2 ? (
									<ChatDialogClass id={`family_${this.state.familyData.id}`} />
								) : null}
								{this.state.familyPage == 3 || this.state.familyPage == 21 ? (
									<div className="tabs-tablet-content-item active">
										<div className="tabs-famtasks-wrapper tabs-innerall-wrapper">
											<div className="tabs-famtasks-caption-wrapper tabs-innerall-caption-wrapper">
												<ul
													className="tabs-famtasks-caption tabs-innerall-caption"
													onWheel={(e) =>
														(e.currentTarget.scrollLeft += e.deltaY / 3)
													}
												>
													<li
														className={
															this.state.familyPage == 3 ? "active" : ""
														}
														onClick={(e) => {
															e.preventDefault();
															this.setState({ familyPage: 3 });
														}}
													>
														<p>
															{LangString(
																"components.Tablet.index.78015f5bdcc49cd3d02727cacb0e61f2",
															)}
														</p>
													</li>
													<li
														className={
															this.state.familyPage == 21 ? "active" : ""
														}
														onClick={(e) => {
															e.preventDefault();
															this.setState({ familyPage: 21 });
														}}
													>
														<p>
															{LangString(
																"components.Tablet.index.5d180ae17c10baa5e72741c80733683d",
															)}
														</p>
													</li>
												</ul>
											</div>
											<div className="tabs-innerall-content-wrapper tabs-famtasks-content-wrapper">
												<div className="tabs-innerall-content-item tabs-famtasks-content-item height-for-inner-tab active">
													{this.familyControl}
												</div>
											</div>
										</div>
									</div>
								) : null}
								{(this.state.familyPage >= 4 && this.state.familyPage <= 5) ||
								(this.state.familyPage >= 12 && this.state.familyPage <= 13) ? (
									<div className="tabs-tablet-content-item active">
										<div className="tabs-famtasks-wrapper tabs-innerall-wrapper">
											<div className="tabs-famtasks-caption-wrapper tabs-innerall-caption-wrapper">
												<ul className="tabs-famtasks-caption tabs-innerall-caption">
													<li
														className={
															this.state.familyPage == 4 ? "active" : ""
														}
														onClick={(e) => {
															e.preventDefault();
															this.setState({ familyPage: 4 });
														}}
													>
														<p>
															{LangString(
																"components.Tablet.index.c06624c7cb8393ae50a65d5bd35390c5",
															)}
														</p>
													</li>
													<li
														className={
															this.state.familyPage == 5 ? "active" : ""
														}
														onClick={(e) => {
															e.preventDefault();
															this.setState({ familyPage: 5 });
														}}
													>
														<p>
															{LangString(
																"components.Tablet.index.5d37e1f0031de1a2e2f2d594af161913",
															)}
														</p>
													</li>
													<li
														className={
															this.state.familyPage == 12 ? "active" : ""
														}
														onClick={(e) => {
															e.preventDefault();
															this.setState({ familyPage: 12 });
														}}
													>
														<p>
															{LangString(
																"components.Tablet.index.1e7d34d9a9f92b5e0ab288f54133c60c",
															)}
														</p>
													</li>
													<li
														className={
															this.state.familyPage == 13 ? "active" : ""
														}
														onClick={(e) => {
															e.preventDefault();
															this.setState({ familyPage: 13 });
														}}
													>
														<p>
															{LangString(
																"components.Tablet.index.c920ddac1c2c5bc00cbe4f4598c1147a",
															)}
														</p>
													</li>
												</ul>
											</div>
										</div>
										<div className="tabs-innerall-content-wrapper tabs-famtasks-content-wrapper">
											{this.state.familyPage == 4 ? (
												<div className="tabs-innerall-content-item tabs-famtasks-content-item height-for-inner-tab active">
													<div className="plrb30">
														<div className="warehouse-size mb24">
															<p className="font40 fontw300 mr12">
																{systemUtil.numberFormat(
																	this.state.familyData.cargoData.amount,
																)}
																<span className="op4">
																	{" "}
																	/{" "}
																	{systemUtil.numberFormat(
																		this.state.familyData.cargoData.max,
																	)}
																</span>
															</p>
															<p className="op4 font16">
																{LangString(
																	"components.Tablet.index.e66fecb3946a23e9f0c1b19d4746da17",
																)}
																<br />
																{LangString(
																	"components.Tablet.index.33fba6c021069085c8a54e565cc02f19",
																)}
															</p>
														</div>
														{this.state.familyData.extraTasks.map(
															(data, id) => {
																if (data.type === "cargoBattle")
																	return (
																		<div className="task-special-box" key={id}>
																			<i className="task-special-box-art">
																				<img src={gruz} alt="" />
																			</i>
																			<p className="fontw800 font40 mb12">
																				{LangString(
																					"components.Tablet.index.fbfa85687ae9cfd8619c41a0c060fd40",
																				)}
																			</p>
																			<p className="op4 font16 fontw400 ln-1-4 task-special-box-info mb32">
																				{LangString(
																					"components.Tablet.index.1cf66a1867d94e0cc21f7231f89da087",
																				)}
																			</p>
																			{data.active === 2 ? (
																				<>
																					<button
																						className="easy-button fam"
																						onClick={() =>
																							CustomEvent.triggerClient(
																								"family:cargoBattle:setGPS",
																								data.id,
																							)
																						}
																					>
																						<p>
																							{LangString(
																								"components.Tablet.index.80ee77e76288d2c2bc561fed036f6add",
																							)}
																						</p>
																					</button>
																					{/* <div className="task-timer task-timer-one">
                                                                        <p className="op4 font16 fontw400 mb8">Закончится через</p>
                                                                        <p className="font40 fontw800">{systemUtil.secondsToString( data.time )}</p>
                                                                    </div> */}
																				</>
																			) : data.active === 1 ? (
																				<>
																					<div className="task-timer task-timer-one">
																						<p className="op4 font16 fontw400 mb8">
																							{LangString(
																								"components.Tablet.index.b59ea107c20428395764a193af293c96",
																							)}
																						</p>
																						<p className="font40 fontw800">
																							{systemUtil.secondsToString(
																								data.time,
																							)}
																						</p>
																					</div>
																				</>
																			) : null}
																		</div>
																	);
															},
														)}
														{!this.state.familyData.extraTasks.length ? (
															<div className="tc">
																<p className="font16 fontw400 upper op4 ln-1-4">
																	{LangString(
																		"components.Tablet.index.d08a37915f823470711af48cf2926ee5",
																	)}
																	{this.state.familyData.cargoData.amount <
																	100 ? (
																		<>
																			<br />
																			<br />
																			{LangString(
																				"components.Tablet.index.cbc49b8462a85047b653e0d0e450591d",
																			)}
																		</>
																	) : (
																		<></>
																	)}
																	{this.state.familyData.cargoNeedTime > 0 ? (
																		<>
																			<br />
																			<br />
																			{LangString(
																				"components.Tablet.index.272b224eb552001c8579948f626886cf",
																			)}
																			<br />
																			{`${Math.floor(this.state.familyData.cargoNeedTime / 60)} ч. ${this.state.familyData.cargoNeedTime % 60} мин.`}
																		</>
																	) : (
																		<></>
																	)}
																</p>
															</div>
														) : null}
													</div>
												</div>
											) : null}
											{this.state.familyPage == 5 ? (
												<div className="tabs-innerall-content-item tabs-famtasks-content-item height-for-inner-tab active">
													<div className="plrb30">
														{this.state.familyData.familyTasks.map(
															(data, index) => {
																return (
																	<div
																		className={`fam-easy-task ${data.color}`}
																	>
																		<div className="fam-easy-task-left">
																			<p className="font24 fontw600 mb16">
																				{data.name}
																			</p>
																			<p className="op4 font16 fontw400 mb32 lh-1-4">
																				{data.info}
																			</p>
																			<button
																				className="easy-button fam"
																				onClick={() =>
																					CustomEvent.triggerServer(
																						"family:tasks:setGPS",
																						data.name,
																					)
																				}
																			>
																				<p>
																					{LangString(
																						"components.Tablet.index.a40a044a0cad003d233b152ddc891bfb",
																					)}
																				</p>
																			</button>
																		</div>
																		<div className="fam-easy-task-right">
																			<p className="op4 font16 fontw400 mb8">
																				{data.desc}
																			</p>
																			<p className="font32 fontw300 mb8">
																				+{data.scores}
																			</p>
																			<p className="op4 font16 fontw400">
																				{LangString(
																					"components.Tablet.index.23d034bf4260780bf374a4b5628ebed0",
																				)}{" "}
																				<br />
																				{LangString(
																					"components.Tablet.index.148ee7b480b5bf3485636882aab71621",
																				)}
																			</p>
																		</div>
																	</div>
																);
															},
														)}
													</div>
												</div>
											) : null}
											{this.state.familyPage == 12 ? (
												<div className="tabs-innerall-content-item tabs-famtasks-content-item height-for-inner-tab active">
													<div className="plrb30">
														<div className="info-line-garage">
															<img src={svgs["info"]} alt="" />
															<p>
																{LangString(
																	"components.Tablet.index.6febe896f5d58e02f933ff2a0c324198",
																)}
															</p>
														</div>
														{this.state.familyData.contract.length < 1 ? (
															<div className="tc">
																<p className="font16 fontw400 upper op4 ln-1-4">
																	{LangString(
																		"components.Tablet.index.d78aa465798ee3f0a1fe9ffbf8f8d8fb",
																	)}
																</p>
															</div>
														) : null}
														{/* {id: 1, name:'Название 1', desc: 'Описание 1', status: -1, win: [{ type: WinTaskEnum.COINS, amount: 30 }, { type: WinTaskEnum.MONEY, amount: 5000 }, { type: 2051 }, { type: -1, desc: 'Леденец'}]}, */}
														{this.state.familyData.contract.map((data, key) => {
															return (
																<div className="fam-contract-box" key={data.id}>
																	<p className="font18 fontw600 mb8">
																		{data.name}
																	</p>
																	<p className="font16 fontw400 op4 ln-1-4 mb16">
																		{data.desc}
																	</p>
																	<div className="ach-item-gift-line">
																		{data.win.map((q, key) => {
																			switch (q.type) {
																				case FamilyContractWinTypes.COINS:
																					return (
																						<div key={key}>
																							+
																							{systemUtil.numberFormat(
																								q.amount,
																							)}{" "}
																							{LangString(
																								"components.Tablet.index.995e1cb7171646943d749555ad69ce2c",
																							)}
																						</div>
																					);
																				case FamilyContractWinTypes.MONEY:
																					return (
																						<div key={key}>
																							{LangString(
																								"components.Tablet.index.acd02345274e0f3a899730d5c52edae2",
																							)}
																							{systemUtil.numberFormat(
																								q.amount,
																							)}
																						</div>
																					);
																				case FamilyContractWinTypes.FAMILY_POINTS:
																					return (
																						<div key={key}>
																							+
																							{systemUtil.numberFormat(
																								q.amount,
																							)}{" "}
																							{LangString(
																								"components.Tablet.index.762526a2a2a4c15d3b74b6141493e0de",
																							)}
																						</div>
																					);
																				default: {
																					if (q.desc)
																						return (
																							<div key={key}>+{q.desc}</div>
																						);
																					else
																						return (
																							<div
																								className="ach-object"
																								key={key}
																							>
																								<img
																									src={
																										iconsItems[`Item_${q.type}`]
																									}
																									alt=""
																								/>
																							</div>
																						);
																				}
																			}
																		})}
																	</div>
																	{data.status >= 0 ? (
																		<div className="fam-contraxt-progress-wrap mb16">
																			<div className="fam-contract-progress">
																				<i
																					style={{ width: `${data.status}%` }}
																				></i>
																			</div>
																			<p className="font12 fontw400 ml16">
																				{data.status}%
																			</p>
																		</div>
																	) : (
																		<></>
																	)}

																	{data.status < 0 &&
																	(this.familySubLeader(CEF.user.familyRank) ||
																		this.familyLeader(CEF.user.familyRank)) ? (
																		<div className="flex-line">
																			<button
																				className="easy-button green"
																				onClick={() => {
																					CustomEvent.triggerServer(
																						"family:contract:get",
																						data.id,
																					);
																				}}
																			>
																				<p>
																					{LangString(
																						"components.Tablet.index.aaac0d0cb48ddd1c02fc18653d480e78",
																					)}
																				</p>
																			</button>
																		</div>
																	) : (
																		<></>
																	)}

																	{data.status >= 0 &&
																	(this.familySubLeader(CEF.user.familyRank) ||
																		this.familyLeader(CEF.user.familyRank)) ? (
																		<div className="flex-line">
																			<button
																				className="easy-button"
																				onClick={() => {
																					CEF.gui.setGui(null);
																					CustomEvent.triggerServer(
																						"family:contract:drop",
																						data.id,
																					);
																				}}
																			>
																				<p>
																					{LangString(
																						"components.Tablet.index.ebded785f9bfedf44b346a055063d4ae",
																					)}
																				</p>
																			</button>
																		</div>
																	) : (
																		<></>
																	)}
																</div>
															);
														})}
													</div>
												</div>
											) : null}
											{this.state.familyPage == 13 ? (
												<div className="tabs-innerall-content-item tabs-famtasks-content-item height-for-inner-tab active">
													<div className="plrb30">
														{Timetable.map((data, key) => {
															return (
																<div className="schedule-time mb8" key={key}>
																	<p className="font24 fontw600 ln-1-4">
																		{LangString(
																			"components.Tablet.index.c616f74b093bf54f1e0be7558f927484",
																		)}
																	</p>
																	<p className="op7 font16">
																		{LangString(
																			"components.Tablet.index.6a2c438db645c18a1fa765e1ce37071d",
																		)}{" "}
																		<strong>
																			{LangString(
																				"components.Tablet.index.839728f97be6efeba427a4c6544b0a40",
																			)}
																		</strong>
																	</p>
																</div>
															);
														})}
													</div>
												</div>
											) : null}
										</div>
									</div>
								) : null}
								{this.state.familyPage >= 6 && this.state.familyPage <= 10 ? (
									<div className="tabs-tablet-content-item active">
										<div className="tabs-famtasks-wrapper tabs-innerall-wrapper">
											<div className="tabs-famtasks-caption-wrapper tabs-innerall-caption-wrapper">
												<ul
													className="tabs-famtasks-caption tabs-innerall-caption"
													onWheel={(e) =>
														(e.currentTarget.scrollLeft += e.deltaY / 3)
													}
												>
													<li
														className={
															this.state.familyPage == 7 ||
															this.state.familyPage == 6
																? "active"
																: ""
														}
														onClick={(e) => {
															e.preventDefault();
															this.setState({ familyPage: 6 });
														}}
													>
														<p>
															{LangString(
																"components.Tablet.index.199a6f42b25899f885d8eea5342cd300",
															)}
														</p>
													</li>
													<li
														className={
															this.state.familyPage == 8 ? "active" : ""
														}
														onClick={(e) => {
															e.preventDefault();
															this.setState({ familyPage: 8 });
														}}
													>
														<p>
															{LangString(
																"components.Tablet.index.276b94e2a476d0990a45b5c1a2e089a1",
															)}
														</p>
													</li>
													<li
														className={
															this.state.familyPage == 9 ? "active" : ""
														}
														onClick={(e) => {
															e.preventDefault();
															this.setState({ familyPage: 9 });
														}}
													>
														<p>
															{LangString(
																"components.Tablet.index.676946e883a529bdb0843813173faed9",
															)}
														</p>
													</li>
													<li
														className={
															this.state.familyPage == 10 ? "active" : ""
														}
														onClick={(e) => {
															e.preventDefault();
															this.setState({ familyPage: 10 });
														}}
													>
														<p>
															{LangString(
																"components.Tablet.index.26760c47c28999ad6d89834d341d20ba",
															)}
														</p>
													</li>
												</ul>
											</div>
											<div className="tabs-innerall-content-wrapper tabs-famtasks-content-wrapper">
												<div className="tabs-innerall-content-item tabs-famtasks-content-item height-for-inner-tab active">
													{this.familyControl}
												</div>
											</div>
										</div>
									</div>
								) : null}
							</div>
						</div>
					</div>
				</>
			</SocketSync>
		);
	}
	get familyControl() {
		switch (this.state.familyPage) {
			case 3: {
				return (
					<>
						<div className="plrb30">
							<div className="fam-lvl-top tc">
								<button className="info-button mb24">
									<img src={svgs["fam-question-icon"]} alt="" />
									<div className="info-button-wrapper">
										<p className="mb16">
											<strong>
												{LangString(
													"components.Tablet.index.95c9481ac3574dd45c3ce76630231115",
												)}
											</strong>
											<br />
											{LevelInfo[0].desc}
										</p>
										<p className="mb16">
											<strong>
												{LangString(
													"components.Tablet.index.7de4b71c6bba490623b2f0a2c94cee7a",
												)}
											</strong>
											<br />
											{LevelInfo[1].desc}
										</p>
										<p className="mb16">
											<strong>
												{LangString(
													"components.Tablet.index.1b061856b23d98311e55fa5f86c11d86",
												)}
											</strong>
											<br />
											{LevelInfo[2].desc}
										</p>
										<p>
											<strong>
												{LangString(
													"components.Tablet.index.a557841d4164b0512e7d4feb1f5d0d88",
												)}
											</strong>
											<br />
											{LevelInfo[3].desc}
										</p>
									</div>
								</button>
								<p className="font40 fontw300 mb16">
									{this.state.familyData.level}{" "}
									{LangString(
										"components.Tablet.index.63b0df3b6bc7cc2c8dc8c88adb0b9feb",
									)}
								</p>
								{this.state.familyData.level < LevelInfo.length ? (
									<p className="font16 fontw400 upper op4 ln-1-4">
										{LangString(
											"components.Tablet.index.f383d802ae80b8f5c4f6f5036e9cef20",
										)}
										<br />
										{LangString(
											"components.Tablet.index.dadd69f15cc10ad90da60290ac2120a4",
										)}
									</p>
								) : (
									<p className="font16 fontw400 upper op4 ln-1-4">
										{LangString(
											"components.Tablet.index.8b1807ffe4727f9da3cf5c9cbdd5d226",
										)}
									</p>
								)}
							</div>
							<div className="fam-stat-info-wrap mb50">
								<div
									className={`fam-stat${this.state.familyData.members.length >= LevelInfo[this.state.familyData.level >= LevelInfo.length ? this.state.familyData.level - 1 : this.state.familyData.level].members ? " succesfull" : ""}`}
								>
									{this.state.familyData.level < LevelInfo.length ? (
										<p className="font40 fontw300 mb8">
											{this.state.familyData.members.length} /{" "}
											{this.state.familyData.upgrades[1]
												? this.state.familyData.upgrades[1] *
														FamilyUpgrade.find((fu) => fu.id == 1).amount +
													FamilyUpgrade.find((fu) => fu.id == 1).default
												: FamilyUpgrade.find((fu) => fu.id == 1).default}
										</p>
									) : (
										<p className="font40 fontw300 mb8">
											{this.state.familyData.members.length}
										</p>
									)}
									<p className="font16 fontw400 upper op4">
										{LangString(
											"components.Tablet.index.f2242b1c81ed6f2c86ed39cf0dc1eb08",
										)}
									</p>
								</div>
								<div
									className={`fam-stat${this.state.familyData.win >= LevelInfo[this.state.familyData.level >= LevelInfo.length ? this.state.familyData.level - 1 : this.state.familyData.level].wins ? " succesfull" : ""}`}
								>
									{this.state.familyData.level < LevelInfo.length ? (
										<p className="font40 fontw300 mb8">
											{this.state.familyData.win} /{" "}
											{
												LevelInfo[
													this.state.familyData.level >= LevelInfo.length
														? this.state.familyData.level - 1
														: this.state.familyData.level
												].wins
											}
										</p>
									) : (
										<p className="font40 fontw300 mb8">
											{this.state.familyData.win}
										</p>
									)}
									<p className="font16 fontw400 upper op4">
										{LangString(
											"components.Tablet.index.2915a792c14a2765f8c1ff07b50e9465",
										)}
									</p>
								</div>
								<div
									className={`fam-stat${this.state.familyData.scores >= LevelInfo[this.state.familyData.level >= LevelInfo.length ? this.state.familyData.level - 1 : this.state.familyData.level].scores ? " succesfull" : ""}`}
								>
									{this.state.familyData.level < LevelInfo.length ? (
										<p className="font40 fontw300 mb8">
											{systemUtil.numberFormat(this.state.familyData.scores)} /{" "}
											{systemUtil.numberFormat(
												LevelInfo[
													this.state.familyData.level >= LevelInfo.length
														? this.state.familyData.level - 1
														: this.state.familyData.level
												].scores,
											)}
										</p>
									) : (
										<p className="font40 fontw300 mb8">
											{systemUtil.numberFormat(this.state.familyData.scores)}
										</p>
									)}
									<p className="font16 fontw400 upper op4">
										{LangString(
											"components.Tablet.index.d104ff5b474468162010dbcd6599f3ba",
										)}
									</p>
								</div>
							</div>
							<div className="flex-line center">
								<button
									className="easy-button center mb8"
									onClick={() => {
										CustomEvent.triggerServer("family:leaveFamily");
									}}
								>
									{LangString(
										"components.Tablet.index.a915d1b2844530305eb866aac6c437d5",
									)}
								</button>
							</div>
							{this.state.familyData.level < LevelInfo.length &&
							this.familySubLeader(CEF.user.familyRank) ? (
								<>
									{this.state.familyData.members.length >=
										LevelInfo[
											this.state.familyData.level >= LevelInfo.length
												? this.state.familyData.level - 1
												: this.state.familyData.level
										].members &&
									this.state.familyData.win >=
										LevelInfo[
											this.state.familyData.level >= LevelInfo.length
												? this.state.familyData.level - 1
												: this.state.familyData.level
										].wins &&
									this.state.familyData.scores >=
										LevelInfo[
											this.state.familyData.level >= LevelInfo.length
												? this.state.familyData.level - 1
												: this.state.familyData.level
										].scores ? (
										<div className="flex-line center">
											<button
												className="easy-button green"
												onClick={() => {
													CustomEvent.callServer("family:levelup", 0).then(
														(val) => {
															if (!val) return;
															let familyData = this.state.familyData;
															familyData.level += 1;
															this.setState({ familyData: familyData });
														},
													);
												}}
											>
												<p>
													{LangString(
														"components.Tablet.index.05095e86ddf084f8fdcba85d4621dcee",
														this.state.familyData.level + 1,
													)}
												</p>
											</button>
										</div>
									) : (
										<>
											{this.state.familyData.level <
											FAMILY_TO_ORGANIZATION_MIN_LEVEL - 1 ? (
												<div className="flex-line center">
													<button
														className="easy-button mr24"
														onClick={() => {
															CustomEvent.callServer("family:levelup", 1).then(
																(val) => {
																	if (!val) return;
																	let familyData = this.state.familyData;
																	familyData.level += 1;
																	this.setState({ familyData: familyData });
																},
															);
														}}
													>
														<p>
															{LangString(
																"components.Tablet.index.45f41cd7dfae734710e7706f177f4a70",
															)}
														</p>
													</button>
													<div className="coin-box">
														<img src={svgs["coin"]} alt="" />
														<p>
															{systemUtil.numberFormat(
																LevelInfo[
																	this.state.familyData.level >=
																	LevelInfo.length
																		? this.state.familyData.level - 1
																		: this.state.familyData.level
																].coin,
															)}
														</p>
													</div>
												</div>
											) : null}

											<div className="tc">
												<p className="font16 fontw400 upper op4 ln-1-4">
													{LangString(
														"components.Tablet.index.19ce99c0b77a72ba19b25317a2dd0309",
													)}
												</p>
											</div>
										</>
									)}
								</>
							) : null}
						</div>
					</>
				);
			}
			case 6: {
				return (
					<>
						<div className="garage-wrapper garage-family">
							<div className="garage-wrap">
								{this.state.familyData.vehicles.map((vehicle, vehicleIndex) => {
									if (!vehicle) return <></>;
									return (
										<div className="garage-item" key={vehicleIndex}>
											<div className="img-wrap">
												{this.familyLeader(CEF.user.familyRank) ||
												this.familySubLeader(CEF.user.familyRank) ? (
													<div className="car-select-fly">
														<div className="select-box">
															<div
																className={`select-box-dropdown${this.state.familyCarEdit == vehicle.id ? " active" : ""}`}
																onClick={() => {
																	this.setState({
																		familyCarEdit:
																			this.state.familyCarEdit == vehicle.id
																				? 0
																				: vehicle.id,
																	});
																}}
															>
																<p>{this.familyGetRankName(vehicle.rank)}</p>
																<span className="arrow-wrap">
																	<svg
																		width="16"
																		height="8"
																		viewBox="0 0 16 8"
																		fill="none"
																		xmlns="http://www.w3.org/2000/svg"
																	>
																		<path
																			fillRule="evenodd"
																			clipRule="evenodd"
																			d="M8 5.76438L14.7006 -5.6797e-08L16 1.11781L8 8L-4.8861e-08 1.11781L1.29936 -6.42585e-07L8 5.76438Z"
																			fill="white"
																		/>
																	</svg>
																</span>
															</div>
															<ul className="select-box-dropdown-wrap">
																{this.state.familyData.ranks.map(
																	(rank, rankIndex) => {
																		return (
																			<li
																				key={rankIndex}
																				className={`list-dropdown-item${vehicle.rank == rank.id ? " active" : ""}`}
																				onClick={() => {
																					let vehicles =
																						this.state.familyData.vehicles;
																					vehicles[vehicleIndex].rank = rank.id;
																					this.setState({
																						familyCarEdit: 0,
																						familyData: {
																							...this.state.familyData,
																							vehicles,
																						},
																					});
																					CustomEvent.triggerServer(
																						"family:setCarRank",
																						vehicle.id,
																						rank.id,
																					);
																				}}
																			>
																				<p>{rank.name}</p>
																			</li>
																		);
																	},
																)}
															</ul>
														</div>
													</div>
												) : null}
												<img src={CEF.getVehicleURL(vehicle.model)} alt="car" />
											</div>
											<div className="info-wrap">
												<div className="topline">
													<p className="name">{vehicle.name}</p>
												</div>
												<div className="downline">
													<div className="bage-gps bage-white">
														<p>
															{vehicle.number ||
																LangString(
																	"components.Tablet.index.e5853b1191a39ff52cc17cc6f2a175f7",
																)}
														</p>
													</div>
													<div className="rightside">
														{vehicle.x || vehicle.y ? (
															<div
																className="bage-gps"
																onClick={(e) => {
																	e.preventDefault();
																	CEF.setGPS(vehicle.x, vehicle.y);
																}}
															>
																<p>
																	{LangString(
																		"components.Tablet.index.1813364e541cc7dd12ec76c58159bf3d",
																	)}
																</p>
															</div>
														) : (
															<div
																className="bage-gps"
																onClick={(e) => {
																	e.preventDefault();
																	let p: {
																		x: number;
																		y: number;
																		z: number;
																		h: number;
																	} = null;
																	FINE_CAR_POS.map((s) => {
																		if (!p) s = p;
																		else {
																			if (
																				systemUtil.distanceToPos(
																					this.state.pos,
																					s,
																				) <
																				systemUtil.distanceToPos(
																					this.state.pos,
																					p,
																				)
																			)
																				s = p;
																		}
																	});
																	CEF.setGPS(p.x, p.y);
																}}
															>
																<p>
																	{LangString(
																		"components.Tablet.index.cd98b847a2f4019de60ae879b20dd7d3",
																	)}
																</p>
															</div>
														)}

														{
															<button
																onClick={(e) => {
																	e.preventDefault();
																	CustomEvent.triggerServer(
																		"vehicle:requestrespawn",
																		vehicle.id,
																	);
																}}
															>
																<span className="icon-wrap">
																	<svg
																		width="18"
																		height="18"
																		viewBox="0 0 18 18"
																		fill="none"
																		xmlns="http://www.w3.org/2000/svg"
																	>
																		<g id="24 / arrows / circle-arrow-right-curved">
																			<path
																				id="icon"
																				fillRule="evenodd"
																				clipRule="evenodd"
																				d="M11.2499 10.9393L12.9696 9.21967L14.0303 10.2803L10.4999 13.8107L6.96961 10.2803L8.03027 9.21967L9.74994 10.9393L9.74994 7.5C9.74994 6.67157 9.07837 6 8.24994 6C7.42152 6 6.74994 6.67157 6.74994 7.5L5.24994 7.5C5.24994 5.84315 6.59309 4.5 8.24994 4.5C9.9068 4.5 11.2499 5.84315 11.2499 7.5L11.2499 10.9393Z"
																				fill="white"
																			></path>
																		</g>
																	</svg>
																</span>
															</button>
														}
													</div>
												</div>
											</div>
										</div>
									);
								})}
								{this.getFreeFamilyCar()}
							</div>
						</div>
					</>
				);
			}
			case 8: {
				return (
					<>
						<div className="plr30">
							<div className="fam-house-info">
								{this.state.familyData.house ? (
									<>
										<img src={famosob} className="mb32" alt="" />
										<p className="font32 fontw600 mb8">
											{this.state.familyData.house.name}
										</p>
										<p className="font16 op4 fontw400 mb50">
											{(this.state.familyData.house.forTp
												? LangString(
														"components.Tablet.index.48fcc157611494fd58e777901d163273",
													)
												: LangString(
														"components.Tablet.index.d6d508595eb06acb8b0a9efd1647f568",
													)) + this.state.familyData.house.id}
										</p>
										<div className="flex-line">
											<button
												className="easy-button"
												onClick={() => {
													CEF.setGPS(
														this.state.familyData.house.pos.x,
														this.state.familyData.house.pos.y,
														this.state.familyData.house.pos.z,
													);
												}}
											>
												{LangString(
													"components.Tablet.index.fab4d3ef16408e3065d0e1c37c3884ee",
												)}
											</button>
											{/*<button className="easy-button"*/}
											{/*        onClick={()=>{*/}
											{/*            CustomEvent.triggerServer('family:sellhouse');*/}
											{/*        }}>Продать за ${systemUtil.numberFormat( this.state.familyData.house.price)}</button>*/}
										</div>
									</>
								) : (
									<p className="font32 fontw600 mb8">
										{LangString(
											"components.Tablet.index.8031ca9843732e9269e41a83a2ebaf47",
										)}
									</p>
								)}
							</div>
						</div>
					</>
				);
			}
			case 9: {
				//FamilyUpgrade upgrades
				return (
					<>
						<div className="plr30">
							<div className="fam-improvement">
								<div className="fam-bank">
									<div>
										<div className="coin-box mb8">
											<p>
												${systemUtil.numberFormat(this.state.familyData.money)}
											</p>
										</div>
										<p className="font16 op4">
											{LangString(
												"components.Tablet.index.78b83a98a89c63eb4171e9d815a42519",
											)}
										</p>
									</div>
									<div>
										<div className="coin-box mb8">
											<img src={svgs["coin"]} alt="" />
											<p>
												{systemUtil.numberFormat(this.state.familyData.donate)}
											</p>
										</div>
										<p className="font16 op4">
											{LangString(
												"components.Tablet.index.c79cdbcfded653a22be829cc341482b2",
											)}
										</p>
									</div>
								</div>
								{FamilyUpgrade.map((data) => {
									return (
										<>
											<div
												className={`fam-improvement-item${(this.state.familyData.upgrades[data.id] || 0) * data.amount + data.default >= data.max + data.default ? " success" : ""}`}
											>
												{/*<div className={`fam-improvement-item${ (this.state.familyData.upgrades[ data.id ] ? (this.state.familyData.upgrades[ data.id ]*data.amount + data.default) : data.default >= data.max + data.default) ? ' success':''}`}>*/}
												<div>
													{data.id === 4 ? (
														<p className="font32 fontw300 mb16">{data.desc}</p>
													) : (
														<p className="font32 fontw300 mb16">
															+ {data.amount} {data.desc}
														</p>
													)}
													{/*{[1,2].includes(data.id) ? <p className="font16 fontw400 op4 ln-1-4">{data.name}</p> :*/}
													{data.id === 4 ? null : (
														<p className="font16 fontw400 op4 ln-1-4">
															{data.name}{" "}
															{this.state.familyData.upgrades[data.id]
																? this.state.familyData.upgrades[data.id] *
																		data.amount +
																	data.default
																: data.default}{" "}
															/ {data.max + data.default}
														</p>
													)}
													{/*}*/}
												</div>
												{this.state.familyData.upgrades[data.id] * data.amount +
													data.default >=
												data.max + data.default ? null : (
													<div>
														{!this.state.familyData.house ? (
															<p className="font18 fontw400 tr ln-1--4">
																{LangString(
																	"components.Tablet.index.d244df3e99e840229e35bfdd457404d3",
																)}
																<br />
																{LangString(
																	"components.Tablet.index.30d1e817f1210e116993415272de3b8b",
																)}
															</p>
														) : (
															<>
																<div className="flex-line right mb8">
																	<div className="coin-box mr16">
																		<img src={svgs["coin"]} alt="" />
																		<p>
																			{systemUtil.numberFormat(
																				getFamilyUpgradeLevelPrice(
																					data.id,
																					(this.state.familyData.upgrades[
																						data.id
																					] || 0) + 1,
																					"coin",
																				),
																			)}
																		</p>
																	</div>
																	<button
																		className="easy-button"
																		onClick={() => {
																			CustomEvent.triggerServer(
																				"family:upgrade",
																				data.id,
																				0,
																			);
																			CEF.gui.setGui(null);
																		}}
																	>
																		{LangString(
																			"components.Tablet.index.6f35afa1238b2b5edb8e2a62085e6fc3",
																		)}
																	</button>
																</div>
																{data.id === 4 ? null : (
																	<div className="flex-line right">
																		<div className="coin-box mr16">
																			<p>
																				$
																				{systemUtil.numberFormat(
																					getFamilyUpgradeLevelPrice(
																						data.id,
																						(this.state.familyData.upgrades[
																							data.id
																						] || 0) + 1,
																						"money",
																					),
																				)}
																			</p>
																		</div>
																		<button
																			className="easy-button"
																			onClick={() => {
																				CustomEvent.triggerServer(
																					"family:upgrade",
																					data.id,
																					1,
																				);
																				CEF.gui.setGui(null);
																			}}
																		>
																			{LangString(
																				"components.Tablet.index.b4709b9a027c940d2bcc5794f19320f1",
																			)}
																		</button>
																	</div>
																)}
															</>
														)}
													</div>
												)}
											</div>
										</>
									);
								})}
							</div>
						</div>
					</>
				);
			}
			case 10: {
				return (
					<>
						<div className="plr30">
							<div className="fam-improvement mb24">
								<div className="fam-bank">
									<div>
										<div className="coin-box mb8">
											<p>
												${systemUtil.numberFormat(this.state.familyData.money)}
											</p>
										</div>
										<p className="font16 op4">
											{LangString(
												"components.Tablet.index.46f21905c6492b779f3c47ed4d3c67c6",
											)}
										</p>
									</div>
									<div className="flex-line right">
										<input
											className="easy-input mr8"
											type="number"
											placeholder={LangString(
												"components.Tablet.index.43a4d9bf9b4555a16fdbe67bebafb145",
											)}
											maxLength={8}
											value={
												this.state.familyInputPayMoney
													? this.state.familyInputPayMoney
													: ""
											}
											onChange={(e) => {
												if (
													e.target.valueAsNumber < 0 ||
													e.target.valueAsNumber >= 99999999
												)
													return;
												this.setState({
													familyInputPayMoney: e.target.valueAsNumber,
												});
											}}
										/>
										<button
											className="easy-button"
											onClick={() => {
												this.setState({ familyInputPayMoney: 0 });
												CustomEvent.triggerServer(
													"family:addDonateByPlayer",
													this.state.familyInputPayMoney,
													1,
												);
												CEF.gui.setGui(null);
											}}
										>
											{LangString(
												"components.Tablet.index.a6fdab49f7cb77002850bd31c7a18922",
											)}
										</button>
									</div>
								</div>

								<div className="fam-bank">
									<div>
										<div className="coin-box mb8">
											<img src={svgs["coin"]} alt="" />
											<p>
												{systemUtil.numberFormat(this.state.familyData.donate)}
											</p>
										</div>
										<p className="font16 op4">
											{LangString(
												"components.Tablet.index.42434cab9638ae6200221d5d99cd74d5",
											)}
										</p>
									</div>
									<div className="flex-line right">
										<input
											className="easy-input mr8"
											type="number"
											placeholder={LangString(
												"components.Tablet.index.97b0bd7f1900b598401b9551289e78cf",
											)}
											maxLength={5}
											value={
												this.state.familyInputPay
													? this.state.familyInputPay
													: ""
											}
											onChange={(e) => {
												if (
													e.target.valueAsNumber < 0 ||
													e.target.valueAsNumber >= 999999
												)
													return;
												this.setState({
													familyInputPay: e.target.valueAsNumber,
												});
											}}
										/>
										<button
											className="easy-button"
											onClick={() => {
												this.setState({ familyInputPay: 0 });
												CustomEvent.triggerServer(
													"family:addDonateByPlayer",
													this.state.familyInputPay,
													0,
												);
												CEF.gui.setGui(null);
												// .then((ans: { answer:number, log:any }) => {
												// if(ans.answer) {
												//     let fd = this.state.familyData
												//     fd.donate += ans.answer
												//     fd.donateLog = ans.log
												//     this.setState({familyInputPay: 0, familyData: fd})
												// }
												// })
											}}
										>
											{LangString(
												"components.Tablet.index.ae468c2b1a77bf5007130b52848cc3dc",
											)}
										</button>
									</div>
								</div>
							</div>

							<div className="member-list-wrap hauto fam-bank-history">
								{this.state.familyData.donateLog.map((data, id) => {
									return (
										<div className="member-list-item" key={id}>
											<div className="leftside mb16">
												<p
													className={`name mr16 ${data.amount >= 0 ? ".count-plus" : ".count-minus"}`}
												>
													<strong>
														{data.type ? (
															<>
																<img src={svgs["coin"]} alt="" />{" "}
															</>
														) : (
															<>$</>
														)}
														{data.amount < 0 ? -1 * data.amount : data.amount}
													</strong>
												</p>
												<p className="name">{data.name}</p>
											</div>
											<div className="rightside mb16">
												<p className="name">
													{system.timeStampString(data.date, true)}
												</p>
											</div>
											<div className="fam-history-reason">{data.reason}</div>
										</div>
									);
								})}
							</div>
						</div>
					</>
				);
			}
			case 21: {
				return (
					<div className="plr30">
						<div className="fam-improvement mb24">
							<div className="fam-bank">
								<div>
									<div className="coin-box font32 mb8">
										<p>
											{LangString(
												"components.Tablet.index.2a83f952019b512a85ee90d3ec4131f9",
											)}
										</p>
									</div>
								</div>
								{/*<div>*/}
								{/*    <div className="font16 op4">*/}
								{/*        <p>Регистрация семьи</p>*/}
								{/*    </div>*/}
								{/*    <p className="coin-box mb8">12 июля 2020</p>*/}
								{/*</div>*/}
							</div>
							<textarea
								className="big-input mr8"
								maxLength={500}
								value={
									this.state.familyData.bio ? this.state.familyData.bio : ""
								}
								onChange={(e) => {
									let familyData = this.state.familyData;
									familyData.bio = e.currentTarget.value;
									this.setState({ familyData: familyData });
								}}
							/>
							<button
								className="easy-button mt8"
								onClick={(e) => {
									CustomEvent.triggerServer(
										"family:saveBio",
										system.filterInput(this.state.familyData.bio),
									);
								}}
							>
								{LangString(
									"components.Tablet.index.eeeae64ded921dcbd5e16d1c556baf9d",
								)}
							</button>
						</div>
					</div>
				);
			}
			default:
				return null;
		}
	}

	getFreeFamilyCar = () => {
		let free_cars = [];
		for (
			let i = this.state.familyData.vehicles.length;
			i <
			(this.state.familyData.upgrades[2]
				? this.state.familyData.upgrades[2]
				: 0) *
				FamilyUpgrade.find((fu) => fu.id == 2).amount +
				FamilyUpgrade.find((fu) => fu.id == 2).default;
			i++
		) {
			free_cars.push(
				<div className="garage-item empty" key={i}>
					<div className="img-wrap">
						<p>
							{LangString(
								"components.Tablet.index.b41f1ebd55aa697495759398783d495e",
							)}{" "}
							{this.state.familyData.house ? (
								""
							) : (
								<>
									<br />
									{LangString(
										"components.Tablet.index.af8e619f2fc8be49e518407aa235db7f",
									)}
								</>
							)}
						</p>
					</div>
					<div className="info-wrap">
						<div className="topline">
							<div></div>
							<div></div>
						</div>
						<div className="downline">
							<div className="bage-gps bage-white">
								<p></p>
							</div>
							<div className="cost"></div>
						</div>
					</div>
				</div>,
			);
		}
		return free_cars;
	};

	get fractionPage() {
		if (!this.state.fractionData) return <></>;
		return (
			<SocketSync
				path={`tablet_${this.state.fractionData.id}`}
				data={(data: string) => {
					const d = JSON.parse(data);
					this.setState({ fractionData: d });
				}}
			>
				<div className="tablet-blur" />
				<div className="tablet-home">
					<div className="grid-in-tablet">
						<div
							className="tablet-info tablet-info-jcs tablet-info-fraction"
							style={{
								background: `#0E121A url(${factionBackground[`id_${this.state.fractionData.id}`]}) no-repeat center center`,
								backgroundSize: "cover",
							}}
						>
							<div className="topline">
								<button
									className="return-btn"
									onClick={(e) => {
										this.setState({ currentPage: "main" });
									}}
								>
									<span className="icon">
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M9.41424 12L16.7071 19.2929L15.2929 20.7071L6.58582 12L15.2929 3.29291L16.7071 4.70712L9.41424 12Z"
												fill="white"
											/>
										</svg>
									</span>
									<p>
										{LangString(
											"components.Tablet.index.7c887da7ca8e0dab99d3161b540e6c11",
										)}
									</p>
								</button>

								<div className="title-wrap">
									<div className="title">
										<div className="icon">
											<svg
												width="64"
												height="64"
												viewBox="0 0 64 64"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M50.6003 43.2376C49.6877 43.4431 48.9806 43.7148 48.4206 44.0022C50.1743 41.766 51.4942 39.2351 52.404 36.7866C52.4323 36.8103 52.4681 36.8371 52.5215 36.8681C53.1256 37.212 54.4199 37.2578 56.0778 36.2549C57.6792 35.2856 58.5946 33.6054 59 32.6832C57.9939 32.6193 56.0676 32.6586 54.4504 33.6366C53.8497 34.001 53.4076 34.3689 53.0809 34.7204C53.3166 33.9014 53.5093 33.1033 53.6505 32.347C53.6587 32.3035 53.65 32.2616 53.6488 32.2195C54.1492 31.9043 54.8132 31.1726 55.1711 29.6955C55.5749 28.0321 55.0855 26.3779 54.7369 25.5008C54.0274 26.126 52.8255 27.3896 52.4238 29.0444C52.0712 30.5006 52.2757 31.4273 52.5715 31.9378C52.5351 31.9975 52.5057 32.0625 52.4913 32.135C52.2116 33.6316 51.7352 35.2909 51.0693 36.9752C51.0868 36.6898 51.0908 36.383 51.0727 36.0482C50.9569 33.9139 49.7092 32.0912 49.0159 31.2342C48.4228 32.147 47.3786 34.0807 47.4956 36.2368C47.6354 38.8239 48.724 39.639 49.054 39.8278C49.2953 39.9651 49.4487 39.9687 49.4908 39.9665C49.5479 39.964 49.6264 39.9375 49.7171 39.8898C48.242 42.6213 46.2129 45.1975 43.5915 47.037C44.0252 46.4115 44.4278 45.5585 44.7092 44.4075C45.3797 41.6681 44.4326 38.9276 43.9221 37.7384C42.9256 38.5561 40.8188 40.5565 40.1441 43.3196C39.3318 46.6378 40.456 48.121 41.0547 48.4934C38.7071 49.5378 36.2135 49.8835 33.5972 49.5292C33.8193 49.4474 34.04 49.3713 34.2632 49.2812C34.2835 49.2731 34.3041 49.2633 34.3222 49.253C34.5827 49.1133 34.7005 48.7997 34.5858 48.5221C34.4621 48.2253 34.1191 48.0822 33.8176 48.2033C32.9607 48.5495 32.1165 48.8273 31.2841 49.041C30.458 48.8064 29.6212 48.5076 28.7736 48.1402C28.4752 48.0114 28.1285 48.1458 27.9974 48.4393C27.8754 48.7138 27.9856 49.0304 28.2416 49.1766C28.2596 49.1872 28.2803 49.1975 28.2998 49.2062C28.5207 49.3016 28.7397 49.3833 28.9595 49.4709C26.3353 49.7593 23.851 49.3509 21.5314 48.2479C22.1394 47.8909 23.302 46.4361 22.5754 43.0986C21.9716 40.3194 19.9176 38.2668 18.9423 37.4243C18.4012 38.6004 17.3836 41.3164 17.9834 44.0716C18.2351 45.2293 18.6157 46.0921 19.033 46.7282C16.4605 44.8234 14.4981 42.197 13.0941 39.4295C13.1831 39.4794 13.2611 39.5076 13.3179 39.5118C13.3597 39.5151 13.5134 39.5154 13.7581 39.3843C14.0932 39.2041 15.2018 38.416 15.4087 35.8334C15.5807 33.681 14.5871 31.7219 14.0177 30.7943C13.3027 31.6334 12.0084 33.4243 11.8377 35.555C11.8109 35.8892 11.8069 36.1961 11.8171 36.482C11.1944 34.7818 10.7613 33.1111 10.52 31.6078C10.5076 31.535 10.4796 31.4691 10.4448 31.4086C10.7539 30.9056 10.9822 29.9842 10.6675 28.52C10.3084 26.8554 9.14011 25.5622 8.44678 24.9195C8.07553 25.7876 7.5438 27.429 7.90431 29.1019C8.22414 30.5876 8.86944 31.3355 9.36105 31.6633C9.35879 31.7054 9.34918 31.747 9.35597 31.7908C9.47802 32.5501 9.64952 33.3529 9.86424 34.1775C9.54639 33.818 9.11412 33.4389 8.52334 33.0597C6.93184 32.0418 5.00751 31.954 4 31.9927C4.38142 32.9247 5.25331 34.6275 6.82928 35.6365C8.46118 36.6809 9.75575 36.6675 10.3683 36.3389C10.4228 36.3091 10.4587 36.2834 10.4878 36.2602C11.3343 38.7304 12.5884 41.294 14.2836 43.5734C13.7315 43.2719 13.0317 42.9826 12.1248 42.7541C9.36246 42.057 6.56794 42.9583 5.3635 43.442C6.19189 44.446 8.20323 46.5516 10.9619 47.2453C13.3869 47.8563 14.8097 47.3779 15.4411 47.0386C16.0449 46.7137 16.2763 46.3496 16.3145 46.2015C16.3331 46.1301 16.3379 46.0391 16.3283 45.9379C17.4556 47.059 18.7163 48.0554 20.1357 48.8443C20.9344 49.2887 21.7526 49.6542 22.5864 49.9418C21.8433 50.0893 20.8929 50.4372 19.7498 51.1887C19.5322 51.3321 19.3161 51.4891 19.1081 51.6571C17.1389 53.2494 16.1339 55.5165 15.7384 56.608C17.0454 56.6736 19.9772 56.6103 22.3519 55.0487C22.6432 54.8578 22.9172 54.6576 23.1678 54.4548C25.243 52.7774 25.4063 51.1678 25.2182 50.5775C27.1563 50.8581 29.1781 50.7393 31.268 50.2389C33.3452 50.7915 35.3625 50.9611 37.3077 50.7295C37.1046 51.3151 37.2266 52.9283 39.2572 54.657C39.5024 54.8657 39.7717 55.0732 40.0582 55.271C42.3922 56.8917 45.3209 57.0287 46.6296 56.9961C46.2617 55.895 45.3158 53.6034 43.3881 51.962C43.185 51.789 42.9731 51.6264 42.7589 51.4777C41.6353 50.698 40.6942 50.3264 39.9551 50.1602C40.7964 49.8938 41.6226 49.5487 42.4334 49.1247C43.8729 48.3718 45.1585 47.4071 46.3143 46.315C46.3022 46.4157 46.3041 46.5069 46.3211 46.5786C46.3555 46.7279 46.5771 47.0975 47.1729 47.4376C47.7953 47.7921 49.2057 48.3068 51.646 47.757C54.4218 47.1329 56.4866 45.0778 57.3404 44.0956C56.1498 43.5809 53.3793 42.6099 50.6003 43.2376Z"
													fill="white"
												></path>
												<path
													d="M31.5025 18.4832C31.5051 18.5012 31.4865 18.3654 31.5006 18.4708C31.5065 18.5153 31.5039 18.4984 31.5025 18.4832Z"
													fill="white"
												></path>
												<path
													d="M23.2981 19.0658C24.5271 18.8114 25.0015 17.7396 24.9187 16.6151C24.7546 14.3946 24.7786 14.7768 24.4972 12.5641C24.1613 9.91874 20.0597 10.7821 20.3945 13.4149C20.6748 15.6215 20.6514 15.2488 20.8158 17.466C20.8989 18.5927 22.2948 19.2728 23.2981 19.0658Z"
													fill="white"
												></path>
												<path
													d="M25.9598 9.94998C25.9115 12.6815 26.0061 12.8007 26.237 15.523C26.4635 18.1773 30.5769 17.3672 30.3518 14.7327C30.152 12.3789 30.0961 12.6299 30.1379 10.268C30.1859 7.61175 26.0081 7.27979 25.9598 9.94998Z"
													fill="white"
												></path>
												<path
													d="M35.8264 13.909C35.8366 11.4276 35.9657 11.5412 35.6874 9.06904C35.5608 7.94818 34.8299 7 33.5916 7C32.5459 7 31.3689 7.94595 31.496 9.06904C31.7749 11.5409 31.6458 11.4279 31.635 13.909C31.6249 16.578 35.8151 16.5769 35.8264 13.909Z"
													fill="white"
												></path>
												<path
													d="M41.1364 9.96309C41.068 8.83805 40.3682 7.85863 39.1375 7.80339C38.0862 7.75681 36.882 8.64892 36.949 9.77703C37.095 12.1705 36.8958 11.9593 37.0416 14.3528C37.1097 15.4778 37.8096 16.4575 39.0405 16.5125C40.0913 16.5588 41.296 15.6667 41.2282 14.5391C41.0835 12.1451 41.2813 12.3571 41.1364 9.96309Z"
													fill="white"
												></path>
												<path
													d="M24.2717 30.9949C24.5926 31.1285 24.926 31.2474 25.2693 31.3531L25.2761 38.726H36.4807L36.5681 31.0236C37.1241 30.7321 37.6408 30.3893 38.0909 29.9784C39.4553 28.8561 40.4712 27.615 41.0468 26.4987C42.2407 23.8045 43.7709 20.7577 41.3109 19.0265C38.7314 17.2102 33.7673 17.2018 30.8067 18.0443C30.4543 18.145 30.1684 18.3034 29.9413 18.5003C28.3079 19.2706 28.6744 21.5162 30.2891 21.8057C31.3692 21.9993 32.1964 21.8783 34.177 21.9508C34.1838 21.9511 36.5909 21.7329 36.5986 21.7335C35.9016 22.2864 33.2237 23.3272 32.1964 24.4862C31.9258 24.7914 31.3587 25.3226 31.0335 25.6316C29.8404 23.7342 27.1049 22.2741 25.1738 21.6671C24.0166 21.3039 21.9453 20.5487 21.2477 21.7873C19.3994 25.5365 21.0816 28.6067 24.2717 30.9949Z"
													fill="white"
												></path>
											</svg>
										</div>
										<p className="tablet-title-main">
											{LangString(
												"components.Tablet.index.e5aae468ac72b6594bccf24bc5771305",
											)}
										</p>
									</div>
									<p className="op40"></p>
								</div>
							</div>

							<div className="tabs-tablet-wrapper">
								<ul className="tabs-tablet-caption">
									<li
										className={this.state.fractionPage === 0 ? "active" : ""}
										onClick={(e) => {
											e.preventDefault();
											this.setState({ fractionPage: 0 });
										}}
									>
										<button className="btn-tablet white">
											<span className="icon-wrapper">
												<span className="icon-wrap">
													<svg
														width="28"
														height="28"
														viewBox="0 0 28 28"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															fillRule="evenodd"
															clipRule="evenodd"
															d="M13.9998 26.8333C6.91218 26.8333 1.1665 21.0876 1.1665 14C1.1665 6.9123 6.91218 1.16663 13.9998 1.16663C21.0875 1.16663 26.8332 6.9123 26.8332 14C26.8332 21.0876 21.0875 26.8333 13.9998 26.8333ZM22.6326 19.9787C23.8099 18.282 24.4998 16.2216 24.4998 14C24.4998 8.20097 19.7988 3.49996 13.9998 3.49996C8.20085 3.49996 3.49984 8.20097 3.49984 14C3.49984 16.2216 4.18978 18.282 5.36709 19.9787C6.68012 18.2444 9.76554 17.5 13.9998 17.5C18.2341 17.5 21.3196 18.2444 22.6326 19.9787ZM20.9586 21.863C20.6172 20.6352 18.1641 19.8333 13.9998 19.8333C9.83556 19.8333 7.38251 20.6352 7.04104 21.863C8.89369 23.5038 11.3304 24.5 13.9998 24.5C16.6692 24.5 19.106 23.5038 20.9586 21.863ZM13.9998 6.99996C11.1755 6.99996 9.33317 9.04835 9.33317 11.6666C9.33317 15.6652 11.3875 17.5 13.9998 17.5C16.5876 17.5 18.6665 15.7262 18.6665 11.9C18.6665 9.2418 16.8164 6.99996 13.9998 6.99996ZM11.6665 11.6666C11.6665 14.3141 12.6211 15.1666 13.9998 15.1666C15.3738 15.1666 16.3332 14.3481 16.3332 11.9C16.3332 10.4421 15.4181 9.33329 13.9998 9.33329C12.5225 9.33329 11.6665 10.2851 11.6665 11.6666Z"
															fill="#141B1F"
														></path>
													</svg>
												</span>
											</span>
											<p>
												{LangString(
													"components.Tablet.index.de429355fd57481412990db8b38cbef2",
												)}
											</p>
										</button>
									</li>
									<li
										className={this.state.fractionPage === 1 ? "active" : ""}
										onClick={(e) => {
											e.preventDefault();
											this.setState({ fractionPage: 1 });
										}}
									>
										<button className="btn-tablet white">
											<span className="icon-wrapper">
												<span className="icon-wrap">
													<svg
														width="28"
														height="28"
														viewBox="0 0 28 28"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															fillRule="evenodd"
															clipRule="evenodd"
															d="M7.00016 25.4383L14.1014 21H23.3335C24.6222 21 25.6668 19.9554 25.6668 18.6667V4.66671C25.6668 3.37804 24.6222 2.33337 23.3335 2.33337H4.66683C3.37817 2.33337 2.3335 3.37804 2.3335 4.66671V18.6667C2.3335 19.9554 3.37817 21 4.66683 21H7.00016V25.4383ZM13.4322 18.6667L9.3335 21.2284V18.6667H4.66683V4.66671H23.3335V18.6667H13.4322Z"
															fill="#141B1F"
														></path>
													</svg>
												</span>
											</span>
											<p>
												{LangString(
													"components.Tablet.index.849a55bb5491ae4d4627fe21047ed806",
												)}
											</p>
										</button>
									</li>
									{fractionCfg.getFraction(this.state.fractionData.id).gos &&
									CEF.user.rank >= 7 ? (
										<li
											className={this.state.fractionPage === 3 ? "active" : ""}
											onClick={(e) => {
												e.preventDefault();
												this.setState({ fractionPage: 3 });
											}}
										>
											<button className="btn-tablet white">
												<span className="icon-wrapper">
													<span className="icon-wrap">
														<svg
															width="28"
															height="28"
															viewBox="0 0 28 28"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M7.00016 25.4383L14.1014 21H23.3335C24.6222 21 25.6668 19.9554 25.6668 18.6667V4.66671C25.6668 3.37804 24.6222 2.33337 23.3335 2.33337H4.66683C3.37817 2.33337 2.3335 3.37804 2.3335 4.66671V18.6667C2.3335 19.9554 3.37817 21 4.66683 21H7.00016V25.4383ZM13.4322 18.6667L9.3335 21.2284V18.6667H4.66683V4.66671H23.3335V18.6667H13.4322Z"
																fill="#141B1F"
															></path>
														</svg>
													</span>
												</span>
												<p>
													{LangString(
														"components.Tablet.index.fa08c6447576771464e033162850d88e",
													)}
												</p>
											</button>
										</li>
									) : (
										<></>
									)}
									{fractionCfg.getFraction(this.state.fractionData.id).gos ? (
										<li
											className={this.state.fractionPage === 2 ? "active" : ""}
											onClick={(e) => {
												e.preventDefault();
												this.setState({ fractionPage: 2 });
											}}
										>
											<button className="btn-tablet white">
												<span className="icon-wrapper">
													<span className="icon-wrap">
														<svg
															width="28"
															height="28"
															viewBox="0 0 28 28"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<g id="24 / maps / radar">
																<path
																	id="icon"
																	fillRule="evenodd"
																	clipRule="evenodd"
																	d="M21.4248 6.57538L23.0747 4.92546C25.3971 7.24784 26.8335 10.4562 26.8335 14C26.8335 21.0877 21.0878 26.8333 14.0002 26.8333C6.91251 26.8333 1.16683 21.0877 1.16683 14C1.16683 7.30562 6.29258 1.80842 12.8335 1.21898V1.16667H13.9931C13.9954 1.16667 13.9978 1.16667 14.0002 1.16667L15.1668 1.16667L15.1668 12.8333L16.475 11.5251C17.1084 12.1585 17.5002 13.0335 17.5002 14C17.5002 15.933 15.9332 17.5 14.0002 17.5C12.0672 17.5 10.5002 15.933 10.5002 14C10.5002 12.4761 11.4741 11.1796 12.8335 10.6992V8.28335C10.1709 8.82384 8.16683 11.1779 8.16683 14C8.16683 17.2217 10.7785 19.8333 14.0002 19.8333C17.2218 19.8333 19.8335 17.2217 19.8335 14C19.8335 12.3892 19.1806 10.9308 18.125 9.87521L19.7749 8.22529C21.2527 9.70317 22.1668 11.7448 22.1668 14C22.1668 18.5103 18.5105 22.1667 14.0002 22.1667C9.48984 22.1667 5.8335 18.5103 5.8335 14C5.8335 9.88578 8.87582 6.48214 12.8335 5.91604V3.56408C7.58356 4.14443 3.50016 8.59535 3.50016 14C3.50016 19.799 8.20117 24.5 14.0002 24.5C19.7992 24.5 24.5002 19.799 24.5002 14C24.5002 11.1005 23.3249 8.47551 21.4248 6.57538Z"
																	fill="#141B1F"
																></path>
															</g>
														</svg>
													</span>
												</span>
												<p>
													{LangString(
														"components.Tablet.index.c980d04aca586d3825f7c837a1a6490b",
													)}
												</p>
											</button>
										</li>
									) : (
										<></>
									)}

									{this.state.fractionData.id === 1 ||
									fractionCfg.getFraction(this.state.fractionData.id).gos ? (
										<li
											onClick={(e) => {
												e.preventDefault();
												this.setState({
													fractionPage: 3,
													currentPage: "gosfraction",
												});
											}}
										>
											<button className="btn-tablet white">
												<span className="icon-wrapper">
													<span className="icon-wrap">
														<svg
															width="28"
															height="28"
															viewBox="0 0 28 28"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<g id="24 / maps / radar">
																<path
																	id="icon"
																	fillRule="evenodd"
																	clipRule="evenodd"
																	d="M21.4248 6.57538L23.0747 4.92546C25.3971 7.24784 26.8335 10.4562 26.8335 14C26.8335 21.0877 21.0878 26.8333 14.0002 26.8333C6.91251 26.8333 1.16683 21.0877 1.16683 14C1.16683 7.30562 6.29258 1.80842 12.8335 1.21898V1.16667H13.9931C13.9954 1.16667 13.9978 1.16667 14.0002 1.16667L15.1668 1.16667L15.1668 12.8333L16.475 11.5251C17.1084 12.1585 17.5002 13.0335 17.5002 14C17.5002 15.933 15.9332 17.5 14.0002 17.5C12.0672 17.5 10.5002 15.933 10.5002 14C10.5002 12.4761 11.4741 11.1796 12.8335 10.6992V8.28335C10.1709 8.82384 8.16683 11.1779 8.16683 14C8.16683 17.2217 10.7785 19.8333 14.0002 19.8333C17.2218 19.8333 19.8335 17.2217 19.8335 14C19.8335 12.3892 19.1806 10.9308 18.125 9.87521L19.7749 8.22529C21.2527 9.70317 22.1668 11.7448 22.1668 14C22.1668 18.5103 18.5105 22.1667 14.0002 22.1667C9.48984 22.1667 5.8335 18.5103 5.8335 14C5.8335 9.88578 8.87582 6.48214 12.8335 5.91604V3.56408C7.58356 4.14443 3.50016 8.59535 3.50016 14C3.50016 19.799 8.20117 24.5 14.0002 24.5C19.7992 24.5 24.5002 19.799 24.5002 14C24.5002 11.1005 23.3249 8.47551 21.4248 6.57538Z"
																	fill="#141B1F"
																></path>
															</g>
														</svg>
													</span>
												</span>
												<p>
													{LangString(
														"components.Tablet.index.0752ccdfcf0fe4eaa441f73cf6cd427f",
													)}
												</p>
											</button>
										</li>
									) : (
										<></>
									)}
									{this.state.fractionData?.mafiabiz ? (
										<li
											onClick={(e) => {
												e.preventDefault();
												this.setState({ currentPage: "mafiabiz" });
											}}
										>
											<button className="btn-tablet white">
												<span className="icon-wrapper">
													<span className="icon-wrap">
														<svg
															width="28"
															height="28"
															viewBox="0 0 28 28"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M13.9998 26.8333C6.91218 26.8333 1.1665 21.0876 1.1665 14C1.1665 6.9123 6.91218 1.16663 13.9998 1.16663C21.0875 1.16663 26.8332 6.9123 26.8332 14C26.8332 21.0876 21.0875 26.8333 13.9998 26.8333ZM22.6326 19.9787C23.8099 18.282 24.4998 16.2216 24.4998 14C24.4998 8.20097 19.7988 3.49996 13.9998 3.49996C8.20085 3.49996 3.49984 8.20097 3.49984 14C3.49984 16.2216 4.18978 18.282 5.36709 19.9787C6.68012 18.2444 9.76554 17.5 13.9998 17.5C18.2341 17.5 21.3196 18.2444 22.6326 19.9787ZM20.9586 21.863C20.6172 20.6352 18.1641 19.8333 13.9998 19.8333C9.83556 19.8333 7.38251 20.6352 7.04104 21.863C8.89369 23.5038 11.3304 24.5 13.9998 24.5C16.6692 24.5 19.106 23.5038 20.9586 21.863ZM13.9998 6.99996C11.1755 6.99996 9.33317 9.04835 9.33317 11.6666C9.33317 15.6652 11.3875 17.5 13.9998 17.5C16.5876 17.5 18.6665 15.7262 18.6665 11.9C18.6665 9.2418 16.8164 6.99996 13.9998 6.99996ZM11.6665 11.6666C11.6665 14.3141 12.6211 15.1666 13.9998 15.1666C15.3738 15.1666 16.3332 14.3481 16.3332 11.9C16.3332 10.4421 15.4181 9.33329 13.9998 9.33329C12.5225 9.33329 11.6665 10.2851 11.6665 11.6666Z"
																fill="#141B1F"
															></path>
														</svg>
													</span>
												</span>
												<p>
													{LangString(
														"components.Tablet.index.cf7fe9bd4fb94ed9205c08d7231ce5d9",
													)}
												</p>
											</button>
										</li>
									) : null}
								</ul>
							</div>
						</div>

						<div className="tabs-tablet-content-wrapper">
							{this.state.fractionPage === 1 ? (
								<div className="tabs-tablet-content-item active">
									<ChatDialogClass
										id={`faction_${this.state.fractionData.id}`}
									/>
								</div>
							) : (
								<></>
							)}
							{this.state.fractionPage === 3 ? (
								<div className="tabs-tablet-content-item active">
									<ChatDialogClass id={"all_faction_chat"} />
								</div>
							) : (
								<></>
							)}
							{this.state.fractionPage === 0 ? (
								<div className="tabs-tablet-content-item active">
									{!this.state.fractionKickId ||
									!this.getFractionMember(this.state.fractionKickId) ? (
										<div className="member-list">
											<div className="member-list-wrap">
												<div className="online-size mb24">
													<p className="font40 fontw300 mr12">
														{
															this.state.fractionData.members.filter(
																(q) => !q.lastSeen,
															).length
														}{" "}
														<span className="op4">
															/ {this.state.fractionData.members.length}
														</span>
													</p>
													<p className="op4 font16">
														{LangString(
															"components.Tablet.index.e060c086b81d214d81b653c81d1b3c73",
														)}
														<br />
														{LangString(
															"components.Tablet.index.e060c086b81d214d81b653c81d1b3c73",
														)}
													</p>
												</div>

												<div className="tablet-search-wrap-block">
													<div
														className="tablet-search-wrap"
														style={{ marginLeft: 0 }}
													>
														<input
															type="text"
															placeholder={LangString(
																"components.Tablet.index.347d62bb8481298fc02f084844a7acd1",
															)}
															value={this.state.fractionSearch}
															onChange={(e) => {
																e.preventDefault();
																this.setState({
																	fractionSearch: e.currentTarget.value
																		? e.currentTarget.value.toLowerCase()
																		: "",
																});
															}}
														/>
														<button className="search-icon">
															<svg
																width="28"
																height="28"
																viewBox="0 0 28 28"
																fill="none"
																xmlns="http://www.w3.org/2000/svg"
															>
																<path
																	fillRule="evenodd"
																	clipRule="evenodd"
																	d="M11.6668 21C6.51217 21 2.3335 16.8213 2.3335 11.6666C2.3335 6.51199 6.51217 2.33331 11.6668 2.33331C16.8215 2.33331 21.0002 6.51199 21.0002 11.6666C21.0002 13.8235 20.2686 15.8094 19.04 17.3899L25.3251 23.675L23.6752 25.3249L17.3901 19.0398C15.8096 20.2684 13.8237 21 11.6668 21ZM18.6668 11.6666C18.6668 15.5326 15.5328 18.6666 11.6668 18.6666C7.80084 18.6666 4.66683 15.5326 4.66683 11.6666C4.66683 7.80065 7.80084 4.66665 11.6668 4.66665C15.5328 4.66665 18.6668 7.80065 18.6668 11.6666Z"
																	fill="white"
																></path>
															</svg>
														</button>
													</div>
													<div className="tablet-search-wrap">
														<input
															type="text"
															placeholder={LangString(
																"components.Tablet.index.32a63cef678fd991a23133500247d7b7",
															)}
															className="tag-input"
															maxLength={12}
															value={
																typeof this.state.fractionTag === "string"
																	? this.state.fractionTag
																	: this.getFractionMember(CEF.id)
																		? this.getFractionMember(CEF.id).tag || ""
																		: ""
															}
															onChange={(e) => {
																e.preventDefault();
																this.setState({
																	fractionTag: e.currentTarget.value || "",
																});
															}}
														/>
														<button
															className="search-icon"
															onClick={(e) => {
																e.preventDefault();
																const mY = this.getFractionMember(CEF.id)
																	? this.getFractionMember(CEF.id).tag || ""
																	: "";
																if (this.state.fractionTag == mY) return;
																CustomEvent.triggerServer(
																	"faction:tag",
																	this.state.fractionTag,
																);
																const q = { ...this.state.fractionData };
																if (q.members.find((q) => q.id === CEF.id)) {
																	q.members.find((q) => q.id === CEF.id).tag =
																		this.state.fractionTag;
																	this.setState({ fractionData: q });
																}
															}}
														>
															<svg
																width="28"
																height="28"
																viewBox="0 0 24 24"
																fill="none"
																xmlns="http://www.w3.org/2000/svg"
															>
																<path
																	d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
																	stroke="white"
																	stroke-width="2"
																	stroke-linecap="round"
																	stroke-linejoin="round"
																/>
																<path
																	d="M17 11L19 13L23 9"
																	stroke="white"
																	stroke-width="2"
																	stroke-linecap="round"
																	stroke-linejoin="round"
																/>
																<path
																	d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z"
																	stroke="white"
																	stroke-width="2"
																	stroke-linecap="round"
																	stroke-linejoin="round"
																/>
															</svg>
														</button>
													</div>
												</div>

												{system
													.sortArrayObjects(
														[
															...this.state.fractionData.members
																.filter(
																	(q) =>
																		!this.state.fractionSearch ||
																		parseInt(this.state.fractionSearch) ===
																			q.id ||
																		q.name
																			.toLowerCase()
																			?.includes(this.state.fractionSearch) ||
																		fractionCfg
																			.getRankName(
																				this.state.fractionData.id,
																				q.rank,
																			)
																			?.toLowerCase()
																			.includes(this.state.fractionSearch),
																)
																.map((q) => {
																	return { ...q, online: !q.lastSeen };
																}),
														],
														[
															{ id: "online", type: "DESC" },
															{ id: "rank", type: "DESC" },
														],
													)
													.map((member, id) => {
														return (
															<div
																key={`member_${id}`}
																className={`member-list-item ${member.lastSeen === 0 ? "item-online" : ""}${member.id === this.state.fractionSelected ? " selected" : ""}`}
																onClick={(e) => {
																	e.preventDefault();
																	this.setState({
																		fractionSelected: member.id,
																	});
																}}
															>
																<div className="leftside">
																	<p className="num">{member.id}</p>
																	<p className="name">{member.name}</p>
																</div>
																<div className="rightside">
																	{CEF.user.isSubLeader &&
																	member.rank < CEF.user.rank ? (
																		<>
																			<div className="block-hidden">
																				<div className="select-wrapper">
																					<Select
																						onChange={(e) => {
																							CustomEvent.triggerServer(
																								"faction:setRank",
																								member.id,
																								parseInt((e as any).value),
																							);
																						}}
																						classNamePrefix={"user_role"}
																						defaultValue={fractionCfg
																							.getFractionRanks(
																								this.state.fractionData.id,
																							)
																							.map((q, i) => {
																								return {
																									value: `${i + 1}`,
																									label: q,
																								};
																							})
																							.find(
																								(q) =>
																									q.value ==
																									member.rank.toString(),
																							)}
																						isOptionDisabled={(
																							option,
																							options,
																						) => {
																							return (
																								parseInt(option.value) >=
																								CEF.user.rank
																							);
																						}}
																						options={fractionCfg
																							.getFractionRanks(
																								this.state.fractionData.id,
																							)
																							.map((q, i) => {
																								return {
																									value: `${i + 1}`,
																									label: q,
																								};
																							})}
																					/>
																				</div>
																				<button
																					onClick={(e) => {
																						e.preventDefault();
																						this.setState({
																							fractionKickId: member.id,
																						});
																					}}
																				>
																					<div className="delete-icon">
																						<svg
																							width="24"
																							height="24"
																							viewBox="0 0 24 24"
																							fill="none"
																							xmlns="http://www.w3.org/2000/svg"
																						>
																							<path
																								fillRule="evenodd"
																								clipRule="evenodd"
																								d="M9 1H15C16.1046 1 17 1.89543 17 3V4H20C21.1046 4 22 4.89543 22 6V8C22 9.10457 21.1046 10 20 10H19.9199L19 21C19 22.1046 18.1046 23 17 23H7C5.89543 23 5 22.1046 5.00345 21.083L4.07987 10H4C2.89543 10 2 9.10457 2 8V6C2 4.89543 2.89543 4 4 4H7V3C7 1.89543 7.89543 1 9 1ZM4 6H7H17H20V8H4V6ZM6.08649 10H17.9132L17.0035 20.917L17 21H7L6.08649 10ZM15 3V4H9V3H15Z"
																								fill="white"
																							></path>
																						</svg>
																					</div>
																				</button>
																			</div>
																			<div className="text-wrap">
																				<p className="lastseen">
																					{member.lastSeen > 0
																						? `${systemUtil.timeStampString(member.lastSeen)}`
																						: ""}
																				</p>
																				<p className="vocation">
																					{fractionCfg.getRankName(
																						this.state.fractionData.id,
																						member.rank,
																					)}{" "}
																					{member.tag ? (
																						<>[{member.tag}]</>
																					) : (
																						""
																					)}
																				</p>
																			</div>
																		</>
																	) : (
																		<>
																			<p className="lastseen">
																				{member.lastSeen > 0
																					? `${systemUtil.timeStampString(member.lastSeen)}`
																					: ""}
																			</p>
																			<p className="vocation">
																				{fractionCfg.getRankName(
																					this.state.fractionData.id,
																					member.rank,
																				)}{" "}
																				{member.tag ? <>[{member.tag}]</> : ""}
																			</p>
																		</>
																	)}
																</div>
															</div>
														);
													})}
											</div>
										</div>
									) : (
										<div className="modal-sure-wrapper">
											<div className="modal-sure-wrap">
												<button
													className="close"
													onClick={(e) => {
														e.preventDefault();
														this.setState({ fractionKickId: null });
													}}
												>
													<span className="icon-wrap">
														<svg
															width="30"
															height="30"
															viewBox="0 0 30 30"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<g id="24 / basic / plus">
																<path
																	id="icon"
																	fillRule="evenodd"
																	clipRule="evenodd"
																	d="M14.9996 13.5858L21.3635 7.22183L22.7777 8.63604L16.4138 15L22.7777 21.364L21.3635 22.7782L14.9996 16.4142L8.6356 22.7782L7.22138 21.364L13.5853 15L7.22138 8.63604L8.6356 7.22183L14.9996 13.5858Z"
																	fill="#141B1F"
																></path>
															</g>
														</svg>
													</span>
												</button>
												<div className="text-wrap">
													<p>
														{LangString(
															"components.Tablet.index.23ff46899060707096d0b2b8b79919cd",
														)}{" "}
														<span>
															{
																this.getFractionMember(
																	this.state.fractionKickId,
																).name
															}{" "}
															{LangString(
																"components.Tablet.index.53ce1738dd5780bdd6da86da3c6e980a",
															)}
														</span>
													</p>
												</div>
												<div className="button-wrap">
													<button
														className="btn-primary"
														onClick={(e) => {
															e.preventDefault();
															CustomEvent.triggerServer(
																"faction:kick",
																this.state.fractionKickId,
															);
															this.setState({ fractionKickId: null });
														}}
													>
														<p>
															{LangString(
																"components.Tablet.index.47afed5025a811f671eebb56e07e1ab2",
															)}
														</p>
													</button>
													<button
														className="btn-primary gray"
														onClick={(e) => {
															e.preventDefault();
															this.setState({ fractionKickId: null });
														}}
													>
														<p>
															{LangString(
																"components.Tablet.index.f7fd3a984d81ce220778960cd09557bb",
															)}
														</p>
													</button>
												</div>
											</div>
										</div>
									)}
								</div>
							) : (
								<></>
							)}
							{this.state.fractionPage === 2 ? (
								<div className="tabs-tablet-content-item active">
									<div className="beacon">
										<div className="topline">
											<div className="switch-wrapper">
												<div className="switch-wrap">
													<input
														type="checkbox"
														id="switch"
														checked={
															this.getFractionMember(CEF.id) &&
															this.getFractionMember(CEF.id).tracker
														}
														onChange={(e) => {
															let data = { ...this.state.fractionData };
															let q = data.members.find((q) => q.id === CEF.id);
															q.tracker = !q.tracker;
															CustomEvent.triggerServer(
																"faction:setGpsTracker",
																q.tracker,
															);
															this.setState({ fractionData: data });
														}}
													/>
													<label htmlFor="switch"></label>
												</div>
												<p className="title">
													{LangString(
														"components.Tablet.index.6522d714008e3f92e9b39c5b093fff05",
													)}
												</p>
											</div>
											<p className="descr">
												{LangString(
													"components.Tablet.index.4f6346f2ccd45caa796bc8445b251250",
												)}
											</p>
										</div>
										<div className="beacon-wrap">
											{this.state.fractionData.members
												.filter((q) => q.tracker && CEF.id !== q.id)
												.map((member, id) => {
													return (
														<div
															key={`gps_${id}`}
															className={`beacon-item ${member.tracker ? "item-online" : ""}`}
														>
															<p className="name">{member.name}</p>
															<div className="switch-wrap">
																<input
																	type="checkbox"
																	id={`switch_${member.id}`}
																	checked={!!member.tracking}
																	onClick={(e) => {
																		e.preventDefault();
																		let data = { ...this.state.fractionData };
																		let q = data.members.find(
																			(q) => q.id === member.id,
																		);
																		q.tracking = !q.tracking;
																		CustomEvent.triggerServer(
																			"faction:setGpsTrackerWatch",
																			member.id,
																			q.tracking,
																		);
																		this.setState({ fractionData: data });
																	}}
																/>
																<label htmlFor={`switch_${member.id}`}></label>
															</div>
														</div>
													);
												})}
										</div>
									</div>
								</div>
							) : (
								<></>
							)}
						</div>
					</div>
				</div>
			</SocketSync>
		);
	}

	get bussinessPage() {
		return (
			<>
				<div className="tablet-blur" />
				<div className="tablet-home">
					<div className="grid-in-tablet">
						<div className="tablet-info tablet-info-jsb tablet-info-operations">
							<div className="topline">
								<button
									className="return-btn"
									onClick={(e) => {
										this.setState({ currentPage: "main" });
									}}
								>
									<span className="icon">
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M9.41424 12L16.7071 19.2929L15.2929 20.7071L6.58582 12L15.2929 3.29291L16.7071 4.70712L9.41424 12Z"
												fill="white"
											/>
										</svg>
									</span>
									<p>
										{LangString(
											"components.Tablet.index.e3d8587d7dd8e4a2c35f21eb1e3ea673",
										)}
									</p>
								</button>

								<div className="title-wrap">
									<div className="title">
										<p className="tablet-title-main">
											{this.state.bussinessData.name}
										</p>
									</div>
								</div>
							</div>

							<ul className="extra-info-tablet-wrap">
								<li className="extra-info-tablet-item">
									<p className="big">
										${systemUtil.numberFormat(this.state.bussinessData.cost)}
									</p>
									<p className="descr">
										{LangString(
											"components.Tablet.index.2f9d55b521d4e9559fca67c30b423319",
										)}
									</p>
								</li>
								<li className="extra-info-tablet-item">
									<p className="big">
										${systemUtil.numberFormat(this.state.bussinessData.money)}
									</p>
									<p className="descr">
										{LangString(
											"components.Tablet.index.79379d41180e2cb65f1e720f4eaec915",
										)}
									</p>
								</li>
								<li className="extra-info-tablet-item">
									<p className="big">
										${systemUtil.numberFormat(this.state.bussinessData.tax)}
									</p>
									<p className="descr">
										{LangString(
											"components.Tablet.index.916324054c73991aaaac9730073e25d2",
										)}
									</p>
								</li>
							</ul>
						</div>

						<div className="operations-wrapper">
							<div className="tabs-submittedads-wrapper">
								<p className="tablet-title-main">
									{LangString(
										"components.Tablet.index.b30d2e3ea67ea3c6065ad0b20ebc04b1",
									)}
								</p>
								<div className="operations-table-wrap">
									<table className="operations-table">
										<thead>
											<tr>
												<th></th>
												<th></th>
												<th></th>
											</tr>
										</thead>
										<tbody>
											{this.state.bussinessData.logs.map((item, id) => {
												return (
													<tr
														key={`bussiness_log_${id}`}
														className={
															item.type === "add" ? "revenue" : "expenses"
														}
													>
														<td>
															<p className="name">{item.text}</p>
														</td>
														<td>
															<p className="date">
																{systemUtil.timeStampString(item.time)}
															</p>
														</td>
														<td>
															<p className="money">
																{item.type === "add" ? "+" : "-"}$
																{systemUtil.numberFormat(item.sum)}
															</p>
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}

	get lifeinvaderPage() {
		return (
			<>
				<div className="tablet-blur" />
				<div className="tablet-home">
					<div className="grid-in-tablet">
						<div className="tablet-info tablet-info-jcs tablet-info-lifeinvander">
							<div className="topline">
								<button
									className="return-btn"
									onClick={(e) => {
										this.setState({ currentPage: "main" });
									}}
								>
									<span className="icon">
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M9.41424 12L16.7071 19.2929L15.2929 20.7071L6.58582 12L15.2929 3.29291L16.7071 4.70712L9.41424 12Z"
												fill="white"
											/>
										</svg>
									</span>
									<p>
										{LangString(
											"components.Tablet.index.fc0ce9857e75ffd806521fb4b7fc1924",
										)}
									</p>
								</button>

								<div className="title-wrap">
									<div className="title">
										<div className="icon">
											<svg
												height="64"
												fill="white"
												viewBox="0 0 512 512"
												width="64"
												xmlns="http://www.w3.org/2000/svg"
											>
												<g id="W">
													<path d="m363.859 261.151-51.035-202.651h-111.05l-53.54 200.381-41.733-200.381h-106.501l91.091 395h103.564l61.084-230.068 61.289 230.068h101.763l93.209-395h-105.836z" />
												</g>
											</svg>
										</div>
										<p className="tablet-title-main">
											{LangString(
												"components.Tablet.index.48db40a530607c7eadee6533508423f7",
											)}
										</p>
									</div>
									<p className="op40"></p>
								</div>
							</div>

							<div className="tabs-tablet-wrapper">
								<ul className="tabs-tablet-caption">
									<li
										className={this.state.lifeinvaderPage == 0 ? "active" : ""}
										onClick={(e) => {
											e.preventDefault();
											this.setState({ lifeinvaderPage: 0 });
										}}
									>
										<button className="btn-tablet red">
											<span className="icon-wrapper">
												<span className="icon-wrap">
													<svg
														width="28"
														height="28"
														viewBox="0 0 28 28"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															fillRule="evenodd"
															clipRule="evenodd"
															d="M4.66683 21V5.83333H18.6668V21C18.6668 21.4091 18.737 21.8018 18.866 22.1667H5.8335C5.18916 22.1667 4.66683 21.6443 4.66683 21ZM22.1668 24.5H5.8335C3.9005 24.5 2.3335 22.933 2.3335 21V3.5H18.6668H19.8335H21.0002L21.0002 9.33333H25.6668V10.5V11.6667V21C25.6668 22.933 24.0998 24.5 22.1668 24.5ZM21.0002 11.6667H23.3335V21C23.3335 21.6443 22.8112 22.1667 22.1668 22.1667C21.5225 22.1667 21.0002 21.6443 21.0002 21L21.0002 11.6667ZM11.6668 8.16667V12.8333H7.00016V8.16667H11.6668ZM16.3335 11.6667V9.33333H12.8335V11.6667H16.3335ZM16.3335 14V16.3333H7.00016V14H16.3335ZM16.3335 19.8333V17.5H7.00016V19.8333H16.3335Z"
															fill="#EB5757"
														></path>
													</svg>
												</span>
											</span>
											<p>
												{LangString(
													"components.Tablet.index.344a49d1cd54a5844988ba8504285e6b",
												)}
											</p>
										</button>
									</li>
									<li
										className={this.state.lifeinvaderPage == 1 ? "active" : ""}
										onClick={(e) => {
											e.preventDefault();
											if (
												!this.state.myNumbers ||
												this.state.myNumbers.length == 0
											)
												return CEF.alert.setAlert(
													"error",
													LangString(
														"components.Tablet.index.b19c8b86248c63b0b33b4eb99b635576",
													),
												);
											this.setState({ lifeinvaderPage: 1 });
										}}
									>
										<button className="btn-tablet red">
											<span className="icon-wrapper">
												<span className="icon-wrap">
													<svg
														width="28"
														height="28"
														viewBox="0 0 28 28"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															fillRule="evenodd"
															clipRule="evenodd"
															d="M7 23.3334V21H9.33333V22.1667C9.33333 23.4554 10.378 24.5 11.6667 24.5H15.1667C16.4553 24.5 17.5 23.4554 17.5 22.1667V19.8334H21V21C21 22.2887 22.0447 23.3334 23.3333 23.3334H25.6667C26.9553 23.3334 28 22.2887 28 21V4.66671C28 3.37804 26.9553 2.33337 25.6667 2.33337H4.66667H2.33333C1.04467 2.33337 0 3.37804 0 4.66671V23.3334C0 24.622 1.04467 25.6667 2.33333 25.6667H4.66667C5.95533 25.6667 7 24.622 7 23.3334ZM2.33333 23.3334V4.66671H23.3333H25.6667V21H23.3333V16.3334H21V17.5H17.5V16.3334H15.1667V22.1667H11.6667V16.3334H9.33333V18.6667H7V16.3334H4.66667V23.3334H2.33333ZM22.1667 7.00004V9.33337H5.83333V7.00004H22.1667ZM18.6667 14V11.6667H5.83333V14H18.6667Z"
															fill="#EB5757"
														></path>
													</svg>
												</span>
											</span>
											<p>
												{LangString(
													"components.Tablet.index.9d63833e1e7f26902e05c64d30319ca9",
												)}
											</p>
										</button>
									</li>
									{this.state.lifeInvaderModerate && CEF.user.fraction === 5 ? (
										<li
											className={
												this.state.lifeinvaderPage == 2 ? "active" : ""
											}
											onClick={(e) => {
												e.preventDefault();
												this.setState({
													lifeinvaderPage: 2,
													lifeInvaderSelect: -1,
												});
											}}
										>
											<button className="btn-tablet red">
												<span className="icon-wrapper">
													<span className="icon-wrap">
														<svg
															width="28"
															height="28"
															viewBox="0 0 28 28"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M23.5454 3.5H4.45446C3.28295 3.5 2.33325 4.54467 2.33325 5.83333V8.16667C2.33325 9.45533 3.28295 10.5 4.45446 10.5H23.5454C24.7169 10.5 25.6666 9.45533 25.6666 8.16667V5.83333C25.6666 4.54467 24.7169 3.5 23.5454 3.5ZM4.45446 12.8333H23.5454C24.7169 12.8333 25.6666 13.878 25.6666 15.1667V17.5C25.6666 18.7887 24.7169 19.8333 23.5454 19.8333H4.45446C3.28295 19.8333 2.33325 18.7887 2.33325 17.5V15.1667C2.33325 13.878 3.28295 12.8333 4.45446 12.8333ZM4.66659 15.1667V17.5H23.3333V15.1667H4.66659ZM4.66659 5.83333V8.16667H23.3333V5.83333H4.66659ZM16.3333 22.1667H2.33325V24.5H16.3333V22.1667Z"
																fill="#EB5757"
															></path>
														</svg>
													</span>
												</span>
												<p>
													{LangString(
														"components.Tablet.index.75fb7cf44a7a0f41008fe58374fa6b68",
													)}
												</p>
											</button>
										</li>
									) : (
										<></>
									)}
									<li
										className={this.state.lifeinvaderPage == 3 ? "active" : ""}
										onClick={(e) => {
											e.preventDefault();
											this.setState({
												lifeinvaderPage: 3,
												lifeInvaderSelect: -1,
											});
										}}
									>
										<button className="btn-tablet red">
											<span className="icon-wrapper">
												<span className="icon-wrap">
													<svg
														width="28"
														height="28"
														viewBox="0 0 28 28"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															fillRule="evenodd"
															clipRule="evenodd"
															d="M23.5454 3.5H4.45446C3.28295 3.5 2.33325 4.54467 2.33325 5.83333V8.16667C2.33325 9.45533 3.28295 10.5 4.45446 10.5H23.5454C24.7169 10.5 25.6666 9.45533 25.6666 8.16667V5.83333C25.6666 4.54467 24.7169 3.5 23.5454 3.5ZM4.45446 12.8333H23.5454C24.7169 12.8333 25.6666 13.878 25.6666 15.1667V17.5C25.6666 18.7887 24.7169 19.8333 23.5454 19.8333H4.45446C3.28295 19.8333 2.33325 18.7887 2.33325 17.5V15.1667C2.33325 13.878 3.28295 12.8333 4.45446 12.8333ZM4.66659 15.1667V17.5H23.3333V15.1667H4.66659ZM4.66659 5.83333V8.16667H23.3333V5.83333H4.66659ZM16.3333 22.1667H2.33325V24.5H16.3333V22.1667Z"
															fill="#EB5757"
														></path>
													</svg>
												</span>
											</span>
											<p>
												{LangString(
													"components.Tablet.index.d2b4339f805aef6191e73f225d34080c",
												)}
											</p>
										</button>
									</li>
								</ul>
							</div>
						</div>

						<div className="tabs-tablet-content-wrapper">
							{this.state.lifeinvaderPage == 0 ? (
								<div className="tabs-tablet-content-item active">
									<section className="submitted-ads">
										<div className="tabs-submittedads-wrapper">
											<div className="tabs-submittedads-caption-wrapper">
												<ul
													className="tabs-submittedads-caption"
													onWheel={(e) =>
														(e.currentTarget.scrollLeft += e.deltaY / 3)
													}
												>
													<li
														className={
															!this.state.lifeinvaderCategory ? "active" : ""
														}
														onClick={(e) => {
															e.preventDefault();
															this.setState({ lifeinvaderCategory: null });
														}}
													>
														<p>
															{LangString(
																"components.Tablet.index.b692a6a3816cfbcefd5494cb5881bd9c",
															)}
														</p>
													</li>
													{NEWS_CATEGORY.map((data, i) => {
														return (
															<li
																key={`news_cat_${i}`}
																className={
																	this.state.lifeinvaderCategory === data[0]
																		? "active"
																		: ""
																}
																onClick={(e) => {
																	e.preventDefault();
																	this.setState({
																		lifeinvaderCategory: data[0],
																	});
																}}
															>
																<p>{data[1]}</p>
															</li>
														);
													})}
												</ul>
											</div>
											<div className="tabs-submittedads-content-wrapper">
												<div className="tabs-submittedads-content-item active">
													<ul className="submittedads-wrap">
														{[...news].reverse().map((q, i) => {
															if (
																this.state.lifeinvaderCategory &&
																this.state.lifeinvaderCategory !== q.cat
															)
																return <></>;
															return (
																<li key={`news_${i}`}>
																	<p className="text">{q.text}</p>
																	<p className="date">
																		{q.name} |{" "}
																		{systemUtil.timeStampString(q.time)}
																		{!this.state.lifeinvaderCategory
																			? ` | ${getCategoryName(q.cat)}`
																			: ""}
																	</p>
																	<p className="num">+{q.number}</p>
																</li>
															);
														})}
													</ul>
												</div>
											</div>
										</div>
									</section>
								</div>
							) : (
								<></>
							)}

							{this.state.lifeinvaderPage == 1 ? (
								<div className="tabs-tablet-content-item active">
									<div className="tablet-form-wrapper">
										<form className="tablet-form-wrap">
											<p className="tablet-title-main">
												{LangString(
													"components.Tablet.index.9e84615138ce35028556df819a1cf439",
												)}
											</p>
											<div className="input-wrapper">
												<div className="input-wrap select-wrapper">
													<label htmlFor="categoryads">
														{LangString(
															"components.Tablet.index.5ac8dc3ee69b2bae27727c29a376b676",
														)}
													</label>
													<Select
														onChange={(e) => {
															this.setState({
																lifeInvaderCat: (e as any).value,
															});
														}}
														isSearchable={false}
														classNamePrefix={"ads_select"}
														value={{
															value: NEWS_CATEGORY.find(
																(q) => q[0] === this.state.lifeInvaderCat,
															)[0],
															label: NEWS_CATEGORY.find(
																(q) => q[0] === this.state.lifeInvaderCat,
															)[1],
														}}
														options={NEWS_CATEGORY.filter(
															(q) =>
																(CEF.user.fraction &&
																	CEF.user.fractionCfg.gos &&
																	CEF.user.rank >= 7) ||
																q[0] != "news",
														).map((q) => {
															return { value: q[0], label: q[1] };
														})}
													/>
												</div>
												<div className="input-wrap">
													<label htmlFor="descrads">
														{LangString(
															"components.Tablet.index.e9853bdfe2cb355428760c765bda534f",
														)}
													</label>
													<textarea
														value={this.state.lifeInvaderText || ""}
														onChange={(e) => {
															this.setState({
																lifeInvaderText: e.currentTarget.value,
															});
														}}
														id="descrads"
														cols={30}
														rows={3}
													></textarea>
												</div>
												<div className="input-wrap select-wrapper">
													<label htmlFor="categoryads">
														{LangString(
															"components.Tablet.index.0e1f99505f29162d9d8514265c02070b",
														)}
													</label>
													<Select
														onChange={(e) => {
															this.setState({
																lifeInvaderNumber: parseInt((e as any).value),
															});
														}}
														isSearchable={false}
														classNamePrefix={"ads_select"}
														value={{
															value: this.state.lifeInvaderNumber.toString(),
															label: this.state.lifeInvaderNumber.toString(),
														}}
														options={this.state.myNumbers.map((q) => {
															return {
																value: q.toString(),
																label: q.toString(),
															};
														})}
													/>
												</div>
											</div>
											<button
												className="btn-primary"
												onClick={(e) => {
													e.preventDefault();
													if (!this.state.lifeInvaderCat) return;
													if (!this.state.lifeInvaderText) return;
													if (!this.state.lifeInvaderNumber) return;
													CustomEvent.callServer(
														"news:new",
														this.state.lifeInvaderCat,
														this.state.lifeInvaderText,
														this.state.lifeInvaderNumber,
													).then((status: string) => {
														if (!status) {
															this.setState({
																lifeInvaderCat: NEWS_CATEGORY[0][0],
																lifeInvaderText: "",
																lifeInvaderNumber:
																	this.state.myNumbers.length > 0
																		? this.state.myNumbers[0]
																		: null,
															});
															CEF.alert.setAlert(
																"success",
																LangString(
																	"components.Tablet.index.e36b908efcf78a2c17ed904eb3b40d3a",
																),
															);
														} else {
															CEF.alert.setAlert("error", status);
														}
													});
												}}
											>
												<p>
													{LangString(
														"components.Tablet.index.4ff3a7f08cd3418bf6af9bf6abb759d8",
													)}
												</p>
											</button>
											{this.state.lifeInvaderCat !== "news" ? (
												<div className="price">
													<p>${systemUtil.numberFormat(NEWS_POST_COST)}</p>
													<p className="descr">
														{LangString(
															"components.Tablet.index.c8e796a5aa1e5229416a1a5b9a8d6edf",
														)}
													</p>
												</div>
											) : (
												<></>
											)}
										</form>
									</div>
								</div>
							) : (
								<></>
							)}
							{this.state.lifeinvaderPage == 2 ? (
								<div className="tabs-tablet-content-item active">
									<ul className="submittedads-wrap moderation-list">
										{[...this.state.lifeInvaderModerate]
											.reverse()
											.map((item, i) => {
												return (
													<li key={`lf_${item.id}_${i}`}>
														<p className="text">{item.text}</p>
														<div className="downline">
															<div className="text-wrap">
																<p className="date">
																	{systemUtil.timeStampString(item.time)}
																</p>
																<p className="name">
																	{item.id} {item.name} {item.number}{" "}
																	{getCategoryName(item.cat)}{" "}
																	{item.res ? ` | ${item.res}` : ""}
																</p>
															</div>
															<div className="button-wrap">
																{item.res ? (
																	<></>
																) : (
																	<>
																		<button
																			className="btn-mini green"
																			onClick={(e) => {
																				e.preventDefault();
																				CustomEvent.triggerServer(
																					"news:setOrder",
																					item.ids,
																					true,
																				);
																			}}
																		>
																			<div className="icon-wrap">
																				<svg
																					width="18"
																					height="18"
																					viewBox="0 0 18 18"
																					fill="none"
																					xmlns="http://www.w3.org/2000/svg"
																				>
																					<path
																						fillRule="evenodd"
																						clipRule="evenodd"
																						d="M6.74694 1.5C7.31115 1.02223 8.12935 0.75 9 0.75C9.87065 0.75 10.6888 1.02223 11.2531 1.5H12C12.8284 1.5 13.5 2.17157 13.5 3H14.25C15.0784 3 15.75 3.67157 15.75 4.5V15.75C15.75 16.5784 15.0784 17.25 14.25 17.25H3.75C2.92157 17.25 2.25 16.5784 2.25 15.75V4.5C2.25 3.67157 2.92157 3 3.75 3H4.5C4.5 2.17157 5.17157 1.5 6 1.5H6.74694ZM12 5.25C12.5552 5.25 13.04 4.94835 13.2993 4.5H14.25V15.75H3.75V4.5H4.70067C4.96003 4.94835 5.44479 5.25 6 5.25H12ZM11.4697 7.71968L8.24998 10.9394L6.53031 9.21968L5.46965 10.2803L8.24998 13.0607L12.5303 8.78034L11.4697 7.71968ZM7.39321 3L7.61749 2.74153C7.86389 2.45756 8.39206 2.25 9 2.25C9.60794 2.25 10.1361 2.45756 10.3825 2.74153L10.6068 3H12V3.75H6V3H7.05101H7.39321Z"
																						fill="white"
																					></path>
																				</svg>
																			</div>
																			<p>
																				{LangString(
																					"components.Tablet.index.e41840f029db8c052e38d80771fee457",
																				)}
																			</p>
																		</button>
																		<button
																			className="btn-mini orange"
																			onClick={(e) => {
																				e.preventDefault();
																				this.setState({
																					...this.state,
																					lifeInvaderSelect:
																						this.state.lifeInvaderSelect ===
																						item.ids
																							? -1
																							: item.ids,
																					lifeInvaderSelectType: 1,
																					lifeInvaderCancel: item.text,
																				});
																				//                                                        CustomEvent.triggerServer('news:setOrder', item.ids, false)
																			}}
																		>
																			<div className="icon-wrap">
																				<svg
																					width="24"
																					height="24"
																					viewBox="0 0 24 24"
																					fill="none"
																					xmlns="http://www.w3.org/2000/svg"
																				>
																					<path
																						d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z"
																						stroke="white"
																						strokeWidth="2"
																						strokeLinecap="round"
																						strokeLinejoin="round"
																					/>
																				</svg>
																			</div>
																		</button>
																		<button
																			className="btn-mini red"
																			onClick={(e) => {
																				e.preventDefault();
																				this.setState({
																					...this.state,
																					lifeInvaderCancel: "",
																					lifeInvaderSelect:
																						this.state.lifeInvaderSelect ===
																						item.ids
																							? -1
																							: item.ids,
																					lifeInvaderSelectType: 0,
																				});
																				//                                                        CustomEvent.triggerServer('news:setOrder', item.ids, false)
																			}}
																		>
																			<div className="icon-wrap">
																				<svg
																					width="18"
																					height="18"
																					viewBox="0 0 18 18"
																					fill="none"
																					xmlns="http://www.w3.org/2000/svg"
																				>
																					<path
																						fillRule="evenodd"
																						clipRule="evenodd"
																						d="M6.74694 1.5C7.31115 1.02223 8.12935 0.75 9 0.75C9.87065 0.75 10.6888 1.02223 11.2531 1.5H12C12.8284 1.5 13.5 2.17157 13.5 3H14.25C15.0784 3 15.75 3.67157 15.75 4.5V15.75C15.75 16.5784 15.0784 17.25 14.25 17.25H3.75C2.92157 17.25 2.25 16.5784 2.25 15.75V4.5C2.25 3.67157 2.92157 3 3.75 3H4.5C4.5 2.17157 5.17157 1.5 6 1.5H6.74694ZM12 5.25C12.5552 5.25 13.04 4.94835 13.2993 4.5H14.25V15.75H3.75V4.5H4.70067C4.96003 4.94835 5.44479 5.25 6 5.25H12ZM10.7197 7.71968L8.99998 9.43935L7.28031 7.71968L6.21965 8.78034L7.93932 10.5L6.21965 12.2197L7.28031 13.2803L8.99998 11.5607L10.7197 13.2803L11.7803 12.2197L10.0606 10.5L11.7803 8.78034L10.7197 7.71968ZM7.39321 3L7.61749 2.74153C7.86389 2.45756 8.39206 2.25 9 2.25C9.60794 2.25 10.1361 2.45756 10.3825 2.74153L10.6068 3H12V3.75H6V3H7.05101H7.39321Z"
																						fill="white"
																					></path>
																				</svg>
																			</div>
																		</button>
																	</>
																)}
															</div>
														</div>
														{this.state.lifeInvaderSelect == item.ids ? (
															<div className="reason-delete-box">
																<input
																	type="text"
																	placeholder={
																		this.state.lifeInvaderSelectType === 0
																			? LangString(
																					"components.Tablet.index.693ee321d39924139d3ef14aceeb1703",
																				)
																			: LangString(
																					"components.Tablet.index.02c424481b79f3b4a9d8d1fceb748a4f",
																				)
																	}
																	value={this.state.lifeInvaderCancel}
																	onChange={(e) => {
																		this.setState({
																			...this.state,
																			lifeInvaderCancel: e.target.value,
																		});
																	}}
																/>
																<button
																	className={`btn-mini ${this.state.lifeInvaderSelectType === 0 ? "red" : "orange"}`}
																	onClick={(e) => {
																		if (this.state.lifeInvaderCancel.length < 1)
																			return;
																		e.preventDefault();
																		CustomEvent.triggerServer(
																			this.state.lifeInvaderSelectType === 0
																				? "news:setOrder"
																				: "news:editOrder",
																			item.ids,
																			!!this.state.lifeInvaderSelectType,
																			this.state.lifeInvaderCancel,
																		);
																		/*                                          if( this.state.lifeInvaderSelectType === 1 ) {
                                                        let lifeInvaderModerate = this.state.lifeInvaderModerate;
                                                        lifeInvaderModerate.map( (d, idx) => { if(d.id == item.id) lifeInvaderModerate[idx].text = this.state.lifeInvaderCancel });
                                                        this.setState( { lifeInvaderModerate, lifeInvaderSelect: -1 });
                                                    }*/
																	}}
																>
																	<div className="icon-wrap">
																		{this.state.lifeInvaderSelectType === 0 ? (
																			<svg
																				width="18"
																				height="18"
																				viewBox="0 0 18 18"
																				fill="none"
																				xmlns="http://www.w3.org/2000/svg"
																			>
																				<path
																					fillRule="evenodd"
																					clipRule="evenodd"
																					d="M6.74694 1.5C7.31115 1.02223 8.12935 0.75 9 0.75C9.87065 0.75 10.6888 1.02223 11.2531 1.5H12C12.8284 1.5 13.5 2.17157 13.5 3H14.25C15.0784 3 15.75 3.67157 15.75 4.5V15.75C15.75 16.5784 15.0784 17.25 14.25 17.25H3.75C2.92157 17.25 2.25 16.5784 2.25 15.75V4.5C2.25 3.67157 2.92157 3 3.75 3H4.5C4.5 2.17157 5.17157 1.5 6 1.5H6.74694ZM12 5.25C12.5552 5.25 13.04 4.94835 13.2993 4.5H14.25V15.75H3.75V4.5H4.70067C4.96003 4.94835 5.44479 5.25 6 5.25H12ZM10.7197 7.71968L8.99998 9.43935L7.28031 7.71968L6.21965 8.78034L7.93932 10.5L6.21965 12.2197L7.28031 13.2803L8.99998 11.5607L10.7197 13.2803L11.7803 12.2197L10.0606 10.5L11.7803 8.78034L10.7197 7.71968ZM7.39321 3L7.61749 2.74153C7.86389 2.45756 8.39206 2.25 9 2.25C9.60794 2.25 10.1361 2.45756 10.3825 2.74153L10.6068 3H12V3.75H6V3H7.05101H7.39321Z"
																					fill="white"
																				></path>
																			</svg>
																		) : (
																			<svg
																				width="24"
																				height="24"
																				viewBox="0 0 24 24"
																				fill="none"
																				xmlns="http://www.w3.org/2000/svg"
																			>
																				<path
																					d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z"
																					stroke="white"
																					strokeWidth="2"
																					strokeLinecap="round"
																					strokeLinejoin="round"
																				/>
																			</svg>
																		)}
																	</div>
																</button>
															</div>
														) : null}
													</li>
												);
												//lifeInvaderSelect
											})}
									</ul>
								</div>
							) : (
								<></>
							)}
							{this.state.lifeinvaderPage == 3 ? (
								<div className="tabs-tablet-content-item active">
									<ul className="submittedads-wrap moderation-list">
										{[...this.state.lifeInvaderModerate]
											.reverse()
											.filter((q) => q.id === CEF.id)
											.map((item, i) => {
												return (
													<li key={`lf_my_${item.id}_${i}`}>
														<p className="text">{item.text}</p>
														<div className="downline">
															<div className="text-wrap">
																<p className="date">
																	{systemUtil.timeStampString(item.time)}
																</p>
																<p className="name">
																	{item.id} {item.name} {item.number}{" "}
																	{getCategoryName(item.cat)}{" "}
																	{item.res ? ` | ${item.res}` : ""}
																</p>
															</div>
														</div>
													</li>
												);
												//lifeInvaderSelect
											})}
									</ul>
								</div>
							) : (
								<></>
							)}
						</div>
					</div>
				</div>
			</>
		);
	}
	get mainPage() {
		return (
			<>
				<div className="topline-mainscreen">
					<div className="battery-icon">
						<svg
							width="1.822916666666667vw"
							height=".833335vw"
							viewBox="0 0 35 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g clipPath="url(#clip0)">
								<rect
									x="-0.5"
									y="0.5"
									width="31.2771"
									height="15.248"
									rx="2.5"
									transform="matrix(1 0 0 -1 1.08508 16.124)"
									stroke="white"
								></rect>
								<path
									d="M33.1432 10.3683C34.1687 10.3683 35 9.53703 35 8.51155V7.18527C35 6.15979 34.1687 5.32848 33.1432 5.32848V10.3683Z"
									fill="white"
								></path>
								<path
									d="M1.97559 12.2335C1.97559 13.3381 2.87102 14.2335 3.97559 14.2335H24.2382V1.76648H3.97559C2.87102 1.76648 1.97559 2.66191 1.97559 3.76648V12.2335Z"
									fill="white"
								></path>
							</g>
							<defs>
								<clipPath id="clip0">
									<rect width="35" height="16" fill="white"></rect>
								</clipPath>
							</defs>
						</svg>
					</div>
				</div>
				<div className="time-date">
					<p className="time">{this.state.realTime}</p>
					<p className="date">{this.state.realDate}</p>
				</div>
				<div className="menu-tablet-wrapper">
					{this.state.houseData ? (
						<a
							href=""
							onClick={(e) => {
								e.preventDefault();
								this.setState({ currentPage: "house" });
							}}
							className="menu-tablet-wrap"
						>
							<div className="menu-tablet-item">
								<div className="icon">
									<svg
										width="64"
										height="64"
										viewBox="0 0 64 64"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M52.6135 35.9867V58C38.8712 58 25.1288 58 11.2147 58V35.9867L8.46626 38.9333L4 34.4267C13.2761 24.8933 22.5521 15.36 32 6L44.5399 18.6533V11.72H50.8957V25.0667L59.6564 33.9067L60 34.4267L55.5337 38.9333L52.6135 35.9867Z"
											fill="white"
										></path>
									</svg>
								</div>
							</div>
							<p>
								{LangString(
									"components.Tablet.index.a859b6b70d2872c78ce80f8f89d5c0fd",
								)}
							</p>
						</a>
					) : (
						<></>
					)}

					{/* <div className="menu-tablet-wrap">
                    <div className="menu-tablet-item">
                        <div className="icon">
                            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M60 59.3333H4V62H60V59.3333Z" fill="white"></path>
                                <path d="M59.3333 34H50.9386C50.14 24.6667 42.604 17.1933 33.276 16.542C33.3546 16.3633 33.3333 16.0213 33.3333 15.814V11.6293C37.3333 10.2667 40.6666 15.0987 44 12.28C44 9.54733 44 6.81533 44 4.08267C40.6666 6.902 36.9333 2.06733 33.3366 3.43267C33.3253 2.64 32.798 2 32.0026 2C31.2006 2 30.6666 2.65067 30.6666 3.45267V15.814C30.6666 16.0207 30.658 16.362 30.736 16.54C21.3966 17.1793 13.8606 24.6667 13.0613 34H4.66663V57.3333H59.3333V34ZM16.6666 51.834C16.6666 53.0647 15.5633 54.062 14.3333 54.062C13.1026 54.062 12 53.064 12 51.834V41.0173C12 39.7867 13.1033 38.7893 14.3333 38.7893C15.5633 38.7893 16.6666 39.7873 16.6666 41.0173V51.834ZM28.6666 51.834C28.6666 53.0647 27.5633 54.062 26.3333 54.062C25.1026 54.062 24 53.064 24 51.834V41.0173C24 39.7867 25.1033 38.7893 26.3333 38.7893C27.5633 38.7893 28.6666 39.7873 28.6666 41.0173V51.834ZM40 51.834C40 53.0647 38.8966 54.062 37.6666 54.062C36.4366 54.062 35.3333 53.064 35.3333 51.834V41.0173C35.3333 39.7867 36.4366 38.7893 37.6666 38.7893C38.8973 38.7893 40 39.7873 40 41.0173V51.834ZM52 51.834C52 53.0647 50.8966 54.062 49.6666 54.062C48.4366 54.062 47.3333 53.064 47.3333 51.834V41.0173C47.3333 39.7867 48.4366 38.7893 49.6666 38.7893C50.8973 38.7893 52 39.7873 52 41.0173V51.834Z" fill="white"></path>
                            </svg>
                        </div>
                    </div>
                    <p>Правительство</p>
                </div> */}
					{CEF.user.fraction ? (
						<div
							className="menu-tablet-wrap"
							onClick={async (e) => {
								e.preventDefault();

								this.setState({ currentPage: "loader" });
								const result = await CustomEvent.callServer(
									"tablet:loadFraction",
								);
								if (!result) {
									this.setState({ currentPage: "main" });
								} else {
									this.setState({
										currentPage: "fraction",
										fractionData: result,
									});
								}
							}}
						>
							<div className="menu-tablet-item">
								<div className="icon">
									<svg
										width="64"
										height="64"
										viewBox="0 0 64 64"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M50.6003 43.2376C49.6877 43.4431 48.9806 43.7148 48.4206 44.0022C50.1743 41.766 51.4942 39.2351 52.404 36.7866C52.4323 36.8103 52.4681 36.8371 52.5215 36.8681C53.1256 37.212 54.4199 37.2578 56.0778 36.2549C57.6792 35.2856 58.5946 33.6054 59 32.6832C57.9939 32.6193 56.0676 32.6586 54.4504 33.6366C53.8497 34.001 53.4076 34.3689 53.0809 34.7204C53.3166 33.9014 53.5093 33.1033 53.6505 32.347C53.6587 32.3035 53.65 32.2616 53.6488 32.2195C54.1492 31.9043 54.8132 31.1726 55.1711 29.6955C55.5749 28.0321 55.0855 26.3779 54.7369 25.5008C54.0274 26.126 52.8255 27.3896 52.4238 29.0444C52.0712 30.5006 52.2757 31.4273 52.5715 31.9378C52.5351 31.9975 52.5057 32.0625 52.4913 32.135C52.2116 33.6316 51.7352 35.2909 51.0693 36.9752C51.0868 36.6898 51.0908 36.383 51.0727 36.0482C50.9569 33.9139 49.7092 32.0912 49.0159 31.2342C48.4228 32.147 47.3786 34.0807 47.4956 36.2368C47.6354 38.8239 48.724 39.639 49.054 39.8278C49.2953 39.9651 49.4487 39.9687 49.4908 39.9665C49.5479 39.964 49.6264 39.9375 49.7171 39.8898C48.242 42.6213 46.2129 45.1975 43.5915 47.037C44.0252 46.4115 44.4278 45.5585 44.7092 44.4075C45.3797 41.6681 44.4326 38.9276 43.9221 37.7384C42.9256 38.5561 40.8188 40.5565 40.1441 43.3196C39.3318 46.6378 40.456 48.121 41.0547 48.4934C38.7071 49.5378 36.2135 49.8835 33.5972 49.5292C33.8193 49.4474 34.04 49.3713 34.2632 49.2812C34.2835 49.2731 34.3041 49.2633 34.3222 49.253C34.5827 49.1133 34.7005 48.7997 34.5858 48.5221C34.4621 48.2253 34.1191 48.0822 33.8176 48.2033C32.9607 48.5495 32.1165 48.8273 31.2841 49.041C30.458 48.8064 29.6212 48.5076 28.7736 48.1402C28.4752 48.0114 28.1285 48.1458 27.9974 48.4393C27.8754 48.7138 27.9856 49.0304 28.2416 49.1766C28.2596 49.1872 28.2803 49.1975 28.2998 49.2062C28.5207 49.3016 28.7397 49.3833 28.9595 49.4709C26.3353 49.7593 23.851 49.3509 21.5314 48.2479C22.1394 47.8909 23.302 46.4361 22.5754 43.0986C21.9716 40.3194 19.9176 38.2668 18.9423 37.4243C18.4012 38.6004 17.3836 41.3164 17.9834 44.0716C18.2351 45.2293 18.6157 46.0921 19.033 46.7282C16.4605 44.8234 14.4981 42.197 13.0941 39.4295C13.1831 39.4794 13.2611 39.5076 13.3179 39.5118C13.3597 39.5151 13.5134 39.5154 13.7581 39.3843C14.0932 39.2041 15.2018 38.416 15.4087 35.8334C15.5807 33.681 14.5871 31.7219 14.0177 30.7943C13.3027 31.6334 12.0084 33.4243 11.8377 35.555C11.8109 35.8892 11.8069 36.1961 11.8171 36.482C11.1944 34.7818 10.7613 33.1111 10.52 31.6078C10.5076 31.535 10.4796 31.4691 10.4448 31.4086C10.7539 30.9056 10.9822 29.9842 10.6675 28.52C10.3084 26.8554 9.14011 25.5622 8.44678 24.9195C8.07553 25.7876 7.5438 27.429 7.90431 29.1019C8.22414 30.5876 8.86944 31.3355 9.36105 31.6633C9.35879 31.7054 9.34918 31.747 9.35597 31.7908C9.47802 32.5501 9.64952 33.3529 9.86424 34.1775C9.54639 33.818 9.11412 33.4389 8.52334 33.0597C6.93184 32.0418 5.00751 31.954 4 31.9927C4.38142 32.9247 5.25331 34.6275 6.82928 35.6365C8.46118 36.6809 9.75575 36.6675 10.3683 36.3389C10.4228 36.3091 10.4587 36.2834 10.4878 36.2602C11.3343 38.7304 12.5884 41.294 14.2836 43.5734C13.7315 43.2719 13.0317 42.9826 12.1248 42.7541C9.36246 42.057 6.56794 42.9583 5.3635 43.442C6.19189 44.446 8.20323 46.5516 10.9619 47.2453C13.3869 47.8563 14.8097 47.3779 15.4411 47.0386C16.0449 46.7137 16.2763 46.3496 16.3145 46.2015C16.3331 46.1301 16.3379 46.0391 16.3283 45.9379C17.4556 47.059 18.7163 48.0554 20.1357 48.8443C20.9344 49.2887 21.7526 49.6542 22.5864 49.9418C21.8433 50.0893 20.8929 50.4372 19.7498 51.1887C19.5322 51.3321 19.3161 51.4891 19.1081 51.6571C17.1389 53.2494 16.1339 55.5165 15.7384 56.608C17.0454 56.6736 19.9772 56.6103 22.3519 55.0487C22.6432 54.8578 22.9172 54.6576 23.1678 54.4548C25.243 52.7774 25.4063 51.1678 25.2182 50.5775C27.1563 50.8581 29.1781 50.7393 31.268 50.2389C33.3452 50.7915 35.3625 50.9611 37.3077 50.7295C37.1046 51.3151 37.2266 52.9283 39.2572 54.657C39.5024 54.8657 39.7717 55.0732 40.0582 55.271C42.3922 56.8917 45.3209 57.0287 46.6296 56.9961C46.2617 55.895 45.3158 53.6034 43.3881 51.962C43.185 51.789 42.9731 51.6264 42.7589 51.4777C41.6353 50.698 40.6942 50.3264 39.9551 50.1602C40.7964 49.8938 41.6226 49.5487 42.4334 49.1247C43.8729 48.3718 45.1585 47.4071 46.3143 46.315C46.3022 46.4157 46.3041 46.5069 46.3211 46.5786C46.3555 46.7279 46.5771 47.0975 47.1729 47.4376C47.7953 47.7921 49.2057 48.3068 51.646 47.757C54.4218 47.1329 56.4866 45.0778 57.3404 44.0956C56.1498 43.5809 53.3793 42.6099 50.6003 43.2376Z"
											fill="white"
										></path>
										<path
											d="M31.5025 18.4832C31.5051 18.5012 31.4865 18.3654 31.5006 18.4708C31.5065 18.5153 31.5039 18.4984 31.5025 18.4832Z"
											fill="white"
										></path>
										<path
											d="M23.2981 19.0658C24.5271 18.8114 25.0015 17.7396 24.9187 16.6151C24.7546 14.3946 24.7786 14.7768 24.4972 12.5641C24.1613 9.91874 20.0597 10.7821 20.3945 13.4149C20.6748 15.6215 20.6514 15.2488 20.8158 17.466C20.8989 18.5927 22.2948 19.2728 23.2981 19.0658Z"
											fill="white"
										></path>
										<path
											d="M25.9598 9.94998C25.9115 12.6815 26.0061 12.8007 26.237 15.523C26.4635 18.1773 30.5769 17.3672 30.3518 14.7327C30.152 12.3789 30.0961 12.6299 30.1379 10.268C30.1859 7.61175 26.0081 7.27979 25.9598 9.94998Z"
											fill="white"
										></path>
										<path
											d="M35.8264 13.909C35.8366 11.4276 35.9657 11.5412 35.6874 9.06904C35.5608 7.94818 34.8299 7 33.5916 7C32.5459 7 31.3689 7.94595 31.496 9.06904C31.7749 11.5409 31.6458 11.4279 31.635 13.909C31.6249 16.578 35.8151 16.5769 35.8264 13.909Z"
											fill="white"
										></path>
										<path
											d="M41.1364 9.96309C41.068 8.83805 40.3682 7.85863 39.1375 7.80339C38.0862 7.75681 36.882 8.64892 36.949 9.77703C37.095 12.1705 36.8958 11.9593 37.0416 14.3528C37.1097 15.4778 37.8096 16.4575 39.0405 16.5125C40.0913 16.5588 41.296 15.6667 41.2282 14.5391C41.0835 12.1451 41.2813 12.3571 41.1364 9.96309Z"
											fill="white"
										></path>
										<path
											d="M24.2717 30.9949C24.5926 31.1285 24.926 31.2474 25.2693 31.3531L25.2761 38.726H36.4807L36.5681 31.0236C37.1241 30.7321 37.6408 30.3893 38.0909 29.9784C39.4553 28.8561 40.4712 27.615 41.0468 26.4987C42.2407 23.8045 43.7709 20.7577 41.3109 19.0265C38.7314 17.2102 33.7673 17.2018 30.8067 18.0443C30.4543 18.145 30.1684 18.3034 29.9413 18.5003C28.3079 19.2706 28.6744 21.5162 30.2891 21.8057C31.3692 21.9993 32.1964 21.8783 34.177 21.9508C34.1838 21.9511 36.5909 21.7329 36.5986 21.7335C35.9016 22.2864 33.2237 23.3272 32.1964 24.4862C31.9258 24.7914 31.3587 25.3226 31.0335 25.6316C29.8404 23.7342 27.1049 22.2741 25.1738 21.6671C24.0166 21.3039 21.9453 20.5487 21.2477 21.7873C19.3994 25.5365 21.0816 28.6067 24.2717 30.9949Z"
											fill="white"
										></path>
									</svg>
								</div>
							</div>
							<p>
								{LangString(
									"components.Tablet.index.65fb2973489cad021538ca9771d618a2",
								)}
							</p>
						</div>
					) : (
						<></>
					)}

					{CEF.user.family ? (
						<div
							className="menu-tablet-wrap"
							onClick={async (e) => {
								e.preventDefault();

								this.setState({ currentPage: "loader" });
								const result =
									await CustomEvent.callServer("tablet:loadFamily");
								if (!result) {
									this.setState({ currentPage: "main" });
								} else {
									this.setState({ currentPage: "family", familyData: result });
								}
							}}
						>
							<div className="menu-tablet-item">
								<div className="icon">
									<svg
										width="36"
										height="36"
										viewBox="0 0 36 36"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M16.4527 3.06521C16.7789 2.57583 16.6419 1.91419 16.1481 1.59469L13.9452 0.169317C13.4609 -0.144066 12.8147 -0.0101911 12.4947 0.469762L9.76697 4.56125L14.0332 6.69432L16.4527 3.06521Z"
											fill="white"
										/>
										<path
											d="M20.2002 9.77814L22.1972 6.78262C22.5234 6.29324 22.3864 5.6316 21.8926 5.3121L19.6897 3.88672C19.2054 3.57334 18.5591 3.70722 18.2392 4.18717L15.934 7.645L20.2002 9.77814Z"
											fill="white"
										/>
										<path
											d="M20.6797 15.0855L22.6112 15.9439C23.0807 16.1525 23.6322 15.9926 23.9171 15.5651L27.4895 10.2065C27.8157 9.71717 27.6787 9.05553 27.1849 8.73603L25.4356 7.60407C24.9513 7.29069 24.305 7.42456 23.9851 7.90452L20.2304 13.5366C19.8678 14.0806 20.0823 14.82 20.6797 15.0855Z"
											fill="white"
										/>
										<path
											d="M32.4763 12.16L30.727 11.0281C30.2427 10.7148 29.5964 10.8486 29.2764 11.3286L26.0732 16.1335C25.7106 16.6774 25.925 17.4168 26.5224 17.6823L28.454 18.5408C28.9235 18.7494 29.4749 18.5895 29.7599 18.162L32.7809 13.6305C33.1071 13.1412 32.9701 12.4796 32.4763 12.16Z"
											fill="white"
										/>
										<path
											d="M28.8819 20.7412C28.8817 20.7412 28.8818 20.7412 28.8817 20.7412C28.4366 20.7412 28.0044 20.6494 27.5971 20.4683L17.741 16.0879H17.0745L21.5051 24.9491C21.7732 25.4852 21.5418 26.1404 20.9873 26.3857C20.468 26.6156 19.8591 26.3737 19.6051 25.8658L14.7162 16.0879H10.2041C9.63616 16.0879 9.14749 15.6515 9.12077 15.0842C9.09222 14.4785 9.57485 13.9785 10.1743 13.9785H16.8359C17.1886 13.9785 17.5179 13.8023 17.7135 13.5089L18.3588 12.5409C18.7107 12.0131 18.5203 11.2963 17.9529 11.0126L9.42044 6.74634C8.94471 6.50848 8.36625 6.66211 8.07121 7.10466L3.21818 14.3843C2.97138 14.7544 2.9834 15.2397 3.2482 15.5971L11.0217 26.0913C11.2095 26.3448 11.2739 26.6689 11.1974 26.9749L9.26878 34.6894C9.10235 35.3551 9.60585 35.9999 10.292 35.9999H26.243C26.8255 35.9999 27.2977 35.5277 27.2977 34.9452V29.3159C27.2977 28.9639 27.4733 28.6351 27.7659 28.4394C27.7659 28.4394 28.0305 28.2624 28.4219 28.0014C30.1571 26.8447 31.193 24.9091 31.193 22.8237V19.7367C30.6 20.3724 29.768 20.7412 28.8819 20.7412Z"
											fill="white"
										/>
									</svg>
								</div>
							</div>
							<p>
								{LangString(
									"components.Tablet.index.b014489239b87ce13b533e665cc35531",
								)}
							</p>
						</div>
					) : (
						<></>
					)}

					<div
						className="menu-tablet-wrap"
						onClick={(e) => {
							e.preventDefault();
							this.setState({ currentPage: "lifeinvader" });
						}}
					>
						<div className="menu-tablet-item">
							<div className="icon">
								<svg
									height="64"
									fill="white"
									viewBox="0 0 512 512"
									width="64"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g id="W">
										<path d="m363.859 261.151-51.035-202.651h-111.05l-53.54 200.381-41.733-200.381h-106.501l91.091 395h103.564l61.084-230.068 61.289 230.068h101.763l93.209-395h-105.836z" />
									</g>
								</svg>
							</div>
						</div>
						<p>
							{LangString(
								"components.Tablet.index.b8cdbce48e439562cc8cc860fa1fff8f",
							)}
						</p>
					</div>
					{this.state.bussinessData ? (
						<div
							className="menu-tablet-wrap"
							onClick={async (e) => {
								e.preventDefault();

								this.setState({ currentPage: "loader" });
								const result = await CustomEvent.callServer(
									"tablet:loadBusiness",
								);
								if (!result) {
									this.setState({ currentPage: "main" });
								} else {
									this.setState({
										currentPage: "bussiness",
										bussinessData: result,
									});
								}
							}}
						>
							<div className="menu-tablet-item">
								<div className="icon">
									<svg
										width="64"
										height="64"
										viewBox="0 0 64 64"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M32 4C16.6052 4 4 16.6052 4 32C4 47.3948 16.6052 60 32 60C47.3948 60 60 47.3948 60 32C60 16.6052 47.4981 4 32 4ZM53.1808 21.048H43.8819C42.4354 16.2952 39.9557 11.9557 36.7528 8.64945C43.9852 10.0959 49.9779 14.7454 53.1808 21.048ZM55.8672 32C55.8672 34.2731 55.5572 36.5461 54.9373 38.6125H45.0184C45.4317 36.4428 45.6384 34.2731 45.6384 32C45.6384 29.7269 45.4317 27.3506 45.0184 25.1808H54.9373C55.5572 27.3506 55.8672 29.6236 55.8672 32ZM32 54.3173C28.5904 51.4244 25.9041 47.3948 24.3542 42.7454H39.6458C38.0959 47.3948 35.4096 51.4244 32 54.3173ZM23.2177 38.6125C22.8044 36.4428 22.5978 34.2731 22.5978 32C22.5978 29.6236 22.8044 27.3506 23.321 25.1808H40.7823C41.1956 27.3506 41.5055 29.7269 41.5055 32C41.5055 34.2731 41.2989 36.4428 40.8856 38.6125H23.2177ZM8.13284 32C8.13284 29.6236 8.4428 27.3506 9.16605 25.1808H19.0849C18.6716 27.3506 18.4649 29.7269 18.4649 32C18.4649 34.2731 18.6716 36.4428 19.0849 38.6125H9.06273C8.4428 36.5461 8.13284 34.2731 8.13284 32ZM32 9.68266C35.3063 12.4723 37.9926 16.5018 39.5424 21.048H24.4576C26.0074 16.5018 28.6937 12.5756 32 9.68266ZM27.1439 8.64945C23.941 11.9557 21.5646 16.2952 20.0148 21.048H10.7159C14.1255 14.7454 20.0148 10.0959 27.1439 8.64945ZM10.7159 42.7454H20.0148C21.4613 47.6015 23.941 51.941 27.1439 55.3506C19.9114 53.9041 13.9188 49.1513 10.7159 42.7454ZM36.8561 55.3506C40.059 51.941 42.5387 47.6015 43.9852 42.7454H53.2841C50.0812 49.1513 44.0886 53.9041 36.8561 55.3506Z"
											fill="white"
										></path>
									</svg>
								</div>
							</div>
							<p>
								{LangString(
									"components.Tablet.index.8ac78a683a2513d996369f4802dc2147",
								)}
							</p>
						</div>
					) : (
						<></>
					)}
					{this.state.vehicles && this.state.vehicles.length > 0 ? (
						<div
							onClick={(e) => {
								e.preventDefault();
								this.setState({ currentPage: "vehicles" });
							}}
							className="menu-tablet-wrap"
						>
							<div className="menu-tablet-item">
								<div className="icon">
									<svg
										width="64"
										height="64"
										viewBox="0 0 64 64"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M61.9753 25.0965L61.527 23.3788C61.3989 22.9334 60.7584 22.5517 60.246 22.5517L51.9836 23.1243C50.7666 22.0427 48.717 20.2614 46.2831 18.4164C42.5042 15.5534 32.5125 15.9988 31.936 16.0624C31.3596 16.0624 21.3678 15.5534 17.5889 18.4164C15.155 20.2614 13.1054 22.0427 11.8885 23.1243L3.75417 22.5517C3.24177 22.5517 2.60127 22.8698 2.47318 23.3788L2.02483 25.0965C1.89673 25.6055 2.28103 26.1145 2.79342 26.1145H5.73971C5.29136 26.6234 4.97111 27.3233 4.84301 28.1503L4.65086 29.6136C4.26657 32.3493 4.20252 35.1486 4.39467 37.8843C4.52276 39.7929 4.77896 41.7652 5.29136 43.1648V45.646C5.29136 46.9184 6.31615 48 7.6612 48H14.6426C15.7315 48 16.6281 47.3002 16.8843 46.2822L31.4877 46.9821H31.8079C31.872 46.9821 31.936 46.9821 32.0001 46.9821C32.0641 46.9821 32.1282 46.9821 32.1922 46.9821H32.5125L47.1158 46.2822C47.372 47.3002 48.3327 48 49.3575 48H56.3389C57.6199 48 58.7088 46.9821 58.7088 45.646V43.1648C59.2212 41.7652 59.4774 39.7929 59.6055 37.8843C59.7976 35.1486 59.6695 32.3493 59.3493 29.6136L59.1571 28.2139C59.029 27.3869 58.7088 26.6871 58.2604 26.1781H61.1427C61.7191 26.1145 62.1034 25.6055 61.9753 25.0965ZM15.2191 33.3036L11.312 35.4667C10.6075 35.8484 9.77484 35.5303 9.45459 34.8305L7.0207 29.2955C6.7645 28.7865 7.34095 28.2139 7.85335 28.4684L15.155 31.8403C15.7955 32.1584 15.7955 32.9855 15.2191 33.3036ZM24.7625 17.3984H26.0435C25.0827 17.9074 22.841 23.4424 22.841 23.4424H19.5104C20.7914 20.1341 24.7625 17.3984 24.7625 17.3984ZM31.8079 41.4471C31.8079 41.4471 18.0372 32.8583 17.717 32.8583L31.8079 37.1845V41.4471ZM32.2563 41.4471V37.1209L46.3472 32.7946C46.0269 32.8583 32.2563 41.4471 32.2563 41.4471ZM56.9794 29.2955L54.4815 34.8305C54.1612 35.5303 53.3286 35.8484 52.6241 35.4667L48.7811 33.3036C48.2046 32.9855 48.2046 32.0948 48.8451 31.8403L56.1468 28.4684C56.6592 28.2776 57.2356 28.7865 56.9794 29.2955Z"
											fill="white"
										></path>
									</svg>
								</div>
							</div>
							<p>
								{LangString(
									"components.Tablet.index.c9497a5013514f2e16544d6d2b8c96f7",
								)}
							</p>
						</div>
					) : (
						<></>
					)}

					{/*<div className="menu-tablet-wrap">*/}
					{/*    <div className="menu-tablet-item">*/}
					{/*        <div className="icon">*/}
					{/*            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
					{/*                <path d="M59.1264 28.4888C58.6783 28.2032 55.1448 26.092 53.7448 25.448L52.0088 21.248C52.524 19.8592 53.5152 15.9672 53.6888 15.2896C53.7583 14.9812 53.7485 14.6602 53.6604 14.3567C53.5723 14.0531 53.4086 13.7768 53.1848 13.5536L50.4464 10.832C50.2238 10.6072 49.9475 10.443 49.6437 10.3548C49.34 10.2666 49.0187 10.2574 48.7104 10.328C48.1952 10.4456 44.2304 11.448 42.752 12.008L38.552 10.272C37.9416 8.928 35.8864 5.484 35.5112 4.8904C35.3453 4.61874 35.1125 4.39421 34.835 4.23831C34.5575 4.0824 34.2447 4.00035 33.9264 4H30.0736C29.7572 4.00016 29.446 4.08034 29.1689 4.23308C28.8918 4.38582 28.6578 4.60616 28.4888 4.8736C28.2032 5.3216 26.092 8.8552 25.448 10.2552L21.248 11.9912C19.8592 11.476 15.9672 10.4848 15.2896 10.3112C14.9812 10.2417 14.6602 10.2514 14.3567 10.3395C14.0531 10.4277 13.7768 10.5913 13.5536 10.8152L10.832 13.5536C10.6072 13.7762 10.443 14.0524 10.3548 14.3562C10.2666 14.66 10.2574 14.9813 10.328 15.2896C10.4456 15.8048 11.448 19.7696 12.008 21.248L10.272 25.448C8.928 26.0584 5.484 28.1136 4.8904 28.4888C4.61874 28.6546 4.39421 28.8875 4.23831 29.1649C4.0824 29.4424 4.00035 29.7553 4 30.0736V33.9208C4.00016 34.2372 4.08034 34.5484 4.23308 34.8255C4.38582 35.1026 4.60616 35.3365 4.8736 35.5056C5.3216 35.7912 8.8552 37.9024 10.2552 38.5464L11.9912 42.7464C11.476 44.1352 10.4848 48.0272 10.3112 48.7048C10.2417 49.0131 10.2514 49.3341 10.3395 49.6377C10.4277 49.9413 10.5913 50.2176 10.8152 50.4408L13.5368 53.1624C13.7594 53.3871 14.0356 53.5514 14.3394 53.6396C14.6432 53.7277 14.9644 53.737 15.2728 53.6664C15.788 53.5488 19.7528 52.5464 21.2312 51.9864L25.4312 53.7224C26.0416 55.0664 28.0968 58.5104 28.472 59.104C28.6386 59.3791 28.8738 59.6063 29.1545 59.7633C29.4352 59.9204 29.7519 60.0019 30.0736 60H33.9208C34.2372 59.9998 34.5484 59.9196 34.8255 59.7669C35.1026 59.6141 35.3365 59.3938 35.5056 59.1264C35.7912 58.6784 37.9024 55.1448 38.5464 53.7448L42.7464 52.0088C44.1352 52.524 48.0272 53.5152 48.7048 53.6888C49.0131 53.7583 49.3341 53.7486 49.6377 53.6604C49.9413 53.5723 50.2176 53.4086 50.4408 53.1848L53.1624 50.4632C53.3871 50.2406 53.5513 49.9643 53.6395 49.6605C53.7277 49.3568 53.737 49.0355 53.6664 48.7272C53.5488 48.212 52.5464 44.2472 51.9864 42.7688L53.7224 38.5688C55.0664 37.9584 58.5103 35.9032 59.1039 35.528C59.3791 35.3613 59.6063 35.1262 59.7633 34.8454C59.9204 34.5647 60.0019 34.248 59.9999 33.9264V30.0736C60.0024 29.7567 59.9234 29.4445 59.7704 29.1669C59.6174 28.8894 59.3956 28.6559 59.1264 28.4888ZM32 44.1912C29.5866 44.189 27.228 43.4711 25.2226 42.1285C23.2171 40.7858 21.6549 38.8786 20.7334 36.6481C19.8118 34.4175 19.5724 31.9638 20.0454 29.5972C20.5184 27.2306 21.6826 25.0574 23.3907 23.3525C25.0988 21.6475 27.2741 20.4873 29.6416 20.0187C32.0091 19.55 34.4623 19.7939 36.6912 20.7195C38.92 21.6452 40.8243 23.2109 42.1633 25.2188C43.5023 27.2267 44.2158 29.5866 44.2136 32C44.2061 35.2349 42.9163 38.3349 40.6267 40.6202C38.3372 42.9055 35.2349 44.1897 32 44.1912Z" fill="white"></path>*/}
					{/*            </svg>*/}
					{/*        </div>*/}
					{/*    </div>*/}
					{/*    <p>Настройки</p>*/}
					{/*</div>*/}
				</div>
			</>
		);
	}
	get vehiclesPage() {
		return (
			<>
				<div className="tablet-blur" />
				<div className="tablet-home">
					<div className="grid-in-tablet">
						<div className="tablet-info tablet-info-jsb tablet-info-transport">
							<div className="topline">
								<button
									className="return-btn"
									onClick={(e) => {
										this.setState({ currentPage: "main" });
									}}
								>
									<span className="icon">
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M9.41424 12L16.7071 19.2929L15.2929 20.7071L6.58582 12L15.2929 3.29291L16.7071 4.70712L9.41424 12Z"
												fill="white"
											/>
										</svg>
									</span>
									<p>
										{LangString(
											"components.Tablet.index.4b9d5607a63135aed8ed18f817ee89e1",
										)}
									</p>
								</button>

								<div className="title-wrap">
									<div className="title">
										<div className="icon">
											<svg
												width="64"
												height="64"
												viewBox="0 0 64 64"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M61.9753 25.0965L61.527 23.3788C61.3989 22.9334 60.7584 22.5517 60.246 22.5517L51.9836 23.1243C50.7666 22.0427 48.717 20.2614 46.2831 18.4164C42.5042 15.5534 32.5125 15.9988 31.936 16.0624C31.3596 16.0624 21.3678 15.5534 17.5889 18.4164C15.155 20.2614 13.1054 22.0427 11.8885 23.1243L3.75417 22.5517C3.24177 22.5517 2.60127 22.8698 2.47318 23.3788L2.02483 25.0965C1.89673 25.6055 2.28103 26.1145 2.79342 26.1145H5.73971C5.29136 26.6234 4.97111 27.3233 4.84301 28.1503L4.65086 29.6136C4.26657 32.3493 4.20252 35.1486 4.39467 37.8843C4.52276 39.7929 4.77896 41.7652 5.29136 43.1648V45.646C5.29136 46.9184 6.31615 48 7.6612 48H14.6426C15.7315 48 16.6281 47.3002 16.8843 46.2822L31.4877 46.9821H31.8079C31.872 46.9821 31.936 46.9821 32.0001 46.9821C32.0641 46.9821 32.1282 46.9821 32.1922 46.9821H32.5125L47.1158 46.2822C47.372 47.3002 48.3327 48 49.3575 48H56.3389C57.6199 48 58.7088 46.9821 58.7088 45.646V43.1648C59.2212 41.7652 59.4774 39.7929 59.6055 37.8843C59.7976 35.1486 59.6695 32.3493 59.3493 29.6136L59.1571 28.2139C59.029 27.3869 58.7088 26.6871 58.2604 26.1781H61.1427C61.7191 26.1145 62.1034 25.6055 61.9753 25.0965ZM15.2191 33.3036L11.312 35.4667C10.6075 35.8484 9.77484 35.5303 9.45459 34.8305L7.0207 29.2955C6.7645 28.7865 7.34095 28.2139 7.85335 28.4684L15.155 31.8403C15.7955 32.1584 15.7955 32.9855 15.2191 33.3036ZM24.7625 17.3984H26.0435C25.0827 17.9074 22.841 23.4424 22.841 23.4424H19.5104C20.7914 20.1341 24.7625 17.3984 24.7625 17.3984ZM31.8079 41.4471C31.8079 41.4471 18.0372 32.8583 17.717 32.8583L31.8079 37.1845V41.4471ZM32.2563 41.4471V37.1209L46.3472 32.7946C46.0269 32.8583 32.2563 41.4471 32.2563 41.4471ZM56.9794 29.2955L54.4815 34.8305C54.1612 35.5303 53.3286 35.8484 52.6241 35.4667L48.7811 33.3036C48.2046 32.9855 48.2046 32.0948 48.8451 31.8403L56.1468 28.4684C56.6592 28.2776 57.2356 28.7865 56.9794 29.2955Z"
													fill="white"
												></path>
											</svg>
										</div>
										<p className="tablet-title-main">
											{LangString(
												"components.Tablet.index.86811cb3bcf76cae39030e537a21174b",
											)}
										</p>
									</div>
								</div>
							</div>

							<ul className="extra-info-tablet-wrap">
								<li className="extra-info-tablet-item">
									<p className="big">{this.state.vehicles.length}</p>
									<p className="descr">
										{LangString(
											"components.Tablet.index.06befe174cb67b62f8bc21ce1fc46c95",
										)}
									</p>
								</li>
								{/* <li className="extra-info-tablet-item">
                            <p className="big">1 999 992</p>
                            <p className="descr">Проехали километров</p>
                        </li> */}
							</ul>
						</div>

						<div className="garage-wrapper">
							<div className="garage-wrap">
								{this.state.vehicles.map((vehicle) => {
									if (!vehicle) return <></>;
									return (
										<div className="garage-item">
											<div className="img-wrap">
												<img src={CEF.getVehicleURL(vehicle.model)} alt="car" />
											</div>
											<div className="info-wrap">
												<div className="topline">
													<p className="name">{vehicle.name}</p>
													{/* <p className="descr">Автомобиль премиум класса</p> */}
												</div>
												<div className="downline">
													<div className="bage-gps bage-white">
														<p>
															{vehicle.number ||
																LangString(
																	"components.Tablet.index.27bf42074df37a5d9fcf28aa2763e09d",
																)}
														</p>
													</div>
													<div className="rightside">
														{vehicle.x || vehicle.y ? (
															<div
																className="bage-gps"
																onClick={(e) => {
																	e.preventDefault();
																	CEF.setGPS(vehicle.x, vehicle.y);
																}}
															>
																<p>
																	{LangString(
																		"components.Tablet.index.d70c21f6e8a858f077270ee17bbe8b14",
																	)}
																</p>
															</div>
														) : (
															<div
																className="bage-gps"
																onClick={(e) => {
																	e.preventDefault();
																	let p: {
																		x: number;
																		y: number;
																		z: number;
																		h: number;
																	} = null;
																	FINE_CAR_POS.map((s) => {
																		if (!p) s = p;
																		else {
																			if (
																				systemUtil.distanceToPos(
																					this.state.pos,
																					s,
																				) <
																				systemUtil.distanceToPos(
																					this.state.pos,
																					p,
																				)
																			)
																				s = p;
																		}
																	});
																	CEF.setGPS(p.x, p.y);
																}}
															>
																<p>
																	{LangString(
																		"components.Tablet.index.cc29aa5cc42acd6eeab7081f0d09008a",
																	)}
																</p>
															</div>
														)}

														<button
															onClick={(e) => {
																e.preventDefault();
																CustomEvent.triggerServer(
																	"vehicle:requestrespawn",
																	vehicle.id,
																);
															}}
														>
															<span className="icon-wrap">
																<svg
																	width="18"
																	height="18"
																	viewBox="0 0 18 18"
																	fill="none"
																	xmlns="http://www.w3.org/2000/svg"
																>
																	<g id="24 / arrows / circle-arrow-right-curved">
																		<path
																			id="icon"
																			fillRule="evenodd"
																			clipRule="evenodd"
																			d="M11.2499 10.9393L12.9696 9.21967L14.0303 10.2803L10.4999 13.8107L6.96961 10.2803L8.03027 9.21967L9.74994 10.9393L9.74994 7.5C9.74994 6.67157 9.07837 6 8.24994 6C7.42152 6 6.74994 6.67157 6.74994 7.5L5.24994 7.5C5.24994 5.84315 6.59309 4.5 8.24994 4.5C9.9068 4.5 11.2499 5.84315 11.2499 7.5L11.2499 10.9393Z"
																			fill="white"
																		></path>
																	</g>
																</svg>
															</span>
														</button>
													</div>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
	get housePage() {
		if (!this.state.houseData) return <></>;
		return (
			<>
				<div className="tablet-blur" />
				<div className="tablet-home">
					<div className="grid-in-tablet">
						<div className="tablet-info tablet-info-jsb tablet-info-home">
							<div className="topline">
								<button
									className="return-btn"
									onClick={(e) => {
										this.setState({ currentPage: "main" });
									}}
								>
									<span className="icon">
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M9.41424 12L16.7071 19.2929L15.2929 20.7071L6.58582 12L15.2929 3.29291L16.7071 4.70712L9.41424 12Z"
												fill="white"
											/>
										</svg>
									</span>
									<p>
										{LangString(
											"components.Tablet.index.586f9929fb7099fe016a6704bf7c4990",
										)}
									</p>
								</button>

								<div className="title-wrap">
									<div className="title">
										<div className="icon">
											<svg
												width="64"
												height="64"
												viewBox="0 0 64 64"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M52.6135 35.9867V58C38.8712 58 25.1288 58 11.2147 58V35.9867L8.46626 38.9333L4 34.4267C13.2761 24.8933 22.5521 15.36 32 6L44.5399 18.6533V11.72H50.8957V25.0667L59.6564 33.9067L60 34.4267L55.5337 38.9333L52.6135 35.9867Z"
													fill="white"
												/>
											</svg>
										</div>
										<p>
											{LangString(
												"components.Tablet.index.d68fa5c3946520aad9995e924ac2f42b",
											)}
										</p>
									</div>
									<p className="op40">№{this.state.houseData.id}</p>
								</div>
							</div>

							<ul className="extra-info-home">
								<div
									className="bage-gps"
									onClick={(e) => {
										e.preventDefault();
										CEF.setGPS(
											this.state.houseData.pos.x,
											this.state.houseData.pos.y,
										);
									}}
								>
									<p>
										{LangString(
											"components.Tablet.index.693211ee98e3dd18d61f4b59e7a442a0",
										)}
									</p>
								</div>

								<li>
									<div className="title">
										<div className="icon">
											<svg
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<g opacity="0.4">
													<path
														fillRule="evenodd"
														clipRule="evenodd"
														d="M12 23.3276L12.6577 22.7533C18.1887 17.9237 21 13.7068 21 10C21 4.75066 16.9029 1 12 1C7.09705 1 3 4.75066 3 10C3 13.7068 5.81131 17.9237 11.3423 22.7533L12 23.3276ZM12 20.6634C7.30661 16.4335 5 12.8492 5 10C5 5.8966 8.16411 3 12 3C15.8359 3 19 5.8966 19 10C19 12.8492 16.6934 16.4335 12 20.6634ZM12 5C14.7614 5 17 7.23858 17 10C17 12.7614 14.7614 15 12 15C9.23858 15 7 12.7614 7 10C7 7.23858 9.23858 5 12 5ZM9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10Z"
														fill="white"
													/>
												</g>
											</svg>
										</div>
										<p>
											{LangString(
												"components.Tablet.index.fd2cd3be1bc6b346e6d437086c34cf16",
											)}
										</p>
									</div>
									<p>{this.state.houseData.name}</p>
								</li>
								<li>
									<div className="title">
										<div className="icon">
											<svg
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<g opacity="0.4">
													<path
														fillRule="evenodd"
														clipRule="evenodd"
														d="M12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23ZM19.3995 17.1246C20.4086 15.6703 21 13.9042 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.9042 3.59138 15.6703 4.6005 17.1246C5.72595 15.6381 8.3706 15 12 15C15.6294 15 18.274 15.6381 19.3995 17.1246ZM17.9647 18.7398C17.672 17.6874 15.5694 17 12 17C8.43062 17 6.328 17.6874 6.03532 18.7398C7.6233 20.1462 9.71194 21 12 21C14.2881 21 16.3767 20.1462 17.9647 18.7398ZM12 15C9.76086 15 8 13.4274 8 10C8 7.75576 9.5791 6 12 6C14.4142 6 16 7.92158 16 10.2C16 13.4796 14.2181 15 12 15ZM10 10C10 12.2693 10.8182 13 12 13C13.1777 13 14 12.2984 14 10.2C14 8.95042 13.2157 8 12 8C10.7337 8 10 8.81582 10 10Z"
														fill="white"
													/>
												</g>
											</svg>
										</div>
										<p>
											{LangString(
												"components.Tablet.index.eab4e357dd982efc16e5b3f4409c77e2",
											)}
										</p>
									</div>
									<p>{this.state.houseData.owner}</p>
								</li>
								<li>
									<div className="title">
										<div className="icon">
											<svg
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<g opacity="0.4">
													<path
														fillRule="evenodd"
														clipRule="evenodd"
														d="M15.4506 1.40268C16.5126 1.09923 17.6196 1.71421 17.923 2.77628C17.9741 2.95497 18 3.13989 18 3.32573V5H20C21.1046 5 22 5.89543 22 7V19C22 20.1046 21.1046 21 20 21H4C2.89543 21 2 20.1046 2 19H2.0267C2.00895 18.8925 2 18.7835 2 18.6743V6.7543C2 5.86134 2.59195 5.07656 3.45056 4.83125L15.4506 1.40268ZM10.1401 19H20V11H18V15.2457C18 16.1387 17.408 16.9234 16.5494 17.1687L10.1401 19ZM20 7V9H18V7H20ZM4 6.75427V18.6742L16 15.2457V3.3257L4 6.75427ZM14 9C14 9.55228 13.5523 10 13 10C12.4477 10 12 9.55228 12 9C12 8.44771 12.4477 8 13 8C13.5523 8 14 8.44771 14 9Z"
														fill="white"
													/>
												</g>
											</svg>
										</div>
										<p>
											{LangString(
												"components.Tablet.index.9243a01adc072bf7106837b40abee1d0",
											)}
										</p>
									</div>
									<p>${systemUtil.numberFormat(this.state.houseData.price)}</p>
								</li>
								<li>
									<div className="title">
										<div className="icon">
											<svg
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<g opacity="0.4">
													<path
														fillRule="evenodd"
														clipRule="evenodd"
														d="M5 3V5H3V7H1V5C1 3.89543 1.81403 3 2.81818 3H5ZM5.81818 6H18.1818C19.186 6 20 6.89543 20 8V16C20 17.1046 19.186 18 18.1818 18H5.81818C4.81403 18 4 17.1046 4 16V8C4 6.89543 4.81403 6 5.81818 6ZM6 12V16H18V12H6ZM6 10H18V8H6V10ZM19 19V21H21.1818C22.186 21 23 20.1046 23 19V17H21V19H19ZM19 3H21.1818C22.186 3 23 3.89543 23 5V7H21V5H19V3ZM2.81818 21H5V19H3V17H1V19C1 20.1046 1.81403 21 2.81818 21Z"
														fill="white"
													/>
												</g>
											</svg>
										</div>
										<p>
											{LangString(
												"components.Tablet.index.06a2207851b5e45d26cb7ae097413685",
											)}
										</p>
									</div>
									<p>${systemUtil.numberFormat(this.state.houseData.tax)}</p>
								</li>
							</ul>
						</div>

						<div className="garage-wrapper">
							<div className="garage-wrap">
								{this.state.houseData.carInt ? (
									<></>
								) : (
									<>
										<div className="garage-item empty">
											<div className="img-wrap">
												<p>
													{LangString(
														"components.Tablet.index.e739f693f3cbe4bda0b36dee7a666bb8",
													)}
												</p>
											</div>
											<div className="info-wrap">
												<div className="topline">
													<div></div>
													<div></div>
												</div>
												<div className="downline">
													<div className="bage-gps bage-white">
														<p></p>
													</div>
													<div className="cost"></div>
												</div>
											</div>
										</div>
									</>
								)}
								{this.state.houseData.cars.map((car, id) => {
									return (
										<div className="garage-item" key={id}>
											<div className="img-wrap">
												<img src={CEF.getVehicleURL(car.model)} alt="car" />
											</div>
											<div className="info-wrap">
												<div className="topline">
													<p className="name">{car.name}</p>
												</div>
												<div className="downline">
													<div className="bage-gps bage-white">
														<p>
															{car.number ||
																LangString(
																	"components.Tablet.index.0cfcb54d174a7d2dea62de7b065ba49c",
																)}
														</p>
													</div>
													{/* <p className="cost">{systemUtil.numberFormat(car.price)}$</p> */}
												</div>
											</div>
										</div>
									);
								})}

								{this.drawEmptyGarageSlots}
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
	get drawEmptyGarageSlots() {
		if (!this.state.houseData.carInt) return <></>;
		const interrior = getInteriorGarageById(this.state.houseData.carInt);
		if (!interrior) return <></>;
		let count = interrior.cars.length - this.state.houseData.cars.length;
		if (count > 0) {
			let q: JSX.Element[] = [];
			for (let id = 0; id < count; id++) {
				q.push(
					<div className="garage-item empty" key={id}>
						<div className="img-wrap">
							<p>
								{LangString(
									"components.Tablet.index.ad4c000cee7adc5160f23283cb884927",
								)}
							</p>
						</div>
						<div className="info-wrap">
							<div className="topline">
								<div></div>
								<div></div>
							</div>
							<div className="downline">
								<div className="bage-gps bage-white">
									<p></p>
								</div>
								<div className="cost"></div>
							</div>
						</div>
					</div>,
				);
			}
			return q;
		} else {
			return <></>;
		}
	}
}
