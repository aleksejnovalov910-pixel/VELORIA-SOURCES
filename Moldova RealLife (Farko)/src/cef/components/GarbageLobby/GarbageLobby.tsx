// Lang file ready
import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useState,
} from "react";
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

import { CloseButton } from "../CloseButton";

import Enter from "./components/Enter";
import Sessions from "./components/Sessions";
import YourSession from "./components/YourSession";

import { CustomEvent } from "../../modules/custom.event";
import { CEF } from "../../modules/CEF";

const GarbageLobby: React.FC = () => {
	useLayoutEffect(() => {
		const ev = CustomEvent.register(
			"sanitation:setComponent",
			(data: string) => {
				setComponent(data);
			},
		);
		return () => ev.destroy();
	});

	const [component, setComponent] = useState("enter");

	const close = useCallback(() => {
		CEF.gui.setGui(null);
	}, []);

	return (
		<div className="garbageLobby">
			<CloseButton onClickAction={() => close()} />

			<img
				src={png["background"]}
				alt=""
				className="garbageLobby__background"
			/>
			<img src={png["car"]} alt="" className="garbageLobby__car" />

			{component === "enter" && <Enter />}
			{component === "sessions" && <Sessions />}
			{component === "yourSession" && <YourSession />}
		</div>
	);
};

export default GarbageLobby;
