import { LangString } from "../../../../../../../../modules/lang";
import React from "react";

const png = Object.fromEntries(
	Object.entries(
		import.meta.glob("../../../../assets/*.png", { eager: true }),
	).map(([key, value]) => {
		const name = key.match(/\/([^/]+)\.png$/)[1];
		return [name, value.default];
	}),
);
const svg = Object.fromEntries(
	Object.entries(
		import.meta.glob("../../../../assets/*.svg", { eager: true }),
	).map(([key, value]) => {
		const name = key.match(/\/([^/]+)\.svg$/)[1];
		return [name, value.default];
	}),
);
import { IFractionData } from "../../../../../../../../../shared/fractions/ranks";
import classNames from "classnames";
import { CEF } from "../../../../../../../../modules/CEF";

export class Radar extends React.Component<
	{
		fractionData: IFractionData;
		activateTrack: Function;
	},
	{}
> {
	constructor(props: any) {
		super(props);
	}

	getFractionMember(id: number) {
		if (!this.props.fractionData) return null;
		return this.props.fractionData.members.find((q) => q.id === id);
	}

	render() {
		return (
			<>
				<div className="government__title">
					<img src={svg["radar"]} alt="" />
					{LangString(
						"components.Tablet.components.Fraction.pages.Government.components.Radar.Radar.78a3226bc23617eff7c440dd763b6202",
					)}
				</div>

				<div className="government-radar">
					<div className="government-radar-description">
						<div
							className={classNames("government-radar-switcher", {
								"government-radar-switcher__active":
									this.getFractionMember(CEF.id) &&
									this.getFractionMember(CEF.id).tracker,
							})}
							onClick={() => this.props.activateTrack(0)}
						>
							<div />
						</div>
						<div className="government-radar-description-text">
							<div className="government-radar-description-text__title">
								{LangString(
									"components.Tablet.components.Fraction.pages.Government.components.Radar.Radar.5d2716cb0bcad59f5b33f77348e36761",
								)}
							</div>
							<div className="government-radar-description-text__span">
								{LangString(
									"components.Tablet.components.Fraction.pages.Government.components.Radar.Radar.db7548392668111fad91f8385ca70229",
								)}
							</div>
						</div>
					</div>

					<div className="government-radar__line" />

					<div className="government-radar-list">
						{this.props.fractionData.members
							.filter((q) => q.tracker && CEF.id !== q.id)
							.map((member, id) => {
								return (
									<div className="government-radar-list__block" key={id}>
										{member.name}
										<div
											className={classNames("government-radar-switcher", {
												"government-radar-switcher__active": !!member.tracking,
											})}
											onClick={() => this.props.activateTrack(member.id)}
										>
											<div />
										</div>
									</div>
								);
							})}
					</div>
				</div>
			</>
		);
	}
}
