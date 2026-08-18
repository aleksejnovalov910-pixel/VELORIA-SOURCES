import { LangString } from "../../modules/lang";
import React, {Component} from "react";
import "./style.less";
import Draggable, {DraggableEvent} from "react-draggable";

import closeIcon from "./assets/closeIcon.svg";
// import backgroundImage from "./assets/backgroundImage.png";

import cardBlackIcon from "./assets/cardBlackIcon.png"
import cardPlatinumIcon from "./assets/cardPlatinumIcon.png"
import cardGoldIcon from "./assets/cardGoldIcon.png"

import walletIcon from "./assets/walletIcon.svg"
import walletIconActive from "./assets/walletIconActive.svg"

import cardIcon from "./assets/cardIcon.svg"
import cardIconActive from "./assets/cardIconAcitve.svg"

import listIcon from "./assets/listIcon.svg"
import listIconActive from "./assets/listIconActive.svg"

import pinIcon from "./assets/pinIcon.svg"
import pinIconActive from "./assets/pinIconActive.svg"

import grayArrow from "./assets/grayArrow.svg"
import orangeArrow from "./assets/orangeArrow.svg"

import wallet from "./assets/wallet.png"
// import attention from "./assets/attention.svg"
import nfc from "./assets/nfc.svg"

import cardBlack from "./assets/cardBlack.png"
import cardPlatinum from "./assets/cardPlatinum.png"
import cardGold from "./assets/cardGold.png"
import {CustomEvent} from "../../modules/custom.event";
import {CustomEventHandler} from "../../../shared/custom.event";
import {BankHistoryItem} from "../../../shared/atm";
import {CEF} from "../../modules/CEF";
import {systemUtil} from "../../../shared/system";

interface historyItem {
    isPlus: boolean,
    description: string,
    sum: number
}

export class ATM extends Component<{}, {
    isDragging: boolean,
    cardOnNFC: boolean,
    refCard: React.RefObject<any>,
    cardType: "black" | "gold" | "platinum",
    cardNumber: string,
    refPinCode: React.RefObject<any>,
    history: historyItem[],
    component: "NFC" | "PIN" | "cashAction" | "transaction" | "settings" | "history",
    refInputCashAction: React.RefObject<any>,
    refInputTransactionAccount: React.RefObject<any>,
    refInputTransactionAmount: React.RefObject<any>,
    refOldPin: React.RefObject<any>,
    refNewPin: React.RefObject<any>,
    refNewRepeatPin: React.RefObject<any>
}> {
    eventHandler: CustomEventHandler;
    
    constructor(props: any) {
        super(props);

        this.state = {
            isDragging: false,
            cardOnNFC: false,
            refCard: React.createRef(),
            cardType: "gold",
            component: "NFC",
            cardNumber: "8790",
            refPinCode: React.createRef(),
            history: [
                {
                    isPlus: true,
                    description: LangString("components.ATM.ATM.bd1f9ea53c84385dd837dcfbeec1b69b"),
                    sum: 50000
                },
                {
                    isPlus: false,
                    description: LangString("components.ATM.ATM.b0382e42df44ea5e74043444cdfc13d4"),
                    sum: 12000
                }
            ],
            refInputCashAction: React.createRef(),
            refInputTransactionAccount: React.createRef(),
            refInputTransactionAmount: React.createRef(),
            refOldPin: React.createRef(),
            refNewPin: React.createRef(),
            refNewRepeatPin: React.createRef()
        }
        
        this.eventHandler = CustomEvent.register("atm:load", (cardNumber: string, historyItems: BankHistoryItem[]) => {
            const history = historyItems.map(el => {
                return {
                    isPlus: el.type === "add",
                    description: el.text,
                    sum: el.sum
                }
            })
            this.setState({
                ...this.state,
                history,
                cardNumber
            })
        })
    }

    public componentWillUnmount() {
        if (this.eventHandler) this.eventHandler.destroy();
    }

    close(): void {
        CEF.gui.setGui(null)
        CEF.playSound("cliekc"); // sunet la selectarea unui articol

    }

    onClickCashAction(): void {
        const amount = this.state.refInputCashAction.current.value;
        if (amount === "") return;
        CustomEvent.triggerServer("atm:takeCash", systemUtil.parseInt(amount))
        CEF.playSound("cliekc"); // sunet la selectarea unui articol
    }

    sendMoney(): void {
        const account = this.state.refInputTransactionAccount.current.value,
            amount = this.state.refInputTransactionAmount.current.value;
        if (amount === "" || account === "") return;
        CustomEvent.triggerServer("bank:transfer", systemUtil.parseInt(amount), account)
        CEF.playSound("cliekc"); // sunet la selectarea unui articol
    }

    async savePin(): Promise<void> {
        const oldPin = this.state.refOldPin.current.value,
            newPin = this.state.refNewPin.current.value,
            repeatNewPin = this.state.refNewRepeatPin.current.value;

        if (oldPin.length < 4) return;
        if (newPin.length < 4) return;
        if (repeatNewPin.length < 4) return;
        CustomEvent.triggerServer("atm:changePin", this.state.cardNumber, oldPin, newPin)
    }

    setComponent(component: "NFC" | "PIN" | "cashAction" | "transaction" | "settings" | "history"): void {
        if (this.state.component === "PIN") return;
        this.setState({...this.state, component});
    }

    moneySpace(value: number): string {
        return `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ");
    }

    setCashActionValue(value: number): void {
        this.state.refInputCashAction.current.value = value;
    }

    setTransactionValue(value: number): void {
        this.state.refInputTransactionAmount.current.value = value;
    }

    async onChangePinEnter(): Promise<void> {
        if (this.state.refPinCode.current.value.length > 4)
            this.state.refPinCode.current.value = this.state.refPinCode.current.value.substr(0, 4);
        if (/[^0-9.]/g.test(this.state.refPinCode.current.value))
            this.state.refPinCode.current.value = this.state.refPinCode.current.value.replaceAll(/[^0-9.]/g, "");

        if (this.state.refPinCode.current.value.length < 4) return;
        
        const isPinCorrect: boolean = await CustomEvent.callServer("pin:check", this.state.cardNumber, this.state.refPinCode.current.value)
        if (isPinCorrect)
            this.setState({...this.state, component: "cashAction"})
    }

    onChangePinInput(type: number): void {
        switch (type) {
            case 0: {
                if (this.state.refOldPin.current.value.length > 4)
                    this.state.refOldPin.current.value = this.state.refOldPin.current.value.substr(0, 4);
                if (/[^0-9.]/g.test(this.state.refOldPin.current.value))
                    this.state.refOldPin.current.value = this.state.refOldPin.current.value.replaceAll(/[^0-9.]/g, "");
                break;
            }
            case 1: {
                if (this.state.refNewPin.current.value.length > 4)
                    this.state.refNewPin.current.value = this.state.refNewPin.current.value.substr(0, 4);
                if (/[^0-9.]/g.test(this.state.refNewPin.current.value))
                    this.state.refNewPin.current.value = this.state.refNewPin.current.value.replaceAll(/[^0-9.]/g, "");
                break;
            }
            case 2: {
                if (this.state.refNewRepeatPin.current.value.length > 4)
                    this.state.refNewRepeatPin.current.value = this.state.refNewRepeatPin.current.value.substr(0, 4);
                if (/[^0-9.]/g.test(this.state.refNewRepeatPin.current.value))
                    this.state.refNewRepeatPin.current.value = this.state.refNewRepeatPin.current.value.replaceAll(/[^0-9.]/g, "");
                break;
            }
            default:
                return;
        }
    }

    startDrag(): void {
        this.setState({...this.state, isDragging: true});
        // CEF.playSound("cliekc"); // sunet la selectarea unui articol
    }

    stopDrag(): void {

        if (this.state.cardOnNFC) {
            this.setState({...this.state, isDragging: false, component: "PIN"});
            this.state.refPinCode.current.focus();
            return;
        }
        this.setState({...this.state, isDragging: false});
    }

    mouseEventOnNFC(toggle: boolean): void {
        console.log(JSON.stringify([toggle, this.state.isDragging]))
        if (!this.state.isDragging) return;
        this.setState({...this.state, cardOnNFC: toggle});
    }

    getPointerEvents() {
        return this.state.isDragging ? "none" : "auto";
    }

    render() {
        return <div className="atm">

            {/* <img src={backgroundImage} className="atm__backgroundImage" alt=""/> */}

            <div className="exit" onClick={() => this.close()}>
                <div className="exit__icon"><img src={closeIcon} alt="#"/></div>
                <div className="exit__title">{LangString("components.ATM.ATM.2ade4fa2c09d04a9f8c7f1b34bb9706b")}</div>
            </div>

            {this.state.component === "NFC" && <div className="atm-startWindow">

                <div className="atm-startWindow__title">
                    {LangString("components.ATM.ATM.3d622191a26abfc79e952b2aa7e8589f")}
                    <br/>{LangString("components.ATM.ATM.755aacf7ec343017aa0c8d5e443e5279")}
                </div>

                <img src={wallet} className="atm-startWindow__wallet" alt=""/>
                <div className="atm-startWindow__filter"/>

                {/* <img src={attention} alt="" className="atm-startWindow__attention"/> */}
                <img src={nfc} alt=""
                     className={`atm-startWindow__nfc ${this.state.cardOnNFC ? "atm-nfc-active" : null}`}
                     onPointerEnter={() => this.mouseEventOnNFC(true)}
                     onPointerLeave={() => this.mouseEventOnNFC(false)}
                />

                <Draggable
                    onStart={() => this.startDrag()}
                    onStop={() => this.stopDrag()}
                    position={{x: 0, y: 0}}
                >
                    <div className={`atm-startWindow-card
                    ${this.state.cardType === "black" ? "atm-startWindow-card__black" : ""}
                    ${this.state.cardType === "platinum" ? "atm-startWindow-card__platinum" : ""}
                    ${this.state.cardType === "gold" ? "atm-startWindow-card__gold" : ""}
                `}
                    style={{pointerEvents: this.getPointerEvents()}}>
                        <span>{CEF.user.name}</span>
                        <img src={cardBlack} alt=""/>
                        <img src={cardPlatinum} alt=""/>
                        <img src={cardGold} alt=""/>
                    </div>
                </Draggable>


            </div>}

            {this.state.component !== "NFC" && <div className={"atm-content"}>


                <div className="atm-content__title">
                    {LangString("components.ATM.ATM.beecf5af22631e24dee3ba4ab0bdc62f")}
                </div>

                <div className="atm-content-head">
                    {this.state.cardType === "black" && <img src={cardBlackIcon} alt=""/>}
                    {this.state.cardType === "gold" && <img src={cardGoldIcon} alt=""/>}
                    {this.state.cardType === "platinum" && <img src={cardPlatinumIcon} alt=""/>}
                    <span>{LangString("components.ATM.ATM.01a46d8259431bdb72fd589cc6050a3a")}</span>
                    <p>{LangString("components.ATM.ATM.60aa8d3b08813950e20d5d787eda5ec7")} {this.state.cardNumber}</p>
                    <div>$ {this.moneySpace(CEF.user.bank)}</div>
                </div>

                <div className="atm-content-body">


                    <div className="atm-content-body-left">

                        <div
                            className={`atm-content-body-left-bottom ${this.state.component === "cashAction" ? "atm-active" : ""}`}
                            onClick={() => this.setComponent("cashAction")}>
                            <img src={walletIcon} alt=""/>
                            <img src={walletIconActive} alt=""/>
                            <span>{LangString("components.ATM.ATM.c19f14939f12bf5f48c148106332d30b")}</span>
                        </div>

                        <div
                            className={`atm-content-body-left-bottom ${this.state.component === "transaction" ? "atm-active" : ""}`}
                            onClick={() => this.setComponent("transaction")}>
                            <img src={cardIcon} alt=""/>
                            <img src={cardIconActive} alt=""/>
                            <span>{LangString("components.ATM.ATM.b05aeb28de7719ae929c1004beba97b2")} <br/> {LangString("components.ATM.ATM.5f5d9fa053a537f04ef70a5767208e2a")}</span>
                        </div>

                        <div
                            className={`atm-content-body-left-bottom ${this.state.component === "history" ? "atm-active" : ""}`}
                            onClick={() => this.setComponent("history")}>
                            <img src={listIcon} alt=""/>
                            <img src={listIconActive} alt=""/>
                            <span>{LangString("components.ATM.ATM.deabdb46024f4bbf0c587fd42e9ec51b")}</span>
                        </div>

                        <div
                            className={`atm-content-body-left-bottom ${this.state.component === "settings" ? "atm-active" : ""}`}
                            onClick={() => this.setComponent("settings")}>
                            <img src={pinIcon} alt=""/>
                            <img src={pinIconActive} alt=""/>
                            <span>{LangString("components.ATM.ATM.b6f7a6ffde025c63d36fb48132e1ceee")}</span>
                        </div>

                    </div>

                    <div className="atm-content-body-right">

                        {this.state.component === "PIN" && <div className={"atm-content-body-right-screen"}>
                            <div className="atm-content-body-right-screen-pin ">
                                <span>{LangString("components.ATM.ATM.d02a0bcb3a1cfbd31870a80861322e9a")}</span>
                                <input type="password" onChange={() => this.onChangePinEnter()} placeholder="* * * *"
                                       ref={this.state.refPinCode}/>
                            </div>
                        </div>}

                        {this.state.component === "cashAction" && <div className={"atm-content-body-right-screen"}>

                            <div className="atm-content-body-right-screen__title">
                                {LangString("components.ATM.ATM.777df49ab3940c475ae37431a12c799f")}
                                <span>{LangString("components.ATM.ATM.04ce0e5e70b552810ee9783957c5a457")}</span>
                            </div>

                            <div className="atm-content-body-right-screen__input">
                                <input ref={this.state.refInputCashAction} type="number" min="0"/>
                                <span>{LangString("components.ATM.ATM.321d46414045ea65c40ef342b38468c1")}</span>
                                <p>$</p>
                            </div>

                            <div className="atm-content-body-right-screen__blanks">
                                <div onClick={() => this.setCashActionValue(25000)}>{LangString("components.ATM.ATM.1f1bc60344f11ed608026a56af4cc417")}</div>
                                <div onClick={() => this.setCashActionValue(50000)}>{LangString("components.ATM.ATM.bfa2bb215bbdb1acc7f5c5d357bfd4de")}</div>
                                <div onClick={() => this.setCashActionValue(100000)}>{LangString("components.ATM.ATM.54623ed4a9cc89c14ab88dafd91f0afb")}</div>
                                <div onClick={() => this.setCashActionValue(500000)}>{LangString("components.ATM.ATM.c2220fc7b63e742d8d953bf6d0980c6d")}</div>
                            </div>

                            <div className="atm-content-body-right-screen__button"
                                 onClick={() => this.onClickCashAction()}>
                                {LangString("components.ATM.ATM.6c811c17642b8fa2c2c1f74437f3b868")}
                            </div>

                        </div>}

                        {this.state.component === "transaction" && <div className={"atm-content-body-right-screen"}>

                            <div className="atm-content-body-right-screen__title">
                                {LangString("components.ATM.ATM.f12ab5d6af146a37f813fa01743eaa9e")}
                                <span>{LangString("components.ATM.ATM.bf2c02d5a78083155abbacc5b72a5acb")}</span>
                            </div>

                            <div className="atm-content-body-right-screen__input  atm-input-padding">
                                <input ref={this.state.refInputTransactionAccount} type="text"/>
                                <span>{LangString("components.ATM.ATM.a62a2975756b30be1d8732ffb93d2d60")}</span>
                            </div>

                            <div className="atm-content-body-right-screen__input">
                                <input ref={this.state.refInputTransactionAmount} type="number"/>
                                <span>{LangString("components.ATM.ATM.6b3acc6801d6e7986da30c5d3bea159e")}</span>
                                <p>$</p>
                            </div>

                            <div className="atm-content-body-right-screen__blanks">
                                <div onClick={() => this.setTransactionValue(25000)}>{LangString("components.ATM.ATM.3c0052bb4f7f4fbfaa40c814ced32f05")}</div>
                                <div onClick={() => this.setTransactionValue(50000)}>{LangString("components.ATM.ATM.f4ed29374dcb5ec0734db80623768061")}</div>
                                <div onClick={() => this.setTransactionValue(100000)}>{LangString("components.ATM.ATM.d564ce9d652bd31c59360f63963826a7")}</div>
                                <div onClick={() => this.setTransactionValue(500000)}>{LangString("components.ATM.ATM.a164edec1b8987a1b986b8400adfedba")}</div>
                            </div>

                            <div className="atm-content-body-right-screen__button" onClick={() => this.sendMoney()}>
                                {LangString("components.ATM.ATM.51cd093006025511a97915070a8a463e")}
                            </div>

                        </div>}

                        {this.state.component === "history" && <div className={"atm-content-body-right-screen"}>

                            <div className="atm-content-body-right-screen__title atm-list-title">
                                {LangString("components.ATM.ATM.99f45b75c5491826aa28809b64ec0335")}
                                <span>{LangString("components.ATM.ATM.cac00ef189fdb323b6b9eb65a912a5a9")}</span>
                            </div>

                            <div className="atm-content-body-right-screen-list">

                                {
                                    this.state.history.map((el, key) => {
                                        return <div className={`${el.isPlus ? "atm-active" : ""}`} key={key}>
                                            <img src={grayArrow} alt=""/>
                                            <img src={orangeArrow} alt=""/>

                                            <span>{el.description}</span>

                                            <p>$ {this.moneySpace(el.sum)}</p>
                                        </div>
                                    })
                                }

                            </div>


                        </div>}

                        {this.state.component === "settings" &&
                        <div className={"atm-content-body-right-screen atm-settings"}>

                            <div className="atm-content-body-right-screen__title">
                                {LangString("components.ATM.ATM.d4c371cbf4a00bc479cd44b0c5f8d3d0")}
                                <span>{LangString("components.ATM.ATM.a045ebe5b4553e3f991f8b893e53b914")}</span>
                            </div>

                            <div className="atm-content-body-right-screen__input">
                                <input type="password" ref={this.state.refOldPin}
                                       onChange={() => this.onChangePinInput(0)}/>
                                <span>{LangString("components.ATM.ATM.717fae812179070adef73f42596a3b91")}</span>
                            </div>

                            <div className="atm-content-body-right-screen__input">
                                <input type="password" ref={this.state.refNewPin}
                                       onChange={() => this.onChangePinInput(1)}/>
                                <span>{LangString("components.ATM.ATM.eb45036bd9040db8a085e3dbe15fdf83")}</span>
                            </div>

                            <div className="atm-content-body-right-screen__input">
                                <input type="password" ref={this.state.refNewRepeatPin}
                                       onChange={() => this.onChangePinInput(2)}/>
                                <span>{LangString("components.ATM.ATM.5ddb4b513256eeb25038f004d861297d")}</span>
                            </div>


                            <div className="atm-content-body-right-screen__button" onClick={() => this.savePin()}>
                                {LangString("components.ATM.ATM.57be53f70223f7fa4c828e113d403e58")}
                            </div>

                        </div>}

                    </div>

                </div>

            </div>}


        </div>
    }
}