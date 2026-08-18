import { LangString } from "../../modules/lang";

// biome-ignore lint/style/useImportType: <explanation>
import React from "react";
import { Component } from "react";
import "./style/style.scss";
import { CEF } from "../../modules/CEF";
import { CustomEvent } from "../../modules/custom.event";
import type { AutosalonCarItem as AutosalonCarItemWithParam, CarParameters } from "../../../shared/autosalon";
import searchIcon from "./img/search.svg";
import { systemUtil } from "../../../shared/system";
import { fuelTypeNames } from "../../../shared/vehicles";
import exit from "./img/exit.svg";
import coins from "../../components/UserMenu/assets/svg/player-stop-white.svg";

// '#44b223',
// '#416a34',
// '#346a47',
// '#346a51',
// '#3a346a',
// '#21a7c7',
// '#295cbe',
// '#cc3f6b',
// '#f73535',
// '#cc963f',
// '#c7cc3f',
// '#070606',
// '#ffffff',

interface AutosalonState {
	type: string;
	selectedCar: number;
	selectPause: boolean;
	name?: string;
	cars: AutosalonCarItemWithParam[];
	loaded?: boolean;
	primaryColor: number;
	secondaryColor: number;
	donate?: number;
	canFamilyBuy?: boolean;
	searchQuery: string;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export class Autosalon extends Component<any, AutosalonState> {
	ev: import("../../../shared/custom.event").CustomEventHandler;
	private containerRef: React.RefObject<HTMLDivElement>;
	private carsListRef: React.RefObject<HTMLDivElement>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	constructor(props: any) {
		super(props);

		this.state = {
			primaryColor: 1,
			secondaryColor: 1,
			type: "",
			name: LangString(
				"components.Autosalon.index.f4ccfc87d3b8bfd76757c891669393f0",
			),
			selectedCar: 1,
			selectPause: false,
			cars: CEF.test
				? [
					{
						item: 1,
						count: 110,
						price: 999990,
						name: "Tesla",
						fuel_type: 3,
						fuel_max: 10,
						fuel_min: 3,
						model: "xa21",
						stock: 0,
						parameters: [
							{
								label: "Cilindri",
								choices: 10,
								choice: 2,
							},
							{
								label: "Cauciucuri",
								choices: 8,
								choice: 6,
							},
							{
								label: "Volante",
								choices: 8,
								choice: 2,
							},
							{
								label: "Portbagaj",
								choices: 2,
								choice: 1,
							},
							{
								label: "Geanta",
								choices: 20,
								choice: 15,
							},
						],
					},
					{
						item: 2,
						count: 10,
						price: 0,
						name: "BMW",
						fuel_type: 3,
						fuel_max: 10,
						fuel_min: 3,
						model: "xa21",
						stock: 10,
						parameters: [
							{
								label: "Cilindri",
								choices: 10,
								choice: 8,
							},
							{
								label: "Cauciucuri",
								choices: 8,
								choice: 8,
							},
							{
								label: "Volante",
								choices: 5,
								choice: 2,
							},
							{
								label: "Portbagaj",
								choices: 2,
								choice: 1,
							},
							{
								label: "Geanta",
								choices: 20,
								choice: 15,
							},
						],
					},
					{
						item: 3,
						count: 0,
						price: 998898,
						name: "Xa21",
						fuel_type: 3,
						fuel_max: 10,
						fuel_min: 3,
						model: "xa21",
						stock: 200,
						parameters: [
							{
								label: "Cilindri",
								choices: 10,
								choice: 8,
							},
							{
								label: "Cauciucuri",
								choices: 8,
								choice: 8,
							},
							{
								label: "Volante",
								choices: 5,
								choice: 2,
							},
							{
								label: "Portbagaj",
								choices: 2,
								choice: 1,
							},
							{
								label: "Geanta",
								choices: 20,
								choice: 15,
							},
						],
					},
					{
						item: 4,
						count: 10,
						price: 0,
						name: "Xa21",
						fuel_type: 3,
						fuel_max: 10,
						fuel_min: 3,
						model: "xa21",
						stock: 100,
						parameters: [
							{
								label: "Cilindri",
								choices: 10,
								choice: 8,
							},
							{
								label: "Cauciucuri",
								choices: 8,
								choice: 8,
							},
							{
								label: "Volante",
								choices: 5,
								choice: 2,
							},
							{
								label: "Portbagaj",
								choices: 2,
								choice: 1,
							},
							{
								label: "Geanta",
								choices: 20,
								choice: 15,
							},
						],
					},
				]
				: [],
			searchQuery: "",
		};

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleSearchChange = this.handleSearchChange.bind(this);

		this.ev = CustomEvent.register(
			"autosalon:startAutosalon",
			(
				name: string,
				cars: AutosalonCarItemWithParam[],
				selectedCar: number,
				donate: number,
				canFamilyBuy: boolean,
			) => {
				this.setState({
					name,
					cars,
					selectedCar,
					donate,
					loaded: true,
					canFamilyBuy,
				}, () => {
					// Ensure selected car is visible after data is loaded
					setTimeout(() => {
						this.scrollSelectedIntoView();
					}, 300);
				});
			},
		);

		this.containerRef = React.createRef();
		this.carsListRef = React.createRef();
		this.adjustZoom = this.adjustZoom.bind(this);
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


	handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ searchQuery: e.target.value });
	};

	filteredCars = () => {
		const { searchQuery, cars } = this.state;
		return cars.filter((car) =>
			car.name.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	};

	componentDidMount = () => {
		this.adjustZoom();
		window.addEventListener("resize", this.adjustZoom);
		document.addEventListener("keydown", this.handleKeyDown);

		// Ensure selected car is visible when component is loaded
		setTimeout(() => {
			this.scrollSelectedIntoView();
		}, 300);
	};
	componentWillUnmount = () => {
		window.removeEventListener("resize", this.adjustZoom);
		document.removeEventListener("keydown", this.handleKeyDown);
		if (this.ev) this.ev.destroy();
	};

	scrollSelectedIntoView = () => {
		if (!this.carsListRef.current) return;

		const carsList = this.carsListRef.current;
		const selectedCar = carsList.querySelector(".car.selected") as HTMLElement;

		if (!selectedCar) return;

		const carsListRect = carsList.getBoundingClientRect();
		const selectedCarRect = selectedCar.getBoundingClientRect();

		const isVisible =
			selectedCarRect.top >= carsListRect.top &&
			selectedCarRect.bottom <= carsListRect.bottom;

		if (!isVisible) {
			const isLastItems = selectedCar.offsetTop > carsList.scrollHeight - carsList.clientHeight - 100;
			const isFirstItems = selectedCar.offsetTop < 100;

			if (isLastItems) {
				carsList.scrollTo({
					top: carsList.scrollHeight,
					behavior: 'smooth'
				});
			} else if (isFirstItems) {
				carsList.scrollTo({
					top: 0,
					behavior: 'smooth'
				});
			} else {
				const scrollTop = selectedCar.offsetTop - carsList.offsetTop - (carsList.clientHeight / 2) + (selectedCar.clientHeight / 2);
				carsList.scrollTo({
					top: scrollTop,
					behavior: 'smooth'
				});
			}
		}
	};

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	handleKeyDown = (e: any) => {
		switch (e.keyCode) {
			case 40: { // Стрелка вниз
				if (this.state.selectPause) return;
				const filteredCars = this.filteredCars();
				const currentIndex = filteredCars.findIndex(
					(data) => data.item === this.state.selectedCar,
				);
				const nextIndex = currentIndex + 1;
				const targetIndex = nextIndex >= filteredCars.length ? 0 : nextIndex;
				this.selectCar(filteredCars[targetIndex].item);
				setTimeout(() => {
					this.scrollSelectedIntoView();
				}, 100);
				return;
			}

			case 38: { // Стрелка вверх
				if (this.state.selectPause) return;
				const filteredCars = this.filteredCars();
				const currentIndex = filteredCars.findIndex(
					(data) => data.item === this.state.selectedCar,
				);
				const prevIndex = currentIndex - 1;
				const targetIndex = prevIndex < 0 ? filteredCars.length - 1 : prevIndex;
				this.selectCar(filteredCars[targetIndex].item);
				setTimeout(() => {
					this.scrollSelectedIntoView();
				}, 100);
				return;
			}
			case 27:
				return this.closeBuying();
		}
	};

	selectCar = (id: number) => {
		if (this.state.selectPause) return;
		//@ts-ignore
		mp.trigger("client:autosalon:changeCar", id);
		this.setState({ selectedCar: id, selectPause: true });
		setTimeout(() => this.setState({ selectPause: false }), 500);
		CEF.playSound("cliekc"); // sunet la selectarea unui articol
		
	};

	handleColorChange = (
		id: number,
		color: { r: number; g: number; b: number },
	) => {
		this.setState({ primaryColor: id });
		CustomEvent.triggerClient(
			"autosalon:setPrimaryColor",
			color.r,
			color.g,
			color.b,
		);
		CEF.playSound("cliekc"); // sunet la selectarea unui articol
		
	};

	closeBuying = () => {
		CustomEvent.triggerClient("server:autosalon:stopBuyCar");
		CEF.gui.setGui(null);
		CEF.playSound("exitmagazin"); // ruleaza instant
		
	};

	buyCar = () => {
		CustomEvent.triggerClient("autosalon:buyCar");
		this.closeBuying();
		CEF.playSound("cliekc"); // sunet la selectarea unui articol
		
	};
	buyFamilyCar = () => {
		CustomEvent.triggerClient("autosalon:buyCar", true);
		CEF.playSound("cliekc"); // sunet la selectarea unui articol
		this.closeBuying();
	};
	testDrive = () => {
		CustomEvent.triggerClient("client:autosalon:testDrive");
		CEF.playSound("cliekc"); // sunet la selectarea unui articol

	};

	selectedCar = () => {
		return this.state.cars.find((itm) => itm.item === this.state.selectedCar);

	};

	toggleCameraZoom = (enableZoom: boolean) => {
		CustomEvent.triggerClient("autosalon:toggleZoom", enableZoom);
	};

	getTitle = () => {
		const title = LangString(
			"components.Autosalon.index.c8df05f4c0b3a3a57034a55807fa1573",
		);
		const titleArray = title.split(" ");
		if (titleArray.length === 1) return titleArray[0];
		return <>
			{titleArray[0]}
			<span> {...titleArray.slice(1)}</span>
		</>;
	};

	render = () => {
		const colors = [
			{ id: 1, colorCode: "Red", color: { r: 255, g: 0, b: 0 } },
			{ id: 2, colorCode: "Blue", color: { r: 0, g: 0, b: 255 } },
			{ id: 3, colorCode: "Green", color: { r: 0, g: 128, b: 0 } },
			{ id: 4, colorCode: "Black", color: { r: 0, g: 0, b: 0 } },
			{ id: 5, colorCode: "White", color: { r: 255, g: 255, b: 255 } },
			{ id: 6, colorCode: "Silver", color: { r: 192, g: 192, b: 192 } },
			{ id: 7, colorCode: "Gray", color: { r: 128, g: 128, b: 128 } },
			{ id: 8, colorCode: "Brown", color: { r: 165, g: 42, b: 42 } },
			{ id: 9, colorCode: "Yellow", color: { r: 255, g: 255, b: 0 } },
			{ id: 10, colorCode: "Purple", color: { r: 128, g: 0, b: 128 } },
			{ id: 11, colorCode: "Orange", color: { r: 255, g: 165, b: 0 } },
			{ id: 12, colorCode: "Pink", color: { r: 255, g: 192, b: 203 } },
			{ id: 13, colorCode: "Beige", color: { r: 245, g: 245, b: 220 } },
			{ id: 14, colorCode: "Tan", color: { r: 210, g: 180, b: 140 } },
			{ id: 15, colorCode: "Lightblue", color: { r: 173, g: 216, b: 230 } },
			{ id: 16, colorCode: "Bisque", color: { r: 255, g: 228, b: 196 } },
		];
		if (!this.selectedCar()) return null;

		const selectedCar = this.selectedCar();

		return (
			<div className="autosalon-container-box">
				<div className="car-shop" ref={this.containerRef}>
					<div className="header">
						<div className="title-carshop">
							<h1>
								{this.getTitle()}
							</h1>
							<h2>tot ce ai nevoie, intr-un singur loc</h2>
						</div>

						<span className="autosalon-vehicle-title">
							{selectedCar.name}
						</span>

						<div className="autosalon-exit">
							<p>Exit</p>
							<div className="exit-img" onClick={this.closeBuying}>
								<img src={exit} alt="Exit" />
							</div>
						</div>
					</div>
					<div className="content">
						<div className="cars-list">
							<div className="searchbar">
								<img src={searchIcon} alt="" />
								<input
									type="text"
									placeholder="Nume"
									value={this.state.searchQuery}
									onChange={this.handleSearchChange}
								/>
							</div>
							<div className="cars-name" ref={this.carsListRef}>
								{this.filteredCars().map((car) => (
									<div
										key={car.item}
										className={`car ${this.state.selectedCar === car.item ? "selected" : ""}`}
										onClick={() => this.selectCar(car.item)}
										onKeyDown={() => this.selectCar(car.item)}
									>
										<h1>{car.name}</h1>
										<h2>
										{this.state.donate ? (
											<>
											<img
												src={coins}
												width={18}
												height={18}
												style={{ verticalAlign: "middle", marginRight: "4px" }}
											/>
											{car.price.toLocaleString()}
											</>
										) : (
											<>${car.price.toLocaleString()}</>
										)}
										</h2>
										{/* <h2>{this.state.donate ? `${car.price.toLocaleString()} SC` : `$${car.price.toLocaleString()}`}</h2> */}
									</div>
								))}
							</div>
						</div>
						<div className="car-display" />
						<div className="car-details">
							<h1 className="car-details-title">Specificatii tehnice</h1>

							{selectedCar &&
								selectedCar.parameters.map((param: CarParameters) => (
									<div className="parameter" key={param.label}>
										<div className="parameter-top">
											<h2>{param.label}</h2>


											{param.label === "Viteza maxima" ? (
												<p>{Math.round(param.choice)} km/H</p>
											) : (
												<p>{param.choice}</p>
											)}
										</div>

										<div className="parameter-line">
											<input
												type="range"
												min="1"
												max={param.choices}
												value={
													selectedCar.parameters[param.label] ||
													param.choice
												}
												style={{
													background: `linear-gradient(to right, #FF6F7D ${(((selectedCar.parameters[param.label] ||
														param.choice) -
														1) /
														(param.choices - 1)) *
														100
														}%, #423f3e ${(((selectedCar.parameters[param.label] ||
															param.choice) -
															1) /
															(param.choices - 1)) *
														100
														}%)`,
												}}
											/>
										</div>
									</div>
								))}
							
							<div className="parameter">
								<div className="parameter-top">
									<h2>Portbagaj</h2>


									<p>{selectedCar.stock} kg</p>
								</div>

								<div className="parameter-line">
									<input
										type="range"
										min="0"
										max="150"
										value={selectedCar.stock}
										style={{
											background: `linear-gradient(to right, #FF6F7D ${Math.min((selectedCar.stock / 150) * 100, 100)}%, #423f3e ${Math.min((selectedCar.stock / 150) * 100, 100)}%)`,
										}}
										disabled
									/>

								</div>
							</div>

					
							<div className="colors-title">
								<h1>Culori</h1>
							</div>
							<div className="colors">
								{colors.map((color) => (
									<div
										key={color.id}
										className={`color ${this.state.primaryColor === color.id ? "selected" : ""}`}
										onClick={() => this.handleColorChange(color.id, color.color)}
										onKeyDown={() => this.handleColorChange(color.id, color.color)}
										style={{ backgroundColor: color.colorCode }}
									/>
								))}
							</div>

							<div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
								<div className="cost" style={{ alignItems: "flex-start" }}>
									<h1>In stoc</h1>
									<h2>
										{selectedCar.count}</h2>
								</div>
								<div className="cost">
									<h1>Pretul</h1>
									<h2>
									{this.state.donate ? (
										<>
										<img
											src={coins}
											width={20}
											height={20}
											style={{ verticalAlign: "middle", marginRight: "4px" }}
										/>
										{selectedCar.price.toLocaleString()}
										</>
									) : (
										<>${selectedCar.price.toLocaleString()}</>
									)}
									</h2>
									{/* <h2>
										{this.state.donate ? `${selectedCar.price.toLocaleString()} SC` : `$ ${selectedCar.price.toLocaleString()}`}</h2> */}
								</div>

							</div>

							<div className="controls">
								<div className="buy-buttons">
									<button className="buy" type="button" onClick={this.buyCar} disabled={selectedCar.count === 0}>
										{this.state.type === "rent" ?
											LangString(
												"components.Autosalon.index.dec4aac52d0447cceb14a506a9a66f41",
											)
											:
											selectedCar.count === 0 ?
												"Stoc epuizat"
												:
												LangString(
													"components.Autosalon.index.b512dd122347a7aadf8f94b05a85279d",
												)
										}
									</button>
									{this.state.canFamilyBuy && this.state.type !== "rent" ? (
										<button
											className="buy-family"
											type="button"
											onClick={this.buyFamilyCar}
										>
											{LangString(
												"components.Autosalon.index.d63da59759306255426722a3f5f14ae7",
											)}
										</button>
									) : null}
								</div>
								{this.state.type !== "rent" ? (
									<button
										type="button"
										className="test"
										onClick={this.testDrive}
									>
										{LangString(
											"components.Autosalon.index.f9cd2d919d173ecc28f79791831e1b29",
										)}
									</button>
								) : null}

							</div>

						</div>
						<div className="autosalon-hints">
							<div className="move">
								<h1>Roteaza la 360°</h1>
								<button type="button" className="move-car">
									🖱️
								</button>
							</div>
							<div className="select-cars">
								<h1>Selecteaza</h1>
								<button type="button" className="up">
									<svg xmlns="http://www.w3.org/2000/svg" width="6" height="13" viewBox="0 0 6 13" fill="none">
										<path d="M3.21213 0.787868C3.09497 0.670711 2.90503 0.670711 2.78787 0.787868L0.87868 2.69706C0.761522 2.81421 0.761522 3.00416 0.87868 3.12132C0.995837 3.23848 1.18579 3.23848 1.30294 3.12132L3 1.42426L4.69706 3.12132C4.81421 3.23848 5.00416 3.23848 5.12132 3.12132C5.23848 3.00416 5.23848 2.81421 5.12132 2.69706L3.21213 0.787868ZM3.3 13L3.3 1H2.7L2.7 13H3.3Z" fill="white" />
									</svg>
								</button>
								<button type="button" className="down">
									<svg xmlns="http://www.w3.org/2000/svg" width="6" height="13" viewBox="0 0 6 13" fill="none">
										<path d="M2.78787 12.2121C2.90503 12.3293 3.09497 12.3293 3.21213 12.2121L5.12132 10.3029C5.23848 10.1858 5.23848 9.99584 5.12132 9.87868C5.00416 9.76152 4.81421 9.76152 4.69706 9.87868L3 11.5757L1.30294 9.87868C1.18579 9.76152 0.995837 9.76152 0.87868 9.87868C0.761522 9.99584 0.761522 10.1858 0.87868 10.3029L2.78787 12.2121ZM2.7 0L2.7 12H3.3L3.3 0L2.7 0Z" fill="white" />
									</svg>
								</button>
							</div>

							<div className="select-cars">
								<h1>Selecteaza</h1>
								<button type="button" className="move-car enter-btn">
									Enter
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};
}
