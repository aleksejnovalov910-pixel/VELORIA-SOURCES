import { LangString } from "../../../../modules/lang";
import React, { useCallback, useState } from "react";
import "../../style.less";

const svg = Object.fromEntries(
	Object.entries(import.meta.glob("../../assets/*.svg", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.svg$/)[1];
			return [name, value.default];
		},
	),
);
const png = Object.fromEntries(
	Object.entries(import.meta.glob("../../assets/*.png", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.png$/)[1];
			return [name, value.default];
		},
	),
);
import classNames from "classnames";
import { CustomEvent } from "../../../../modules/custom.event";

const Enter: React.FC = () => {
	const [password, setPassword] = useState(true);

	const createSession = useCallback(() => {
		CustomEvent.triggerServer("sanitation:createSquad", !password);
	}, []);

	const getSessions = useCallback(() => {
		CustomEvent.triggerServer("sanitation:getSessions");
	}, []);

	return (
		<>
			<div className="garbageLobby__title">
				{LangString(
					"components.GarbageLobby.components.Enter.Enter.f517dce204eba3190a637bf831562e4e",
				)}{" "}
				<br />{" "}
				<span>
					{LangString(
						"components.GarbageLobby.components.Enter.Enter.7515dac51af7c18c1c0bb00527111490",
					)}
				</span>
			</div>

			<div className="garbageLobby__text">
				{LangString(
					"components.GarbageLobby.components.Enter.Enter.8d97fe2bdb6becc4d775d648d4a92d57",
				)}
			</div>

			<div className="garbageLobby-images">
				<div className="garbageLobby-images__block">
					<img src={png["cash"]} alt="" />
					<p>
						{LangString(
							"components.GarbageLobby.components.Enter.Enter.1c001fe2f31da1f50fe42cb191e5a293",
						)}
					</p>
					<div>
						{LangString(
							"components.GarbageLobby.components.Enter.Enter.e794144c2f76a8e86fc795157355d468",
						)}
					</div>
					<span>
						{LangString(
							"components.GarbageLobby.components.Enter.Enter.6eb7b6c519a374c2e0e29eeb1d3fac3b",
						)}
					</span>
				</div>
				<div className="garbageLobby-images__block">
					<img src={png["flag"]} alt="" />
					<div>
						{LangString(
							"components.GarbageLobby.components.Enter.Enter.3608a0e6469c49fabcbdd068d08098cb",
						)}
					</div>
					<p>
						{LangString(
							"components.GarbageLobby.components.Enter.Enter.512ea760c392fe0ada9ff67028f8cef5",
						)}
					</p>
				</div>
				<div className="garbageLobby-images__block">
					<img src={png["garbage"]} alt="" />
					<p>
						{LangString(
							"components.GarbageLobby.components.Enter.Enter.4e09fea6797ab894ef6999347425b8be",
						)}
					</p>
					<div>
						{LangString(
							"components.GarbageLobby.components.Enter.Enter.395ceff6c29a16cfa8447d1df8afde78",
						)}
					</div>
				</div>
			</div>

			<div className="garbageLobby-redButton">
				<div
					className="garbageLobby-redButton__button"
					onClick={() => createSession()}
				>
					{LangString(
						"components.GarbageLobby.components.Enter.Enter.5954fd7b27d959853d80e689dca27f38",
					)}
				</div>
				<div
					className={classNames("garbageLobby-redButton__switcher", {
						"garbageLobby-redButton__switcher-active": password,
					})}
					onClick={() => setPassword(!password)}
				>
					<div />
				</div>
				<span>
					{LangString(
						"components.GarbageLobby.components.Enter.Enter.5333103c35c6975963fa5587b0150888",
					)}
				</span>
			</div>

			<div className="garbageLobby-button" onClick={() => getSessions()}>
				{LangString(
					"components.GarbageLobby.components.Enter.Enter.54264c04c7a43bbfd25e85ff29442068",
				)}
			</div>
		</>
	);
};

export default Enter;
