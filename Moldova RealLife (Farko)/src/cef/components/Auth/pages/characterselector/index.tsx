import React, { useState } from "react";
import { CustomEvent } from "../../../../modules/custom.event";
import ghostIcon from "../../img/ghost.svg";
import charIcon from "../../img/char.png";
import moneyIcon from "../../img/money.svg";
import { FACTION_ID } from "../../../../../shared/fractions";

type Props = {
	characters: {
		id: number;
		name: string;
		level: number;
		faction: number;
		cash: string;
		rank: number;
		bank: string;
		gender: string;
		pay: boolean;
		playTime: number;
		bought: boolean;
	}[];
	toggleVisibility: (tabId: number) => void;
};

export function CharacterSelector({ characters, toggleVisibility }: Props) {
	const [disableButton, setdisableButton] = useState(false);

	async function selectCharacter(id: number) {
		setdisableButton(true);
		await CustomEvent.callServer("cef:user:select", id).then((res) => {
			if (!res) {
				setdisableButton(false);
			} else {
				toggleVisibility(5);
			}
		});
	}

	function createCharacter() {
		toggleVisibility(6);
	}
	function formatPlayTime(minutes: number): string {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}H ${mins}MIN`;
	}

	function getFactionNameById(factionId: number): string {
		return FACTION_ID[factionId] || "Unknown";
	}

	console.log(characters);
	return (
		<div className="character-creation">
			<div className="header">
				<div className="title">
					<h1>
						Selectie <span>caracterul</span>
					</h1>
				</div>
				<p>Alege caracterul cu care doresti sa începi.</p>
			</div>
			<div className="characters">
				{characters.map((character) => (
					<div className="character" key={character.id}>
						<img
							className="character-picture"
							src={charIcon}
							alt={character.name}
							style={!character.bought ? { opacity: 0.1 } : null}
						/>

						{character.bought ? (
							<>
								<div className="charracter-top">
									<h1 className="character-name">{character.name}</h1>
									<div className="character-level">
										<div className="circle" />
										<div className="level-number">{character.level}</div>
									</div>
								</div>

								<div className="character-details">
									<div className="character-skill">
										<div className="skill-name">Factiune</div>
										<div className="skill-value">
											{getFactionNameById(character.faction)}
										</div>
									</div>
									<div className="character-skill">
										<div className="skill-name">Gen</div>
										<div className="skill-value">{character.gender}</div>
									</div>
									<div className="character-skill">
										<div className="skill-name">Cash</div>
										<div className="skill-value">{character.cash}</div>
									</div>
									<div className="character-skill">
										<div className="skill-name">Bank</div>
										<div className="skill-value">{character.bank}</div>
									</div>
									<div className="character-skill">
										<div className="skill-name">Ore jucate</div>
										<div className="skill-value">
											{formatPlayTime(character.playTime)}
										</div>
									</div>
								</div>
							</>
						) : !character.bought && !character.pay ? (
							<div className="not-bought">
								<img className="ghost" src={ghostIcon} alt="Unpaid slot" />
								<p>
									Acest slot nu este platit. Va rugam sa efectuati o plata
									pentru a-l debloca.
								</p>
							</div>
						) : !character.bought && character.pay ? (
							<div className="not-bought">
								<img className="ghost" src={moneyIcon} alt="Free slot" />
								<p>
									Slot platit. Puteti crea un alt caracter folosind moneda de
									donatie.
								</p>
							</div>
						) : (
							<div className="not-bought">
								<img className="ghost" src={ghostIcon} alt="Unknown state" />
								<p>
									Stare necunoscuta. Va rugam sa verificati datele caracterului
									dumneavoastra.
								</p>
							</div>
						)}

						<div
							className="character-buttons"
							style={!character.bought ? { marginTop: "110px" } : null}
						>
							{character.bought ? (
								<>
									<button
										className="select"
										type="button"
										onClick={() => selectCharacter(character.id)}
										style={{
											backgroundColor: disableButton ? "#ccc" : "#007BFF",
											cursor: disableButton ? "not-allowed" : "pointer",
										}}
										disabled={disableButton}
									>
										Selectati
									</button>
								</>
							) : !character.bought && !character.pay ? (
								<button
									className="buy"
									type="button"
									onClick={() => createCharacter()}
								>
									Creati caracter
								</button>
							) : !character.bought && character.pay ? (
								<button className="buy" type="button">
									Creati caracter pentru 500 SC
								</button>
							) : null}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
