import { LangString } from "../../../../../../../../modules/lang";
import React, { Component, CSSProperties } from "react";
import "./style.less";

const svg = Object.fromEntries(
	Object.entries(import.meta.glob("./assets/*.svg", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.svg$/)[1];
			return [name, value.default];
		},
	),
);
import { ITakeMenu } from "../../../../../../../../../shared/battlePass/DTOs";
import { RewardRarity } from "../../../../../../../../../shared/battlePass/rewards";
import { CustomEvent } from "../../../../../../../../modules/custom.event";

export class BuyMenu extends Component<
	{
		styles: CSSProperties;
		data: ITakeMenu;
	},
	{}
> {
	constructor(props: any) {
		super(props);
	}

	buttonTake(): boolean {
		if (!this.props.data.isOpened) return false;
		return this.props.data.canTake;
	}

	render() {
		return (
			<div
				className="buyMenu"
				style={this.props.styles}
				onClick={() => CustomEvent.trigger("battlePass:closeTakeMenu")}
			>
				{!this.props.data.isOpened && (
					<div className="buyMenu__close">
						<img src={svg["lock"]} alt="" />
						{LangString(
							"components.BattlePass.Pages.Main.components.List.components.BuyMenu.BuyMenu.93e11045ec447bbcbf43ef25184471ea",
						)}
					</div>
				)}

				<div className="buyMenu__name">
					<span style={{ fontFamily: "Gilroy ExtraBold" }}>
						{this.props.data.name}
					</span>
				</div>

				{this.props.data.rarity === RewardRarity.LEGENDARY && (
					<div className="buyMenu-rarity buyMenu-rarity__orange">
						<img src={svg["orangeStar"]} alt="" />
						{LangString(
							"components.BattlePass.Pages.Main.components.List.components.BuyMenu.BuyMenu.297b697a17becdf6f592e922659be6bd",
						)}
					</div>
				)}

				{this.props.data.rarity === RewardRarity.COMMON && (
					<div className="buyMenu-rarity buyMenu-rarity__blue">
						<img src={svg["blueStar"]} alt="" />
						{LangString(
							"components.BattlePass.Pages.Main.components.List.components.BuyMenu.BuyMenu.dd805063c530bc549add4c6368bc1b3e",
						)}
					</div>
				)}

				{this.props.data.rarity === RewardRarity.RARE && (
					<div className="buyMenu-rarity buyMenu-rarity__purple">
						<img src={svg["purpleStar"]} alt="" />
						{LangString(
							"components.BattlePass.Pages.Main.components.List.components.BuyMenu.BuyMenu.21fa689d2b38881bbc64a5b706e138ec",
						)}
					</div>
				)}

				{!this.props.data.isOpened && (
					<div className="buyMenu-rarity buyMenu-rarity__gray">
						<img src={svg["grayStar"]} alt="" />
						{LangString(
							"components.BattlePass.Pages.Main.components.List.components.BuyMenu.BuyMenu.86bb25298eca5767c21517b7c3e8228c",
						)}
					</div>
				)}

				{this.buttonTake() && (
					<div
						className="buyMenu-button"
						onClick={() =>
							CustomEvent.triggerServer(
								"battlePass:takeReward",
								this.props.data.level,
							)
						}
					>
						{LangString(
							"components.BattlePass.Pages.Main.components.List.components.BuyMenu.BuyMenu.f9d6fbbfc09fe3802fa0c2a6b51b9e55",
						)}
					</div>
				)}
			</div>
		);
	}
}
