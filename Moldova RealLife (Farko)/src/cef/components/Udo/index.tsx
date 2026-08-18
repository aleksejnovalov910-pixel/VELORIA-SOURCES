import { LangString } from "../../modules/lang";
import React from "react";
import "./assets/style.less";
import Draggable from "react-draggable";
import { UdoData, UdoTypeBase } from "../../../shared/licence";
const udoIcon = Object.fromEntries(
	Object.entries(import.meta.glob("./assets/*.png", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.png$/)[1];
			return [name, value.default];
		},
	),
);
import { CustomEvent } from "../../modules/custom.event";
import close from "../HudBlock/images/svg/close.svg";
import { CEF } from "../../modules/CEF";
import { fractionCfg } from "../../modules/fractions";

interface UdoType extends UdoTypeBase {
	close?: () => any;
}

export class UdoBlock extends React.Component<
	{},
	{
		items: UdoType[];
	}
> {
	constructor(props: any) {
		super(props);
		this.state = {
			items: [
				// {player:"test name", fraction:2, rank:1, tag:"test tag", user:1},
				// {player:"test name", fraction:1, rank:1, tag:"test tag", user:2},
			],
		};

		CustomEvent.register("udo:show", (data: UdoType) => {
			const items = [...this.state.items];
			items.push(data);
			this.setState({ items });
		});
	}


	render() {
		return (
			<>
				{this.state.items.map((item, index) => {
					return (
						<UdoItem
							key={index}
							user={item.user}
							tag={item.tag}
							player={item.player}
							fraction={item.fraction}
							rank={item.rank}
							close={() => {
								const items = [...this.state.items];
								items.splice(index, 1);
								this.setState({ ...this.state, items });
							}}
						/>
					);
				})}
			</>
		);
	}
}

export class UdoItem extends React.Component<UdoType, { isDrag: boolean }> {
	constructor(props: any) {
		super(props);
		this.state = {
			isDrag: true,
		};
	}
	closeClick = () => {
		this.props.close();
	};

	getUdoCfg = () => {
		return UdoData.find((q) => q.id === this.props.fraction);
	};

	escClick = (event: any) => {
		if (event.keyCode === 27) this.closeClick();
	};

	getImage() {
		return CEF.getPassportImageURL(`${this.props.user}_passport`)
	}

	// get image() {
	// 	return CEF.getSignatureURL(`idcard_${this.props.user}`);
	// }

	render() {
		return (
			<>
				<section className="section-udo animated fadeInUp">
					<Draggable>
						<div className={`udo-new-wrapper ${this.getUdoCfg().class}`}>
							<button className="udo-new-close" onClick={this.props.close}>
								<div>
									<img src={close} alt="" />
								</div>
								<p>
									{LangString(
										"components.Udo.index.38e87dca00b81bad010ba68f25ba6e46",
									)}
								</p>
							</button>
							<div className="udo-new-container">
								<div className="udo-new-text">
									<p className="udo-fraction">
										{fractionCfg.getFractionName(this.props.fraction) || "Unknown"}
									</p>
									<p className="udo-new-name">{this.props.player}</p>
									<p className="udo-rank">
										{fractionCfg.getRankName(
											this.props.fraction,
											this.props.rank,
										)}
										{this.props.tag ? (
											<>
												<br />
												{LangString(
													"components.Udo.index.ffdb1b45b1c492ec2f27823f809346c5",
												)}{" "}
												<strong>{this.props.tag}</strong>
											</>
										) : (
											<></>
										)}
									</p>
									{/* <div className="udo-signature">
										<img src={this.image} alt="" />
									</div> */}
								</div>
								<div className="udo-new-image">
									<img src={this.getImage()} alt="" />
								</div>
							</div>
						</div>
					</Draggable>
				</section>
			</>
		);
	}
}
