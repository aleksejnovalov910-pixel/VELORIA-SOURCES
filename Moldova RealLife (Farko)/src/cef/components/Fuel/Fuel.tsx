import React, { Component, createRef } from "react";
import "./assets/fuel.less";
import bg from "./assets/bg.svg";
import bge from "./assets/bge.svg";

import "./electro/style/style.scss"
import "./gas/style/style.scss"

import gasico from './gas/img/gas-ico.svg';
import exit from './gas/img/exit.svg';

import egasico from './electro/img/gas-ico.svg';


import filling from "./assets/filling.png";
import { createStyles, Slider, withStyles } from "@material-ui/core";
import { PayBox } from "../PayBox/PayBox";
import { FPayBox } from "../PayBox/FPayBox"
import { PayData, PayType } from "../../../shared/pay";
import { CustomEvent } from "../../modules/custom.event";
import { CustomEventHandler } from "../../../shared/custom.event";
import { CEF } from "../../modules/CEF";
import { fuelTypeNames, VEHICLE_FUEL_TYPE } from "../../../shared/vehicles";
import { systemUtil } from "../../../shared/system";


const png = Object.fromEntries(
    Object.entries(import.meta.glob("./gas/img/*.png", { eager: true })).map(
        ([key, value]) => {
            const name = key.match(/([^/]+).png$/)?.[1];
            return [name, value.default];
        }
    )
);


// import png from './gas/img/*.png'

export class Fuel extends React.Component<{}, {
    show: boolean;
    /** Название */
    fuelName: string;
    /** типы из fuelTypeNames */
    fuelTypes: Array<VEHICLE_FUEL_TYPE>;
    /** цена за литр */
    fuelPrice: Array<number>;
    /** Литров */
    fuelFilling: number;
    /** Стоимость */
    fuelCost: number;
    /** Стоимость канистры */
    canisterPrice: number;
    /** Текущее кол-во топлива*/
    fuelMin: number;
    /** Максимальное кол-во топлива*/
    fuelMax: number;

    select: number;
    password: string;
    errorType: number;
    error: string;

    fuelSelectType: number;
    fuelSelectPay: number;
    /** ИД бизнеса */
    id: number;
    // allowedFuel?: VEHICLЫE_FUEL_TYPE,
    catalog?: {
        item: VEHICLE_FUEL_TYPE;
        price: number;
        count: number;
        max_count: number;
    }[]
}> {
    ev: CustomEventHandler;
    _child: React.RefObject<PayBox>;
    constructor(props: any) {
        super(props);
        this.state = {
            id: 0,
            show: CEF.test,
            fuelName: "GASOLINE",
            // fuelTypes: CEF.test ? [VEHICLE_FUEL_TYPE.ELECTRO, VEHICLE_FUEL_TYPE.A95, VEHICLE_FUEL_TYPE.A92, VEHICLE_FUEL_TYPE.DISEL] : [],
            fuelTypes: CEF.test ? [VEHICLE_FUEL_TYPE.ELECTRO, VEHICLE_FUEL_TYPE.A95, VEHICLE_FUEL_TYPE.A92, VEHICLE_FUEL_TYPE.DISEL] : [],
            fuelPrice: [10, 11, 12, 13],
            fuelFilling: 10,
            fuelCost: 10,
            canisterPrice: 0,
            fuelMin: 25,
            fuelMax: 100,
            fuelSelectType: 0,
            fuelSelectPay: 0,
            select: 0,
            password: "",
            errorType: 0,
            error: "",
        };
        this.ev = CustomEvent.register("fuel:open", (electro: boolean, catalog: {
            item: VEHICLE_FUEL_TYPE;
            price: number;
            count: number;
            max_count: number;
        }[], id: number, name: string, current: number, max: number) => {
            let qcatalog = catalog.filter(itm => {
                if (electro && itm.item === VEHICLE_FUEL_TYPE.ELECTRO) return true;
                if (!electro && itm.item !== VEHICLE_FUEL_TYPE.ELECTRO) return true;
                return false;
            })
            this.setState({ catalog, show: true, fuelName: name, fuelTypes: qcatalog.map(q => q.item), fuelPrice: qcatalog.map(q => q.price), fuelMin: Math.min(Math.floor(current), max), fuelFilling: Math.min(Math.floor(current), max), fuelMax: max, id }, () => {
                this.setFuel(Math.min(Math.floor(current), max))
            })
        })
        this._child = React.createRef<PayBox>();
    }

    containerRef = createRef<HTMLDivElement>();

    componentWillUnmount() {
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



    clickPay = () => {
        let result = this._child.current.canPay((this.state.fuelPrice[this.state.fuelSelectType] * this.state.fuelFilling))
        if (!result) return;
        CustomEvent.callServer("fuel:add", this.state.id, this.state.fuelFilling, result.paytype, result.pin, this.isEletro(), this.state.fuelTypes[this.state.fuelSelectType]).then(status => {
            if (status) this._child.current.getError(status);
            else CEF.gui.setGui(null);
        })
    }
    setFuel = (value: number) => {
        value = Math.floor(value);
        if (value < this.state.fuelMin) return 1;
        this.setState({ ...this.state, fuelFilling: (value - this.state.fuelMin) })
    }
    isEletro = () => {
        if (this.state.fuelTypes[0] == VEHICLE_FUEL_TYPE.ELECTRO) return true;
        return false;
    }

    close() {
        CEF.gui.setGui(null);
    }


//     render() {
//         if (!this.state.show) return null;
//         return <>
//             {this.state.fuelTypes[0] == VEHICLE_FUEL_TYPE.ELECTRO && <div className="electrofuel-container-box">
//                 <div className="electrofuel-box" ref={this.containerRef}>
//                     <div className="electrofuel-gas-station-box">
//                         <div className="electrofuel-top">
//                             <div className="electrofuel-title">
//                                 <div className="electrofuel-title-img">
//                                     <img src={egasico} alt="" />
//                                 </div>
//                                 <div className="electrofuel-title-text">
//                                     <h1>
//                                         <span>Electic </span> Refueling
//                                     </h1>
//                                     <p>Lorem ipsum dolor sit amet, consectetur adipiscing</p>
//                                 </div>
//                             </div>
//                             <div className="electrofuel-exit" onClick={this.close}>
//                                 <p>Exit</p>
//                                 <div className="electrofuel-exit-img">
//                                     <img src={exit} alt="Exit" />
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="electrofuel-fuel-type electrofuel-total-price" style={{ marginTop: "10px" }}>
//                             <h1>Electric quantity</h1>
//                             <h2>$ {systemUtil.numberFormat(this.state.fuelPrice[this.state.fuelSelectType])} / kW</h2>
//                         </div>
//                         {AddSlider(this.isEletro(), (this.state.fuelFilling + this.state.fuelMin), this.state.fuelPrice[this.state.fuelSelectType] * this.state.fuelFilling, 1, 0, this.state.fuelMax, this.setFuel)}
//                         <div className="electrofuel-fuel-type electrofuel-total-price" style={{ marginTop: "10px" }}>
//                             <h1>Total Price</h1>
//                             <h2>$ {systemUtil.numberFormat(this.state.fuelPrice[this.state.fuelSelectType] * this.state.fuelFilling)}</h2>
//                         </div>
//                         <div className="electrofuel-controls">
//                             <FPayBox ref={this._child} allowCompany={true} electro={true} />
//                             <button type="button" onClick={this.clickPay} className="electrofuel-button electrofuel-alimenteaza">
//                                 Alimenteaza
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>}

//             {this.state.fuelTypes[0] !== VEHICLE_FUEL_TYPE.ELECTRO && <div className="gasfuel-container-box">
//                 <div className="gasfuel-box" ref={this.containerRef}>
//                     <div className="gasfuel-gas-station-box">
//                         <div className="gasfuel-top">
//                             <div className="gasfuel-title">
//                                 <div className="gasfuel-title-img">
//                                     <img src={gasico} alt="" />
//                                 </div>
//                                 <div className="gasfuel-title-text">
//                                     <h1>
//                                         <span>Gas </span> Station
//                                     </h1>
//                                     <p>Lorem ipsum dolor sit amet, consectetur adipiscing</p>
//                                 </div>
//                             </div>
//                             <div className="gasfuel-exit" onClick={this.close}>
//                                 <p>Exit</p>
//                                 <div className="gasfuel-exit-img">
//                                     <img src={exit} alt="Exit" />
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="gasfuel-fuel-type">
//                             <h1>Select fuel type</h1>
//                         </div>
//                         <div className="gasfuel-fuel-list">
//                             {this.state.fuelTypes.map((data, index) => {
//                                 return <div className="gasfuel-fuel-item" key={index}>
//                                     <img src={png[fuelTypeNames[data]]} alt="" />
//                                     <div className="gasfuel-fuel-item-header">
//                                         <h1>{fuelTypeNames[data]}</h1>
//                                         <h2>$ {this.state.fuelPrice[this.state.fuelSelectType]} / Liter</h2>
//                                     </div>
//                                     <button
//                                         type="button"
//                                         onClick={() => this.setState({ ...this.state, fuelSelectType: index, fuelCost: this.state.catalog.find(q => q.item === data).price })}
//                                         className={`gasfuel-fuel-item-controls ${this.state.fuelSelectType == index ? "selected" : ""
//                                             }`}
//                                     >
//                                         Select
//                                     </button>
//                                 </div>
//                             })}
//                         </div>
//                         <div className="gasfuel-fuel-type" style={{ marginTop: "10px" }}>
//                             <h1>Fuel quantity</h1>
//                         </div>
//                         {AddSlider(this.isEletro(), (this.state.fuelFilling + this.state.fuelMin), this.state.fuelPrice[this.state.fuelSelectType] * this.state.fuelFilling, 1, 0, this.state.fuelMax, this.setFuel)}
//                         <div className="gasfuel-fuel-type gasfuel-total-price" style={{ marginTop: "10px" }}>
//                             <h1>Total Price</h1>
//                             <h2>$ {systemUtil.numberFormat(this.state.fuelPrice[this.state.fuelSelectType] * this.state.fuelFilling)}</h2>
//                         </div>
//                         <div className="gasfuel-controls">
//                             <FPayBox ref={this._child} allowCompany={true} electro={false} />
//                             <button type="button" onClick={this.clickPay} className="gasfuel-button gasfuel-alimenteaza">
//                                 Alimenteaza
//                             </button>
//                         </div>

//                     </div>
//                 </div>
//             </div>
//             }
//         </>
//     }
// }

render() {
    if (!this.state.show) return null;
    return <>
        {this.state.fuelTypes[0] == VEHICLE_FUEL_TYPE.ELECTRO && <div className="electrofuel-container-box">
            <div className="electrofuel-box" ref={this.containerRef}>
                <div className="electrofuel-gas-station-box">
                    <div className="electrofuel-top">
                        <div className="electrofuel-title">
                            <div className="electrofuel-title-img">
                                <img src={egasico} alt="" />
                            </div>
                            <div className="electrofuel-title-text">
                                <h1>
                                    <span>Incarcare </span> Electrica
                                </h1>
                                <p>Alimenteaza-ti vehiculul electric rapid si usor</p>
                            </div>
                        </div>
                        <div className="electrofuel-exit" onClick={this.close}>
                            <p>EXIT</p>
                            <div className="electrofuel-exit-img">
                                <img src={exit} alt="EXIT" />
                            </div>
                        </div>
                    </div>
                    <div className="electrofuel-fuel-type electrofuel-total-price" style={{ marginTop: "10px" }}>
                        <h1>Cantitate energie</h1>
                        <h2>$ {systemUtil.numberFormat(this.state.fuelPrice[this.state.fuelSelectType])} / kW</h2>
                    </div>
                    {AddSlider(this.isEletro(), (this.state.fuelFilling + this.state.fuelMin), this.state.fuelPrice[this.state.fuelSelectType] * this.state.fuelFilling, 1, 0, this.state.fuelMax, this.setFuel)}
                    <div className="electrofuel-fuel-type electrofuel-total-price" style={{ marginTop: "10px" }}>
                        <h1>Pret total</h1>
                        <h2>$ {systemUtil.numberFormat(this.state.fuelPrice[this.state.fuelSelectType] * this.state.fuelFilling)}</h2>
                    </div>
                    <div className="electrofuel-controls">
                        <FPayBox ref={this._child} allowCompany={true} electro={true} />
                        <button type="button" onClick={this.clickPay} className="electrofuel-button electrofuel-alimenteaza">
                            Alimenteaza
                        </button>
                    </div>
                </div>
            </div>
        </div>}

        {this.state.fuelTypes[0] !== VEHICLE_FUEL_TYPE.ELECTRO && <div className="gasfuel-container-box">
            <div className="gasfuel-box" ref={this.containerRef}>
                <div className="gasfuel-gas-station-box">
                    <div className="gasfuel-top">
                        <div className="gasfuel-title">
                            <div className="gasfuel-title-img">
                                <img src={gasico} alt="" />
                            </div>
                            <div className="gasfuel-title-text">
                                <h1>
                                    <span>Statie </span> Benzinarie
                                </h1>
                                <p>Alimenteaza-ti masina cu combustibilul dorit</p>
                            </div>
                        </div>
                        <div className="gasfuel-exit" onClick={this.close}>
                            <p>EXIT</p>
                            <div className="gasfuel-exit-img">
                                <img src={exit} alt="EXIT" />
                            </div>
                        </div>
                    </div>
                    <div className="gasfuel-fuel-type">
                        <h1>Selecteaza tipul de combustibil</h1>
                    </div>
                    <div className="gasfuel-fuel-list">
                        {this.state.fuelTypes.map((data, index) => {
                            return <div className="gasfuel-fuel-item" key={index}>
                                <img src={png[fuelTypeNames[data]]} alt="" />
                                <div className="gasfuel-fuel-item-header">
                                    <h1>{fuelTypeNames[data]}</h1>
                                    {/* <h2>$ {this.state.fuelPrice[this.state.fuelSelectType]} / Litru</h2> */}
                                    <h2>$ {this.state.fuelPrice[index]} / Litru</h2>

                                </div>
                                <button
                                    type="button"
                                    onClick={() => this.setState({
                                        fuelSelectType: index,
                                        fuelCost: this.state.fuelPrice[index]
                                    })}
                                    className={`gasfuel-fuel-item-controls ${this.state.fuelSelectType === index ? "selected" : ""}`}
                                    >
                                    Selecteaza
                                </button>
                                {/* <button
                                    type="button"
                                    onClick={() => this.setState({ ...this.state, fuelSelectType: index, fuelCost: this.state.catalog.find(q => q.item === data).price })}
                                    className={`gasfuel-fuel-item-controls ${this.state.fuelSelectType == index ? "selected" : ""
                                        }`}
                                >
                                    Selecteaza
                                </button> */}
                            </div>
                        })}
                    </div>
                    <div className="gasfuel-fuel-type" style={{ marginTop: "10px" }}>
                        <h1>Cantitate combustibil</h1>
                    </div>
                    {AddSlider(this.isEletro(), (this.state.fuelFilling + this.state.fuelMin), this.state.fuelPrice[this.state.fuelSelectType] * this.state.fuelFilling, 1, 0, this.state.fuelMax, this.setFuel)}
                    <div className="gasfuel-fuel-type gasfuel-total-price" style={{ marginTop: "10px" }}>
                        <h1>Pret total</h1>
                        <h2>$ {systemUtil.numberFormat(this.state.fuelPrice[this.state.fuelSelectType] * this.state.fuelFilling)}</h2>
                    </div>
                    <div className="gasfuel-controls">
                        <FPayBox ref={this._child} allowCompany={true} electro={false} />
                        <button type="button" onClick={this.clickPay} className="gasfuel-button gasfuel-alimenteaza">
                            Alimenteaza
                        </button>
                    </div>
                </div>
            </div>
        </div>
        }
    </>
}
}
export const AddSlider = (isElectro: boolean, value: number, price: number, step: number, min: number, max: number, handler: (newValue: number) => void) => {
    if (isElectro) return <div className="electrofuel-fuel-box">
        <div className="electrofuel-fuel-line">
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => handler(Number(e.target.value))}
                style={{
                    background: `linear-gradient(to right, #38BDFF ${(value / max) * 100}%, #000000 ${(value / max) * 100}%)`,
                }}
            />
            <p>{value} kW</p>
        </div>
    </div>

    if (!isElectro) return <div className="gasfuel-fuel-box">
        <div className="gasfuel-fuel-line">
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => handler(Number(e.target.value))}
                style={{
                    background: `linear-gradient(to right, #FF8C21 ${(value / max) * 100}%, #000000 ${(value / max) * 100}%)`,
                }}
            />
            <p>{value} L</p>
        </div>
    </div>

    // <ElectroSlider valueLabelFormat={() => FormatSlider(value, price, isElectro, min, max)} orientation="horizontal" valueLabelDisplay="on" value={value} step={step ? step : 0.01} min={min} max={max} onChange={(e: any, newValue: number) => handler(newValue)} />

};
