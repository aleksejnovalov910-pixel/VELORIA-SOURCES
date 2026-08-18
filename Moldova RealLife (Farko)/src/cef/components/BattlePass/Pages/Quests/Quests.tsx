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

import { NavigationBar } from "../../components/NavigationBar";
import { Footer } from "../../components/Footer";
import { TaskDTO } from "../../../../../shared/battlePass/DTOs";

export class Quests extends Component<
	{
		global: TaskDTO;
		basic: TaskDTO[];
		globalExist: boolean;
	},
	{}
> {
	constructor(props: any) {
		super(props);
	}

	render() {
		return (
			<div className="quests">
				<div className="battlePass-center">
					<div className="quests__title">
						{LangString(
							"components.BattlePass.Pages.Quests.Quests.045a3fb659f4e8ec98b59afc5079287d",
						)}
					</div>

					<div className="quests-body">
						<div className="quests-body-left">
							<div className="quests-body__title">
								{LangString(
									"components.BattlePass.Pages.Quests.Quests.c81f400fcb2b1f652b98933dfff3c4fd",
								)}
							</div>

							<div className="quests-body-left-blocks">
								{this.props.basic.map((el, key) => {
									return (
										<div className="quests-body-left-blocks-block" key={key}>
											<div className="quests-body-left-blocks-block__title">
												{el.name}
											</div>
											<div className="quests-body-left-blocks-block__text">
											{el.desc.split('\n').map((line, idx) => (
												<div key={idx}>{line}</div>
											))}
											</div>
											<div className="quests-body-left-blocks-block__exp">
												<span>+ {el.exp} exp</span>
											</div>

											<div className="quests-body-left-blocks-block-progressbar">
												{el.progress}/{el.goal}
												<div className="quests-body-left-blocks-block-progressbar__bar">
													<div
														style={{
															width: `${Math.trunc((el.progress * 100) / el.goal)}%`,
														}}
													/>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>

						{this.props.globalExist && (
							<div className="quests-body-right">
								<div className="quests-body__title">
									{LangString(
										"components.BattlePass.Pages.Quests.Quests.77f2daa161db4269fe45eeb08d22a5c4",
									)}
								</div>

								<div className="quests-body-right-block">
									<div className="quests-body-right-block__title">
										{this.props.global.name}
									</div>

									<div className="quests-body-right-block__text">
										{this.props.global.desc}
									</div>

									<div className="quests-body-right-block-progressbar">
										{Math.trunc(
											(this.props.global.progress * 100) /
												this.props.global.goal,
										)}
										%
										<div className="quests-body-right-block-progressbar__bar">
											<div
												style={{
													width: `${Math.trunc((this.props.global.progress * 100) / this.props.global.goal)}%`,
												}}
											/>
										</div>
									</div>

									<div className="quests-body-right-block-exp">
										<img src={png["wreath"]} alt="" />
										<span>
											+ {this.props.global.exp} <div>EXP</div>
										</span>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}
