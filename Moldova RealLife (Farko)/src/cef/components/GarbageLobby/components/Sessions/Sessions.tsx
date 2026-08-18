import { LangString } from "../../../../modules/lang";
import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import "../../style.less";
import { CustomEvent } from "../../../../modules/custom.event";

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
import { ILobbyDTO } from "../../../../../shared/jobs/sanitation/dto";

const Sessions: React.FC = () => {
	useLayoutEffect(() => {
		const ev = CustomEvent.register(
			"sanitation:setSessions",
			(data: ILobbyDTO[]) => {
				setLobbies(data);
			},
		);

		return () => ev.destroy();
	}, []);

	const [selected, setSelected] = useState<number>(-1);
	const [lobbies, setLobbies] = useState<ILobbyDTO[]>([]);

	const inputRef = useRef(null);

	const connect = useCallback(() => {
		if (selected === -1) return;

		const lobby = lobbies.find((el) => el.id === selected);

		if (lobby === undefined) return;

		CustomEvent.triggerServer(
			"sanitation:joinSquad",
			selected,
			lobby.isPublic ? null : inputRef.current.value,
		);
	}, [selected, lobbies]);

	return (
		<>
			<div className="garbageLobby__title">
				<span>
					{" "}
					{LangString(
						"components.GarbageLobby.components.Sessions.Sessions.e6fa152a1955493eb9381c5863b9d4d2",
					)}{" "}
				</span>
				{LangString(
					"components.GarbageLobby.components.Sessions.Sessions.99037dcda5e3e63d1feba5d09dc0a7d1",
				)}
			</div>

			{lobbies.map((el, key) => {
				return (
					<React.Fragment key={key}>
						<div
							className="garbageLobby-session"
							onClick={() => setSelected(el.id)}
						>
							{el.name}
						</div>

						{!el.isPublic && selected === el.id && (
							<div className="garbageLobby-sessionInput">
								<span>
									{LangString(
										"components.GarbageLobby.components.Sessions.Sessions.f6acc8cc816c0b8b89684ec317c3dd5b",
									)}
								</span>
								<input type="password" ref={inputRef} />
							</div>
						)}
					</React.Fragment>
				);
			})}

			<div className="garbageLobby-redButton garbageLobby-mt">
				<div
					className="garbageLobby-redButton__button"
					onClick={() => connect()}
				>
					{LangString(
						"components.GarbageLobby.components.Sessions.Sessions.d8d4d2c7f3281efcbe63b5bb66add898",
					)}
				</div>
			</div>
		</>
	);
};

export default Sessions;
