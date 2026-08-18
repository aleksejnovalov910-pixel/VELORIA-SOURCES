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

export class Footer extends Component<
	{
		expires: string;
		changeShowLevelBlock: Function;
		changeShowGiftBlock: Function;
		changeShowGiftLevelBlock: Function;
		everyDayExp: string;
	},
	{}
> {
	constructor(props: any) {
		super(props);
	}

	render() {
		return (
			<div className="footer">
				<div className="footer__leftText">
					<span>
						{LangString(
							"components.BattlePass.components.Footer.Footer.9d0cc81a834ab48e037979add6303ce7",
						)}
					</span>
					{this.props.expires}
				</div>

				<div
					className="footer-button"
					onClick={() => this.props.changeShowLevelBlock(true)}
				>
					<img src={svg["cart"]} alt="" className="footer-button__icon" />
					<img src={svg["star"]} alt="" className="footer-button__star" />
					<img src={svg["star"]} alt="" className="footer-button__star" />
					<img src={svg["star"]} alt="" className="footer-button__star" />
					<img src={svg["star"]} alt="" className="footer-button__star" />
					<img src={svg["star"]} alt="" className="footer-button__star" />
					<img src={svg["star"]} alt="" className="footer-button__star" />
					<img src={svg["star"]} alt="" className="footer-button__star" />
					{LangString(
						"components.BattlePass.components.Footer.Footer.a7101fad63fc089792ca267c3234abad",
					)}
				</div>

				<div
					className="footer-button footer-buttonTransparent"
					onClick={() => this.props.changeShowGiftLevelBlock(true)}
				>
					<img src={svg["gift"]} alt="" className="footer-button__icon" />
					{LangString(
						"components.BattlePass.components.Footer.Footer.132ac3c185c26e7ab8722d989334c644",
					)}
				</div>

				<div
					className="footer-button footer-buttonTransparent"
					onClick={() => this.props.changeShowGiftBlock(true)}
				>
					<img src={svg["gift"]} alt="" className="footer-button__icon" />
					{LangString(
						"components.BattlePass.components.Footer.Footer.9f318bd62725b1acec0f82815a107205",
					)}
				</div>

				<div className="footer__rightText">
					<div>
						<span>
							{LangString(
								"components.BattlePass.components.Footer.Footer.ade573dc0e3359bd1cb28cdec4771a8f",
							)}{" "}
							<br />{" "}
							{LangString(
								"components.BattlePass.components.Footer.Footer.22e0dd6e3a1b441cff131f3a4b77bdf8",
							)}
						</span>
						{this.props.everyDayExp}
					</div>
					<img src={svg["flash"]} alt="" />
				</div>
			</div>
		);
	}
}
