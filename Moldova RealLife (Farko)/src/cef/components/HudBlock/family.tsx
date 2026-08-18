import "./family.scss";
import React, { Component } from "react";
import { CustomEvent } from "../../modules/custom.event";
import type { CustomEventHandler } from "../../../shared/custom.event";

export class HudFamily extends Component<
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	{},
	{
		show: boolean;
		name?: string;
		points?: number;
		timer: number;
	}
> {
	ev: CustomEventHandler;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	mgTime: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	constructor(props: any) {
		super(props);

		this.state = {
			show: false,
			points: 0,
			name: "Family",
			timer: 1000,
		};
		this.ev = CustomEvent.register(
			"hud:cargoBattle",
			(show: boolean, name?: string, points?: number, tickTime?: number) => {
				this.setState({
					...this.state,
					show,
					name,
					points,
					timer: typeof tickTime === "number" ? tickTime : 1000,
				});
				this.updateFamilyGame();
			},
		);
		//        this.updateFamilyGame( );
	}

	updateFamilyGame = () => {
		if (this.mgTime) clearInterval(this.mgTime);
		if (this.state.timer <= 0) return;
		this.mgTime = setInterval(() => {
			if (this.state.points < 100)
				this.setState({ ...this.state, points: this.state.points + 1 });
			else this.hideGame();
		}, this.state.timer);
	};

	componentWillUnmount() {
		if (this.ev) this.ev.destroy();
		if (this.mgTime) clearInterval(this.mgTime);
	}
	hideGame = () => {
		if (this.mgTime) clearInterval(this.mgTime);
		this.setState({ points: 0, show: false });
	};
	render() {
		if (!this.state.show) return null;
		return (
			<div className="family-box">
				<h1 className="title">Family</h1>
				<h2>The zone is being held</h2>
				<div className="bar-box">
					<div className="bar" style={{ width: `${this.state.points}%` }} />
				</div>
				<div className="progress-box">
					<h1>{this.state.points} </h1>
					<h2>/ 100</h2>
				</div>
			</div>
		);
	}
}
