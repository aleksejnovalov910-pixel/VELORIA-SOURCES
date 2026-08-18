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
import { CEF } from "../../modules/CEF";

export class CasinoEnter extends Component<
	{},
	{
		component: number;
	}
> {
	constructor(props: any) {
		super(props);
		this.state = {
			component: 0,
		};
	}

	close() {
		CEF.gui.close();
	}

	changeComponent() {
		if (this.state.component === 4) return;

		this.setState({ ...this.state, component: this.state.component + 1 });
	}

	render() {
		return (
			<div className="casino">
				<img className="casino__smoke " src={png["smoke"]} alt="" />

				{this.state.component === 0 && (
					<div className="casino-content">
						<div className="casino-content-slide">
							<img
								src={svg["furtherButton"]}
								className="casino-content-slide__button"
								alt=""
								onClick={() => this.changeComponent()}
							/>
							<div>
								1{" "}
								<span>
									{LangString(
										"components.CasinoEnter.CasinoEnter.014703baff40b9aa72d253743532676e",
									)}
								</span>
							</div>
						</div>

						<div className="casino-content-information">
							<div className="casino-content-information__block">
								<img
									src={svg["welcomeImg"]}
									className="casino-content-information__block-welcomeImg"
									alt=""
								/>
							</div>
						</div>

						<div className="casino-content__line" />
					</div>
				)}

				{this.state.component === 1 && (
					<div className="casino-content">
						<div className="casino-content-slide">
							<img
								src={svg["furtherButton"]}
								className="casino-content-slide__button"
								alt=""
								onClick={() => this.changeComponent()}
							/>
							<div>
								2{" "}
								<span>
									{LangString(
										"components.CasinoEnter.CasinoEnter.08c3bab29c441bd3bd4564c8fd886a84",
									)}
								</span>
							</div>
						</div>

						<div className="casino-content-information">
							<div className="casino-content-information__name">
								{LangString(
									"components.CasinoEnter.CasinoEnter.c39600750dac94f8dff3051c1bd04d54",
								)}
							</div>

							<div className="casino-content-information__block">
								<img src={png["chipsImg"]} alt="" />
								<div>
									{LangString(
										"components.CasinoEnter.CasinoEnter.241fe31573ca9be64f06356c730bbf40",
									)}
								</div>
							</div>
						</div>

						<div className="casino-content__line" />
					</div>
				)}

				{this.state.component === 2 && (
					<div className="casino-content">
						<div className="casino-content-slide">
							<img
								src={svg["furtherButton"]}
								className="casino-content-slide__button"
								alt=""
								onClick={() => this.changeComponent()}
							/>
							<div>
								3{" "}
								<span>
									{LangString(
										"components.CasinoEnter.CasinoEnter.e278bf9299bd0195d92adabc8c7818c5",
									)}
								</span>
							</div>
						</div>

						<div className="casino-content-information">
							<div className="casino-content-information__name">
								{LangString(
									"components.CasinoEnter.CasinoEnter.6cd059dd3cbe42b18dc2804718a564f7",
								)}
							</div>

							<div className="casino-content-information__block">
								<img src={png["diceImg"]} alt="" />
								<div>
									{LangString(
										"components.CasinoEnter.CasinoEnter.9c132c7fbc964be528dc104bf402c5b1",
									)}
								</div>
							</div>
						</div>

						<div className="casino-content__line" />
					</div>
				)}

				{this.state.component === 3 && (
					<div className="casino-content">
						<div className="casino-content-slide">
							<img
								src={svg["furtherButton"]}
								className="casino-content-slide__button"
								alt=""
								onClick={() => this.changeComponent()}
							/>
							<div>
								4{" "}
								<span>
									{LangString(
										"components.CasinoEnter.CasinoEnter.ba1a41f2a43adda6e58ee499afdf19f3",
									)}
								</span>
							</div>
						</div>

						<div className="casino-content-information">
							<div className="casino-content-information__name">
								{LangString(
									"components.CasinoEnter.CasinoEnter.71ebd98989a1f382ae980afd06f9fbcf",
								)}
							</div>

							<div className="casino-content-information__block">
								<img src={png["rouletteImg"]} alt="" />
								<div>
									{LangString(
										"components.CasinoEnter.CasinoEnter.6d6ab176bbfd290043ba82714d9daa4f",
									)}
								</div>
							</div>
						</div>

						<div className="casino-content__line" />
					</div>
				)}

				{this.state.component === 4 && (
					<div className="casino-content">
						<div className="casino-content-slide">
							<img
								src={svg["closeButton"]}
								className="casino-content-slide__button"
								alt=""
								onClick={() => this.close()}
							/>
							<div>
								5{" "}
								<span>
									{LangString(
										"components.CasinoEnter.CasinoEnter.b9f7f547cda1654dace0ef30e8f82a8f",
									)}
								</span>
							</div>
						</div>

						<div className="casino-content-information">
							<div className="casino-content-information__name">
								<span>VIP</span>{" "}
								{LangString(
									"components.CasinoEnter.CasinoEnter.3e1802179816642415e539d342ad46ed",
								)}
							</div>

							<div className="casino-content-information__block">
								<img src={png["vipImg"]} alt="" />
								<div>
									{LangString(
										"components.CasinoEnter.CasinoEnter.5fcace73d1451cce90c6334aea0a6709",
									)}
								</div>
							</div>
						</div>

						<div className="casino-content__line" />
					</div>
				)}
			</div>
		);
	}
}
