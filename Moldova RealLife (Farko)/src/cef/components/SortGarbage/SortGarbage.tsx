import { LangString } from "../../modules/lang";
import React, { useCallback, useState } from "react";
import "./style.less";
const png = Object.fromEntries(
	Object.entries(import.meta.glob("./assets/*.png", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.png$/)[1];
			return [name, value.default];
		},
	),
);
const svg = Object.fromEntries(
	Object.entries(import.meta.glob("./assets/*.svg", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.svg$/)[1];
			return [name, value.default];
		},
	),
);
const category = Object.fromEntries(
	Object.entries(
		import.meta.glob("./assets/categoryes/*.svg", { eager: true }),
	).map(([key, value]) => {
		const name = key.match(/\/([^/]+)\.svg$/)[1];
		return [name, value.default];
	}),
);
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { CustomEvent } from "../../modules/custom.event";

enum ContainerType {
	PAPER,
	GLASS,
	CAN,
}

interface IItem {
	img: string;
	position: { x: number; y: number };
	type: ContainerType;
	completed: boolean;
}

interface IContainer {
	color: "White" | "Red" | "Green";
	category: string;
	img: string;
	imgFront: string;
	type: ContainerType;
}

const SortGarbage = () => {
	const [dragItem, setDragItem] = useState<number>(null);
	const [container, setContainer] = useState<number>(null);

	const [items, setItems] = useState<IItem[]>([
		{
			img: "paper0",
			position: { x: 0, y: 0 },
			type: ContainerType.PAPER,
			completed: false,
		},
		{
			img: "metal0",
			position: { x: 0, y: 0 },
			type: ContainerType.CAN,
			completed: false,
		},
		{
			img: "paper1",
			position: { x: 0, y: 0 },
			type: ContainerType.PAPER,
			completed: false,
		},
		{
			img: "glass1",
			position: { x: 0, y: 0 },
			type: ContainerType.GLASS,
			completed: false,
		},
		{
			img: "paper0",
			position: { x: 0, y: 0 },
			type: ContainerType.PAPER,
			completed: false,
		},
		{
			img: "metal1",
			position: { x: 0, y: 0 },
			type: ContainerType.CAN,
			completed: false,
		},
		{
			img: "glass0",
			position: { x: 0, y: 0 },
			type: ContainerType.GLASS,
			completed: false,
		},
		{
			img: "metal0",
			position: { x: 0, y: 0 },
			type: ContainerType.CAN,
			completed: false,
		},
		{
			img: "glass0",
			position: { x: 0, y: 0 },
			type: ContainerType.GLASS,
			completed: false,
		},
	]);

	const [containers] = useState<IContainer[]>([
		{
			color: "White",
			category: "paper",
			img: "blueContainer",
			imgFront: "blueContainerFront",
			type: ContainerType.PAPER,
		},
		{
			color: "White",
			category: "glass",
			img: "greenContainer",
			imgFront: "greenContainerFront",
			type: ContainerType.GLASS,
		},
		{
			color: "White",
			category: "metal",
			img: "redContainer",
			imgFront: "redContainerFront",
			type: ContainerType.CAN,
		},
	]);

	const onStartDrag = useCallback((key: number) => {
		setDragItem(key);
	}, []);

	const checkOnFinish = useCallback(() => {
		if (items.filter((el) => el.completed === false).length === 0)
			CustomEvent.triggerServer("sanitation:sort:completedGame");
	}, []);

	const onStopDrag = useCallback(
		(e: DraggableEvent, data: DraggableData, key: number) => {
			const itemsCopy = [...items];
			if (container === null) return;
			if (containers[container].type === itemsCopy[key].type) {
				itemsCopy[key].position = { x: data.x, y: data.y };
				itemsCopy[key].completed = true;
				setItems(itemsCopy);
			}

			setDragItem(null);
			checkOnFinish();
		},
		[items, containers, container, checkOnFinish],
	);

	const pointerEnter = useCallback(
		(key: number) => {
			setContainer(key);

			if (dragItem === null) return;

			const item = items[dragItem];
			let containersCopy = [...containers];

			if (containers[key].type === item.type) {
				containersCopy[key].color = "Green";
			} else {
				containersCopy[key].color = "Red";
			}
		},
		[dragItem],
	);

	const pointerLeave = useCallback((key: number) => {
		let containersCopy = [...containers];

		containersCopy[key].color = "White";

		setContainer(null);
	}, []);
	return (
		<div className="sortGarbage">
			<img
				src={png["backgroundImage"]}
				className="sortGarbage__backgroundImage"
				alt=""
			/>

			<div className="sortGarbage-titleTopLeft">
				<span>
					{LangString(
						"components.SortGarbage.SortGarbage.40828bac2cf4eb1ed7d140837174da28",
					)}
					<br />{" "}
					{LangString(
						"components.SortGarbage.SortGarbage.b8fac711cc57681b04dd19a9dd564c58",
					)}
				</span>
				<p>
					{LangString(
						"components.SortGarbage.SortGarbage.82cf9894ccbfdd40508fcff73a04e27c",
					)}
				</p>
			</div>

			<div className="sortGarbage-slots">
				{items.map((el, key) => {
					return (
						<Draggable
							key={key}
							defaultPosition={{ x: 0, y: 0 }}
							position={el.position}
							onStart={() => onStartDrag(key)}
							onStop={(event, data) => onStopDrag(event, data, key)}
						>
							<div className={`sortGarbage-slots__${key}`}>
								<img src={png[el.img]} alt="" />
							</div>
						</Draggable>
					);
				})}
			</div>

			<div className="sortGarbage__bottomLeft">
				<img src={svg["mouse"]} alt="" />
				{LangString(
					"components.SortGarbage.SortGarbage.217433609c356cc5a467efff27092a45",
				)}{" "}
				<br />
				{LangString(
					"components.SortGarbage.SortGarbage.da0c53c46ebb1ef7b6464428cb9b448f",
				)}
			</div>

			<div className="sortGarbage-containers">
				{containers.map((el, key) => {
					return (
						<div className="sortGarbage-containers-block" key={key}>
							<img
								src={category[`${el.category}${el.color}`]}
								alt=""
								className="sortGarbage-containers-block__category"
							/>
							<img
								src={png[el.img]}
								alt=""
								className="sortGarbage-containers-block__container"
							/>
							<img
								src={png[el.imgFront]}
								alt=""
								className="sortGarbage-containers-block__containerFront"
							/>
							<div
								className="sortGarbage-containers-block__drop"
								onPointerEnter={() => pointerEnter(key)}
								onPointerLeave={() => pointerLeave(key)}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default SortGarbage;
