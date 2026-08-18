import { LangString } from "../../../modules/lang";
import React, { Component } from "react";
import "./style.scss";
import { DeathType } from "./enums/DeathType.enum";
import { PopupType } from "./enums/PopupType.enum";
import { CustomEvent } from "../../../modules/custom.event";
import { system } from "../../../modules/system";
import deathScreenBG from "../img/deathScreenBG.png";


export class DeathPopUp extends Component<
	{},
	{
		type: DeathType;
		name?: string;
		id?: number;
		popupType: PopupType;
		totalTime: number;
		respawnButtonTime: number;
	}
> {
	constructor(props: any) {
		super(props);
		this.state = {
			type: DeathType.NoNameMurder,
			name: "",
			id: 0,
			popupType: PopupType.Empty,
			totalTime: 1200,
			respawnButtonTime: 600,
		};

		CustomEvent.register(
			"deathpopup:setKillerName",
			(killerId: number, killerName: string) => {
				this.setState({
					type: DeathType.Murder,
					name: killerName,
					id: killerId,
				});
			},
		);

		CustomEvent.register("deathpopup:setKillerId", (killerId: number) => {
			this.setState({
				type: DeathType.NoNameMurder,
				name: "",
				id: killerId,
			});
		});

		CustomEvent.register("deathpopup:setSuicide", () => {
			this.setState({
				type: DeathType.Suicide,
				name: "",
				id: 0,
			});
		});

		CustomEvent.register("deathpopup:setType", (withMedics: boolean) => {
			this.setState({
				popupType: withMedics ? PopupType.ComingMedic : PopupType.Empty,
			});
		});

		// CustomEvent.register("deathpopup:setTotalTime", (time: number) => {
		// 	this.setState({
		// 		totalTime: time,
		// 	});
		// });

		CustomEvent.register("deathpopup:setTime", (time: number, total: number) => {
			this.setState({
				respawnButtonTime: time,
				totalTime: total,
			});
		});
	}

	sendDeathAccept(value: boolean) {
		CustomEvent.triggerClient("deathDialog:accept:status", true);
	}

	respawnInHospital() {
		CustomEvent.triggerClient("deathpopup:accept");
	}

	formatTime(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const sec = seconds % 60;
		return `${String(minutes).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
	}

	getDeathMessage(): string {
		const { type, name, id } = this.state;

		switch (type) {
			case DeathType.Murder:
				return `${name} (ID: ${id}) te-a omorat.`;
			case DeathType.NoNameMurder:
				// return `Un jucator necunoscut (ID: ${id}) te-a omorat.`;
				return `Esti in coma`;

			case DeathType.Suicide:
				return "Te-ai sinucis.";
			default:
				return "Ai murit.";
		}
	}


	render() {
		const showRespawnButton = this.state.respawnButtonTime <= 0;

		return (
			<div className="death-container-box">
				<div className="deathscreen">
					<img className="payday-img1" src={deathScreenBG} alt="" />
					<div className="content">
						<h1>Ai murit!</h1>
						<h2>{this.getDeathMessage()}</h2>
						
						<div className="timer-section">
							<h3>Respawn automat:</h3>
							<h4 className="total-timer">{this.formatTime(this.state.totalTime)}</h4>
						</div>

						{!showRespawnButton ? (
							<div className="timer-section">
								<h3>Te poti respawna in:</h3>
								<h4 className="respawn-timer">{this.formatTime(this.state.respawnButtonTime)}</h4>
							</div>
						) : (
							<div className="respawn-section">
								<h5>Vrei sa te respawnezi in spital?</h5>
								<div className="controls">
									<button
										type="button"
										className="respawn-btn"
										onClick={() => this.respawnInHospital()}
									>
										Respawn in spital
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}
