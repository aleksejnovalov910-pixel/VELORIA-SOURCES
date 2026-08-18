import React from "react";
import { LangString } from "../../../modules/lang";
import { CEF } from "../../../modules/CEF";

const icons = Object.fromEntries(
    Object.entries(
        import.meta.glob("../assets/images/*.png", { eager: true }),
    ).map(([key, value]: [string, { default: string }]) => {
        const name = key.match(/\/([^/]+)\.png$/)[1];
        return [name, value.default];
    }),
);

type MatchesProps = {
    createType: "deathmatch" | "gungame" | "teamfight";
    createLocation: number;
    createFreeEnter: boolean;
    places: any[];
    refRoomName: React.RefObject<HTMLInputElement>;
    refRoomPass: React.RefObject<HTMLInputElement>;
    refRoomPrice: React.RefObject<HTMLInputElement>;
    onChangeCreateType: (type: "deathmatch" | "gungame" | "teamfight") => void;
    onChangeCreateLocation: (toggle: boolean) => void;
    onChangeCreateFreeEnter: () => void;
}

const Matches: React.FC<MatchesProps> = ({
    createType,
    createLocation,
    createFreeEnter,
    places,
    refRoomName,
    refRoomPass,
    refRoomPrice,
    onChangeCreateType,
    onChangeCreateLocation,
    onChangeCreateFreeEnter
}) => {
    return (
        <>
            <div className="matches">
                <div
                    className={`match-type ${createType === "deathmatch" ? "selected" : ""}`}
                    onClick={() => onChangeCreateType("deathmatch")}
                >
                    <div className="img">
                        <img src={icons['deathmatch']} alt="deathmatch" />
                    </div>
                    <h2>
                        {LangString(
                            "components.GunGame.GunGame.7304a89f2581323336fdffe8ffce1796"
                        )}
                    </h2>
                </div>
                <div
                    className={`match-type ${createType === "gungame" ? "selected" : ""}`}
                    onClick={() => onChangeCreateType("gungame")}
                >
                    <div className="img">
                        <img src={icons['gungame']} alt="gungame" />
                    </div>
                    <h2>
                        {LangString(
                            "components.GunGame.GunGame.3a52c673b1fdf91c4ac161e7314f0b76"
                        )}
                    </h2>
                </div>
                <div
                    className={`match-type ${createType === "teamfight" ? "selected" : ""}`}
                    onClick={() => onChangeCreateType("teamfight")}
                >
                    <div className="img">
                        <img src={icons['teamfight']} alt="teamfight" />
                    </div>
                    <h2>
                        {LangString(
                            "components.GunGame.GunGame.0293776ac3bf7dba12cdcb204710473a"
                        )}
                    </h2>
                </div>
            </div>
            <div className="info">
                <img src={icons['info-ico']} alt="info-ico" />
                <p>
                    {createType === "teamfight" && LangString(
                        "components.GunGame.GunGame.54fdff0b1beb5b57b0ee68145e0e8636"
                    )}

                    {createType === "gungame" && LangString(
                        "components.GunGame.GunGame.c7a9f01882579252c47a86e4b82c4bd7"
                    )}

                    {createType === "deathmatch" && LangString(
                        "components.GunGame.GunGame.c7a9f01882579252c47a86e4b82c4bd7"
                    )}
                </p>
            </div>
            <hr />
            <h3>
                {LangString(
                    "components.GunGame.GunGame.180c2b1c581445b5e2caa258d40e923f"
                )}
            </h3>
            <div className="locations">
                <div className="location">
                    <div className="img-location-box">
                        <img
                            className="img-location"
                            src={places[createLocation].imgLocation}
                            alt={""}
                        />
                    </div>

                    <div className="controls">
                        <div className="arrow-left arrow-gg" onClick={() => onChangeCreateLocation(true)}>
                            <img src={icons['arrow-left']} alt="arrow-left" />
                        </div>
                        <h2>{places[createLocation].name}</h2>
                        <div className="arrow-right arrow-gg" onClick={() => onChangeCreateLocation(false)}>
                            <img src={icons['arrow-right']} alt="arrow-right" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="element">
                <h1>
                    {LangString(
                        "components.GunGame.GunGame.b31a64512c717bb493cc8733d505aeba"
                    )}
                </h1>
                <input
                    ref={refRoomName}
                    spellCheck="false"
                    type="text"
                    defaultValue={LangString(
                        "components.GunGame.GunGame.c8b9a24f3bbd2fa797380ca9f1902ef4",
                        CEF.user.name,
                    )}
                />
            </div>
            <div className="free-entry">
                <div
                    className="check"
                    onClick={onChangeCreateFreeEnter}
                >
                    <div
                        className={`check-circle ${createFreeEnter ? "selected" : ""}`}
                    ></div>
                </div>
                <h1>
                    {LangString(
                        "components.GunGame.GunGame.912c8fc18fe4e4ed8e563d36bfc80666",
                    )}
                </h1>
            </div>
            <div className="element">
                <h1>
                    {LangString(
                        "components.GunGame.GunGame.47c10db3fced3d771fab7b88a3134863",
                    )}
                </h1>
                <input
                    ref={refRoomPass}
                    spellCheck="false"
                    type="password"
                />
            </div>
            <div className="element">
                <h1>
                    {LangString(
                        "components.GunGame.GunGame.90f0ac36673261e3ec0886977b40ac50",
                    )}
                </h1>
                <input
                    ref={refRoomPrice}
                    spellCheck="false"
                    type="text"
                    defaultValue={0}
                />
            </div>
            <div className="info info-last">
                <img src={icons['info-ico']} alt="info-ico" />
                <p>
                    {LangString(
                        "components.GunGame.GunGame.615fdffba236124317372c50267c3e06",
                    )}
                </p>
            </div>
        </>
    );
};

export default Matches;
