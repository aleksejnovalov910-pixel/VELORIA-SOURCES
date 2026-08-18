import React from "react";
import { LangString } from "../../../modules/lang";
import { IGunGameSession } from "../../../../shared/gungame";


const icons = Object.fromEntries(
    Object.entries(
        import.meta.glob("../assets/images/*.png", { eager: true }),
    ).map(([key, value]: [string, { default: string }]) => {
        const name = key.match(/\/([^/]+)\.png$/)[1];
        return [name, value.default];
    }),
);


type GunGameListProps = {
    sessions: IGunGameSession[];
    places: any[];
    sessionAction: (id: number) => void;
}

const GunGameList: React.FC<GunGameListProps> = ({ sessions, places, sessionAction }) => {
    return (
        <>
            <hr />
            <div className="games">
                {!sessions.length && <h1 style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: ' translate(-50%, -50%)'
                }}>Nu au fost gasite sesiuni. Creeaza una noua!</h1>}
                {sessions.map((game: IGunGameSession, index: number) => (
                    <div className="game" key={index}>
                        <img
                            className="img-game"
                            src={places[game.place]?.imgPlace}
                            alt={game.name}
                        />
                        <div className="details">
                            <h1>{game.name}</h1>
                            <div className="type">
                                <div className="type-img">
                                    <img
                                        className="img-type"
                                        src={icons[game.type]}
                                        alt={game.type}
                                    />
                                </div>
                                <h2>{game.type ?? "Game"}</h2>
                            </div>
                            <div className="location">
                                <img src={icons['location']} alt="location" />
                                <h2>{places[game.place]?.name ?? "Place"}</h2>
                            </div>
                            <div className="players-time">
                                <div className="players element-box">
                                    <div className="element-img">
                                        <img src={icons['players']} alt="players" />
                                    </div>
                                    <h3>{game.online} / {game.maxPlayers}</h3>
                                </div>

                                <div className="time element-box">
                                    <div className="element-img">
                                        <img src={icons['time']} alt="time" />
                                    </div>
                                    <h3>{game.time}</h3>
                                </div>
                            </div>
                            <div className="money element-box">
                                <div className="element-img">
                                    <img src={icons['money']} alt="money" />
                                </div>
                                <h4>$
                                    {`${game.price}`.replace(
                                        /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                        " ",
                                    )}
                                </h4>
                            </div>
                            <button
                                type="button"
                                onClick={() => sessionAction(game.id)}
                            >
                                {LangString(
                                    "components.GunGame.GunGame.e23f7adb15120b21735290e811908cdc"
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default GunGameList;