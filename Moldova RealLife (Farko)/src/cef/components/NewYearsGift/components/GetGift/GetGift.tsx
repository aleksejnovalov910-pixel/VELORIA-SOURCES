import { LangString } from "../../../../modules/lang";
import React, { Component } from "react";
import "../../style.less";
const iconsInventoryItems = Object.fromEntries(
	Object.entries(
		import.meta.glob("../../../../../shared/icons/*.png", { eager: true }),
	).map(([key, value]) => {
		const name = key.match(/\/([^/]+)\.png$/)[1];
		return [name, value.default];
	}),
);

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
import { CustomEventHandler } from "../../../../../shared/custom.event";
import { CEF } from "../../../../modules/CEF";

export class GetGift extends Component<
	{},
	{
		items: [number, string][];
	}
> {
	private _ev: CustomEventHandler;

	constructor(props: any) {
		super(props);

		this.state = {
			items: [
				[2, "descr"],
				[4, "descr"],
				[6, "descr"],
			],
		};

		this._ev = CustomEvent.register(
			"newYearsGift:setGifts",
			(data: [number, string][]) => {
				this.setState({
					items: data,
				});
			},
		);
	}

	public componentWillUnmount() {
		this._ev?.destroy;
	}

	public onButtonPressed(): void {
		if (this.state.items.length == 1) {
			CEF.gui.setGui(null);
			CustomEvent.triggerServer("newYearsGift:get");
		}

		const items = this.state.items;
		items.pop();

		this.setState({
			items: items,
		});
	}

	render() {
		return (
			<div className="giftGet">
				<img
					src={
						this.state.items.length === 1
							? png["oneLetter"]
							: png["manyLetters"]
					}
					alt=""
					className="giftGet__background"
				/>

				<div className="giftGet-block">
					<div className="giftGet__text">
						{this.state.items[this.state.items.length - 1][1]}
					</div>

					<div className="giftGet-item">
						<img
							src={png["itemBackground"]}
							alt=""
							className="giftGet-item__background"
						/>

						<img
							src={
								iconsInventoryItems[
									`Item_${this.state.items[this.state.items.length - 1][0]}`
								]
							}
							alt=""
							className="giftGet-item__item"
						/>
					</div>
				</div>

				<div
					className="giftGet__button"
					onClick={() => {
						this.onButtonPressed();
					}}
				>
					<img src={svg["button"]} alt="" />

					<span>
						{this.state.items.length === 1
							? LangString(
									"components.NewYearsGift.components.GetGift.GetGift.9171ee0eff82ec6191221b714afdf840",
								)
							: LangString(
									"components.NewYearsGift.components.GetGift.GetGift.b63c9d7d1fdf9fc55deccc31a87e51f9",
								)}
					</span>
				</div>
			</div>
		);
	}
}
