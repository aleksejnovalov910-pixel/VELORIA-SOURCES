import { LangString } from "../../../../modules/lang";
import { Component } from "react";
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
const png = Object.fromEntries(
	Object.entries(import.meta.glob("./assets/*.png", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.png$/)[1];
			return [name, value.default];
		},
	),
);
import { CEF } from "../../../../modules/CEF";
import { CustomEvent } from "../../../../modules/custom.event";

export class EnterWord extends Component<
	{},
	{
		inputRef: React.RefObject<any>;
	}
> {
	constructor(props: any) {
		super(props);

		this.state = {
			inputRef: React.createRef(),
		};
	}

	exit() {
		CEF.gui.setGui(null);
	}

	send() {
		const value = this.state.inputRef.current.value
			? this.state.inputRef.current.value
			: "";
		CustomEvent.triggerServer("advancedQuests:enterWord", value);
		CEF.gui.setGui(null);
	}

	render() {
		return (
			<div className="inputScreen">
				<img
					src={svg["background"]}
					alt=""
					className="inputScreen__background"
				/>
				<img src={png["ellipse"]} alt="" className="inputScreen__ellipse" />

				<div className="inputScreen__blur" />

				<div className="inputScreen__title">
					{LangString(
						"components.AdvancedQuests.components.EnterWord.index.c84d4c4bd6dea7fd077f9deb10bc83ca",
					)}
				</div>

				<input
					ref={this.state.inputRef}
					type="text"
					className="inputScreen__input"
				/>

				<div className="inputScreen__buttons">
					<div onClick={() => this.send()}>
						{LangString(
							"components.AdvancedQuests.components.EnterWord.index.c8c869b0097231ef97d32a67d4c075ba",
						)}
					</div>
					<div onClick={() => this.exit()}>
						{LangString(
							"components.AdvancedQuests.components.EnterWord.index.a45dc0b94735013b27345ef2e409c055",
						)}
					</div>
				</div>
			</div>
		);
	}
}
