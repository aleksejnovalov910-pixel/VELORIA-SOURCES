import { LangString } from "../../../../../../modules/lang";
import React from "react";
import "./style.less";

import { Radar } from "./components/Radar";
import { Dispatching } from "./components/Dispatching";
import { Citizens } from "./components/Citizens";
import { Transport } from "./components/Transport";
import { Wanted } from "./components/Wanted";

const png = Object.fromEntries(
	Object.entries(import.meta.glob("../../assets/*.png", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.png$/)[1];
			return [name, value.default];
		},
	),
);
const svg = Object.fromEntries(
	Object.entries(import.meta.glob("../../assets/*.svg", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.svg$/)[1];
			return [name, value.default];
		},
	),
);
import classNames from "classnames";
import { IFractionData } from "../../../../../../../shared/fractions/ranks";
import { fractionCfg } from "../../../../../../modules/fractions";

export class Government extends React.Component<
	{
		fractionData: IFractionData;
		activateTrack: Function;
	},
	{
		page: string;
	}
> {
	constructor(props: any) {
		super(props);

		this.state = {
			page: "radar",
		};
	}

	switchPage(el: string) {
		this.setState({ page: el });
	}

	render() {
		return (
			<div className="government">
				<div className="government-navigation">
					<div
						onClick={() => {
							this.switchPage("radar");
						}}
						className={classNames({
							"government-navigation__active": this.state.page === "radar",
						})}
					>
						{LangString(
							"components.Tablet.components.Fraction.pages.Government.Government.c85f49b791dd0862899a8dff485d61a7",
						)}
					</div>

					<div
						onClick={() => {
							this.switchPage("dispatching");
						}}
						className={classNames({
							"government-navigation__active":
								this.state.page === "dispatching",
						})}
					>
						{LangString(
							"components.Tablet.components.Fraction.pages.Government.Government.9176b9ea04b80e358a7019ab4c5c252d",
						)}
					</div>

					{fractionCfg.getFraction(this.props.fractionData.id).police && (
						<>
							<div
								onClick={() => {
									this.switchPage("citizens");
								}}
								className={classNames({
									"government-navigation__active":
										this.state.page === "citizens",
								})}
							>
								{LangString(
									"components.Tablet.components.Fraction.pages.Government.Government.fb77f4d284ade05f055d7b9fb2f10be8",
								)}
							</div>

							<div
								onClick={() => {
									this.switchPage("transport");
								}}
								className={classNames({
									"government-navigation__active":
										this.state.page === "transport",
								})}
							>
								{LangString(
									"components.Tablet.components.Fraction.pages.Government.Government.0d3a211ea53df47d9183c9e2bb378be6",
								)}
							</div>
						</>
					)}

					<div
						onClick={() => {
							this.switchPage("wanted");
						}}
						className={classNames({
							"government-navigation__active": this.state.page === "wanted",
						})}
					>
						{LangString(
							"components.Tablet.components.Fraction.pages.Government.Government.aafd29f08d610fd4aec2f84a50ccb691",
						)}
					</div>
				</div>

				{this.state.page === "radar" && (
					<Radar
						fractionData={this.props.fractionData}
						activateTrack={this.props.activateTrack}
					/>
				)}
				{this.state.page === "dispatching" && (
					<Dispatching fractionData={this.props.fractionData} />
				)}
				{this.state.page === "citizens" && (
					<Citizens fractionData={this.props.fractionData} />
				)}
				{this.state.page === "transport" && <Transport />}
				{this.state.page === "wanted" && <Wanted />}
			</div>
		);
	}
}
