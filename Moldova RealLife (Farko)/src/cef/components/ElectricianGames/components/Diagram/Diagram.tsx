import { LangString } from "../../../../modules/lang";
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

import {
	DiagramItem,
	DiagramMaps,
} from "../../../../../shared/jobs/electrician/config";
import { CEF } from "../../../../modules/CEF";
import { CustomEvent } from "../../../../modules/custom.event";

export class Diagram extends Component<
	{},
	{
		DiagramMap: DiagramItem[];
		currentBlock: number;
	}
> {
	constructor(props: any) {
		super(props);

		let copy: string = JSON.stringify(
			DiagramMaps[Math.floor(Math.random() * DiagramMaps.length)],
		);

		this.state = {
			DiagramMap: JSON.parse(copy),
			currentBlock: 0,
		};
	}

	close() {
		CEF.gui.setGui(null);
	}

	drawDirection(el: DiagramItem) {
		if (el.currentDirection) {
			return <div className={`diagram-line_${el.currentDirection}`} />;
		} else {
			return null;
		}
	}

	blockClick(key: number) {
		let DiagramMap = [...this.state.DiagramMap],
			currentBlock = DiagramMap[this.state.currentBlock],
			clickedBlock = DiagramMap[key];

		if (!currentBlock.next) return this.finishGame(false);
		if (clickedBlock.active) return;

		if (typeof currentBlock.next === "number") {
			if (currentBlock.next !== key) return this.finishGame(false);
			// @ts-ignore
			currentBlock.currentDirection = currentBlock.direction;
		} else {
			if (currentBlock.next.indexOf(key) === -1) return this.finishGame(false);
			currentBlock.currentDirection =
				currentBlock.direction[currentBlock.next.indexOf(key)];
		}

		clickedBlock.active = true;

		DiagramMap[this.state.currentBlock] = currentBlock;
		DiagramMap[key] = clickedBlock;

		this.setState({ ...this.state, DiagramMap, currentBlock: key });
	}

	finishGame(success: boolean) {
		CustomEvent.triggerClient("electrician:gameComplete", success);
		CEF.gui.setGui(null);
	}

	render() {
		return (
			<div className="diagram">
				<div className="exit" onClick={() => this.close()}>
					<div className="exit__icon">
						<img src={svg["closeIcon"]} alt="#" />
					</div>
					<div className="exit__title">
						{LangString(
							"components.ElectricianGames.components.Diagram.Diagram.a7ed5d21faabd808c1e958026bba3fe3",
						)}
					</div>
				</div>

				<img
					src={png["diagramBackground"]}
					alt=""
					className="diagram__background"
				/>

				<div className="diagram__title">
					{LangString(
						"components.ElectricianGames.components.Diagram.Diagram.aa64649fe9178386de8ace3c37c231ce",
					)}
				</div>

				<div className="diagram__text">
					<span>
						{LangString(
							"components.ElectricianGames.components.Diagram.Diagram.647d994b726436cd7b60119cd530f0e6",
						)}
					</span>{" "}
					<br />
					{LangString(
						"components.ElectricianGames.components.Diagram.Diagram.ec00de912f2b510c6822cab768d52e9a",
					)}
				</div>

				<img src={png["prompt"]} alt="" className="diagram__prompt" />

				<div className="diagram-blocks">
					<img src={svg["start"]} alt="" className="diagram-blocks__start" />
					<img src={svg["finish"]} alt="" className="diagram-blocks__finish" />

					{this.state.DiagramMap.map((el, key) => {
						return (
							<div
								className={`${el.plus ? "diagram-blocks__plus" : "diagram-blocks__minus"} ${el.active ? "diagram-active" : null}`}
								key={key}
								onClick={() => this.blockClick(key)}
							>
								<div className="diagram-blocks__block" />
								{this.drawDirection(el)}
							</div>
						);
					})}
				</div>

				<div className="diagram__flash">
					{this.state.currentBlock === 15 ? (
						<img
							src={svg["diagramFlashActive"]}
							alt=""
							onClick={() => this.finishGame(true)}
						/>
					) : (
						<img src={svg["diagramFlash"]} alt="" />
					)}
				</div>
			</div>
		);
	}
}
