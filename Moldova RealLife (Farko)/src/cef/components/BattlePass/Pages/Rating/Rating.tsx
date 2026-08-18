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
import { BATTLE_PASS_SEASON } from "../../../../../shared/battlePass/main";
import { RatingDTO } from "../../../../../shared/battlePass/DTOs";

export class Rating extends Component<
	{
		rating: RatingDTO[];
	},
	{}
> {
	constructor(props: any) {
		super(props);
	}

	render() {
		return (
			<>
				<img src={png["background"]} alt="" className="rating__background" />

				<div className={"rating"}>
					<div className="rating-title">
						{LangString(
							"components.BattlePass.Pages.Rating.Rating.2b2777835b03bac74caa959cae9290db",
						)}
						<span>
							{LangString(
								"components.BattlePass.Pages.Rating.Rating.fe4588638b47c417cf0f2a1880aab637",
							)}
						</span>
					</div>

					<div className="rating-body">
						<div className="rating-body-left">
							<div className="rating-body-left-categories">
								<div className="rating-body-left-categories__number">№</div>
								<div className="rating-body-left-categories__name">
									{LangString(
										"components.BattlePass.Pages.Rating.Rating.4dcd3544f6f0b455489a7bd72ba8c7cb",
									)}
								</div>
								<div className="rating-body-left-categories__level">
									{LangString(
										"components.BattlePass.Pages.Rating.Rating.5a6b5ccfc740a21bc66055a7689624a5",
									)}
								</div>
							</div>

							<div className="rating-body-left-scroll">
								{this.props.rating
									.sort((a, b) => a.place - b.place)
									.map((el, key) => {
										return (
											<div className="rating-body-left-block" key={key}>
												<div className="rating-body-left-block__number">
													{el.place + 1}
												</div>
												<div className="rating-body-left-block__name">
													{el.name} ({el.id})
												</div>
												<div className="rating-body-left-block__level">
													{Math.trunc(el.exp / BATTLE_PASS_SEASON.levelExp)}
													<img src={svg["shield"]} alt="" />
												</div>
											</div>
										);
									})}
							</div>
						</div>

						<div className="rating-body-right">
							{this.props.rating.map((el, key) => {
								if (key > 2) return;

								let image = "goldStar";

								if (key === 1) {
									image = "silverStar";
								} else if (key === 2) {
									image = "bronzeStar";
								}

								return (
									<div className="rating-body-right-block" key={key}>
										<img src={png[image]} alt="" />
										<span>№{key + 1}</span>
										{el.name} ({el.id})
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</>
		);
	}
}
