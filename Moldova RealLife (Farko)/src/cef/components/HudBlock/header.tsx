import "./header.scss";
import React, { Component } from "react";

import { HudQuestClass } from "./quest";
import { CEF } from "../../modules/CEF";
import { CustomEvent } from "../../modules/custom.event";
const iconsItems = Object.fromEntries(
	Object.entries(
		import.meta.glob("../../../shared/icons/*.png", { eager: true }),
	).map(([key, value]) => {
		const name = key.match(/\/([^/]+)\.png$/)[1];
		//@ts-ignore
		return [name, value.default];
	}),
);

import type { StorageAlertData } from "../../../shared/alertsSettings";
import calendarIcon from "./img/calendar.svg";
import usersIcon from "./img/users.svg";
import logoIcon from "./img/logo-1.png";
import bulletsIcon from "./img/bullets.svg";
import cashIcon from "./img/cash.svg";
import bankIcon from "./img/bank.svg";

export class HudHeaderClass extends Component<
	{
		alertsData: StorageAlertData;
	},
	{
		sumChange?: number;
		date?: string;
		online?: number;
		isAdmin?: boolean;
		realHour?: number;
		realMinutes?: number;
		weapon?: {
			magazines: number[];
			weapon: number;
			ammo: number;
			maxMagazine: number;
		};
		money: number;
		bank: number;
		chips: number;
		hasBankCard: boolean;
		serverMenu: { title: string; key: string }[];
	}
> {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	constructor(props: any) {
		super(props);

		this.state = {
			money: 0,
			bank: 0,
			chips: 0,
			hasBankCard: true,
			serverMenu: [
				{
					title: "Inventory",
					key: "TAB",
				},
				{
					title: "Cursor",
					key: "`",
				},

				{
					title: "Phone",
					key: "▲",
				},
				{
					title: "Tablet",
					key: "▼",
				},
				{
					title: "Interaction",
					key: "G",
				},

				{
					title: "Menu",
					key: "M",
				},
				{
					title: "Micro",
					key: "N",
				},
			],
		};

		CustomEvent.register(
			"hud:data",
			(
				date: string,
				time1: string,
				time2: string,
				online: number,
				isAdmin: boolean,
				id: number,
				realHour: number,
				realMinutes: number,
			) => {
				this.setState({ date, online, isAdmin, realHour, realMinutes });
				CEF.setId(id);
				CEF.setAdmin(isAdmin);
			},
		);

		CustomEvent.register(
			"hud:weapon",
			(weapon: {
				magazines: number[];
				weapon: number;
				ammo: number;
				maxMagazine: number;
			}) => {
				this.setState({ weapon });
			},
		);

		CustomEvent.register("hud:ammo", (ammo: number) => {
			if (!this.state.weapon) return;
			this.setState({ weapon: { ...this.state.weapon, ammo } });
		});

		CustomEvent.register("cef:hud:setMoney", (money: number) => {
			this.drawChangeMoney(this.state.money, money);
			CEF.user.money = money;
			this.setState({ money: money });
		});

		CustomEvent.register("cef:hud:setChips", (money: number) => {
			CEF.user.chips = money;
			this.setState({ chips: money });
		});

		CustomEvent.register("cef:hud:setMoneyBank", (money) => {
			this.drawChangeMoney(this.state.bank, money);
			CEF.user.bank = money;
			this.setState({ bank: money });
		});

		CustomEvent.register("cef:hud:hasBankCard", (status) => {
			this.setState({ hasBankCard: status });
		});
	}

	get totalMagazineAmmo() {
		if (!this.state.weapon) return 0;
		let sum = 0;
		// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
		this.state.weapon.magazines.map((q) => (sum += q));
		return sum;
	}

	drawChangeMoney(old: number, sum: number) {
		this.setState({ sumChange: sum - old }, () => {
			setTimeout(() => {
				if (this.state.sumChange !== sum - old) return;
				this.setState({ sumChange: null });
			}, 3000);
		});
	}

	render() {
		return (
			<div className="hud-header-container-box">
				<div className="section">
					<div className="section-left">
						<h3 className="server-name">Moldova  Real Life</h3>
						<div className="section-details">
							<div className="date-time details">
								<img src={calendarIcon} alt="" className="ico" />
								<h4 className="time">
									{this.state.realHour < 10 ? "0" : ""}
									{this.state.realHour}:{this.state.realMinutes < 10 ? "0" : ""}
									{this.state.realMinutes}
								</h4>
								<h5 className="date">{this.state.date}</h5>
							</div>
							<div className="section-id details">
								<h1>ID</h1>
								<h4 className="player-id">{CEF.id}</h4>
							</div>
							<div className="section-players details">
								<img src={usersIcon} alt="" className="ico" />
								<h4 className="number-players">{this.state.online}</h4>
							</div>
						</div>
					</div>
					<img className="section-logo" src={logoIcon} alt="" />
				</div>
				<div className="section-cashmoney">
					<h1 className="money">$ {this.state.money.toLocaleString()}</h1>
					<span>
						<img src={cashIcon} alt="" />
					</span>
				</div>
				<div className="section-bankmoney">
					<h1 className="money">$ {this.state.bank.toLocaleString()}</h1>
					<span>
						<img src={bankIcon} alt="" />
					</span>
				</div>
				<HudQuestClass alertsData={this.props.alertsData} />

				{this.state.weapon ? (
					<div className="section-weapon">
						<img
							className="weapon-img"
							src={iconsItems[`Item_${this.state.weapon.weapon}`]}
							alt=""
						/>
						<div className="weapon-bullets">
							<img src={bulletsIcon} alt="" />
							<h4>
								<span>{this.state.weapon.ammo}</span> / {this.totalMagazineAmmo}
							</h4>
						</div>
					</div>
				) : null}

				<div className="section-server">
					{this.state.serverMenu.map((item) => (
						<div key={item.key} className="command">
							<h4>{item.title}</h4>
							<span>{item.key}</span>
						</div>
					))}
				</div>
				{/* <JailMission /> */}
			</div>
		);
	}
}
