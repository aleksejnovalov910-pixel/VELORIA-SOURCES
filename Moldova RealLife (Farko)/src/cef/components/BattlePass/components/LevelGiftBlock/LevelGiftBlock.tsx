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
import { CustomEvent } from "../../../../modules/custom.event";
import { BATTLE_PASS_SEASON } from "../../../../../shared/battlePass/main";

export class LevelGiftBlock extends Component<
	{
		changeShowBlock: Function;
		coins: number;
	},
	{
		levels: number;
	}
> {
	ref: React.RefObject<any> = React.createRef();

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

	send() {
		const value = this.ref.current.value;
		if (value === "") return;
		if (value.length > 7) return;
		this.props.changeShowBlock(false);
		CustomEvent.triggerServer(
			"battlePass:sendGiftLevels",
			Number(value),
			this.state.levels,
		);
	}

	render() {
		return (
			<div className="giftBlock">
				<div className="giftBlock-body">
					<div className="giftBlock-body__balance">
						{LangString(
							"components.BattlePass.components.LevelGiftBlock.LevelGiftBlock.7b0516ee76e0094e446a3d6f6fd73357",
						)}
						<img src={svg["coin"]} alt="" />
						<span> {this.props.coins}</span>
					</div>

					<div className="giftBlock-body-block">
						<img
							src={png["starImage"]}
							className="giftBlock-body-block__logo"
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
								"components.BattlePass.components.LevelGiftBlock.LevelGiftBlock.c24c4e3505f88b2ed19c1f017ef8d892",
							)}
						</div>

						<div className="giftBlock-body-block__text">
							{LangString(
								"components.BattlePass.components.LevelGiftBlock.LevelGiftBlock.3a31d8a3be8faf3b988d20fe6bc75abe",
							)}
						</div>

						<input
							type="number"
							placeholder={LangString(
								"components.BattlePass.components.LevelGiftBlock.LevelGiftBlock.a7ced7244c276ee4ae4a9232347f5e84",
							)}
							ref={this.ref}
						/>

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
								<span>
									{this.state.levels}{" "}
									{LangString(
										"components.BattlePass.components.LevelGiftBlock.LevelGiftBlock.2b3b59f04d8ed6accad90bdc325a4164",
									)}
								</span>
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
									"components.BattlePass.components.LevelGiftBlock.LevelGiftBlock.829b7889072ee3de91864b35b8cd093b",
								)}
							</div>
						</div>

						<div className="enter-bottom-price">
							<img src={svg["coin"]} alt="" />
							{this.state.levels * BATTLE_PASS_SEASON.levelPrice}
							{/*<div className="enter-bottom-price__through">*/}
							{/*    <img src={svg["coin"]} alt=""/>*/}
							{/*    300*/}
							{/*</div>*/}
						</div>

						<div
							className="giftBlock-body-block__button"
							onClick={() => this.send()}
						>
							<img src={svg["gift"]} alt="" />
							{LangString(
								"components.BattlePass.components.LevelGiftBlock.LevelGiftBlock.3330df1f7242fcf143f398c7feef783c",
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
