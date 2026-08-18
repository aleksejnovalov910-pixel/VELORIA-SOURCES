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
import classNames from "classnames";
import { TENCODES_LIST } from "../../../../../../../../../shared/fractions";
import { CustomEvent } from "../../../../../../../../modules/custom.event";
import { IFractionData } from "../../../../../../../../../shared/fractions/ranks";
import { systemUtil } from "../../../../../../../../../shared/system";
import { CEF } from "../../../../../../../../modules/CEF";

export class Dispatching extends React.Component<
	{
		fractionData: IFractionData;
	},
	{
		isDepartment: boolean;
		selectActive: boolean;
		tenCode: number;
	}
> {
	constructor(props: any) {
		super(props);

		this.state = {
			isDepartment: true,
			selectActive: false,
			tenCode: 0,
		};
	}

	render() {
		return (
			<>
				<div className="government__title">
					<img src={svg["rudder"]} alt="" />
					{LangString(
						"components.Tablet.components.Fraction.pages.Government.components.Dispatching.Dispatching.8d52d2daa6b415b27eede22583e68248",
					)}
				</div>
				<div className="government-dispatching">
					<div className="government-dispatching-navigation">
						<div
							className={classNames({
								"government-dispatching-navigation-active":
									this.state.isDepartment,
							})}
							onClick={() => this.setState({ isDepartment: true })}
						>
							{LangString(
								"components.Tablet.components.Fraction.pages.Government.components.Dispatching.Dispatching.993b87243b90225b5f7c24d07849185d",
							)}
						</div>
						<div
							className={classNames({
								"government-dispatching-navigation-active":
									!this.state.isDepartment,
							})}
							onClick={() => this.setState({ isDepartment: false })}
						>
							{LangString(
								"components.Tablet.components.Fraction.pages.Government.components.Dispatching.Dispatching.8b93f13542399c6e52e2471387f62517",
							)}
						</div>
					</div>

					<div className="government-dispatching-code">
						<div
							className={classNames("government-dispatching-code-rank", {
								"government-dispatching-code-rank__active":
									this.state.selectActive,
							})}
							onClick={() => {
								if (!this.state.selectActive)
									this.setState({ selectActive: true });
							}}
						>
							{TENCODES_LIST[this.state.tenCode][0]} -{" "}
							{TENCODES_LIST[this.state.tenCode][1]}
							<img src={svg["back"]} alt="" />
							<div className="government-dispatching-code-rank-list">
								{TENCODES_LIST.map(([codeName, codeDesc], codeID) => {
									return (
										<div
											key={codeID}
											onClick={() => {
												this.setState({ tenCode: codeID, selectActive: false });
											}}
										>
											{codeName} - {codeDesc}
										</div>
									);
								})}
							</div>
						</div>

						<div
							className="government-dispatching-code__button"
							onClick={() => {
								CustomEvent.triggerServer(
									"dispatch:tencode",
									Number(this.state.tenCode || 0),
									!this.state.isDepartment,
								);
							}}
						>
							{LangString(
								"components.Tablet.components.Fraction.pages.Government.components.Dispatching.Dispatching.5cb17ebfed3aa64c624573e5b686d334",
							)}
						</div>
					</div>

					<div className="government-dispatching-list">
						{this.props.fractionData.alerts
							.sort((a, b) => b.id - a.id)
							.map((gosData) => {
								if (gosData.type === 0 && this.state.isDepartment) {
									return (
										<div className="government-dispatching-list-block">
											<div className="government-dispatching-list-block-left">
												<div className="government-dispatching-list-block-left__name">
													{LangString(
														"components.Tablet.components.Fraction.pages.Government.components.Dispatching.Dispatching.3902b6125ea5bf2348c5eac1fabea9cc",
													)}
												</div>
												<div className="government-dispatching-list-block-left__status">
													{LangString(
														"components.Tablet.components.Fraction.pages.Government.components.Dispatching.Dispatching.471a2be93b95cd8dda534cb47813bf3c",
													)}
												</div>
												<div className="government-dispatching-list-block-left__information">
													#{gosData.id} |{" "}
													{systemUtil.timeStampString(gosData.timestamp)}{" "}
													{gosData.pos[0]
														? ` | ${Math.round(
																systemUtil.distanceToPos2D(
																	{
																		x: gosData.pos[0],
																		y: gosData.pos[1],
																	},
																	{
																		x: this.props.fractionData.playerPosition.x,
																		y: this.props.fractionData.playerPosition.y,
																	},
																),
															)} м.`
														: ""}
												</div>
											</div>
											<div className="government-dispatching-list-block-right">
												{gosData.callAnswered ? (
													<div className="government-dispatching-list-block-right__accept">
														{LangString(
															"components.Tablet.components.Fraction.pages.Government.components.Dispatching.Dispatching.1b89df133eae37539c2a18724eb8c18d",
														)}{" "}
														<div>{String(gosData.callAnswered)}</div>
													</div>
												) : (
													<></>
												)}
												{!gosData.actual ? (
													<div className="government-dispatching-list-block-right__time">
														{LangString(
															"components.Tablet.components.Fraction.pages.Government.components.Dispatching.Dispatching.fd307f1e1d9ccf293ccbaab3a136bdc8",
														)}
													</div>
												) : (
													<div
														className="government-dispatching-code__button"
														onClick={() =>
															CustomEvent.triggerServer(
																"dispatch:answer",
																gosData.id,
															)
														}
													>
														{LangString(
															"components.Tablet.components.Fraction.pages.Government.components.Dispatching.Dispatching.a0cf3e67287d45458a6e3aaf93b05052",
														)}
													</div>
												)}
											</div>
										</div>
									);
								}

								if (gosData.type === 1) {
									if (
										(gosData.isGlobal && !this.state.isDepartment) ||
										(!gosData.isGlobal && this.state.isDepartment)
									)
										return <></>;

									let tenCode = TENCODES_LIST[gosData.code];

									return tenCode ? (
										<div className="government-dispatching-list-block">
											<div className="government-dispatching-list-block-left">
												<div className="government-dispatching-list-block-left__name">
													{tenCode[0]} - {tenCode[1]}
												</div>
												<div className="government-dispatching-list-block-left__status">
													{LangString(
														"components.Tablet.components.Fraction.pages.Government.components.Dispatching.Dispatching.81e7d64649b4b3e5caee4e807ac73d37",
													)}
												</div>
												<div className="government-dispatching-list-block-left__information">
													#{gosData.id} |{" "}
													{systemUtil.timeStampString(gosData.timestamp)}{" "}
													{gosData.pos[0]
														? ` | ${Math.round(
																systemUtil.distanceToPos2D(
																	{
																		x: gosData.pos[0],
																		y: gosData.pos[1],
																	},
																	{
																		x: this.props.fractionData.playerPosition.x,
																		y: this.props.fractionData.playerPosition.y,
																	},
																),
															)} м.`
														: ""}
												</div>
											</div>
											<div className="government-dispatching-list-block-right">
												<div
													className="government-dispatching-code__button"
													onClick={() =>
														CEF.setGPS(gosData.pos[0], gosData.pos[1])
													}
												>
													{LangString(
														"components.Tablet.components.Fraction.pages.Government.components.Dispatching.Dispatching.892ee4165419ed39d3929b1014702721",
													)}
												</div>
											</div>
										</div>
									) : (
										<></>
									);
								}
							})}
					</div>
				</div>
			</>
		);
	}
}
