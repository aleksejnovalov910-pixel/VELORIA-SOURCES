import { LangString } from "../../../../../../modules/lang";
import React from "react";

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
import { IFractionStorageLog } from "../../../../../../../shared/fractions/ranks";

export class Safe extends React.Component<
	{
		logs: IFractionStorageLog[];
	},
	{}
> {
	constructor(props: any) {
		super(props);
	}

	render() {
		return (
			<div className="tablet-fraction-body">
				<div className="tablet-fraction-body__title">
					{LangString(
						"components.Tablet.components.Fraction.pages.Safe.Safe.e85d9453632d85efaef1ffa245ae5d26",
					)}
				</div>
				<div className="tablet-fraction-safe">
					<div className="tablet-fraction-safe__description">
						<span>
							{LangString(
								"components.Tablet.components.Fraction.pages.Safe.Safe.c3effad89e333aaf8cacbb56412731af",
							)}
						</span>
					</div>

					<div className="tablet-fraction-safe-list">
						{this.props.logs.map((log, key) => {
							return (
								<div className="tablet-fraction-safe-list-block" key={key}>
									<div>{log.who}</div>
									<div className="tablet-fraction-safe-list-block__red">
										{log.text}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}
