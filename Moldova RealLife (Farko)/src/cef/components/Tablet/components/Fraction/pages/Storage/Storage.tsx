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
import { IFractionStorageDTO } from "../../../../../../../shared/fractions/ranks";
import { inventoryShared } from "../../../../../../../shared/inventory";
import { fractionCfg } from "../../../../../../modules/fractions";
import classNames from "classnames";
import { CustomEvent } from "../../../../../../modules/custom.event";

export class Storage extends React.Component<
	{
		fractionId: number;
		storages: IFractionStorageDTO[];
		update: Function;
	},
	{
		chooseRankIdStorage: number;
		chooseRankId: number;
	}
> {
	constructor(props: any) {
		super(props);

		this.state = {
			chooseRankId: -1,
			chooseRankIdStorage: -1,
		};
	}

	chooseRank(id: number, storageId: number) {
		if (
			this.state.chooseRankIdStorage === storageId &&
			this.state.chooseRankId === id
		)
			return;
		this.setState({ chooseRankId: id, chooseRankIdStorage: storageId });
	}

	chooseRankClose(id: number, storageId: number) {
		if (
			this.state.chooseRankIdStorage !== storageId &&
			this.state.chooseRankId !== id
		)
			return;
		this.setState({ chooseRankId: -1, chooseRankIdStorage: -1 });
	}

	changeRank(storageId: number, itemId: number, rank: number) {
		this.setState({ chooseRankId: -1, chooseRankIdStorage: -1 });
		CustomEvent.callServer(
			"tablet:setRankForItem",
			storageId,
			itemId,
			rank,
		).then((res) => {
			if (res) this.props.update();
		});
	}

	render() {
		return (
			<div className="tablet-fraction-body">
				<div className="tablet-fraction-body__title">
					{LangString(
						"components.Tablet.components.Fraction.pages.Storage.Storage.27d7c385f71f1d11f5c49f4245a5557d",
					)}
				</div>

				<div className="tablet-fraction-storage">
					<div className="tablet-fraction-storage__description">
						<span>
							{LangString(
								"components.Tablet.components.Fraction.pages.Storage.Storage.49d0c121f7f0e1ccacb30590efb2408b",
							)}
						</span>
						<span>
							{LangString(
								"components.Tablet.components.Fraction.pages.Storage.Storage.4fb50ca86585d0052b8036d179b3402c",
							)}
						</span>
					</div>

					<div className="tablet-fraction-storage-list">
						{this.props.storages.map((storage, storageKey) => {
							return (
								<React.Fragment key={storageKey}>
									{storage.items.map((item, itemKey) => {
										return (
											<div
												className="tablet-fraction-storage-list-block"
												key={itemKey}
											>
												<div className="tablet-fraction-storage-list-block__name">
													{inventoryShared.get(item[0]).name}
												</div>
												<div
													className={classNames(
														"tablet-fraction-storage-list-block-rank",
														{
															"tablet-fraction-storage-list-block-rank__active":
																this.state.chooseRankId === itemKey &&
																this.state.chooseRankIdStorage === storageKey,
														},
													)}
													onClick={() => this.chooseRank(itemKey, storageKey)}
												>
													<div
														className="tablet-fraction-storage-list-block-rank__name"
														onClick={() =>
															this.chooseRankClose(itemKey, storageKey)
														}
													>
														{fractionCfg.getRankName(
															this.props.fractionId,
															item[2],
														)}
														<img src={svg["back"]} alt="" />
													</div>
													<div className="tablet-fraction-storage-list-block-rank-list">
														{fractionCfg
															.getFraction(this.props.fractionId)
															.ranks.map((rank, rankKey) => {
																return (
																	<div
																		key={rankKey}
																		onClick={() =>
																			this.changeRank(
																				storage.id,
																				item[0],
																				rankKey,
																			)
																		}
																	>
																		{rank}
																	</div>
																);
															})}
													</div>
												</div>
											</div>
										);
									})}
								</React.Fragment>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}
