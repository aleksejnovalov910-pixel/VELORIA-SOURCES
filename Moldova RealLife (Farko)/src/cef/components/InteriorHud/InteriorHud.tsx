import { LangString } from "../../modules/lang";
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
import FurnitureHudStore from "../../stores/FurnitureHud";
import { observer } from "mobx-react";
import { CustomEvent } from "../../modules/custom.event";

@observer
export class InteriorHud extends Component<
	{
		store: FurnitureHudStore;
	},
	{}
> {
	store: FurnitureHudStore = this.props.store;

	constructor(props: any) {
		super(props);

		document.addEventListener("keydown", this.keyDownHandler);
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.keyDownHandler);

		this.store.setState({
			direction: "x",
			moveType: true,
		});
	}

	keyDownHandler = (e: any) => {
		if (
			[39, 37, 38, 40, 16, 17, 79, 78, 89].find((el) => el === e.keyCode) ===
			undefined
		)
			return;

		CustomEvent.triggerClient("furniturePlace:onKey", e.keyCode);
	};

	render() {
		return (
			<div className="interiorHud">
				<div className="interiorHud-top-left">
					<div className="interiorHud-top-left-line">
						<div className="interiorHud-buttonBlock">
							<img src={svg["arrowLeft"]} alt="" />
						</div>
						<div className="interiorHud-buttonBlock">
							<img src={svg["arrowRight"]} alt="" />
						</div>
						<div className="interiorHud-top-left-line__text">
							{LangString(
								"components.InteriorHud.InteriorHud.18f6c1ae109cb96db152afa257568d4a",
							)}
						</div>
					</div>

					<div className="interiorHud-top-left-line">
						<div className="interiorHud-buttonBlock">
							<img src={svg["arrowUp"]} alt="" />
						</div>
						<div className="interiorHud-buttonBlock">
							<img src={svg["arrowDown"]} alt="" />
						</div>
						<div className="interiorHud-top-left-line__text">
							{LangString(
								"components.InteriorHud.InteriorHud.6ee7d1b613d0cbb11295d0e2fb793deb",
							)}{" "}
							<br />{" "}
							{LangString(
								"components.InteriorHud.InteriorHud.c41dcbe857d3323857c529aed715b14c",
							)}
						</div>
					</div>
				</div>

				<div className="interiorHud-top-center">
					<div className="interiorHud-buttonBlock">
						<span>
							{LangString(
								"components.InteriorHud.InteriorHud.91f34a3787556da5a41a451655433ff7",
							)}
						</span>
					</div>
					<div className="interiorHud-top-center__text">
						{LangString(
							"components.InteriorHud.InteriorHud.dc8c7ed515605ce1c4ef16ef8be18c64",
						)}
					</div>

					<div className="interiorHud-buttonBlock">
						<span>
							{LangString(
								"components.InteriorHud.InteriorHud.e2097663adf60d96a81c70241536de80",
							)}
						</span>
					</div>
					<div className="interiorHud-top-center__text">
						{LangString(
							"components.InteriorHud.InteriorHud.f6f5da32095afc1c36093e906a5db8bd",
						)}
					</div>

					<div className="interiorHud-buttonBlock">
						<span>O</span>
					</div>
					<div className="interiorHud-top-center__text">
						{LangString(
							"components.InteriorHud.InteriorHud.f8d2ac139993324f4f8cadbe9685809f",
						)}{" "}
						<span>
							{LangString(
								"components.InteriorHud.InteriorHud.d1b7019bd4e0653531a14a694ab235f6",
							)}{" "}
							<br />{" "}
							{LangString(
								"components.InteriorHud.InteriorHud.d4c192b62d964ebdfd358e695e765cfb",
							)}
						</span>
					</div>
				</div>

				<div className="interiorHud-top-right">
					<div className="interiorHud-top-right-line">
						<div className="interiorHud-top-right-line__text">
							{LangString(
								"components.InteriorHud.InteriorHud.019e41d9d687e6886481ce9d0716f5a0",
							)}
						</div>
						<div className="interiorHud-buttonBlock">
							<span>N</span>
						</div>
					</div>

					<div className="interiorHud-top-right-line">
						<div className="interiorHud-top-right-line__text">
							{LangString(
								"components.InteriorHud.InteriorHud.def21b0bcea435e47dd96ed94dfc7343",
							)}
						</div>
						<div className="interiorHud-buttonBlock">
							<span>Y</span>
						</div>
					</div>
				</div>

				<div className="interiorHud-bottom-left">
					<img
						className="interiorHud-bottom-left__image"
						src={svg[`coordinate${this.store.direction.toUpperCase()}`]}
						alt=""
					/>

					<div className="interiorHud-bottom-left-block">
						<img src={png["move"]} alt="" />
						<div>
							<span>
								{LangString(
									"components.InteriorHud.InteriorHud.9d1cbef54499d4fdd335201c90b91bfb",
								)}
							</span>
							{this.store.moveType
								? LangString(
										"components.InteriorHud.InteriorHud.c4ac29235059349f613b7ef05cf08306",
									)
								: LangString(
										"components.InteriorHud.InteriorHud.27f0c8bd409774ac7e28dfd4f4045a63",
									)}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
