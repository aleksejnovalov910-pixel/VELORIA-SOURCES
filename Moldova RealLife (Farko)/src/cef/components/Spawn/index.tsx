import React, { Component } from "react";
import "./style/style.scss";
import { CustomEvent } from "../../modules/custom.event";
import { CEF } from "../../modules/CEF";
import homeImg from "./img/img-home.png";
import organizationImg from "./img/img-organization.png";
import laspplaceImg from "./img/img-lastplace.png";
import familyImg from "./img/img-family.png";
import homeSvg from "./img/home.svg";
import organizationSvg from "./img/organization.svg";
import laspplaceSvg from "./img/lastplace.svg";
import familySvg from "./img/family.svg";
import arrows from "./img/arrows.svg";
import type { CustomEventHandler } from "../../../shared/custom.event";

type LocationType = {
	id: number;
	name: string;
	img: string;
	svg: string;
	selected: boolean;
	isAvailable: boolean;
	isHovered: boolean;
};

type SpawnScreenState = {
	locations: LocationType[];
	show: boolean;
	canSpawnHouse: boolean;
	haveHouse: boolean;
	haveFamily: boolean;
	haveFamilyHouse: boolean;
	fraction: number;
	nextSpawnTime: number;
};

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export class SpawnScreen extends Component<{}, SpawnScreenState> {
	private ev: CustomEventHandler;

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	constructor(props: any) {
		super(props);
		this.state = {
			locations: [
				{
					id: 0,
					name: "acasa",
					img: homeImg,
					svg: homeSvg,
					selected: false,
					isAvailable: false,
					isHovered: false,
				},
				{
					id: 1,
					name: "organizatie",
					img: organizationImg,
					svg: organizationSvg,
					selected: false,
					isAvailable: false,
					isHovered: false,
				},
				{
					id: 2,
					name: "familie",
					img: familyImg,
					svg: familySvg,
					selected: false,
					isAvailable: false,
					isHovered: false,
				},
				{
					id: 3,
					name: "ultima locatie",
					img: laspplaceImg,
					svg: laspplaceSvg,
					selected: false,
					isAvailable: true,
					isHovered: false,
				},
			],
			show: true,
			canSpawnHouse: false,
			haveHouse: false,
			haveFamily: false,
			haveFamilyHouse: false,
			fraction: 0,
			nextSpawnTime: 0,
		};

		this.ev = CustomEvent.register(
			"spawn:select",
			this.handleSpawnSelect.bind(this),
		);
	}

	componentWillUnmount() {
		if (this.ev) this.ev.destroy();
	}

	private handleSpawnSelect(
		canSpawnHouse: boolean,
		haveHouse: boolean,
		haveFamily: boolean,
		haveFamilyHouse: boolean,
		fraction: number,
		nextSpawnTime: number,
	) {
		this.setState({
			canSpawnHouse,
			haveHouse,
			haveFamily,
			haveFamilyHouse,
			fraction,
			nextSpawnTime,
			show: true,
		});

		this.setState((prevState) => ({
			locations: prevState.locations.map((location) => {
				switch (location.id) {
					case 0:
						return { ...location, isAvailable: canSpawnHouse && haveHouse };
					case 1:
						return { ...location, isAvailable: fraction > 0 };
					case 2:
						return { ...location, isAvailable: haveFamily && haveFamilyHouse };
					default:
						return location;
				}
			}),
		}));
	}

	private selectSpawn(location: LocationType) {
		if (!location.isAvailable) return;
		this.setState({ show: false });
		CustomEvent.triggerServer("spawn:select", location.id);
		CEF.gui.setGui(null);
	}

	private handleMouseEnter(locationId: number) {
		this.setState((prevState) => ({
			locations: prevState.locations.map((location) =>
				location.id === locationId
					? { ...location, isHovered: true }
					: location,
			),
		}));
	}

	private handleMouseLeave(locationId: number) {
		this.setState((prevState) => ({
			locations: prevState.locations.map((location) =>
				location.id === locationId
					? { ...location, isHovered: false }
					: location,
			),
		}));
	}

	render() {
		if (!this.state.show) return null;

		return (
			<div className="spawn-container-box">
				<div className="location-creation">
					<div className="header">
						<div className="spawn-container-title">
							<h1>
								selectati <span>locatie</span>
							</h1>
						</div>
						<p>Alegeti punctul de spawn al personajului</p>
					</div>
					<div className="spawn-container-locations">
						{this.state.locations.map((location) => (
							<div
								className={`location ${location.isHovered ? "selected" : ""}`}
								key={location.id}
								style={{ backgroundImage: `url(${location.img})` }}
								onMouseEnter={() => this.handleMouseEnter(location.id)}
								onMouseLeave={() => this.handleMouseLeave(location.id)}
							>
								<div className="location-top">
									<h1 className="location-name">{location.name}</h1>
								</div>
								<div className="locations-img">
									<img className="location-img" src={location.svg} alt="" />
									<img src={arrows} alt="" />
								</div>
								<div className="location-buttons">
									{location.isAvailable && (
										<button
											onClick={() => this.selectSpawn(location)}
											className={`button ${
												location.isHovered ? "select" : "buy"
											}`}
											type="button"
										>
											Select
										</button>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}
}
