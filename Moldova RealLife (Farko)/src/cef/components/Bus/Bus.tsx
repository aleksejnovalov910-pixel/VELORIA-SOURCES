import { LangString } from "../../modules/lang";
import React, { Component, createRef } from "react";

import "./style/style.scss"

// import png from "./img/*.png"
// import svg from "./img/*.svg"
import { BUS_LEVELS, JobLevel } from "../../../shared/jobs/busman/config";
import { CustomEvent } from "../../modules/custom.event";
import { CustomEventHandler } from "../../../shared/custom.event";
import { CEF } from "../../modules/CEF";

const png = Object.fromEntries(
    Object.entries(import.meta.glob("./img/*.png", { eager: true })).map(
        ([key, value]: [string, { default: string }]) => {
            const name = key.match(/\/([^/]+)\.png$/)[1];
            return [name, value.default];
        },
    ),
);
const svg = Object.fromEntries(
    Object.entries(import.meta.glob("./img/*.svg", { eager: true })).map(
        ([key, value]: [string, { default: string }]) => {
            const name = key.match(/\/([^/]+)\.svg$/)[1];
            return [name, value.default];
        },
    ),
);
export class Bus extends Component<{}, {
    exp: number,
    currentType: number | null
}> {
    eventHandler: CustomEventHandler;


    containerRef = createRef<HTMLDivElement>();

    constructor(props: any) {
        super(props);

        this.state = {
            exp: 40,
            currentType: null
        }

        this.eventHandler = CustomEvent.register("busman:employerLoad", (exp: number, type: number | null) => {
            this.setState({ ...this.state, exp: Math.trunc(exp), currentType: type });
        });
    }

    public componentWillUnmount() {
        if (this.eventHandler) this.eventHandler.destroy();
        window.removeEventListener("resize", this.adjustZoom);
    }

    close() {
        CEF.gui.setGui(null);
        CEF.playSound("exitmagazin"); // ruleaza instant
        
    }

    startWork(type: number) {
        CustomEvent.triggerServer("busman:startWork", type);
        this.close();
    }

    stopWork() {
        CustomEvent.triggerClient("busman:finishWork");
        this.close();
    }

    componentDidMount() {
        this.adjustZoom();
        window.addEventListener("resize", this.adjustZoom);
    }

    adjustZoom = () => {
        const container = this.containerRef.current;
        if (container) {
            const zoomCountOne = window.innerWidth / 1920;
            const zoomCountTwo = window.innerHeight / 1080;

            if (zoomCountOne < zoomCountTwo) {
                container.style.zoom = `${zoomCountOne}`;
            } else {
                container.style.zoom = `${zoomCountTwo}`;
            }
        }
    };

    getButton(el: JobLevel): any {
        if (this.state.currentType === null) {
            if (this.state.exp < el.fromEXP) {
                return <button className="busdriver-buttons-top" disabled>Indisponibil</button>
            } else {
                return <button className="busdriver-button" onClick={() => this.startWork(el.index)}>Angajeaza-te</button>
            }
        } else {
            if (this.state.currentType === el.index) {
                return <button className="busdriver-button" onClick={() => this.stopWork()}>Demisioneaza</button>
            } else {
                return <button className="busdriver-buttons-top" disabled>Indisponibil</button>
            }
        }
    }

    render() {
        return (
            <div className="busdriver-container-box">
                <div className="busdriver-box" ref={this.containerRef}>
                    <div className="busdriver-gas-station-box">
                        <div className="busdriver-top">
                            
                            <div className="busdriver-exit">
                                <p>Exit</p>
                                <div className="exit-img" onClick={this.close}>
                                    <img src={svg['exit']} alt="Exit" />
                                </div >
                            </div>

                            <div className="busdriver-title">
                                <div className="busdriver-title-img">
                                    <img src={svg['ico']} alt="" />
                                    <h1>
                                        <span>Sofer</span>Autobuz
                                    </h1>
                                </div>
                                <p>
                                Bine ai venit la depoul de autobuze!
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                                Pentru inceput, alege orice nivel disponibil si incepe lucrul.
                                Nu uita sa reduci viteza inainte de a opri.



                                </p>
                                <div className="busdriver-your-experience">
                                    <h3>Experienta ta</h3>
                                    <h4>{this.state.exp} EXP</h4>
                                </div>
                            </div>
                            <img className="busdriver-bus" src={png['bus']} alt="" />
                        </div>
                        <div className="busdriver-content">
                            {
                                BUS_LEVELS.map((el, key) => {
                                    return (
                                        <div className="busdriver-level" key={key}>
                                            <div className="busdriver-level-title">
                                                <h1>
                                                    {el.index + 1} LVL <span>({el.fromEXP} exp )</span>
                                                </h1>
                                                <p>{el.description}</p>
                                            </div>
                                            <div className="busdriver-controls">
                                                <div className="busdriver-buttons-top">
                                                    Plata $ {el.payment}
                                                </div>
                                                {this.getButton(el)}
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}   