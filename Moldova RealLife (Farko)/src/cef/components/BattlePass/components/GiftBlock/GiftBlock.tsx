import { LangString } from "../../../../modules/lang";
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
import { BATTLE_PASS_SEASON } from "../../../../../shared/battlePass/main";
import { CustomEvent } from "../../../../modules/custom.event";

export class GiftBlock extends Component<
	{
		changeShowBlock: Function;
		coins: number;
		discountActive: boolean;
	},
	{}
> {
	ref: React.RefObject<any> = React.createRef();

	constructor(props: any) {
		super(props);
	}

	sendPresent() {
		const value = this.ref.current.value;
		if (value === "") return;
		if (value.length > 7) return;

		CustomEvent.triggerServer("battlePass:sendGiftPass", Number(value));
		this.props.changeShowBlock(false);
	}

	render() {
		return (
			<div className="giftBlock">
				<div className="giftBlock-body">
					<div className="giftBlock-body__balance">
						{LangString(
							"components.BattlePass.components.GiftBlock.GiftBlock.94a90665e568c69ace4a8f0c5d26746c",
						)}
						<img src={svg["coin"]} alt="" />
						<span>{this.props.coins}</span>
					</div>

					<div className="giftBlock-body-block">
						<img
							src={png["caseImage"]}
							className="giftBlock-body-block__logo3"
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
								"components.BattlePass.components.GiftBlock.GiftBlock.83f135432d2ec9e0c67f18f4e5830410",
							)}
						</div>

						<div className="giftBlock-body-block__text">
							{LangString(
								"components.BattlePass.components.GiftBlock.GiftBlock.bf1473d65fb4a5cc240507d5b0025f14",
							)}
						</div>

						<input
							type="number"
							placeholder={LangString(
								"components.BattlePass.components.GiftBlock.GiftBlock.44a18068df0aad4124d187dd1181e098",
							)}
							ref={this.ref}
						/>

						{
							<div className="enter-bottom-price">
								<img src={svg["coin"]} alt="" />
								{this.props.discountActive
									? BATTLE_PASS_SEASON.discount.specialPrice
									: BATTLE_PASS_SEASON.battlePassCost}
								{this.props.discountActive && (
									<div className="enter-bottom-price__through">
										<img src={svg["coin"]} alt="" />
										{BATTLE_PASS_SEASON.battlePassCost}
									</div>
								)}
							</div>
						}

						<div
							className="giftBlock-body-block__button"
							onClick={() => this.sendPresent()}
						>
							<img src={svg["gift"]} alt="" />
							{LangString(
								"components.BattlePass.components.GiftBlock.GiftBlock.257066446b05123be053ea04c46090b8",
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
