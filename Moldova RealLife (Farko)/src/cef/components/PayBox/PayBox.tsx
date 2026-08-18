import React from 'react';
import './assets/paybox.less';
import cash from './img/cash.svg';
import card from './img/card.svg';
import { CEF } from '../../modules/CEF';
import { PayData, PayType } from '../../../shared/pay';
import { system } from "../../modules/system";
import "./style.scss";

export class PayBox extends React.Component<{
    sum?: number,
    allowCompany?: boolean
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
    // getPass = () => {
    //     let PassArray = [];
    //     for (let i = 0; i < 4; i++) {
    //         if (this.state.password && this.state.password.length > i) PassArray.push(this.state.password[i])
    //         else PassArray.push(null);
    //     }
    //     return <div className="paybox_pass">
    //         {PassArray.map((data, index) => {
    //             return <p key={index} className={`paybox_pass_k ${!data ? "paybox_pass_n" : ""}`}>*</p>
    //         })}
    //     </div>
    // }
    render() {
        return <>
            {/* <h1 className="paybox_h1">{this.props.sum ? `$${system.numberFormat(this.props.sum)}` : <>Способы оплаты</>}</h1> */}
            <div className="payment-methods">
                <div className={`payment-method ${this.state.select === PayType.CASH ? "selected" : ""}`}
                    onClick={() => this.setState({ ...this.state, select: PayType.CASH, error: null, password: "", errorType: 0 })}>
                    <span className='payment-img'>
                        <img src={cash} />
                    </span>
                    <div className="payment-summ">
                        <h2>Cash</h2>
                        <input value={`$${CEF.user.money}`} readOnly></input>
                        {/* <h3>${this.state.cash}</h3> */}
                    </div>
                </div>
                {CEF.user.bank ?
                    <div className={`payment-method ${this.state.select === PayType.CARD ? "selected" : ""}`}
                        onClick={() => this.setState({ ...this.state, select: PayType.CARD, error: "", password: "", errorType: 0 })}>
                        <span className='payment-img'>
                            <img src={card} />
                        </span>
                        <div className="payment-summ">
                            <h2>{(!this.state.password || this.state.password.length < 4) && this.state.select === PayType.CARD ? 'Introduceti codul PIN' : 'Card'}</h2>
                            {this.state.select === PayType.CARD ?
                                <div className="card-password-input">
                                    {/* {this.getPass()} */}
                                    <input className="paybox_input" type='password' value={this.state.password} autoFocus pattern="[0-9]{4}" onChange={(e: any) => this.inputPass(e.target.value)} />

                                </div>
                                :
                                <input value={`$${CEF.user.bank}`} readOnly />
                            }
                        </div>
                    </div> : null
                }
                {CEF.user.fractionCfg && CEF.user.fractionCfg.gos && this.props.allowCompany ?
                    <div className={`payment-method ${this.state.select === PayType.COMPANY ? "selected" : ""}`}
                        onClick={() => this.setState({ ...this.state, select: PayType.COMPANY, error: null, password: "", errorType: 0 })}>
                        <span className='payment-img'>
                            <img src={card} />
                        </span>
                        <div className="payment-summ">
                            <h2 className="companyCount">Contul companiei</h2>
                        </div>
                    </div> : null
                }
            </div>
            {this.state.error ?
                <h1 className={`payment-error ${this.state.errorType === 0 ? "pbe_info" : ""}`}>{this.state.error}</h1>
                : null}
        </>
    }
}
