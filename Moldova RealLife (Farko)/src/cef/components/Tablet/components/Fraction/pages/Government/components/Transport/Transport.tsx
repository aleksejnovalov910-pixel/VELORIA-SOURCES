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
import { CustomEvent } from "../../../../../../../../modules/custom.event";
import { CEF } from "../../../../../../../../modules/CEF";

export class Transport extends React.Component<
	{},
	{
		searchData: {
			model: string;
			name: string;
			number: string;
			owner: number;
			ownername: string;
		}[];
	}
> {
	textRef: React.RefObject<HTMLInputElement> = React.createRef();

	constructor(props: any) {
		super(props);

		this.state = {
			searchData: [],
		};
	}

	search() {
		const text = this.textRef.current.value;

		CustomEvent.callServer("faction:database:searchvehicle", text).then(
			(data) => {
				if (!data) return;
				this.setState({ searchData: data });
			},
		);
	}

	render() {
		return (
			<>
				<div className="government__title">
					<img src={svg["rudder"]} alt="" />
					{LangString(
						"components.Tablet.components.Fraction.pages.Government.components.Transport.Transport.00cb35da08a68ac777d92f0c8d915f72",
					)}
				</div>
				<div className="government-transport">
					<div className="government-transport-find">
						<input
							ref={this.textRef}
							type="text"
							placeholder={LangString(
								"components.Tablet.components.Fraction.pages.Government.components.Transport.Transport.ce8f45c10e679a0988a6da85d8722e72",
							)}
							onKeyDown={(e) => {
								if (e.keyCode !== 13) return;
								this.search();
							}}
						/>
						<img src={svg["search"]} alt="" onClick={() => this.search()} />
					</div>

					<div className="government-transport-list">
						{this.state.searchData.map((veh, key) => {
							return (
								<div className="government-transport-list-block" key={key}>
									<div className="government-transport-list-block-image">
										<div className="government-transport-list-block-image__number">
											{veh.number ||
												LangString(
													"components.Tablet.components.Fraction.pages.Government.components.Transport.Transport.505488dd068c737d4864a20166d2e1eb",
												)}
										</div>
										<img src={CEF.getVehicleURL(veh.model)} alt="" />
									</div>
									<div className="government-transport-list-block__title">
										{veh.name}
									</div>
									<div className="government-transport-list-block__text">
										{LangString(
											"components.Tablet.components.Fraction.pages.Government.components.Transport.Transport.be46c55e6364b0a5258c2b3be43f6152",
										)}
									</div>
									<div className="government-transport-list-block__name">
										{veh.ownername} #{veh.owner}
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
