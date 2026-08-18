import React, { Component, createRef } from "react";

import "./style/style.scss"
// import "./fonts/*.otf"

import { ELECTRICIAN_LEVELS, JobLevel, WORK_TYPE } from "../../../shared/jobs/electrician/config";

import bus from "./img/bus.png"
import exitSvg from "./img/exit.svg"

import { CustomEvent } from "../../modules/custom.event";
import { CustomEventHandler } from "../../../shared/custom.event";
import { CEF } from "../../modules/CEF";

const png = Object.fromEntries(
    Object.entries(import.meta.glob("./assets/*.png", { eager: true })).map(
        ([key, value]: [string, any]) => {
            const name = key.match(/\/([^/]+)\.png$/)[1];
            return [name, value.default];
        },
    ),
);
const svg = Object.fromEntries(
    Object.entries(import.meta.glob("./assets/*.svg", { eager: true })).map(
        ([key, value]: [string, any]) => {
            const name = key.match(/\/([^/]+)\.svg$/)[1];
            return [name, value.default];
        },
    ),
);
export class Electrician extends Component<{}, {
    exp: number,
    currentType: WORK_TYPE | null
}> {
    eventHandler: CustomEventHandler;
    containerRef = createRef<HTMLDivElement>();

    constructor(props: any) {
        super(props);

        this.state = {
            exp: 40,
            currentType: null
        }

        this.eventHandler = CustomEvent.register('electrician:employerLoad', (exp: number, type: WORK_TYPE | null) => {
            this.setState({ exp: Math.trunc(exp), currentType: type });
        });
    }

    public componentWillUnmount() {
        if (this.eventHandler) this.eventHandler.destroy();
        window.removeEventListener("resize", this.adjustZoom);
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
                return <button className="electrican-buttons-top" disabled>Indisponibil</button>
            } else {
                return <button className="electrican-button" onClick={() => this.startWork(el.index)}>Angajeaza-te</button>
            }
        } else {
            if (this.state.currentType === el.index) {
                return <button className="electrican-button" onClick={() => this.stopWork()}>Demisioneaza</button>
            } else {
                return <button className="electrican-buttons-top" disabled>Indisponibil</button>
            }
        }
    }

    startWork(type: WORK_TYPE) {
        CustomEvent.triggerServer('electrician:check', type);
        this.close();
    }

    stopWork() {
        CustomEvent.triggerClient('electrician:finish');
        this.close();
    }

    close() {
        CEF.gui.setGui(null);
    }


    render() {
        return <div className="electrican-container-box">
            <div className="electrican-box" ref={this.containerRef}>
                <div className="electrican-gas-station-box">
                    <div className="electrican-top">
                        <div className="electrican-exit">
                            <p>Exit</p>
                            <div className="exit-img" onClick={this.close}>
                                <img src={exitSvg} alt="Exit" />
                            </div >
                        </div>

                        <div className="electrican-title">
                            <div className="electrican-title-img">
                                <img src={svg['ico']} alt="" />
                                <h1>
                                    <span>Job</span>Electrician
                                </h1>
                            </div>
                            <p>
                                Bine ai venit la centrala electrica!
                                <br />
                                <br />
                              <br />

                                Pentru a incepe munca, alege tipul de activitate disponibil pentru tine,
                                acumuleaza EXP pentru a-ti imbunatati calificarea si a castiga mai multi bani.
                            </p>
                            <div className="electrican-your-experience">
                                <h3>Experienta ta</h3>
                                <h4>{this.state.exp} EXP</h4>
                            </div>
                        </div>
                        {/* <img className="electrican-bus"></img><img src={bus} alt="#"/> */}
                        <img className="electrican-bus" src={bus} alt="Electrican" />

                    </div>
                    <div className="electrican-content">
                        {ELECTRICIAN_LEVELS.map((el, key) => {
                            return <div className="electrican-level" key={key}>
                                <div className="electrican-level-title">
                                    <h1>
                                        {el.index + 1} LVL <span>({el.fromEXP} exp )</span>
                                    </h1>
                                    <p>{el.description}</p>
                                </div>
                                <div className="electrican-controls">
                                    <div className="electrican-buttons-top">Plata $ {el.payment}</div>
                                    {
                                        this.getButton(el)
                                    }
                                </div>


                            </div>
                        })}
                    </div>
                </div>
            </div>
        </div>

    }
}