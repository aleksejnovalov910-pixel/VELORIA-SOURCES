import { LangString } from "../../modules/lang";
import React, { Component } from "react";
import { CustomEvent } from "../../modules/custom.event";
import { CEF } from "../../modules/CEF";
import { inventoryShared } from "../../../shared/inventory";

import "./style.scss";
import exitIcon from "./exit.svg";

const images = Object.fromEntries(
	Object.entries(
		import.meta.glob("../../../shared/SuccessInfo/*.png", { eager: true }),
	).map(([key, value]: [string, any]) => {
		const name = key.match(/\/([^/]+)\.png$/)[1];
		return [name, value.default];
	}),
);

const imagesWebp = Object.fromEntries(
	Object.entries(
		import.meta.glob("../../../shared/SuccessInfo/*.webp", { eager: true }),
	).map(([key, value]: [string, any]) => {
		const name = key.match(/\/([^/]+)\.webp$/)[1];
		return [name, value.default];
	}),
);



export class SuccessScreen extends Component<
	{},
	{
		data: [string, string, string][];
		title?: string;
		desc?: string;
		image?: string;
	}
> {
	private containerRef: React.RefObject<HTMLDivElement>;

	constructor(props: any) {
		super(props);
		this.state = {
			data: [],
			// title: 'Gdfgd',
			// desc: 'string',
			// image: "card",
		};
		CustomEvent.register(
			"success:screen:show",
			(title: string, desc: string, image: string) => {
				CEF.gui.setCursor(true);
				if (this.state.title)
					return this.setState({
						data: [...this.state.data, [title, desc, image]],
					});
				this.setState({ title, desc, image });
			},
		);
		CustomEvent.register("success:screen:showitem", (item: number) => {
			const cfg = inventoryShared.get(item);
			if (!cfg || !cfg.helpDesc || !cfg.helpIcon) return;
			CEF.gui.setCursor(true);
			if (this.state.title)
				return this.setState({
					data: [...this.state.data, [cfg.name, cfg.helpDesc, cfg.helpIcon]],
				});
			this.setState({
				title: cfg.name,
				desc: cfg.helpDesc,
				image: cfg.helpIcon,
			});
		});

		this.containerRef = React.createRef();
		this.adjustZoom = this.adjustZoom.bind(this);
	}

	componentDidMount() {
		this.adjustZoom();
		window.addEventListener("resize", this.adjustZoom);
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.adjustZoom);
	}
	adjustZoom() {
		const container = this.containerRef.current;
		if (container) {
			const zoomCountOne = window.innerWidth / 1920;
			const zoomCountTwo = window.innerHeight / 1080;

			if (zoomCountOne < zoomCountTwo) {
				container.style.zoom = zoomCountOne.toString();
			} else {
				container.style.zoom = zoomCountTwo.toString();
			}
		}
	}


	render() {
		if (!this.state.title) return <></>;

		return (
			<div className="carving-knife-container-box" style={{ zIndex: 999999 }}>
				<div className="carving-knife-box" ref={this.containerRef}>
					<div className="carving-knife-exit">
						<p>Exit</p>
						<div className="exit-img">
							<img src={exitIcon} alt="Exit" />
						</div>
					</div>

					<div className="carving-knife">
						<div className="knife-box">
							<img src={images[this.state.image] || imagesWebp[this.state.image]} alt="" />
						</div>
						<h1>{this.state.title}</h1>
						<p>{this.state.desc}</p>
						<button
							onClick={(e) => {
								e.preventDefault();
								if (this.state.data.length > 0) {
									const data = [...this.state.data];
									this.setState(
										{
											title: this.state.data[0][0],
											desc: this.state.data[0][1],
											image: this.state.data[0][2],
										},
										() => {
											data.splice(0, 1);
											this.setState({ data });
										},
									);
								} else {
									this.setState({
										title: null,
										desc: null,
										image: null,
									});
									CEF.gui.setCursor(false);
								}
							}}
						>
							{LangString(
								"components.SuccessInfo.index.b8d9cf54d56ac0250193f5c1a0d135e3",
							)}
						</button>
					</div>
				</div>
			</div>
		)	
	}
}
