import { LangString } from "../../modules/lang";
import React, { useCallback, useLayoutEffect, useState, useRef, useEffect } from "react";
import "./style.less";

import "./style/style.scss"

const png = Object.fromEntries(
    Object.entries(import.meta.glob("./img/*.png", { eager: true })).map(
        ([key, value]: [string, any]) => {
            const name = key.match(/\/([^/]+)\.png$/)[1];
            return [name, value.default];
        },
    ),
);
const svg = Object.fromEntries(
    Object.entries(import.meta.glob("./img/*.svg", { eager: true })).map(
        ([key, value]: [string, any]) => {
            const name = key.match(/\/([^/]+)\.svg$/)[1];
            return [name, value.default];
        },
    ),
);
import { CustomEvent } from "../../modules/custom.event";
import { CEF } from "../../modules/CEF";

const Garbage = () => {

    const [working, setWorking] = useState<boolean>(false);

    useLayoutEffect(() => {
        const event = CustomEvent.register("sanitation:sort:hiring", (data: boolean) => {
            setWorking(data);
        })

        return () => event.destroy();
    }, []);

    const join = useCallback(() => {
        CustomEvent.triggerServer("sanitation:sort:join");
    }, []);

    const leave = useCallback(() => {
        CustomEvent.triggerServer("sanitation:sort:leave");
    }, []);

    const containerRef = useRef(null);

    useEffect(() => {
        function adjustZoom() {
            const container = containerRef.current;
            if (container) {
                const zoomCountOne = window.innerWidth / 1920;
                const zoomCountTwo = window.innerHeight / 1080;

                if (zoomCountOne < zoomCountTwo) {
                    container.style.zoom = zoomCountOne;
                } else {
                    container.style.zoom = zoomCountTwo;
                }
            }
        }

        adjustZoom();
        window.addEventListener("resize", adjustZoom);

        return () => {
            window.removeEventListener("resize", adjustZoom);
        };
    }, []);

    return <div className="garbsingle-container-box">
        <div className="garbsingle-box" ref={containerRef}>

            <div className="garbsingle-exit">
                <p>Exit</p>
                <div className="exit-img" onClick={() => CEF.gui.setGui(null)}>
                    <img src={svg["exit"]} alt="Exit" />
                </div>
            </div>

            <div className="garbsingle-gas-station-box">
                <img className="garbsingle-builder" src={png["builder"]} alt="" />
                <div className="garbsingle-left">
                    <div className="garbsingle-title">
                        <div className="garbsingle-title-img">
                            <img src={svg["ico"]} alt="" />
                            <h1>
                                <span>Job </span> Gunoier
                            </h1>
                        </div>
                        <p>
                            {LangString(
                                "components.Garbage.Garbage.6f9d526d2c95786c839a59e723f87ed3",
                            )}
                            <br />
                            {LangString(
                                "components.Garbage.Garbage.2689c3e21c04b0e781d616201a25083f",
                            )}
                        </p>
                    </div>
                </div>
                {
                    working ? <div className="garbsingle-sessions-box">
                        <div className="garbsingle-salary">
                            <h1>Salariu</h1>
                            <h2>
                                $50 <span> per unitate</span>
                            </h2>
                        </div>
                        <div className="garbsingle-session-controls">
                            <button className="garbsingle-back" onClick={() => leave()}>
                                {LangString(
                                    "components.Garbage.Garbage.e2d0684981baf5f0b4d66af58c81d01c",
                                )}

                            </button>
                        </div>
                    </div>
                        :
                        <div className="garbsingle-controls">
                            <div className="garbsingle-salary">
                                <h1>Salariu</h1>
                                <h2>
                                    50$<span> per unitate</span>
                                </h2>
                            </div>
                            <div className="garbsingle-controls-top">
                                <button onClick={() => join()}>
                                    {LangString(
                                        "components.Garbage.Garbage.e59fbfc5bacdbc8d7e439f2abde72d8b",
                                    )}
                                </button>
                            </div>
                        </div>
                }
            </div>
        </div>
    </div>



}

export default Garbage
