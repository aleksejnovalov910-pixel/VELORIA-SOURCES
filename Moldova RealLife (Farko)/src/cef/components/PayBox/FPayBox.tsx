import React from 'react';
import './assets/paybox.less';

import "../Fuel/electro/style/style.scss"
import "../Fuel/gas/style/style.scss"

import { CEF } from '../../modules/CEF';
import { PayData, PayType } from '../../../shared/pay';
import { system } from "../../modules/system";


export class FPayBox extends React.Component<{
    sum?: number,
    allowCompany?: boolean
    electro?: boolean
}, {
    select: number;
    password: string;
    errorType: number;
    error: string;
}> {
    constructor(props: any) {
        super(props);
        this.state = {
            select: 0,
            password: "",
            errorType: 0,
            error: ""
        }
    }
    inputPass = (value: string) => {
        if (value.length >= 5) return;
        this.setState((state) => {
            return { ...state, password: value };
        }
        )
    }
    /** Оплата */
    sendPay = (value: number) => {
        if (this.state.select === PayType.CASH && CEF.user.money < value) return this.setState({ ...this.state, error: "Fonduri insuficiente", errorType: 1 }), null;
        else if (this.state.select === PayType.CARD && CEF.user.bank < value) return this.setState({ ...this.state, error: "Fonduri insuficiente", errorType: 1 }), null;
        else if (this.state.select === PayType.CARD && this.state.password.length < 4) return this.setState({ ...this.state, error: "Introduceti codul PIN", errorType: 1 }), null;
        // else if( this.state.select === PayType.COMPANY && this.state.password.length  < 4 ) return this.setState({...this.state, error:"Introduceti codul PIN", errorType:1 }),null;
        else if (value === 0) return this.setState({ ...this.state, error: "Alegeti cantitatea produsului", errorType: 1 }), null;
        else {
            // Добавить проверки PIN-кода
            this.setState({ ...this.state, error: "", errorType: 0 })
            return { paytype: this.state.select };
        }

    }
    canPay = (value: number): PayData => {
        if (this.state.select === PayType.CASH && CEF.user.money < value) return this.setState({ ...this.state, error: "Fonduri insuficiente", errorType: 1 }), null;
        else if (this.state.select === PayType.CARD && CEF.user.bank < value) return this.setState({ ...this.state, error: "Fonduri insuficiente", errorType: 1 }), null;
        else if (this.state.select === PayType.CARD && this.state.password.length < 4) return this.setState({ ...this.state, error: "Introduceti codul PIN", errorType: 1 }), null;
        // else if( this.state.select === PayType.COMPANY && this.state.password.length  < 4 ) return this.setState({...this.state, error:"Introduceti codul PIN", errorType:1 }),null;
        else if (value === 0) return this.setState({ ...this.state, error: "Alegeti cantitatea produsului", errorType: 1 }), null;
        else {
            this.setState({ ...this.state, error: "", errorType: 0 })
            return { paytype: this.state.select, pin: this.state.password };
        }

    }
    /** Получить ошибку при оплате */
    getError = (error: string) => {
        this.setState({ ...this.state, error: error, errorType: 1 });
    }
    getPass = () => {
        let PassArray = [];
        for (let i = 0; i < 4; i++) {
            if (this.state.password && this.state.password.length > i) PassArray.push(this.state.password[i])
            else PassArray.push(null);
        }
        return <div className="paybox_pass">
            {PassArray.map((data, index) => {
                return <p key={index} className={`paybox_pass_k ${!data ? "paybox_pass_n" : ""}`}>*</p>
            })}
        </div>
    }
    render() {
        return <>
            {this.props.electro === true &&
                <div className="electrofuel-pay-controls">
                    <button
                        type="button"
                        className={`electrofuel-card ${this.state.select === PayType.CASH ? "electrofuel-selected" : ""}`}
                        onClick={() => this.setState({ ...this.state, select: PayType.CASH, error: null, password: "", errorType: 0 })}>
                        Cash
                    </button>
                    {CEF.user.bank ?
                        <button
                            type="button"
                            className={`electrofuel-card ${this.state.select === PayType.CARD ? "electrofuel-selected" : ""}`}
                            onClick={() => this.setState({ ...this.state, select: PayType.CARD, error: "", password: "", errorType: 0 })}>
                            Card
                        </button> : null
                    }
                </div>}

            {this.props.electro !== true &&
                <div className="gasfuel-pay-controls">
                    <button
                        type="button"
                        className={`gasfuel-card ${this.state.select === PayType.CASH ? "gasfuel-selected" : ""}`}
                        onClick={() => this.setState({ ...this.state, select: PayType.CASH, error: null, password: "", errorType: 0 })}>

                        Cash
                    </button>
                    {CEF.user.bank ?
                        <button
                            type="button"
                            className={`gasfuel-card ${this.state.select === PayType.CARD ? "gasfuel-selected" : ""}`}
                            onClick={() => this.setState({ ...this.state, select: PayType.CARD, error: "", password: "", errorType: 0 })}>
                                
                            Card
                        </button>
                        : null
                    }
                </div>
            }



        </>
    }
}
