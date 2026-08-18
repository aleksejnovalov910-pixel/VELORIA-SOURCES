import { LangString } from "../../modules/lang";
import React, {Component} from "react";
import {CustomEvent} from "../../modules/custom.event";
import "./style.less"
import Draggable from "react-draggable";
import {RACE_TYPE} from "../../../shared/race";
import {CEF} from "../../modules/CEF";


export class RaceEditBlock extends Component<{}, {
    name: string,
    id: number,
    opened: boolean,
    checkCount: number,
    posCount: number,
    type: RACE_TYPE,
    cars: string[],
}> {
    ev: import("../../../shared/custom.event").CustomEventHandler;
    ev2: import("../../../shared/custom.event").CustomEventHandler;

    constructor(props: any) {
        super(props);
        this.state = {
            name: "Test",
            id: 1,
            opened: false,
            checkCount: 5,
            posCount: 5,
            type: null,
            cars: []
        }

        this.ev = CustomEvent.register("raceedit:open", (id: number, name: string, checkCount: number, posCount: number, type: RACE_TYPE, cars: string[]) => {
            this.setState({ opened: true, id, name, checkCount, posCount, type, cars })
        })

        this.ev2 = CustomEvent.register("raceedit:close", () => {
            this.setState({ opened: false })
        })
    }

    componentWillUnmount() {
        if (this.ev) this.ev.destroy();
        if (this.ev2) this.ev2.destroy();
    }



    render() {
        if (!this.state.opened) return <></>;
        if (CEF.gui.currentGui) return <></>;
        let checks: number[] = [];
        for (let id = 0; id < this.state.checkCount; id++) checks.push(id);
        let poss: number[] = [];
        for (let id = 0; id < this.state.posCount; id++) poss.push(id);
        return <Draggable key={"race_edit"}>
            <div className="race-edit">
                <div className="name">{this.state.name} #{this.state.id}</div>
                <div className="item">
                    {this.state.cars.map(car => {
                        return <button onClick={e => {
                            e.preventDefault();
                            CustomEvent.triggerClient("raceedit:spawnCar", car)
                        }}>{LangString("components.Race.index.9733e5596c5d854cd4b963939d145e6e")} {car}</button>
                    })}
                </div>
                <button onClick={e => {
                    CustomEvent.triggerClient("raceedit:newCheck")
                }}>{LangString("components.Race.index.595e035e95c88faf37d4c2b5590b5a55")}</button>
                <button onClick={e => {
                    CustomEvent.triggerClient("raceedit:newSpawn")
                }}>{LangString("components.Race.index.9214738a58707309098742df0a410741")}</button>
                <button onClick={e => {
                    CustomEvent.triggerClient("raceedit:changeType")
                    this.setState({ type: this.state.type === "circle" ? "line" : "circle"})
                }}>{LangString("components.Race.index.d1b4926a8c8db1ba455d2d4cb7e06ad9")} {this.state.type === "circle" ? LangString("components.Race.index.cf5bb22fae4e13267602ead628f6f744") : LangString("components.Race.index.3107ad23a6521f4565958afd9dd901d1")}</button>

                {poss.length > 0 ? <div className="list">
                    {poss.map(id => {
                        return <div className="item" key={`spawn_${id}`}>
                            <div className="title">{LangString("components.Race.index.2271da93b957c8df36eeff6b9f33cc51")}{id}</div>
                            <div className="job">
                                <button className="del" onClick={e => {
                                    e.preventDefault();
                                    CustomEvent.triggerClient("raceedit:spawnDel", id)
                                }}>X</button>
                                <button className="tp" onClick={e => {
                                    e.preventDefault();
                                    CustomEvent.triggerClient("raceedit:spawnTp", id)
                                }}>{LangString("components.Race.index.8f6486bd82364b6b936959dbc6c545d6")}</button>
                            </div>
                        </div>
                    })}
                </div> : <></>}
                {checks.length > 0 ? <div className="list">
                    {checks.map(id => {
                        return <div className="item" key={`check_${id}`}>
                            <div className="title">{LangString("components.Race.index.1d3ba1fddc892e49c2c9eda050f1172e")}{id}</div>
                            <div className="job">
                                <button className="del" onClick={e => {
                                    e.preventDefault();
                                    CustomEvent.triggerClient("raceedit:checkDel", id)
                                }}>X</button>
                                <button className="tp" onClick={e => {
                                    e.preventDefault();
                                    CustomEvent.triggerClient("raceedit:checkTp", id)
                                }}>{LangString("components.Race.index.ca1e007e1a8e1bf5c91e37cbdc914eb1")}</button>
                            </div>
                        </div>
                    })}
                </div> : <></>}

                <div className="control">
                    <button className="no" onClick={e => {
                        e.preventDefault();
                        this.setState({opened: false})
                        CustomEvent.triggerClient("raceedit:save", false)
                    }}>{LangString("components.Race.index.156222acde8243e90ae521a9b103d118")}</button>
                    <button className="yes" onClick={e => {
                        e.preventDefault();
                        this.setState({ opened: false })
                        CustomEvent.triggerClient("raceedit:save", true)
                    }}>{LangString("components.Race.index.219af8ddbc61c1c31beaac9fce9282e1")}</button>
                </div>

            </div>
        </Draggable>;
    }
}

