import { LangString } from "../../../../../../modules/lang";
import React, { Component, CSSProperties } from "react";
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
const items = Object.fromEntries(
	Object.entries(import.meta.glob("./assets/items/*.png", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.png$/)[1];
			return [name, value.default];
		},
	),
);
import { BATTLE_PASS_SEASON } from "../../../../../../../shared/battlePass/main";
import {
	BaseReward,
	ClothReward,
	RewardRarity,
	RewardType,
} from "../../../../../../../shared/battlePass/rewards";
import { BuyMenu } from "./components/BuyMenu";
import { ITakeMenu } from "../../../../../../../shared/battlePass/DTOs";
import { CustomEventHandler } from "../../../../../../../shared/custom.event";
import { CustomEvent } from "../../../../../../modules/custom.event";
import { CEF } from "../../../../../../modules/CEF";

export class List extends Component<
	{
		receivedRewards: number[];
		exp: number;
	},
	{
		currentPage: number;
		styles: CSSProperties;
		takeMenuData: ITakeMenu;
		isMale: boolean;
	}
> {
	ev: CustomEventHandler;

	constructor(props: any) {
		super(props);

		this.state = {
			currentPage: 0,
			styles: {
				display: "none",
				position: "absolute",
				left: "0px",
				right: "0px",
			},
			takeMenuData: {
				isOpened: false,
				rarity: RewardRarity.RARE,
				canTake: false,
				name: LangString(
					"components.BattlePass.Pages.Main.components.List.List.02bbb5fefc6a088635572f795dfa46e3",
				),
				level: 228,
			},
			isMale: true,
		};

		this.ev = CustomEvent.register("battlePass:closeTakeMenu", () =>
			this.closeTakeMenu(),
		);
	}

	async setGender() {
		this.setState({ ...this.state, isMale: await CEF.user.getIsMale() });
	}

	componentDidMount() {
		this.setGender();
	}

	componentWillUnmount() {
		this.ev.destroy();
	}

	changePage(toggle: boolean) {
		let index = this.state.currentPage;
		if (toggle) {
			if (index === Math.ceil(BATTLE_PASS_SEASON.rewards.length / 6) - 1) {
				index = 0;
			} else {
				index++;
			}
		} else {
			if (index === 0) {
				index = Math.ceil(BATTLE_PASS_SEASON.rewards.length / 6) - 1;
			} else {
				index--;
			}
		}

		this.setState({ ...this.state, currentPage: index });
	}

	backgroundByRarity(rarity: RewardRarity) {
		if (rarity === RewardRarity.LEGENDARY) {
			return "orangeStarBackground";
		} else if (rarity === RewardRarity.RARE) {
			return "purpleStarBackground";
		} else {
			return "blueStarBackground";
		}
	}

	starByRarity(rarity: RewardRarity) {
		if (rarity === RewardRarity.LEGENDARY) {
			return "orangeStar";
		} else if (rarity === RewardRarity.RARE) {
			return "purpleStar";
		} else {
			return "blueStar";
		}
	}

	showMenu(
		event: React.MouseEvent<HTMLDivElement, MouseEvent>,
		level: number,
		rarity: RewardRarity,
		name: string,
	) {
		this.setState({
			...this.state,
			styles: {
				display: "block",
				position: "absolute",
				left: `${event.screenX}px`,
				top: `${event.screenY}px`,
			},
			takeMenuData: {
				canTake:
					this.props.receivedRewards.find((el) => el === level) === undefined,
				rarity: rarity,
				name,
				isOpened:
					Math.trunc(this.props.exp / BATTLE_PASS_SEASON.levelExp) >= level + 1,
				level: level,
			},
		});
	}

	closeTakeMenu() {
		this.setState({
			...this.state,
			styles: {
				display: "none",
				position: "absolute",
				left: "0px",
				top: "0px",
			},
		});
	}

	getImage(el: BaseReward) {
		if (el.type !== RewardType.CLOTH)
			return (
				<img
					src={items[el.image]}
					className="main-list-block-item__itemImage"
					alt=""
				/>
			);

		if (this.state.isMale) {
			return (
				<img
					src={items[(el as ClothReward).maleImage]}
					className="main-list-block-item__itemImage"
					alt=""
				/>
			);
		} else {
			return (
				<img
					src={items[(el as ClothReward).femaleImage]}
					className="main-list-block-item__itemImage"
					alt=""
				/>
			);
		}
	}

	render() {
		return (
			<>
				<BuyMenu styles={this.state.styles} data={this.state.takeMenuData} />

				<div className="main-list">
					<div
						className="main-list__button"
						onClick={() => this.changePage(false)}
					>
						<img src={svg["arrowLeft"]} alt="" />
					</div>

					<div
						className="main-list__button main-list__buttonRight"
						onClick={() => this.changePage(true)}
					>
						<img src={svg["arrowRight"]} alt="" />
					</div>

					{BATTLE_PASS_SEASON.rewards.map((el, i) => {
						if (
							i < this.state.currentPage * 6 ||
							i > this.state.currentPage * 6 + 5
						)
							return null;

						return (
							<div
								className={`main-list-block ${i % 2 ? "main-list-block-even" : null}
                        ${Math.trunc(this.props.exp / BATTLE_PASS_SEASON.levelExp) >= i + 1 ? "main-list-block-active" : null}`}
								key={i}
							>
								{i !== BATTLE_PASS_SEASON.rewards.length - 1 && (
									<>
										<img
											src={svg["topArrow"]}
											className={"main-list-block__topArrow"}
											alt=""
										/>
										<img
											src={svg["topArrowOrange"]}
											className={
												"main-list-block__topArrow main-list-block__topArrow-orange"
											}
											alt=""
										/>
									</>
								)}

								<div
									className="main-list-block-item"
									onClick={(event) =>
										this.showMenu(event, i, el.rarity, el.name)
									}
								>
									<img
										src={png[this.backgroundByRarity(el.rarity)]}
										className="main-list-block-item__background"
										alt=""
									/>

									{this.props.receivedRewards.find((el) => el === i) !==
										undefined && (
										<div className="main-list-block-item__checkmark">
											<div>
												<img src={svg["checkmark"]} alt="" />
											</div>
											<span>
												{LangString(
													"components.BattlePass.Pages.Main.components.List.List.35b6b40b23d02060dec26fc89e8b1173",
												)}
											</span>
										</div>
									)}
									{this.getImage(el)}

									<img
										src={svg["bottom"]}
										className="main-list-block-item__bottom"
										alt=""
									/>

									<img
										src={svg[this.starByRarity(el.rarity)]}
										alt=""
										className="main-list-block-item__star"
									/>

									<div className="main-list-block-item__level">{i + 1}</div>
								</div>

								{i !== BATTLE_PASS_SEASON.rewards.length - 1 && (
									<>
										<img
											src={svg["bottomArrow"]}
											className={"main-list-block__bottomArrow"}
											alt=""
										/>
										<img
											src={svg["bottomArrowOrange"]}
											className={
												"main-list-block__bottomArrow main-list-block__bottomArrow-orange"
											}
											alt=""
										/>
									</>
								)}
							</div>
						);
					})}
				</div>
			</>
		);
	}
}
