// biome-ignore lint/style/useImportType: <explanation>
import React, { Component } from "react";
import "./style/style.scss";
import type { IParkingData, IParkingFloor } from "../../../shared/parking";
import { CEF } from "../../modules/CEF";
import carImage from "./img/car.png";
import { CustomEvent } from "../../modules/custom.event";
import type { CustomEventHandler } from "../../../shared/custom.event";
import exitIcon from "./img/exit.svg";
import logoIcon from "./img/icon.svg";
import searchIcon from "./img/search.svg";

interface PositionEx {
	x: number;
	y: number;
	z: number;
}

interface VehicleData {
	dbid: number;
	model: string;
	numberPlate: string;
	spawnPosition: PositionEx;
	spawnRotation: PositionEx;
	spawnDimension: number;
	usedAfterRespawn: boolean;
	inventoryTmp: number;
	afkTime: number;
	needRespawn: boolean;
	user: number;
}


const vehicleMockSpec = {
    speed: {
        name: "Viteza maxima",
        value: 100,
        max: 250
    },
    braking: {
        name: "Frane",
        value: 1.2,
        max: 3
    },
    acceleration: {
        name: "Acceleratie",
        value: 0.25,
        max: 1
    },
    traction: {
        name: "Tractiune",
        value: 2.2,
        max: 4
    },
}

export class Parking extends Component<
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	{},
	{
		id: number;
		name: string;
		//@ts-ignore
		exit: [Vector3Mp, number, number] | null;
		floors: IParkingFloor[];
		singlePayment: string;
		dailyPayment: string;
		subType: number;
		vehicles: VehicleData[];
		selectedCar: VehicleData | null;
		searchQuery: string;
		showFilterDropdown: boolean;
		sortOrder: 'asc' | 'desc' | null;
		vehicleSpecs?: {
			speed: number;
			traction: number;
			acceleration: number;
			braking: number;
		};
	}
> {
	ev: CustomEventHandler;

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	constructor(props: any) {
		super(props);
		this.state = {
			id: 5,
			name: "aaaa",
			exit: null,
			floors: [],
			singlePayment: "a",
			dailyPayment: "a",
			subType: 0,
			selectedCar: null,
			searchQuery: "",
			vehicles: [],
			showFilterDropdown: false,
			sortOrder: null,
		};

		this.ev = CustomEvent.register(
			"parking:load",
			(parkingData: IParkingData) => {
				this.setState({ ...parkingData });
				console.log(parkingData);
			},
		);
	}

	handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ searchQuery: event.target.value });
	};

	toggleFilterDropdown = () => {
		this.setState(prevState => ({ showFilterDropdown: !prevState.showFilterDropdown }));
	};

	setSortOrder = (order: 'asc' | 'desc') => {
		this.setState({
			sortOrder: order,
			showFilterDropdown: false
		});
	};

	getSortedVehicles = (vehicles: VehicleData[]) => {
		if (!this.state.sortOrder) return vehicles;

		return [...vehicles].sort((a, b) => {
			const modelA = a.model.toLowerCase();
			const modelB = b.model.toLowerCase();

			if (this.state.sortOrder === 'asc') {
				return modelA.localeCompare(modelB);
			} else {
				return modelB.localeCompare(modelA);
			}
		});
	};

	componentDidMount() {
		if (this.state.vehicles.length > 0) {
			this.setState({ selectedCar: this.state.vehicles[0] });
		}

		document.addEventListener('click', this.handleClickOutside);

	}

	componentWillUnmount() {
		this.ev.destroy();

		document.removeEventListener('click', this.handleClickOutside);
	}

	handleClickOutside = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (this.state.showFilterDropdown && !target.closest('.dropdown-wrapper')) {
			this.setState({ showFilterDropdown: false });
		}
	};

	componentDidUpdate(prevProps: any, prevState: any): void {
		if (prevState?.selectedCar?.model !== this.state.selectedCar?.model) {
			this.getVehicleSpecs();
		}
	}

	async getVehicleSpecs() {
		const vehicleModel = this.state.selectedCar?.model;
		if (!vehicleModel) return;

		const specs = await CustomEvent.callClient("cef:getVehicleSpecs", vehicleModel);
		
		if (!specs) return;
		this.setState({ vehicleSpecs: specs });
	}

	setSelectedCar(car: VehicleData) {
		this.setState({ selectedCar: car });
	}

	spawnCar(car: VehicleData) {
		CustomEvent.triggerServer("parking:spawnVehicle", car);
		this.close();
	}
	close() {
		CEF.gui.setGui(null);
	}

	exit() {
		if (!this.state.exit) return;
		CustomEvent.triggerServer(
			"parking:exit",
			this.state.exit[0],
			this.state.exit[1],
			this.state.exit[2],
		);
		this.close();
	}

	toFloor(dimension: number) {
		CustomEvent.triggerServer("parking:toFloor", dimension, this.state.subType);
		this.close();
	}

	isInteger(n: number) {
		return Number(n) === n && n % 1 === 0;
	}

	getCurrentFloor() {
		return this.state.floors.find((el) => el.current);
	}

	getCarFloor() {
		return this.state.floors.find((el) => el.haveCar);
	}

	render() {
		if (!this.state.vehicles) return null;
		const filteredVehicles = this.state.vehicles.filter((car) =>
			car.model.toLowerCase().includes(this.state.searchQuery.toLowerCase()),
		);

		const sortedVehicles = this.getSortedVehicles(filteredVehicles);

		return (
			<div className="parking-container-box">
				<div className="car-shop">
					<div className="header">
						<div className="titleWrapper">

							<span className="titleWrapper-logo">
								<img src={logoIcon} alt="Logo" />
							</span>
							<div>
								<h1>
									<span>GARAGE</span> SYSTEM
								</h1>
								<h2>Aici iti poti parca si pastra vehiculele in siguranta</h2>
							</div>

						</div>
						<button
							className="exit-button"
							type="button"
							onClick={this.close}
						>
							<span>Exit</span>
							<div className="exit-img">
								<img src={exitIcon} alt="Exit" />
							</div>
						</button>
					</div>

					<div className="search">
						<div className="searchbar">
							<img src={searchIcon} alt="" />
							<input
								type="text"
								placeholder="Nume"
								maxLength={100}
								value={this.state.searchQuery}
								onChange={this.handleSearchChange}
							/>


						</div>
						<div className="dropdown-wrapper" onClick={this.toggleFilterDropdown}>

							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
								<path opacity="0.3" d="M14.3388 0H1.66119C1.33935 0.000268305 1.0245 0.0994258 0.754858 0.285438C0.485216 0.471451 0.272371 0.736321 0.142155 1.0479C0.0119387 1.35948 -0.0300494 1.70438 0.0212864 2.04073C0.0726223 2.37708 0.215075 2.69043 0.431355 2.94274L5.92559 9.3396V15.3725C5.92563 15.4905 5.95708 15.606 6.0163 15.7059C6.07553 15.8058 6.16015 15.8859 6.26046 15.9372C6.34062 15.9791 6.4289 16.0006 6.51828 16C6.65298 15.9999 6.78364 15.9512 6.88871 15.8619L8 14.9208L9.85215 13.3521C9.92146 13.2934 9.97742 13.2189 10.0159 13.1342C10.0544 13.0495 10.0744 12.9567 10.0744 12.8627V9.3396L15.5686 2.94274C15.7849 2.69043 15.9274 2.37708 15.9787 2.04073C16.03 1.70438 15.9881 1.35948 15.8578 1.0479C15.7276 0.736321 15.5148 0.471451 15.2451 0.285438C14.9755 0.0994258 14.6607 0.000268305 14.3388 0Z" fill="white" />
							</svg>

							{this.state.sortOrder === 'asc' ? 'A → Z' : this.state.sortOrder === 'desc' ? 'Z → A' : 'Filter'}

							<svg className="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
								<path opacity="0.3" d="M13 1L7 7L0.999999 1" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
							</svg>

							{this.state.showFilterDropdown && (
								<div className="filter-dropdown">
									<div
										className={`filter-option ${this.state.sortOrder === 'asc' ? 'active' : ''}`}
										onClick={(e) => { e.stopPropagation(); this.setSortOrder('asc'); }}
									>
										<span>A → Z</span>
									</div>
									<div
										className={`filter-option ${this.state.sortOrder === 'desc' ? 'active' : ''}`}
										onClick={(e) => { e.stopPropagation(); this.setSortOrder('desc'); }}
									>
										<span>Z → A</span>
									</div>
								</div>
							)}
						</div>
					</div>
					<div className="content_parking">
						<div className="content_parking-list">
							{sortedVehicles.map((car) => (
								<div
									key={car.dbid}
									className={`content_parking-item ${this.state.selectedCar?.dbid === car.dbid ? "selected" : ""}`}
								>
									<div className="parking-item-title">
										<span>Model </span>
										<h6>{car.model}</h6>
									</div>

									<img src={CEF.getVehicleURL(car.model)} className="parking-item-image" alt={car.model} />

									<span className="parking-item-plate">
										{car.numberPlate}
									</span>

									<button
										className="parking-item-select"
										onClick={() => this.setSelectedCar(car)}
									>
										Select
									</button>
								</div>
							))}

						</div>
						{this.state.selectedCar && (
							<div className="content_parking-details">
								<h1>{this.state.selectedCar.model}</h1>

								<div className="img-container">
									<img src={CEF.getVehicleURL(this.state.selectedCar.model)} alt="" />
								</div>

								<h2>Specificatii tehnice</h2>
								<div className="content_parking-specs">
									{this.state.vehicleSpecs ? (
										Object.entries(vehicleMockSpec).map(([key, data]) => {
											const value = this.state.vehicleSpecs[key as keyof typeof vehicleMockSpec] || data.value;
											return (
												<div key={key} className="content_parking-specs-item">
													<div className="content_parking-specs-item-title">
														{data.name}
														<span>{value}</span>
													</div>

													<div className="content_parking-specs-item-progress">
														<span style={{ width: `${(value / data.max) * 100}%` }} />
													</div>
												</div>
											)
										})
									) : (
										<h1>Loading...</h1>
									)}
								</div>

								<div className="controls">
									<button
										className="spawn-car"
										onClick={() => this.spawnCar(this.state.selectedCar)}
									>
										Spawn car
									</button>
									<button
										className="unpark-car"
										onClick={this.close}
									>
										Exit
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
