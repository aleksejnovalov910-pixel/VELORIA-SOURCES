import { LangString } from "../../../../../../modules/lang";
import React, { Component } from "react";
import "./success-transaction-component.less";
const png = Object.fromEntries(
	Object.entries(
		import.meta.glob("../../../../../assets/*.png", { eager: true }),
	).map(([key, value]) => {
		const name = key.match(/\/([^/]+)\.png$/)[1];
		return [name, value.default];
	}),
);
import { BankPages } from "../../enums/bankPages.enum";

export class SuccessTransactionComponent extends Component<
	{
		transactionAmount: number;
		onPageChange: any;
	},
	{}
> {
	constructor(props: any) {
		super(props);
		this.format = this.format.bind(this);
	}
	format(s: string | number, blockWidth: number = 4) {
		let v = s.toString().replace(/[^\d0-9]/g, ""),
			reg = new RegExp(`.{${blockWidth}}`, "g");
		if (blockWidth === 3) {
			return `${v.substr(0, v.length % blockWidth)} ${v
				.substr(v.length % blockWidth, v.length)
				.replace(reg, function (a) {
					return `${a} `;
				})}`;
		} else {
			return v.replace(reg, function (a) {
				return `${a} `;
			});
		}
	}
	render() {
		return (
			<div className="np-success-transaction">
				<img
					className="np-success-transaction-bg"
					src={png["success-transaction-bg"]}
					alt=""
				/>
				<div className="np-success-transaction-info">
					<div className="np-success-transaction-title">
						{LangString(
							"components.new-phone.components.bank-page.components.success-component.success-transaction-component.301af1f5868fe0f92afa39f4f9cbae4c",
						)}
					</div>
					<div className="np-success-transaction-amount">
						$ {this.format(this.props.transactionAmount, 3)}
					</div>
				</div>
				<button
					className="np-new-transaction-confirm"
					onClick={() => this.props.onPageChange(BankPages.MAIN)}
				>
					{LangString(
						"components.new-phone.components.bank-page.components.success-component.success-transaction-component.40a1c5492aa9c4237aeb2899b7035499",
					)}
				</button>
			</div>
		);
	}
}
