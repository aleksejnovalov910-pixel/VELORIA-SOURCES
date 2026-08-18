import { LangString } from "../../../../modules/lang";
import React, { Component } from "react";
import "../../style.less";

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
import { CEF } from "../../../../modules/CEF";
import { inventoryShared } from "../../../../../shared/inventory";
const iconsInventoryItems = Object.fromEntries(
	Object.entries(
		import.meta.glob("../../../../../shared/icons/*.png", { eager: true }),
	).map(([key, value]) => {
		const name = key.match(/\/([^/]+)\.png$/)[1];
		return [name, value.default];
	}),
);
import { CustomEventHandler } from "../../../../../shared/custom.event";
import { CustomEvent } from "../../../../modules/custom.event";

export class SendGift extends Component<
	{},
	{
		letterText: string;
		letterLength: number;
		idLength: number;
		userId: number;
		inventoryItemsIds: [number, number][];
		selectedItemId: number;
	}
> {
	private _ev: CustomEventHandler;

	constructor(props: any) {
		super(props);

		this.state = {
			letterText: "",
			selectedItemId: 3,
			letterLength: 0,
			userId: 0,
			idLength: 0,
			inventoryItemsIds: CEF.test
				? [
						[1, 1],
						[2, 1],
						[4, 1],
						[6, 12],
					]
				: [],
		};

		this._ev = CustomEvent.register(
			"newYearGift:setInventoryData",
			(data: [number, number][]) => {
				this.setState({
					inventoryItemsIds: data,
				});
			},
		);
	}

	public componentWillUnmount() {
		this._ev?.destroy();
	}

	updateLetter(val: string, len: number) {
		this.setState({
			...this.state,
			letterLength: len,
			letterText: val,
		});
	}

	send() {
		if (isNaN(this.state.userId) || this.state.userId == 0) {
			return CEF.alert.setAlert(
				"warning",
				LangString(
					"components.NewYearsGift.components.SendGift.SendGift.a116ccb3e11b0e36660487725d64f0c4",
				),
			);
		}

		if (isNaN(this.state.selectedItemId) || this.state.selectedItemId <= 0) {
			return CEF.alert.setAlert(
				"warning",
				LangString(
					"components.NewYearsGift.components.SendGift.SendGift.e39e554e1766a6d8a4736ae39da3aca1",
				),
			);
		}

		CustomEvent.triggerServer(
			"newYearsGift:send",
			this.state.selectedItemId,
			this.state.userId,
		);
	}

	updateUserId(value: number, len: number) {
		this.setState({
			...this.state,
			idLength: len,
			userId: value,
		});
	}

	renderInventoryItems() {
		const items = [];

		this.state.inventoryItemsIds.forEach((i) => {
			const item = inventoryShared.get(i[0]);

			items.push(
				<div
					className="giftSend-right-inventory__slot"
					onClick={() => {
						this.setState({
							selectedItemId: item.item_id,
						});
					}}
				>
					<img src={iconsInventoryItems[`Item_${item.item_id}`]} alt="" />
					<span>{i[1]}</span>
				</div>,
			);
		});

		const totalEmptyItems = 25 - items.length;

		if (totalEmptyItems > 0) {
			for (let i = 0; i < totalEmptyItems; i++) {
				items.push(<div className="giftSend-right-inventory__slot" />);
			}
		}

		return items;
	}

	render() {
		return (
			<div className="giftSend">
				<div className="giftSend-left">
					<img
						src={png["background"]}
						alt=""
						className="giftSend-left__background"
					/>

					<textarea
						wrap="soft"
						onChange={(event) =>
							this.updateLetter(event.target.value, event.target.value.length)
						}
						maxLength={130}
						placeholder={LangString(
							"components.NewYearsGift.components.SendGift.SendGift.53bae69f60e5ac2e7048f9535fbdafd5",
						)}
						className="giftSend-left__text"
					/>

					<div className="giftSend-left__maxLength">
						{this.state.letterLength}
						{LangString(
							"components.NewYearsGift.components.SendGift.SendGift.b740aef3aa3379e3ac79050d47a2bab1",
						)}
					</div>

					<div className="giftSend-left__itemSlot">
						<img
							src={iconsInventoryItems[`Item_${this.state.selectedItemId}`]}
							alt=""
						/>
					</div>

					<div className="giftSend-left-address">
						<div className="giftSend-left-address-input">
							<img src={svg["input"]} alt="" />

							<input
								type="number"
								maxLength={7}
								onChange={(event) =>
									this.updateUserId(
										event.target.valueAsNumber,
										event.target.value.length,
									)
								}
								placeholder={LangString(
									"components.NewYearsGift.components.SendGift.SendGift.661f0c1c7ad3815c137d6d00502b34f6",
								)}
								name=""
								id=""
							/>
						</div>

						<div
							className="giftSend-left-address-button"
							onClick={() => this.send()}
						>
							<img
								src={
									this.state.idLength === 0 ? svg["buttonGray"] : svg["button"]
								}
								className={`giftSend-left-address-button__background
                            ${this.state.idLength !== 0 ? "giftSend__active" : null}`}
								alt=""
							/>

							<img
								src={svg["box"]}
								className="giftSend-left-address-button__box"
								alt=""
							/>

							<span>
								{LangString(
									"components.NewYearsGift.components.SendGift.SendGift.47b112ea3d866170e644970eb9ec9f23",
								)}
							</span>
						</div>
					</div>
				</div>

				<div className="giftSend-right">
					<div className="giftSend-right__title">
						{LangString(
							"components.NewYearsGift.components.SendGift.SendGift.7f877b3f7a7661a9a7cc4618f5815d20",
						)}
					</div>

					<div className="giftSend-right-inventory">
						{this.renderInventoryItems()}
					</div>
				</div>
			</div>
		);
	}
}
