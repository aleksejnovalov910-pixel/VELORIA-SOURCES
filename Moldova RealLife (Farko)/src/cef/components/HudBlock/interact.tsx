import "./interact.scss";
import React, { Component } from "react";
import { CustomEvent } from "../../modules/custom.event";
import type { CustomEventHandler } from "../../../shared/custom.event";

export class HudInteractClass extends Component<
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	{},
	{
		key: string;
		text: string;
	}
> {
	ev: CustomEventHandler;
	ev2: CustomEventHandler;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	progress: any;
	up = false; //
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	constructor(props: any) {
		super(props);

		this.state = {
			key: null,
			text: null,
		};

		this.ev = CustomEvent.register("cef:alert:setHelpKey", (key, text) => {
			this.setState({ key, text });
		});
		this.ev2 = CustomEvent.register("cef:alert:removeHelpKey", () => {
			this.setState({ key: null });
		});

		setInterval(() => {
			if (!this.progress) return;
			this.progress.animate(this.up ? 1.0 : 0.0);
			this.up = !this.up;
		}, 1401);
	}

	componentWillUnmount() {
		if (this.ev) this.ev.destroy();
		if (this.ev2) this.ev2.destroy();
	}
	render() {
		return (
			<div
				className="hud-interaction-wrapper"
				style={{ display: this.state.key ? "flex" : "none" }}
			>
				<div className="box">
					<div className="enter-the-action" />
					<h1>{this.state.text}</h1>
				</div>
			</div>
		);
	}
}
