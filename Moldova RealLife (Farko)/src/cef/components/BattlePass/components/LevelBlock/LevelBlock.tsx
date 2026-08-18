import { LangString } from "../../../../modules/lang";
import React, { Component } from "react";
import "../GiftBlock/style.less";

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
import { BATTLE_PASS_SEASON } from "../../../../../shared/battlePass/main";
import { CustomEvent } from "../../../../modules/custom.event";

export class LevelBlock extends Component<
	{
		changeShowBlock: Function;
		coins: number;
	},
	{
		levels: number;
	}
> {
	constructor(props: any) {
		super(props);

		this.state = {
			levels: 1,
		};
	}

	changeLevels(toggle: boolean, count: number) {
		if (toggle) {
			if (this.state.levels + count > 1000) return;
			this.setState({ ...this.state, levels: this.state.levels + count });
		} else {
			if (this.state.levels - count < 1) return;
			this.setState({ ...this.state, levels: this.state.levels - count });
		}
	}

	buyLevels() {
		CustomEvent.triggerServer("battlePass:buyLevels", this.state.levels);
		this.props.changeShowBlock(false);
	}

	render() {
		return (
			<div className="giftBlock">
				<div className="giftBlock-body">
					<div className="giftBlock-body__balance">
						{LangString(
							"components.BattlePass.components.LevelBlock.LevelBlock.bfbe71faafb2f466605058e572477067",
						)}
						<img src={svg["coin"]} alt="" />
						<span>{this.props.coins}</span>
					</div>

					<div className="giftBlock-body-block">
						<img
							src={png["starImage"]}
							className="giftBlock-body-block__logo2"
							alt=""
						/>

						<div
							className="giftBlock-body-block__close"
							onClick={() => this.props.changeShowBlock(false)}
						>
							<img src={svg["closeIcon"]} alt="" />
						</div>

						<div className="giftBlock-body-block__title">
							{LangString(
								"components.BattlePass.components.LevelBlock.LevelBlock.3fe1dd06ae0fb84f7bc71600fec70bcd",
							)}
						</div>

						<div className="giftBlock-body-block__text">
							{LangString(
								"components.BattlePass.components.LevelBlock.LevelBlock.9f55af7e89d3f1b457d934c172f32768",
							)}
						</div>

						{/*<input type="number" placeholder="Введи ID друга"/>*/}

						<div className="giftBlock-body-block-level">
							<div
								className="giftBlock-body-block-level__button"
								onClick={() => this.changeLevels(false, 10)}
							>
								-10
							</div>

							<div className="giftBlock-body-block-level-bar">
								<div
									className="giftBlock-body-block-level__button"
									onClick={() => this.changeLevels(false, 1)}
								>
									-
								</div>
								<span>{this.state.levels}</span>
								<div
									className="giftBlock-body-block-level__button"
									onClick={() => this.changeLevels(true, 1)}
								>
									+
								</div>
							</div>

							<div
								className="giftBlock-body-block-level__button"
								onClick={() => this.changeLevels(true, 10)}
							>
								{LangString(
									"components.BattlePass.components.LevelBlock.LevelBlock.c8f3bdb47d38e90b879d49cd0ae10b51",
								)}
							</div>
						</div>

						<div className="enter-bottom-price">
							<img src={svg["coin"]} alt="" />
							{BATTLE_PASS_SEASON.levelPrice * this.state.levels}
							{/*<div className="enter-bottom-price__through">*/}
							{/*    <img src={svg["coin"]} alt=""/>*/}
							{/*    300*/}
							{/*</div>*/}
						</div>

						<div
							className="giftBlock-body-block__button"
							onClick={() => this.buyLevels()}
						>
							<img src={svg["cart"]} alt="" />
							{LangString(
								"components.BattlePass.components.LevelBlock.LevelBlock.041490c88c1bb1847cc900387db6b1f7",
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
