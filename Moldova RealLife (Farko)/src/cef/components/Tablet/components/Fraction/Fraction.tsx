import { LangString } from "../../../../modules/lang";
import React from "react";
import "./style.less";

const svg = Object.fromEntries(
	Object.entries(import.meta.glob("./assets/*.svg", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.svg$/)[1];
			return [name, value.default];
		},
	),
);

import classNames from "classnames";
import { SocketSync } from "../../../SocketSync";
import { CEF } from "../../../../modules/CEF";
import {
	ALL_FRACTION_RIGHTS,
	FRACTION_RIGHTS,
	IFractionData,
	IFractionGarageDTO,
	IFractionStorageDTO,
	IFractionStorageLog,
} from "../../../../../shared/fractions/ranks";
import { CustomEvent } from "../../../../modules/custom.event";
import { fractionCfg } from "../../../../modules/fractions";
import { UserList } from "./pages/UserList";
import { Cars } from "./pages/Cars";
import { Rangs } from "./pages/Rangs";
import { Safe } from "./pages/Safe";
import { Government } from "./pages/Government";
import { Storage } from "./pages/Storage";
import { Business } from "./pages/Business/Business";

export class Fraction extends React.Component<
	{
		back: Function;
	},
	{
		page: string;
		data: IFractionData;
		garages: IFractionGarageDTO[];
		storages: IFractionStorageDTO[];
		storageLogs: IFractionStorageLog[];
		rights: FRACTION_RIGHTS[];
	}
> {
	constructor(props: any) {
		super(props);

		this.state = {
			page: "userList",
			data: null,
			garages: [],
			storages: [],
			storageLogs: [],
			rights: [],
		};
	}

	componentDidMount() {
		this.loadFractionData();
	}

	switchPage(el: string) {
		this.setState({ page: el });
	}

	async loadFractionData() {
		const resultFraction = await CustomEvent.callServer("tablet:loadFraction");

		const resultGarages = await CustomEvent.callServer(
			"tablet:getFractionGarages",
		);

		const resultStorages = await CustomEvent.callServer(
			"tablet:getFractionStorages",
		);

		const resultStorageLog = await CustomEvent.callServer(
			"tablet:getFractionMoneyChest",
		);

		const resultRights = fractionCfg.isLeader(CEF.user.fraction, CEF.user.rank)
			? ALL_FRACTION_RIGHTS
			: await CustomEvent.callServer("fraction:getRights");

		if (resultFraction && resultGarages && resultStorages && resultStorageLog) {
			this.setState({
				data: resultFraction,
				garages: resultGarages,
				storages: resultStorages,
				storageLogs: resultStorageLog,
				rights: resultRights,
			});
		}
	}

	activateTrack = (id: number) => {
		if (id === 0) {
			let data = { ...this.state.data };
			let q = data.members.find((q) => q.id === CEF.id);
			q.tracker = !q.tracker;
			CustomEvent.triggerServer("faction:setGpsTracker", q.tracker);
			this.setState({ data });
		} else {
			let data = { ...this.state.data };
			let q = data.members.find((q) => q.id === id);
			q.tracking = !q.tracking;
			CustomEvent.triggerServer("faction:setGpsTrackerWatch", id, q.tracking);
			this.setState({ data });
		}
	};

	updateStorage = async () => {
		const resultStorages = await CustomEvent.callServer(
			"tablet:getFractionStorages",
		);

		this.setState({
			storages: resultStorages,
		});
	};

	updateGarage = async () => {
		const resultGarages = await CustomEvent.callServer(
			"tablet:getFractionGarages",
		);

		this.setState({
			garages: resultGarages,
		});
	};

	render() {
		if (!this.state.data) return <></>;

		return (
			<SocketSync
				path={`tablet_${CEF.user.fraction}`}
				data={(data: string) => {
					const d = JSON.parse(data);
					this.setState({ data: d });
				}}
			>
				<div className="tablet-fraction">
					<div className="tablet-fraction-navigation">
						<div
							className="tablet-fraction-navigation__back"
							onClick={() => this.props.back()}
						>
							<img src={svg["back"]} alt="" />{" "}
							{LangString(
								"components.Tablet.components.Fraction.Fraction.f29c06543609b3c067eca53203b94f13",
							)}
						</div>
						<div className="tablet-fraction-navigation__title">
							{fractionCfg.getFraction(this.state.data.id).name}
						</div>
						<div className="tablet-fraction-navigation-list">
							<div
								onClick={() => {
									this.switchPage("userList");
								}}
								className={classNames({
									"tablet-fraction-navigation-list__active":
										this.state.page === "userList",
								})}
							>
								{LangString(
									"components.Tablet.components.Fraction.Fraction.1e259ba09211a52ba659746fce3770e2",
								)}
							</div>

							<div
								onClick={() => {
									this.switchPage("cars");
								}}
								className={classNames({
									"tablet-fraction-navigation-list__active":
										this.state.page === "cars",
								})}
							>
								{LangString(
									"components.Tablet.components.Fraction.Fraction.56124cd4abf2a97c553954451733b43b",
								)}
							</div>

							{this.state.rights.includes(FRACTION_RIGHTS.STORAGE) && (
								<div
									onClick={() => {
										this.switchPage("storage");
									}}
									className={classNames({
										"tablet-fraction-navigation-list__active":
											this.state.page === "storage",
									})}
								>
									{LangString(
										"components.Tablet.components.Fraction.Fraction.2375e3c53da62dfb7109e344e9fad9bb",
									)}
								</div>
							)}

							{fractionCfg.isLeader(CEF.user.fraction, CEF.user.rank) && (
								<div
									onClick={() => {
										this.switchPage("rangs");
									}}
									className={classNames({
										"tablet-fraction-navigation-list__active":
											this.state.page === "rangs",
									})}
								>
									{LangString(
										"components.Tablet.components.Fraction.Fraction.3b826bc3987daca9fbf91669d5d0eb3c",
									)}
								</div>
							)}

							<div
								onClick={() => {
									this.switchPage("safe");
								}}
								className={classNames({
									"tablet-fraction-navigation-list__active":
										this.state.page === "safe",
								})}
							>
								{LangString(
									"components.Tablet.components.Fraction.Fraction.a6964a2600af1f751e11b8a48b93777b",
								)}
							</div>

							{fractionCfg.getFraction(this.state.data.id).gos && (
								<div
									onClick={() => {
										this.switchPage("government");
									}}
									className={classNames({
										"tablet-fraction-navigation-list__active":
											this.state.page === "government",
									})}
								>
									{LangString(
										"components.Tablet.components.Fraction.Fraction.36d11c377ff93093c8bfadf0917f17fc",
									)}
								</div>
							)}

							{this.state.data.mafiabiz && (
								<div
									onClick={() => {
										this.switchPage("mafia");
									}}
									className={classNames({
										"tablet-fraction-navigation-list__active":
											this.state.page === "mafia",
									})}
								>
									{LangString(
										"components.Tablet.components.Fraction.Fraction.cc147a0311ff19f611e9969287e5e190",
									)}
								</div>
							)}
						</div>
					</div>

					{this.state.page === "userList" && (
						<UserList
							members={this.state.data.members}
							fractionId={this.state.data.id}
							rights={this.state.rights}
						/>
					)}
					{this.state.page === "cars" && (
						<Cars
							garages={this.state.garages}
							fractionId={this.state.data.id}
							update={this.updateGarage}
							rights={this.state.rights}
						/>
					)}
					{this.state.page === "storage" && (
						<Storage
							fractionId={this.state.data.id}
							storages={this.state.storages}
							update={this.updateStorage}
						/>
					)}
					{this.state.page === "rangs" && (
						<Rangs fractionId={this.state.data.id} />
					)}
					{this.state.page === "safe" && <Safe logs={this.state.storageLogs} />}
					{this.state.page === "government" && (
						<Government
							fractionData={this.state.data}
							activateTrack={this.activateTrack}
						/>
					)}
					{this.state.page === "mafia" && (
						<Business mafiaData={this.state.data.mafiabiz} />
					)}
				</div>
			</SocketSync>
		);
	}
}
