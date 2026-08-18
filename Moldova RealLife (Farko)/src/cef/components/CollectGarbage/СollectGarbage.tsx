import { LangString } from "../../modules/lang";
import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useState,
} from "react";
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
import Draggable from "react-draggable";
import { CustomEvent } from "../../modules/custom.event";
import { CEF } from "../../modules/CEF";

interface IItem {
	image: string;
	isDragging: boolean;
	inBag: boolean;
}

const CollectGarbage: React.FC = () => {
	const [id, setId] = useState<number>(-1);
	const [step, setStep] = useState<number>(-1);

	useLayoutEffect(() => {
		const event = CustomEvent.register(
			"sanitation:collectGarbage",
			(step: number, id: number) => {
				setId(id);
				setStep(step);
			},
		);
		return () => event.destroy();
	}, []);

	const [items, setItems] = useState<IItem[]>([
		{
			image: "banana",
			isDragging: false,
			inBag: false,
		},
		{
			image: "apple",
			isDragging: false,
			inBag: false,
		},
		{
			image: "bottle",
			isDragging: false,
			inBag: false,
		},
		{
			image: "can0",
			isDragging: false,
			inBag: false,
		},
		{
			image: "can1",
			isDragging: false,
			inBag: false,
		},
		{
			image: "can2",
			isDragging: false,
			inBag: false,
		},
		{
			image: "can3",
			isDragging: false,
			inBag: false,
		},
		{
			image: "twix0",
			isDragging: false,
			inBag: false,
		},
		{
			image: "twix1",
			isDragging: false,
			inBag: false,
		},
		{
			image: "banana",
			isDragging: false,
			inBag: false,
		},
	]);

	const getDraggingItem = useCallback(() => {
		let i = null;

		items.forEach((el, key) => {
			if (el.isDragging) i = key;
		});

		return i;
	}, []);

	const onStartDrag = useCallback((key: number) => {
		const itemsCopy = [...items];
		itemsCopy[key].isDragging = true;
		setItems(itemsCopy);
	}, []);

	const checkOnFinish = useCallback(() => {
		if (items.filter((el) => el.inBag === false).length === 0) {
			CustomEvent.triggerClient("sanitation:collectGarbage:finish", step, id);
		}
	}, [step, id]);

	const onStopDrag = useCallback(
		(key: number) => {
			let itemsCopy = [...items];
			itemsCopy[key].isDragging = false;
			setItems(itemsCopy);
			checkOnFinish();
		},
		[checkOnFinish],
	);

	const pointerEnterOnBag = useCallback(() => {
		let key = getDraggingItem();
		if (key === null) return;
		let itemsCopy = [...items];
		itemsCopy[key].inBag = true;
		setItems(itemsCopy);
	}, []);

	const pointerLeaveFromBag = useCallback(() => {
		let key = getDraggingItem();
		if (key === null) return;
		let itemsCopy = [...items];
		itemsCopy[key].inBag = false;
		setItems(itemsCopy);
	}, []);

	return (
		<div className="collectGarbage">
			<img
				src={png["backgroundImage"]}
				className="collectGarbage__backgroundImage"
				alt=""
			/>

			<img src={png["bagBack"]} className="collectGarbage__bagBack" alt="" />
			<img src={png["bagFront"]} className="collectGarbage__bagFront" alt="" />

			<div className="collectGarbage-titleTopLeft">
				<span>
					{LangString(
						"components.CollectGarbage.СollectGarbage.a9eea7ae0d49804d68f80da58dd665f6",
					)}{" "}
					<br />{" "}
					{LangString(
						"components.CollectGarbage.СollectGarbage.b8303b073726441db978aa442fe11ba1",
					)}
				</span>
				<p>
					{LangString(
						"components.CollectGarbage.СollectGarbage.9b5935f98c27d724852ad0ab716812b3",
					)}
				</p>
			</div>

			<div className="collectGarbage-slots">
				{items.map((el, key) => {
					return (
						<Draggable
							onStart={() => onStartDrag(key)}
							onStop={() => onStopDrag(key)}
							key={key}
						>
							<div className={`collectGarbage-slots__${key}`}>
								<img src={png[el.image]} alt="" />
							</div>
						</Draggable>
					);
				})}
			</div>

			<div
				className="collectGarbage__dropBlock"
				onPointerEnter={() => pointerEnterOnBag()}
				onPointerLeave={() => pointerLeaveFromBag()}
			/>

			<div className="collectGarbage__bottomLeft">
				<img src={svg["mouse"]} alt="" />
				{LangString(
					"components.CollectGarbage.СollectGarbage.90df490021a74d7a51b4d9d67f65af30",
				)}{" "}
				<br />
				{LangString(
					"components.CollectGarbage.СollectGarbage.73da92497c90f720f6e347c4b37ebe9d",
				)}
			</div>
		</div>
	);
};

export default CollectGarbage;
