import { LangString } from "../../modules/lang";
import React, { Component } from "react";

import { CustomEventHandler } from "../../../shared/custom.event";
import { CustomEvent } from "../../modules/custom.event";
import { CEF } from "../../modules/CEF";

import "./style.scss";

import divingImg from "./assets/img/diving.png";
import divingIcon from "./assets/img/ico.png";
import closeIcon from "./assets/img/exit.svg";


export class DivingEmployer extends Component<
	{},
	{
		isWorking: boolean;
	}
> {
	ev: CustomEventHandler;
	private containerRef: React.RefObject<HTMLDivElement>;
	constructor(props: any) {
		super(props);

		this.state = {
			isWorking: false,
		};

		this.ev = CustomEvent.register(
			"divingEmployer:setIsWorking",
			(isWorking: boolean) => {
				this.setState({ isWorking });
			},
		);

		this.containerRef = React.createRef();
		this.adjustZoom = this.adjustZoom.bind(this);
	}

	componentDidMount() {
		this.adjustZoom();
		window.addEventListener("resize", this.adjustZoom);
	}

	componentWillUnmount() {
		this.ev.destroy();
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

	onClickHandle() {
		CustomEvent.triggerClient("diving:switcher");
		CEF.gui.setGui(null);
	}

	render() {
		return (
			<div className="diving-container-box">
				<div className="diving-box" ref={this.containerRef}>
					<div className="diving-exit">
						<p>
							{LangString(
								"components.DivingEmployer.DivingEmployer.d962d68c1d650a6dcdc44178c3c1201d",
							)}
						</p>
						<div className="exit-img" onClick={() => CEF.gui.setGui(null)}>
							<img src={closeIcon} alt="Exit" />
						</div>
					</div>

					<div className="diving">
						<div className="left">
							<div className="title-diving">
								<img src={divingIcon} alt="" />
								<h1>
									{LangString(
										"components.DivingEmployer.DivingEmployer.38baf98a649010262e9e58aec9a4e47c",
									)} <span>									
										{LangString(
											"components.DivingEmployer.DivingEmployer.39f72696b3337bca8d0f5b06aff7db87",
										)}
									</span>
								</h1>
							</div>
							<p>
								{LangString(
									"components.DivingEmployer.DivingEmployer.1b9247a6064e0154a66bcbeabdb17ccf",
								)}
								<br />
								<br />
								{LangString(
									"components.DivingEmployer.DivingEmployer.401d07f7b7318e285f85b2c63fd99f77",
								)}
							</p>
							<button type="button" onClick={() => this.onClickHandle()}>
								{this.state.isWorking ?
									LangString(
										"components.DivingEmployer.DivingEmployer.01c0ebd5db76121334780bdb475ab216",
									) :
									LangString(
										"components.DivingEmployer.DivingEmployer.41288fd2338866a224aa63ea684a6786",
									)
								}
							</button>
						</div>
						<img className="diving-img" src={divingImg} alt="" />
					</div>
				</div>
			</div>
		)		
	}
}
