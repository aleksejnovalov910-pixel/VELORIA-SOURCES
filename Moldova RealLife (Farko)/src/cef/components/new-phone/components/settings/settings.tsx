import { LangString } from "../../../../modules/lang";
import React, { Component } from "react";
import "./settings.less";
const png = Object.fromEntries(
	Object.entries(import.meta.glob("../../assets/*.png", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.png$/)[1];
			return [name, value.default];
		},
	),
);
import { SettingsPages } from "./enums/settingsPage.enum";
import { Wallpapers } from "./components/wallpapers/wallpapers";
import { Ringtones } from "./components/ringtones/ringtones";
import { CEF } from "../../../../modules/CEF";
import { PhoneSettings } from "../../../../../shared/phone";
import { CustomEvent } from "../../../../modules/custom.event";

export class SettingsPage extends Component<
	{
		onBgChange: any;
		bg: string;
		phoneNumber: number;
		settings: PhoneSettings;
		setParentState: any;
		phoneClose: any;
		phoneId: number;
	},
	{
		user: { name: string; number: number };
		isMuted: boolean;
		isDoNotDistrub: boolean;
		page: SettingsPages;
	}
> {
	constructor(props: any) {
		super(props);
		this.state = {
			user: {
				name: CEF.user.name,
				number: this.props.phoneNumber,
			},
			isMuted: !this.props.settings.sound,
			isDoNotDistrub: this.props.settings.aviamode,
			page: SettingsPages.SETTINGS,
		};
		this.format = this.format.bind(this);
		this.setSettings = this.setSettings.bind(this);
		this.takeSim = this.takeSim.bind(this);
		this.onBack = this.onBack.bind(this);
	}
	format(s: string | number, blockWidth: number = 4) {
		let v = s.toString().replace(/[^\d0-9]/g, ""),
			reg = new RegExp(`.{${blockWidth}}`, "g");
		if (blockWidth === 3) {
			return `${v.substr(0, v.length % blockWidth)} ${v
				.substr(v.length % blockWidth, v.length)
				.replace(reg, function (a) {
					return `${a} `;
				})}`;
		} else {
			return v.replace(reg, function (a) {
				return `${a} `;
			});
		}
	}

	setSettings(params: Partial<PhoneSettings>) {
		const settings: any = { ...this.props.settings };
		for (let param in params) {
			settings[param] = (params as any)[param];
		}
		CustomEvent.triggerServer(
			"phone:setSettings",
			this.props.phoneId,
			settings,
		);
		this.props.setParentState(settings);
	}

	takeSim() {
		CustomEvent.triggerServer("phone:close", true);
		this.props.phoneClose();
	}

	onBack() {
		this.setState({ ...this.state, page: SettingsPages.SETTINGS });
	}

	render() {
		return (
			<div className="np-settings">
				{this.state.page === SettingsPages.SETTINGS ? (
					<>
						<div className="np-settings-title">
							{LangString(
								"components.new-phone.components.settings.settings.187d7616bc515392b21a92e11f674825",
							)}
						</div>
						<div className="np-settings-user-info-wrap">
							<div className="np-settings-user-icon">
								<img src={png["user-without-photo"]} alt="" />
							</div>
							<div className="np-settings-user-info">
								<div className="np-settings-user-name">
									{this.state.user.name}
								</div>
								<div className="np-settings-user-number">
									{this.format(this.state.user.number)}
								</div>
							</div>
						</div>
						<div className="np-settings-list">
							<div className="np-settings-item">
								<div className="np-settings-item-icon">
									<img src={png["do-not-distrub"]} alt="" />
								</div>
								<div className="np-settings-customization-wrap">
									<div className="np-settings-name">
										{LangString(
											"components.new-phone.components.settings.settings.16d0bc9aaf14d36080c54a20d1428f75",
										)}
									</div>
									<div
										className={
											this.state.isDoNotDistrub === true
												? "np-settings-slider active"
												: "np-settings-slider"
										}
										onClick={() => {
											this.setState({
												...this.state,
												isDoNotDistrub: !this.state.isDoNotDistrub,
											});
											this.setSettings({
												aviamode: !this.state.isDoNotDistrub,
											});
										}}
									></div>
								</div>
							</div>
							<div className="np-settings-item">
								<div className="np-settings-item-icon">
									<img src={png["sound"]} alt="" />
								</div>
								<div className="np-settings-customization-wrap">
									<div className="np-settings-name">
										{LangString(
											"components.new-phone.components.settings.settings.33abb43ed9f066520c086b77a060d509",
										)}
									</div>
									<div
										className={
											this.state.isMuted === true
												? "np-settings-slider active"
												: "np-settings-slider"
										}
										onClick={() => {
											this.setState({
												...this.state,
												isMuted: !this.state.isMuted,
											});
											this.setSettings({ sound: this.state.isMuted });
										}}
									></div>
								</div>
							</div>
							<div className="np-settings-item">
								<div className="np-settings-item-icon">
									<img src={png["wallpaper"]} alt="" />
								</div>
								<div
									className="np-settings-customization-wrap"
									onClick={() =>
										this.setState({
											...this.state,
											page: SettingsPages.WALLPAPERS,
										})
									}
								>
									<div className="np-settings-name">
										{LangString(
											"components.new-phone.components.settings.settings.730ea8bbad155ccb51139bdc5a33fdca",
										)}
									</div>
									<div className="np-settings-icon">
										<svg
											width="20"
											height="20"
											viewBox="0 0 20 20"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M7.1875 4.375L12.8125 10L7.1875 15.625"
												stroke="#0A3668"
												strokeOpacity="0.2"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</div>
								</div>
							</div>
						</div>
						<button onClick={this.takeSim} className="np-settings-btn">
							{LangString(
								"components.new-phone.components.settings.settings.130dcb312f07e2c75bdf13b5c884651f",
							)}
						</button>
					</>
				) : this.state.page === SettingsPages.WALLPAPERS ? (
					<Wallpapers
						setSettings={this.setSettings}
						onBack={this.onBack}
						onBgChange={this.props.onBgChange}
						bg={this.props.bg}
					></Wallpapers>
				) : this.state.page === SettingsPages.RINGTONES ? (
					<Ringtones onBack={this.onBack}></Ringtones>
				) : null}
			</div>
		);
	}
}
