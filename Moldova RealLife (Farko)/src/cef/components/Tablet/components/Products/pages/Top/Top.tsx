import React, { Component } from "react";
import "../../style.less";

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
import {
	ILastSells,
	IUserBuyerRating,
} from "../../../../../../../shared/tablet/business.config";
import { system } from "../../../../../../modules/system";

export class Top extends Component<
	{
		week: IUserBuyerRating[];
		month: IUserBuyerRating[];
		lastSells: ILastSells[] | null;
	},
	{
		page: "day" | "month" | "week";
	}
> {
	constructor(props: any) {
		super(props);

		this.state = {
			page: "day",
		};
	}

	changePage = (page: "day" | "month" | "week") => {
		this.setState({ page });
	};

	render() {
		return (
			<div className="tp tp-top">
				{this.props.week !== null &&
					this.props.month !== null &&
					this.props.lastSells && (
						<>
							<div className="tp-filter">
								<div
									className={classNames({
										"tp-filter__active": this.state.page === "day",
									})}
									onClick={() => this.changePage("day")}
								>
									Pe zi
								</div>
								<div
									className={classNames({
										"tp-filter__active": this.state.page === "week",
									})}
									onClick={() => this.changePage("week")}
								>
									Intr-o saptamana
								</div>
								<div
									className={classNames({
										"tp-filter__active": this.state.page === "month",
									})}
									onClick={() => this.changePage("month")}
								>
									Luna curenta
								</div>
							</div>
							{this.state.page === "day" && (
								<>
									<div className="tp-cat tp-top-grid tp-top-grid-day">
										<div>Titlu subiect</div>
										<div>Pachete</div>
										<div>ID</div>
										<div>Data</div>
										<div style={{ textAlign: "end" }}>Suma</div>
									</div>
									<div className="tp-list tp-top-list">
										{this.props.lastSells.map((el, key) => {
											return (
												<div
													className="tp-list-block tp-top-grid-day"
													key={key}
												>
													<div className={"tp-top-list-day__name"}>
														{el.name}
													</div>
													<div className={"tp-top-list-day__value"}>
														{el.count}
													</div>
													<div className={"tp-top-list-day__id"}>
														{el.userId}
													</div>
													<div className={"tp-top-list-day__date"}>
														{el.time}
													</div>
													<div className={"tp-top-list-day__sum"}>
														+{system.numberFormat(el.money)}$
													</div>
												</div>
											);
										})}
									</div>
								</>
							)}
							{this.state.page === "week" && (
								<>
									<div className="tp-cat tp-top-grid">
									<div>Locatie</div>
									<div>ID</div>
									<div style={{ textAlign: "end" }}>Suma</div>

									</div>
									<div className="tp-list tp-top-list">
										{this.props.week.map((el, key) => {
											return (
												<div className="tp-list-block tp-top-grid" key={key}>
													<div className="tp-top-list__geo">{key + 1}</div>
													<div className="tp-top-list__id">{el.userId}</div>
													<div className="tp-top-list__value">
														+{system.numberFormat(el.money)}$
													</div>
												</div>
											);
										})}
									</div>
								</>
							)}
							{this.state.page === "month" && (
								<>
									<div className="tp-cat tp-top-grid">
										<div>Locatie</div>
										<div>ID</div>
										<div style={{ textAlign: "end" }}>Suma</div>
									</div>
									<div className="tp-list tp-top-list">
										{this.props.month.map((el, key) => {
											return (
												<div className="tp-list-block tp-top-grid" key={key}>
													<div className="tp-top-list__geo">{key + 1}</div>
													<div className="tp-top-list__id">{el.userId}</div>
													<div className="tp-top-list__value">
														+{system.numberFormat(el.money)}$
													</div>
												</div>
											);
										})}
									</div>
								</>
							)}
						</>
					)}
			</div>
		);
	}
}
