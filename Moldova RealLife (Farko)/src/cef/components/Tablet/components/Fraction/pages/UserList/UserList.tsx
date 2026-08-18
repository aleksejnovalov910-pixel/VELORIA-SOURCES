import { LangString } from "../../../../../../modules/lang";
import React from "react";
const svg = Object.fromEntries(
	Object.entries(import.meta.glob("../../assets/*.svg", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.svg$/)[1];
			return [name, value.default];
		},
	),
);
import {
	FRACTION_RIGHTS,
	IFractionMemberDTO,
} from "../../../../../../../shared/fractions/ranks";
import classNames from "classnames";
import { fractionCfg } from "../../../../../../modules/fractions";
import { CustomEvent } from "../../../../../../modules/custom.event";
import { systemUtil } from "../../../../../../../shared/system";

export class UserList extends React.Component<
	{
		fractionId: number;
		members: IFractionMemberDTO[];
		rights: FRACTION_RIGHTS[];
	},
	{
		chooseRankId: number;
		showSubMenu: number;
		sortByOnline: boolean;
		sortBySymbols: boolean;
		findText: string;
	}
> {
	textRef: React.RefObject<HTMLInputElement> = React.createRef();

	constructor(props: any) {
		super(props);

		this.state = {
			chooseRankId: -1,
			showSubMenu: -1,
			sortByOnline: false,
			sortBySymbols: false,
			findText: "",
		};
	}

	chooseRank(id: number) {
		if (this.state.chooseRankId === id) return;
		this.setState({ chooseRankId: id });
	}

	chooseRankClose(id: number) {
		if (this.state.chooseRankId !== id) return;
		this.setState({ chooseRankId: -1 });
	}

	changeShowSubMenu(id: number) {
		if (id === this.state.showSubMenu)
			return this.setState({ showSubMenu: -1 });
		this.setState({ showSubMenu: id });
	}

	changeRank(memberId: number, rank: number) {
		this.setState({ chooseRankId: -1 });
		CustomEvent.triggerServer("faction:setRank", memberId, rank + 1);
	}

	kickMember(id: number) {
		this.setState({ showSubMenu: id });
		CustomEvent.triggerServer("faction:kick", id);
	}

	giveAward(id: number) {
		this.setState({ showSubMenu: id });
		CustomEvent.triggerServer("tablet:giveAward", id);
	}

	changeWarns(id: number, give: boolean) {
		give
			? CustomEvent.triggerServer("tablet:giveFractionWarn", id)
			: CustomEvent.triggerServer("tablet:removeFractionWarn", id);
	}

	getMembers() {
		let members = this.props.members.sort((a, b) => b.rank - a.rank);

		if (this.state.sortByOnline) {
			members = members.filter((e) => !e.lastSeen);
		}

		if (this.state.sortBySymbols) {
			members = members.sort((a, b) => (a.name > b.name ? 1 : -1));
		}

		if (this.state.findText !== "") {
			members = members.filter(
				(e) =>
					e.name.toLowerCase().includes(this.state.findText.toLowerCase()) ||
					`${e.id}`.includes(this.state.findText),
			);
		}

		return members;
	}

	changeSearchText() {
		this.setState({ findText: this.textRef.current.value });
	}

	changeFilters(isOnline: boolean) {
		if (isOnline) {
			this.setState({ sortByOnline: !this.state.sortByOnline });
		} else {
			this.setState({ sortBySymbols: !this.state.sortBySymbols });
		}
	}

	render() {
		return (
			<div className="tablet-fraction-body">
				<div className="tablet-fraction-body__title">
					{LangString(
						"components.Tablet.components.Fraction.pages.UserList.UserList.6de81254e0a3fb110446deb34d807eed",
					)}
				</div>

				<div className="tablet-fraction-body__members">
					{this.props.members.filter((q) => !q.lastSeen).length} /{" "}
					{this.props.members.length}{" "}
					<span>
						{LangString(
							"components.Tablet.components.Fraction.pages.UserList.UserList.911f99537729d1220142868f1f3ce1be",
						)}
					</span>
				</div>
				<div className="tablet-fraction-userlist">
					<div className="tablet-fraction-userlist-filter">
						<div
							className="tablet-fraction-userlist-filter__checkbox"
							onClick={() => this.changeFilters(true)}
						>
							<div
								className={classNames({
									"tablet-fraction-userlist-filter__checkbox-active":
										this.state.sortByOnline,
								})}
							>
								<img src={svg["checkmark"]} alt="" />
							</div>
							{LangString(
								"components.Tablet.components.Fraction.pages.UserList.UserList.ae24928541363f8fec10e6747e650933",
							)}
						</div>
						<div
							className="tablet-fraction-userlist-filter__checkbox"
							onClick={() => this.changeFilters(false)}
						>
							<div
								className={classNames({
									"tablet-fraction-userlist-filter__checkbox-active":
										this.state.sortBySymbols,
								})}
							>
								<img src={svg["checkmark"]} alt="" />
							</div>
							{LangString(
								"components.Tablet.components.Fraction.pages.UserList.UserList.73a9a1f1fab0d49b7544372a678789b7",
							)}
						</div>
						<div className="tablet-fraction-userlist-filter__input">
							<input
								type="text"
								ref={this.textRef}
								placeholder={LangString(
									"components.Tablet.components.Fraction.pages.UserList.UserList.1d3c14aa30b7d5aa8f6e8063789fe958",
								)}
								onChange={() => {
									this.setState({ findText: this.textRef.current.value });
								}}
							/>
							<img
								src={svg["search"]}
								onClick={() => this.changeSearchText()}
								alt=""
							/>
						</div>
					</div>

					<div className="tablet-fraction-userlist__description">
						<span>
							{LangString(
								"components.Tablet.components.Fraction.pages.UserList.UserList.437a3e7dc2ac1cd64d551d9ba62349ea",
							)}
						</span>
						<span>Name</span>
						{this.props.rights.includes(FRACTION_RIGHTS.WARNS) && (
							<span>
								{LangString(
									"components.Tablet.components.Fraction.pages.UserList.UserList.25ed47aadbc62f5672c2151b8467d50a",
								)}
							</span>
						)}
						{this.props.rights.includes(FRACTION_RIGHTS.CHANGE_RANKS) && (
							<span>
								{LangString(
									"components.Tablet.components.Fraction.pages.UserList.UserList.0a88b3d366546d8af88c48b9ced0c8d1",
								)}
							</span>
						)}
					</div>

					<div className="tablet-fraction-userlist-list">
						{this.getMembers().map((member, key) => {
							return (
								<div className="tablet-fraction-userlist-list-block" key={key}>
									<div className="tablet-fraction-userlist-list-block__id">
										{member.id}
									</div>
									<div className="tablet-fraction-userlist-list-block__name">
										{!member.lastSeen ? "• " : ""} {member.name}
										{member.lastSeen
											? ` [${systemUtil.timeStampString(member.lastSeen)}]`
											: ""}
									</div>
									{this.props.rights.includes(FRACTION_RIGHTS.WARNS) ? (
										<div className="tablet-fraction-userlist-list-block__rebuke">
											<div
												className="tablet-fraction-userlist-list-block__rebuke-minus"
												onClick={() => this.changeWarns(member.id, false)}
											>
												-
											</div>
											{member.warns}
											<div
												className="tablet-fraction-userlist-list-block__rebuke-plus"
												onClick={() => this.changeWarns(member.id, true)}
											>
												+
											</div>
										</div>
									) : (
										<div></div>
									)}
									{this.props.rights.includes(FRACTION_RIGHTS.CHANGE_RANKS) ? (
										<div
											className={classNames(
												"tablet-fraction-userlist-list-block-rank",
												{
													"tablet-fraction-userlist-list-block-rank__active":
														key === this.state.chooseRankId,
												},
											)}
											onClick={() => this.chooseRank(key)}
										>
											<div
												className="tablet-fraction-userlist-list-block-rank__name"
												onClick={() => this.chooseRankClose(key)}
											>
												{fractionCfg.getRankName(
													this.props.fractionId,
													member.rank,
												)}
												<img src={svg["back"]} alt="" />
											</div>
											<div className="tablet-fraction-userlist-list-block-rank-list">
												{fractionCfg
													.getFraction(this.props.fractionId)
													.ranks.map((rank, rankId) => {
														if (
															fractionCfg.isLeader(
																this.props.fractionId,
																rankId + 1,
															)
														)
															return;
														return (
															<div
																key={rankId}
																onClick={() =>
																	this.changeRank(member.id, rankId)
																}
															>
																{rank}
															</div>
														);
													})}
											</div>
										</div>
									) : (
										<div className="tablet-fraction-userlist-list-block-text">
											{fractionCfg.getRankName(
												this.props.fractionId,
												member.rank,
											)}
										</div>
									)}
									<div
										className="tablet-fraction-userlist-list-block-more"
										onClick={() => this.changeShowSubMenu(member.id)}
									>
										<img src={svg["ellipsis-vertical"]} alt="" />

										{this.state.showSubMenu === member.id && (
											<div className="tablet-fraction-userlist-list-block-more__list">
												{this.props.rights.includes(FRACTION_RIGHTS.KICK) && (
													<div onClick={() => this.kickMember(member.id)}>
														{LangString(
															"components.Tablet.components.Fraction.pages.UserList.UserList.05eb0b3027830e1d4edecfeaf11e8617",
														)}
													</div>
												)}
												{this.props.rights.includes(FRACTION_RIGHTS.AWARDS) && (
													<div onClick={() => this.giveAward(member.id)}>
														{LangString(
															"components.Tablet.components.Fraction.pages.UserList.UserList.9270e50cb9e882a17b2811290ecfc3bc",
														)}
													</div>
												)}
											</div>
										)}
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
