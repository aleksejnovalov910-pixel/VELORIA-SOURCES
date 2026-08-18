import { LangString } from "../../../../modules/lang";
import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useState,
} from "react";
import "../../style.less";

const svg = Object.fromEntries(
	Object.entries(import.meta.glob("../../assets/*.svg", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.svg$/)[1];
			return [name, value.default];
		},
	),
);
import { CustomEvent } from "../../../../modules/custom.event";
import { IMyLobbyDTO } from "../../../../../shared/jobs/sanitation/dto";
import classNames from "classnames";

const YourSession: React.FC = () => {
	const [lobby, setLobby] = useState<IMyLobbyDTO>({
		id: -1,
		players: ["Zaz", "raz"],
		ownerName: "Zaz",
	});

	useLayoutEffect(() => {
		const ev = CustomEvent.register(
			"sanitation:setMyLobby",
			(data: IMyLobbyDTO) => {
				setLobby(data);
			},
		);

		return () => ev.destroy();
	}, []);

	const leave = useCallback(() => {
		CustomEvent.triggerServer("sanitation:leaveSquad");
	}, []);

	return (
		<>
			<div className="garbageLobby__title">
				<span>
					{LangString(
						"components.GarbageLobby.components.YourSession.YourSession.2f493c84e716a9915c902b7c956a0540",
					)}
				</span>{" "}
				#{lobby.id}
			</div>

			{lobby.players.map((el, key) => {
				return (
					<div
						className={classNames("garbageLobby-player", {
							"garbageLobby-player__crown": lobby.ownerName === el,
						})}
						key={key}
					>
						{el}
						<img src={svg["crown"]} alt="" />
						<img src={svg["mark"]} alt="" />
					</div>
				);
			})}

			<div className="garbageLobby-greenButton" onClick={() => leave()}>
				{LangString(
					"components.GarbageLobby.components.YourSession.YourSession.31da02586852ebcabf63519d7d773115",
				)}
			</div>
		</>
	);
};

export default YourSession;
