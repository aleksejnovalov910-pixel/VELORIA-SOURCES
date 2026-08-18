import { LangString } from "../../../modules/lang";
import React, { Component } from "react";
import "./style.less";
const png = Object.fromEntries(
	Object.entries(import.meta.glob("./assets/*.png", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.png$/)[1];
			return [name, value.default];
		},
	),
);
const svg = Object.fromEntries(
	Object.entries(import.meta.glob("./assets/*.svg", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.svg$/)[1];
			return [name, value.default];
		},
	),
);
import { CloseButton } from "../../CloseButton";
import { CEF } from "../../../modules/CEF";
const items = Object.fromEntries(
	Object.entries(import.meta.glob("./assets/items/*.png", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.png$/)[1];
			return [name, value.default];
		},
	),
);
import Draggable from "react-draggable";

interface CookingItem {
	id: number;
	img: string;
}

const products: CookingItem[] = [
	{
		id: 0,
		img: "Cabbage",
	},
	{
		id: 1,
		img: "Carrot",
	},
	{
		id: 2,
		img: "Cereal",
	},
	{
		id: 3,
		img: "Cereal2",
	},
	{
		id: 4,
		img: "Chicken",
	},
	{
		id: 5,
		img: "Cucumbers",
	},
	{
		id: 6,
		img: "Greens",
	},
	{
		id: 7,
		img: "Greens2",
	},
	{
		id: 8,
		img: "Meat",
	},
	{
		id: 9,
		img: "Meat2",
	},
	{
		id: 10,
		img: "Meat3",
	},
	{
		id: 11,
		img: "Mushrooms",
	},
	{
		id: 12,
		img: "Mushrooms2",
	},
	{
		id: 13,
		img: "Mushrooms3",
	},
	{
		id: 14,
		img: "Mushrooms4",
	},
	{
		id: 15,
		img: "Onion",
	},
	{
		id: 16,
		img: "Pasta",
	},
	{
		id: 17,
		img: "Pepper",
	},
	{
		id: 18,
		img: "Pumpkin",
	},
	{
		id: 19,
		img: "Radish",
	},
	{
		id: 20,
		img: "Tomatoes",
	},
];

export class JailCooking extends Component<
	{
		status: (status: boolean) => void;
	},
	{
		recipe: CookingItem[];
		products: CookingItem[];
		dragItem: number | null;
		onPot: boolean;
		step: number;
	}
> {
	constructor(props: any) {
		super(props);

		const productsCopy = [...JSON.parse(JSON.stringify(products))];

		productsCopy.sort(() => Math.random() - 0.5);

		const recipe = this.getRecipe();
		this.state = {
			recipe,
			products: productsCopy,
			dragItem: null,
			onPot: false,
			step: 0,
		};
	}

	getRecipe() {
		const recipe: CookingItem[] = [];

		for (let i = 0; i < 5; i++) {
			const product = products[Math.floor(Math.random() * products.length)];

			if (recipe.find((el) => el.id === product.id) === undefined) {
				recipe.push(product);
			} else {
				i--;
			}
		}

		return recipe;
	}

	close = () => {
		CEF.gui.setGui(null);
	};

	pointerEnter() {
		this.setState({ onPot: true });
	}

	pointerLeave() {
		this.setState({ onPot: false });
	}

	startDrag(key: number) {
		this.setState({ dragItem: key });
	}

	finish() {
		this.props.status(true);
	}

	stopDrag() {
		const products = [...this.state.products];
		let step = this.state.step;

		if (
			this.state.onPot &&
			this.state.dragItem === this.state.recipe[this.state.step].id
		) {
			if (this.state.step + 1 === this.state.recipe.length) {
				this.finish();
			} else {
				let key;
				products.find((el, i) => {
					if (el.id === this.state.dragItem) {
						key = i;
						return true;
					}

					return false;
				});

				step++;

				if (key != undefined) products.splice(key, 1);
			}
		}
		this.setState({ dragItem: null, products, step });
	}

	render() {
		return (
			<div className="jailCooking jailCookingGame">
				<CloseButton onClickAction={this.close} isRightPosition={true} />

				<img
					src={png["background"]}
					alt=""
					className="jailCooking__background"
				/>

				<div className="jailCookingGame-left">
					<div className="jailCookingGame-left__title">
						<h1>
							{LangString(
								"components.MiniGame.JailCooking.JailCooking.0a149e22bf5031c29e8c072330b27e27",
							)}
						</h1>
						<h2>
							{LangString(
								"components.MiniGame.JailCooking.JailCooking.9a615c97aa698c5b25bcb4b5c2abe470",
							)}
						</h2>
					</div>

					<div className="jailCookingGame-left__text">
						{LangString(
							"components.MiniGame.JailCooking.JailCooking.3171eb087ab78fe90d01004941107901",
						)}{" "}
						<br />
						{LangString(
							"components.MiniGame.JailCooking.JailCooking.a044470eb004632b8336416d92e70324",
						)}
					</div>

					<div className="jailCookingGame-left-ingredients">
						<div className="jailCookingGame-left-ingredients__title">
							{LangString(
								"components.MiniGame.JailCooking.JailCooking.cf3783218baa7a019b8813dad45609ca",
							)}
							<div>
								<img src={svg["star"]} alt="" />
								{LangString(
									"components.MiniGame.JailCooking.JailCooking.dd82b8551b6f79d9919090312952451c",
								)}
							</div>
						</div>
						<div className="jailCookingGame-left-ingredients-items">
							{this.state.products.map((el, key) => {
								return (
									<div
										className="jailCookingGame-left-ingredients-items__block"
										key={key}
									>
										<Draggable
											position={{ x: 0, y: 0 }}
											onStart={() => this.startDrag(el.id)}
											onStop={() => this.stopDrag()}
										>
											<div>
												<img src={items[el.img]} alt="" />
											</div>
										</Draggable>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				<div className="jailCookingGame-recipe">
					<img
						src={png["recipe"]}
						alt=""
						className="jailCookingGame-recipe__background"
					/>

					{this.state.recipe.map((el, key) => {
						return (
							<img
								key={key}
								src={items[el.img]}
								alt=""
								className={`jailCookingGame-recipe__item jailCookingGame-recipe__item-${key}`}
							/>
						);
					})}
				</div>

				<div className={"jailCookingGame-pot"}>
					<img
						src={png["pot"]}
						className="jailCookingGame-pot__background"
						alt=""
					/>

					<div className="jailCookingGame-pot__bubble jailCookingGame-pot__bubble_0" />
					<div className="jailCookingGame-pot__bubble jailCookingGame-pot__bubble_1" />
					<div className="jailCookingGame-pot__bubble jailCookingGame-pot__bubble_2" />
					<div className="jailCookingGame-pot__bubble jailCookingGame-pot__bubble_3" />
					<div className="jailCookingGame-pot__bubble jailCookingGame-pot__bubble_4" />
					<div className="jailCookingGame-pot__bubble jailCookingGame-pot__bubble_5" />
					<div className="jailCookingGame-pot__bubble jailCookingGame-pot__bubble_6" />
					<div className="jailCookingGame-pot__bubble jailCookingGame-pot__bubble_7" />
					<img
						src={png["potFron"]}
						className="jailCookingGame-pot__backgroundFront"
						alt=""
					/>
				</div>

				<div
					className="jailCookingGame-pot__drop"
					onPointerEnter={() => this.pointerEnter()}
					onPointerLeave={() => this.pointerLeave()}
				/>
			</div>
		);
	}
}
