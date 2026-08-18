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

import { CustomEventHandler } from "../../../../../shared/custom.event";
import { CustomEvent } from "../../../../modules/custom.event";
import { PurchaseDTO } from "../../../../../shared/battlePass/DTOs";

export class Enter extends Component<
	{
		changeShowBlock: Function;
		changeDiscountActiveState: Function;
		setCoins: Function;
		setComponent: Function;
	},
	{
		discountActive: boolean;
		expires: number;
		price: number;
		discountPrice: number;
	}
> {
	ev: CustomEventHandler;
	interval: number;

	constructor(props: any) {
		super(props);

		this.state = {
			discountActive: true,
			price: 300,
			expires: 10,
			discountPrice: 200,
		};

		this.ev = CustomEvent.register(
			"battlePass:purchase",
			(DTO: PurchaseDTO) => {
				this.props.changeDiscountActiveState(DTO.discountActive);
				this.props.setCoins(DTO.coins);
				if (DTO.discountActive) {
					this.setState({
						discountActive: true,
						price: DTO.price,
						expires: DTO.expires,
						discountPrice: DTO.discountPrice,
					});
				} else {
					this.setState({
						discountActive: false,
						price: DTO.price,
					});
				}
			},
		);

		this.interval = setInterval(() => {
			if (this.state.expires <= 0) return;
			if (this.state.discountActive && this.state.expires === 1) {
				this.setState({
					...this.state,
					discountActive: false,
					expires: this.state.expires - 1,
				});
			} else {
				this.setState({ ...this.state, expires: this.state.expires - 1 });
			}
		}, 1000);
	}

	convertSecondsToTime(seconds: number): string {
		if (seconds > 86400) {
			const days: number = Math.trunc(seconds / 86400);
			let word: string = LangString(
				"components.BattlePass.Pages.Enter.Enter.fa04a928782809f020fe097948541b4b",
			);
			if (days === 1)
				word = LangString(
					"components.BattlePass.Pages.Enter.Enter.a4e4fd2df78e166c47d8c13af0310b75",
				);
			if (days >= 2 && days <= 4)
				word = LangString(
					"components.BattlePass.Pages.Enter.Enter.0ff10bd79afe9a25747b722d24e926af",
				);
			return `${days} ${word}`;
		} else {
			return new Date(seconds * 1000).toISOString().substr(11, 8);
		}
	}

	componentWillUnmount() {
		if (this.ev) this.ev.destroy();
		if (this.interval) clearInterval(this.interval);
	}

	render() {
		return (
			<div className="enter">
				{/*<img src={png["star"]} alt="" className="enter__star"/>*/}
				<img src={png["background"]} className="enter__background" alt="" />

				{/*<img src={png["rightImage"]}  className="enter__right-image" alt=""/>*/}
				{/*<img src={png["leftImage"]}  className="enter__left-image" alt=""/>*/}
				<img src={png["summerEdition"]} className="enter__summer" alt="" />

				{/* <div className="enter__title">
                    Battle Pass
                </div>*/}

				<div className="enter__text">
					{LangString(
						"components.BattlePass.Pages.Enter.Enter.20a34514ea816a097e9e7c032994c09a",
					)}
					<div />
					{LangString(
						"components.BattlePass.Pages.Enter.Enter.ce3071ad8f05ad9f1deb3033382246f2",
					)}
				</div>

				{/*<img src={png["leprechaun"]} className="enter__leprechaun" alt=""/>*/}

				<div className="enter-bottom">
					<div className="enter-bottom__text">
						<span>
							{LangString(
								"components.BattlePass.Pages.Enter.Enter.f08716efe23198cfeb2e0b915481cc78",
							)}
						</span>
						{LangString(
							"components.BattlePass.Pages.Enter.Enter.07cb1965ffe5827c18b31199c0b390aa",
						)}
					</div>

					{this.state.discountActive && (
						<>
							<div className="enter-bottom-time">
								<img src={svg["time"]} alt="" />
								<div className="enter-bottom-time__text">
									{LangString(
										"components.BattlePass.Pages.Enter.Enter.7bc94c9053be4c8e07af9c0b58e5dfbe",
									)}
									<span>{this.convertSecondsToTime(this.state.expires)}</span>
								</div>
							</div>

							<div className="enter-bottom__line" />
						</>
					)}

					<div className="enter-bottom-price">
						<img src={svg["coin"]} alt="" />
						{this.state.discountActive
							? this.state.discountPrice
							: this.state.price}
						{this.state.discountActive && (
							<div className="enter-bottom-price__through">
								<img src={svg["coin"]} alt="" />
								{this.state.price}
							</div>
						)}
					</div>

					{/* <div className="footer-button" onClick={() => CustomEvent.triggerServer("battlePass:buy")}>
                    <img src={svg["cart"]} alt="" className="footer-button__icon"/>
                    <img src={svg["star"]} alt="" className="footer-button__star"/>
                    <img src={svg["star"]} alt="" className="footer-button__star"/>
                    <img src={svg["star"]} alt="" className="footer-button__star"/>
                    <img src={svg["star"]} alt="" className="footer-button__star"/>
                    <img src={svg["star"]} alt="" className="footer-button__star"/>
                    <img src={svg["star"]} alt="" className="footer-button__star"/>
                    <img src={svg["star"]} alt="" className="footer-button__star"/>
                    <img src={svg["star"]} alt="" className="footer-button__star"/>
                    <img src={svg["star"]} alt="" className="footer-button__star"/>
                    <img src={svg["star"]} alt="" className="footer-button__star"/>
                    {LangString("components.BattlePass.Pages.Enter.Enter.9bd0e47ca2564acd1b778b9d4933be63")}
                </div> */}

					<div
						className="footer-button footer-buttonTransparent"
						onClick={() => this.props.changeShowBlock(true)}
					>
						<img src={svg["gift"]} alt="" className="footer-button__icon" />
						{LangString(
							"components.BattlePass.Pages.Enter.Enter.6df750cdeccb01600d598968d37abb09",
						)}
					</div>

					<div
						className="footer-button footer-buttonTransparent"
						onClick={() => this.props.setComponent("purchase-storage")}
					>
						<img src={svg["package"]} alt="" />
					</div>
				</div>
			</div>
		);
	}
}
