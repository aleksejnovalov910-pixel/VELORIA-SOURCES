import { LangString } from "../../modules/lang";
import React, { Component } from "react";
import './assets/style/style.scss'
import closeIcon from "./assets/closeIcon.svg";




const icons = Object.fromEntries(
	Object.entries(
		import.meta.glob("./assets/images/*.png", { eager: true }),
	).map(([key, value]: [string, { default: string }]) => {
		const name = key.match(/\/([^/]+)\.png$/)[1];
		return [name, value.default];
	}),
);

const imgPlaces = Object.fromEntries(
	Object.entries(
		import.meta.glob("./assets/places/*.png", { eager: true }),
	).map(([key, value]: [string, { default: string }]) => {
		const name = key.match(/\/([^/]+)\.png$/)[1];
		return [name, value.default];
	}),
);
const imgLocations = Object.fromEntries(
	Object.entries(
		import.meta.glob("./assets/locations/*.png", { eager: true }),
	).map(([key, value]: [string, { default: string }]) => {
		const name = key.match(/\/([^/]+)\.png$/)[1];
		return [name, value.default];
	}),
);
const iconsItems = Object.fromEntries(
	Object.entries(
		import.meta.glob("../../../shared/icons/*.png", { eager: true }),
	).map(([key, value]: [string, { default: string }]) => {
		const name = key.match(/\/([^/]+)\.png$/)[1];
		return [name, value.default];
	}),
);


import { CustomEvent } from "../../modules/custom.event";
import {
	IGunGameLobbySettings,
	IGunGameSession,
} from "../../../shared/gungame";
import { CEF } from "../../modules/CEF";
import { systemUtil } from "../../../shared/system";
import Password from "./components/password";
import GunGameList from "./components/list";
import Matches from "./components/matches";
import CreateSide from "./components/side";

type sessionType = "deathmatch" | "gungame" | "teamfight";

export class GunGame extends Component<
	{},
	{
		component: "select" | "create" | "enterPass";
		sessions: IGunGameSession[];

		createType: sessionType;
		createLocation: number;
		createFreeEnter: boolean;
		refRoomName: React.RefObject<any>;
		refRoomPass: React.RefObject<any>;
		refRoomPrice: React.RefObject<any>;
		selectedSession: number;
		selectedSessionName: string;
		refPassInput: React.RefObject<any>;
		selectedGun: number;
		useArmour: boolean;
		rebornAfterDeath: boolean;
		refKillsForEnd: React.RefObject<any>;

	}
> {
	description: any = {
		deathmatch: LangString(
			"components.GunGame.GunGame.0c2b33ff100811d2e3991fcd0e0b470b",
		),
		gungame: LangString(
			"components.GunGame.GunGame.c7a9f01882579252c47a86e4b82c4bd7",
		),
		teamfight: LangString(
			"components.GunGame.GunGame.54fdff0b1beb5b57b0ee68145e0e8636",
		),
	};

	places: any = [
		{
			name: LangString(
				"components.GunGame.GunGame.72b5e2a2d3c0053b81bb7f07defa41ef",
			),
			imgPlace: imgPlaces["lager"],
			imgLocation: imgLocations["lager"],
		},
		{
			name: LangString(
				"components.GunGame.GunGame.d86f17a4de154fefa44d04d79a23632d",
			),
			imgPlace: imgPlaces["svalka"],
			imgLocation: imgLocations["svalka"],
		},
		{
			name: LangString(
				"components.GunGame.GunGame.f3ee9f88b902c4838c5cd2f52db92b47",
			),
			imgPlace: imgPlaces["baraki"],
			imgLocation: imgLocations["baraki"],
		},
		{
			name: LangString(
				"components.GunGame.GunGame.29d7f7a84369a4c6a22d728fba5b427d",
			),
			imgPlace: imgPlaces["fontan"],
			imgLocation: imgLocations["fontan"],
		},
	];

	DM_WEAPONS: {
		/** Модель оружия. {@link DUELS_WEAPON Пример} есть в файле <b>/duels.ts</b>*/
		weapon: string;
		/** Название оружия */
		name: string;
		img: string;
	}[] = [
			{
				weapon: "weapon_machinepistol",
				name: LangString(
					"components.GunGame.GunGame.a180418d9f2be50e80bc00fe796a70c8",
				),
				img: "item",
			},
			{
				weapon: "weapon_combatpdw",
				name: LangString(
					"components.GunGame.GunGame.3112bd01c9c5d9a908454a23f5a10c15",
				),
				img: "item",
			},
			{
				weapon: "weapon_smg",
				name: LangString(
					"components.GunGame.GunGame.c80e7c193cd39e793bebc6e91506b444",
				),
				img: "item",
			},
			{
				weapon: "weapon_musket",
				name: LangString(
					"components.GunGame.GunGame.c3cd64e3fd3dc06eaca1d13bd88f6b09",
				),
				img: "item",
			},
			{
				weapon: "weapon_dbshotgun",
				name: LangString(
					"components.GunGame.GunGame.c0ad26fbe8c4d49b67f298a32b122290",
				),
				img: "item",
			},
			{
				weapon: "weapon_heavyshotgun",
				name: LangString(
					"components.GunGame.GunGame.b743ab4d983dd15938a5b8fb2aed6ec6",
				),
				img: "item",
			},
			{
				weapon: "weapon_bullpuprifle_mk2",
				name: LangString(
					"components.GunGame.GunGame.6eb0575855aad46270de9869594e5252",
				),
				img: "item",
			},
			{
				weapon: "weapon_militaryrifle",
				name: LangString(
					"components.GunGame.GunGame.2905c782c330925eaea3b2b05cb9b4c7",
				),
				img: "item",
			},
			{
				weapon: "weapon_carbinerifle",
				name: LangString(
					"components.GunGame.GunGame.a056efe185b18ddf831a513c5baa476d",
				),
				img: "item",
			},
			{
				weapon: "weapon_assaultrifle_mk2",
				name: LangString(
					"components.GunGame.GunGame.2b34e3b2590bba6e3958f970a1bc07b4",
				),
				img: "item",
			},
			{
				weapon: "weapon_sniperrifle",
				name: LangString(
					"components.GunGame.GunGame.eeb4c7bc71804b8eab87bcc4b3e1119d",
				),
				img: "item",
			},
			{
				weapon: "weapon_mg",
				name: LangString(
					"components.GunGame.GunGame.8b84000a984992e3ed65e4a6531b008d",
				),
				img: "item",
			},
			{
				weapon: "weapon_combatmg_mk2",
				name: LangString(
					"components.GunGame.GunGame.0b11ec762e04676f2acc93345b0f1850",
				),
				img: "item",
			},
			{
				weapon: "weapon_pistol50",
				name: LangString(
					"components.GunGame.GunGame.1dadadbed43dc161240aced93c688d0d",
				),
				img: "item",
			},
			{
				weapon: "weapon_revolver",
				name: LangString(
					"components.GunGame.GunGame.a4bdfdf802a11a0e03f3b68f5078afe3",
				),
				img: "item",
			},
		];

	mapTypeToMode: Map<sessionType, number> = new Map<sessionType, number>([
		["deathmatch", 0],
		["gungame", 1],
		["teamfight", 3],
	]);

	private containerRef: React.RefObject<HTMLDivElement>;

	constructor(props: any) {
		super(props);

		this.containerRef = React.createRef();

		this.state = {
			component: "select",
			sessions: [
				{
					id: 228,
					name: LangString(
						"components.GunGame.GunGame.1af44239306c5b6a29702c3cdfe960c7",
					),
					type: "deathmatch",
					place: 0,
					btnType: "connect",
					online: 5,
					maxPlayers: 40,
					price: 22000,
					time: "04:20",
					password: true,
				}
			
			],
			createType: "deathmatch",
			createLocation: 0,
			createFreeEnter: false,
			refRoomName: React.createRef(),
			refRoomPass: React.createRef(),
			refRoomPrice: React.createRef(),
			selectedSession: null,
			selectedSessionName: "",
			refPassInput: React.createRef(),
			selectedGun: 0,
			useArmour: false,
			rebornAfterDeath: false,
			refKillsForEnd: React.createRef(),
		};

		CustomEvent.register("gg:init", (sessions: IGunGameSession[]) => {
			this.setState({
				...this.state,
				component: "select",
				sessions,
			});
		});

		this.adjustZoom = this.adjustZoom.bind(this);
	}

	componentDidMount() {
		this.adjustZoom();
		window.addEventListener("resize", this.adjustZoom);
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.adjustZoom);
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


	setComponent(component: any): void {
		this.setState({
			...this.state,
			component,
		});
	}

	close(): void {
		CEF.gui.setGui(null);
	}

	setUseArmour(toggle: boolean) {
		this.setState({ ...this.state, useArmour: toggle });
	}

	setRebornAfterDeath(toggle: boolean) {
		this.setState({ ...this.state, rebornAfterDeath: toggle });
	}

	sessionAction(key: number): void {
		const session = this.state.sessions.find((s) => s.id == key);
		if (session.password && session.btnType === "connect") {
			this.setState({
				...this.state,
				selectedSession: key,
				selectedSessionName: session.name,
				component: "enterPass",
			});
		} else if (session.btnType === "cancel") {
			CustomEvent.triggerServer("gg:leave");
		} else if (session.btnType === "create") {
			CustomEvent.triggerServer("gg:start");
		} else {
			CustomEvent.triggerServer("gg:join", key, "");
		}
	}

	changeCreateType(type: any): void {
		this.setState({ ...this.state, createType: type });
	}

	changeCreateLocation(toggle: boolean): void {
		if (toggle) {
			if (this.state.createLocation === this.places.length - 1) {
				this.setState({ ...this.state, createLocation: 0 });
			} else {
				this.setState({
					...this.state,
					createLocation: this.state.createLocation + 1,
				});
			}
		} else {
			if (this.state.createLocation === 0) {
				this.setState({
					...this.state,
					createLocation: this.places.length - 1,
				});
			} else {
				this.setState({
					...this.state,
					createLocation: this.state.createLocation - 1,
				});
			}
		}
	}

	changeCreateFreeEnter(): void {
		if (!this.state.createFreeEnter) this.state.refRoomPass.current.value = "";

		this.setState({
			...this.state,
			createFreeEnter: !this.state.createFreeEnter,
		});
	}

	createMatch(): void {
		const name = this.state.refRoomName.current.value,
			freeEnter = this.state.createFreeEnter,
			pass = this.state.refRoomPass.current.value,
			price = this.state.refRoomPrice.current.value,
			type = this.state.createType,
			location = this.state.createLocation,
			useArmour = this.state.useArmour,
			reborn = this.state.rebornAfterDeath;

		if (!name)
			return CEF.alert.setAlert(
				"error",
				LangString(
					"components.GunGame.GunGame.23fae16c43c8f6b0c3760c8320747e3c",
				),
			);
		if (type === "deathmatch") {
			const selectedGun = this.state.selectedGun;
		}

		const killsForEnd = this.state.refKillsForEnd.current.value;

		if (killsForEnd < 5 || killsForEnd > 100) {
			return CEF.alert.setAlert(
				"error",
				LangString(
					"components.GunGame.GunGame.5fb11cf9050adfbacffcc708263d5f6c",
				),
			);
		}

		if (price > 50000)
			return CEF.alert.setAlert(
				"error",
				LangString(
					"components.GunGame.GunGame.2df72d2b4affab48b8f7ba176b4ce8d4",
					systemUtil.numberFormat(50000),
				),
			);

		const settings: IGunGameLobbySettings = {
			map: location,
			bet: price,
			password: pass,
			mode: this.mapTypeToMode.get(type),
			armour: useArmour,
			kills: killsForEnd,
			weapon: this.state.selectedGun,
			regen: reborn,
			name: systemUtil.filterInput(name),
		};

		CustomEvent.triggerServer("gg:create", settings);
	}

	addSymbolToPassword(value: number): void {
		if (this.state.refPassInput.current.value.length >= 6) return;
		this.state.refPassInput.current.value += `${value}`;
	}

	deleteLastSymbol(): void {
		if (this.state.refPassInput.current.value.length === 0) return;

		this.state.refPassInput.current.value =
			this.state.refPassInput.current.value.substring(
				0,
				this.state.refPassInput.current.value.length - 1,
			);
	}

	afterEnterPassword(): void {
		const sessionId = this.state.selectedSession,
			password = this.state.refPassInput.current.value;

		CustomEvent.triggerServer("gg:join", sessionId, password.toString());
	}

	changePasswordInput(): void {
		if (this.state.refPassInput.current.value.length > 6)
			this.state.refPassInput.current.value =
				this.state.refPassInput.current.value.substring(0, 6);
		this.state.refPassInput.current.value =
			this.state.refPassInput.current.value.replaceAll(/[^0-9.]/g, "");
	}

	changeSelectedGun(toggle: boolean) {
		let state: number;

		if (toggle) {
			if (this.state.selectedGun === this.DM_WEAPONS.length - 1) {
				state = 0;
			} else {
				state = this.state.selectedGun + 1;
			}
		} else {
			if (this.state.selectedGun === 0) {
				state = this.DM_WEAPONS.length - 1;
			} else {
				state = this.state.selectedGun - 1;
			}
		}

		this.setState({ ...this.state, selectedGun: state });
	}

	render() {
		const {	component } = this.state;

		return (
			<div className="gungame-container-box">
				<div className="gungame-box" ref={this.containerRef}>
					<div className="gungame-exit">
						<p>
							{LangString(
								"components.GunGame.GunGame.523203eccaca2ba3a3857529068206a4",
							)}
						</p>
						<div className="exit-img" onClick={() => this.close()}>
							<img src={closeIcon} alt="Exit" />
						</div>
					</div>

					<div className="gungame">
						<div className="title">
							<div className="title-name">
								<img src={icons['gun-ico']} alt="" />
								<h1>
									<span>gun</span> game
								</h1>
							</div>
							{component === "select" && (
								<button onClick={() => this.setComponent("create")} type="button">
									{LangString(
										"components.GunGame.GunGame.60fda112fea268c01f1b4608fa897c5e",
									)}
								</button>
							)}
						</div>


						{this.state.component === "enterPass" && (
							<Password
								selectedSessionName={this.state.selectedSessionName}
								refPassInput={this.state.refPassInput}
								onBack={() => {
									this.setState({ ...this.state, component: "select" });
									this.state.refPassInput.current.value = "";
								}}
								onChangePasswordInput={() => this.changePasswordInput()}
								onAddSymbol={(value) => this.addSymbolToPassword(value)}
								onDeleteLastSymbol={() => this.deleteLastSymbol()}
								onEnterPassword={() => this.afterEnterPassword()}
							/>
						)}

						{(component === "select" || component === "enterPass") && (
							<GunGameList 
								sessions={this.state.sessions}
								places={this.places}
								sessionAction={(id) => this.sessionAction(id)}
							/>
						)}

						{component === "create" && (
							<Matches 
								createType={this.state.createType}
								createLocation={this.state.createLocation}
								createFreeEnter={this.state.createFreeEnter}
								places={this.places}
								refRoomName={this.state.refRoomName}
								refRoomPass={this.state.refRoomPass}
								refRoomPrice={this.state.refRoomPrice}
								onChangeCreateType={(type) => this.changeCreateType(type)}
								onChangeCreateLocation={(toggle) => this.changeCreateLocation(toggle)}
								onChangeCreateFreeEnter={() => this.changeCreateFreeEnter()}
							/>
						)}
					</div>

					{component === 'create' && (
						<CreateSide
							refKillsForEnd={this.state.refKillsForEnd}
							useArmour={this.state.useArmour}
							rebornAfterDeath={this.state.rebornAfterDeath}
							createType={this.state.createType}
							selectedGun={this.state.selectedGun}
							DM_WEAPONS={this.DM_WEAPONS}
							icons={icons}
							iconsItems={iconsItems}
							onSetUseArmour={(toggle) => this.setUseArmour(toggle)}
							onSetRebornAfterDeath={(toggle) => this.setRebornAfterDeath(toggle)}
							onChangeSelectedGun={(toggle) => this.changeSelectedGun(toggle)}
							onCreateMatch={() => this.createMatch()}
						/>
					)}
				</div>
			</div>
		)
	}
}
