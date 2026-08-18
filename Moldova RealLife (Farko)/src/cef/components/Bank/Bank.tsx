import { LangString } from "../../modules/lang";
import React, {Component} from "react";
import "./style.less";

import fleeca from "./assets/fleeca.svg";
import lines from "./assets/lines.svg";
import cardBlack from "./assets/cardBlack.png";
import cardPlatinum from "./assets/cardPlatinum.png";
import cardGold from "./assets/cardGold.png";
import cardIcon from "./assets/cardIcon.png";
import point from "./assets/point.svg";
import sharpIcon from "./assets/sharpIcon.svg";
import starIcon from "./assets/starIcon.svg";
import minus from "./assets/minus.svg";
import plus from "./assets/plus.svg";
import walletIcon from "./assets/walletIcon.svg";
import houseIcon from "./assets/houseIcon.svg";
import carIcon from "./assets/carIcon.svg";
import doubleHouseIcon from "./assets/doubleHouseIcon.svg";
import doubleCarIcon from "./assets/doubleCarIcon.svg";
import businessIcon from "./assets/businessIcon.svg";
import exitIcon from "../NumberPlate/assets/images/exitIcon.svg";
import {CEF} from "../../modules/CEF";
import {CustomEvent} from "../../modules/custom.event";
import {CustomEventHandler} from "../../../shared/custom.event";
import {newBankCardCost, REMOVAL_BANK_MONEY_PERCENT} from "../../../shared/economy";
import {systemUtil} from "../../../shared/system";
import {BankTax, BankTaxes} from "../../../shared/atm";

interface Rate {
    amount: number,
    name: string,
    benefits: string[]
}

let eventHandler: CustomEventHandler;
let updateEventHandler: CustomEventHandler;
let updateCardEventHandler: CustomEventHandler;

type taxesCategory = "houses" | "businesses" | "warehouse"

export class Bank extends Component<{}, {
    bankId: number,
    component: "operations" | "settings" | "taxes" | "rate",
    accountNumber: string,
    balance: number,
    cash: number,
    rate: number,
    isCashOut: boolean,
    showMax: boolean,
    activeBtnOperation: boolean,
    commission: number,
    totalAmount: number,
    refOperationAmount: React.RefObject<any>,
    refOperationCode: React.RefObject<any>,
    taxes: BankTaxes,
    taxesCat: taxesCategory,
    rates: Rate[],
    chooseRate: number,
    settingsComponent: "changeCode" | "orderCard" | "closeAccount",
    refOldCode: React.RefObject<any>,
    refNewCode: React.RefObject<any>
    refChangePin: React.RefObject<any>
}> {

    private getTaxName(cat: taxesCategory): string {
        switch (cat) {
            case "houses":
                return LangString("components.Bank.Bank.3f2431f39ecd7f09c5ccdaabb1140659")
            case "businesses":
                return LangString("components.Bank.Bank.216c2307f9e9b3019748e32c3e7bf761")
            case "warehouse":
                return LangString("components.Bank.Bank.3bd6344b26cc358cd6dd0d31b75818aa")
        }
    }

    maxAmount: number = 99999999;

    constructor(props: any) {
        super(props);

        this.state = {
            bankId: 0,
            component: "operations",
            accountNumber: "123123",
            balance: 540000,
            cash: 800000,
            rate: 1,
            isCashOut: false,
            showMax: false,
            activeBtnOperation: false,
            commission: 0,
            totalAmount: 0,
            refOperationAmount: React.createRef(),
            refOperationCode: React.createRef(),
            taxes: {
                houses: [
                    {
                        id: 0,
                        name: LangString("components.Bank.Bank.54c7eccec1b4bf2bdacf53d835fedc52"),
                        address: "3517 W. Gray St. Utica, Pennsylvania 57867",
                        taxAmountLeft: 21000,
                        maxTaxAmount: 30000,
                    },
                    {
                        id: 0,
                        name: LangString("components.Bank.Bank.06fbfb3df83308336296984ca6e76565"),
                        address: "3517 W. Gray St. Utica, Pennsylvania 57867",
                        taxAmountLeft: 21000,
                        maxTaxAmount: 30000,
                    },
                    {
                        id: 0,
                        name: LangString("components.Bank.Bank.b2da1caf23cbe5d81eaea2b25f7f1301"),
                        address: "3517 W. Gray St. Utica, Pennsylvania 57867",
                        taxAmountLeft: 21000,
                        maxTaxAmount: 30000,
                    },
                    {
                        id: 0,
                        name: LangString("components.Bank.Bank.3977955ed9b1ce06ba5e68b9974cf567"),
                        address: "3517 W. Gray St. Utica, Pennsylvania 57867",
                        taxAmountLeft: 21000,
                        maxTaxAmount: 30000,
                    }
                ],
                businesses: [],
                warehouse: []
            },
            taxesCat: "houses",
            rates: [
                {
                    name: LangString("components.Bank.Bank.6a11f1f1e7fbaf966871689cad742601"),
                    amount: 1000,
                    benefits: [
                        "Max. Saldo 10000000",
                        //"Блатная карта",
                        //"Она чёрная"
                    ]
                },
                {
                    name: LangString("components.Bank.Bank.75773d3476872a32df3d972ec1b78dda"),
                    amount: 20000,
                    benefits: [
                        "Max. Saldo 100000000",
                        //"Блатная карта",
                        //"Она чёрная"
                    ]
                },
                {
                    name: "Platinum",
                    amount: 50000,
                    benefits: [
                        "Max. Saldo 500000000",
                        //"Блатная карта",
                        //"Она чёрная"
                    ]
                },
            ],
            chooseRate: 0,
            settingsComponent: "changeCode",
            refNewCode: React.createRef(),
            refOldCode: React.createRef(),
            refChangePin: React.createRef()
        }

        updateEventHandler = CustomEvent.register("bank:updateTax",
            (taxId: number, taxCategory: taxesCategory) => {
                const taxes = this.state.taxes;
                taxes[taxCategory].splice(this.state.taxes[taxCategory].findIndex(el => el.id === taxId), 1)
                this.setState({
                    ...this.state,
                    taxes: taxes
                })
            })

        updateCardEventHandler = CustomEvent.register("bank:updateCard",
            (cardRate: number) => {
                this.setState({
                    ...this.state,
                    rate: cardRate
                })
            })

        eventHandler = CustomEvent.register("bank:loadData",
            (bankId: number, rateId: number, cardNumber: string, taxes: BankTaxes) => {
                this.setState({
                    bankId,
                    rate: rateId,
                    accountNumber: cardNumber,
                    taxes
                })
            })
    }

    public componentWillUnmount() {
        if (eventHandler) eventHandler.destroy();
    }

    exit(): void {
        CEF.gui.setGui(null)
        CEF.playSound("cliekc"); // sunet la selectarea unui articol

    }

    payAllTaxesForCat(): void {
        this.state.taxes[this.state.taxesCat].map(tax => {
            CustomEvent.triggerServer("bank:payTax", tax.id, this.state.taxesCat)
            CEF.playSound("cliekc"); // sunet la selectarea unui articol

        })
    }

    payForItem(id: number): void {
        CustomEvent.triggerServer("bank:payTax", id, this.state.taxesCat)
        CEF.playSound("cliekc"); // sunet la selectarea unui articol

    }

    changeRate(): void {
        if (this.state.chooseRate <= this.state.rate) return;
        const index: number = this.state.chooseRate;
        CustomEvent.triggerServer("bank:changeCard", index)
        CEF.playSound("cliekc"); // sunet la selectarea unui articol
    }

    async onClickChangeCode(): Promise<void> {
        const old = this.state.refOldCode.current.value,
            newer = this.state.refNewCode.current.value;
        CustomEvent.triggerServer("atm:changePin", this.state.accountNumber, old, newer)
        CEF.playSound("cliekc"); // sunet la selectarea unui articol

    }

    async orderCard(): Promise<void> {
        CustomEvent.triggerServer("bank:reissue", this.state.refChangePin.current.value)
    }

    closeAccount(): void {
        CustomEvent.triggerServer("bank:closeCard")
        CEF.playSound("cliekc"); // sunet la selectarea unui articol

    }

    setComponent(component: "operations" | "settings" | "taxes" | "rate"): void {
        this.setState({...this.state, component})
    }

    setIsCashOut(toggle: boolean): void {
        if (this.state.isCashOut === toggle) return;
        this.state.refOperationAmount.current.value = ""
        this.setState({...this.state, isCashOut: toggle, totalAmount: 0})
    }

    getTotalAmountForCat(cat: taxesCategory): number {
        let blockTaxes = this.state.taxes[cat],
            amount = 0;

        blockTaxes.forEach(el => {
            amount += el.maxTaxAmount - el.taxAmountLeft;
        });

        if (amount < 0) return 0;
        return amount;
    }

    setTaxesCat(taxesCat: taxesCategory): void {
        this.setState({...this.state, taxesCat});
    }

    onChangeOperation(isAmount: boolean): void {
        let amount = Number(this.state.refOperationAmount.current.value),
            code = this.state.refOperationCode.current.value;

        if (code.length > 4) this.state.refOperationCode.current.value = code.substr(0, 4);
        if (/[^0-9.]/g.test(code)) this.state.refOperationCode.current.value = this.state.refOperationCode.current.value.replaceAll(/[^0-9.]/g, "")

        if (amount > this.maxAmount) {
            return this.setState({
                ...this.state,
                commission: 0,
                totalAmount: 0,
                activeBtnOperation: false,
                showMax: true
            });
        }

        let obj: any = {};

        if (amount <= this.maxAmount && this.state.showMax) obj.showMax = false;

        if (isAmount) {
            obj.commission = this.state.isCashOut ? Math.round(amount / 100) : 0;
            obj.totalAmount = amount + obj.commission;
        }

        obj.activeBtnOperation = !this.state.showMax && !obj.showMax && code.length === 4 && amount !== 0;

        this.setState({...this.state, ...obj});
    }

    setChooseRate(toggle: boolean): void {
        let chooseRate: number = this.state.chooseRate;
        if (toggle) {
            if (this.state.chooseRate === this.state.rates.length - 1) return;
            chooseRate += 1;
        } else {
            if (this.state.chooseRate === 0) return;
            chooseRate -= 1;
        }

        this.setState({...this.state, chooseRate})
    }


    getTransform(): string {
        switch (this.state.chooseRate) {
            case 0:
                return "bank-card0";
            case 1:
                return "";
            case 2:
                return "bank-card2";
            default:
                return "";
        }
    }

    setSettingsComponent(settingsComponent: "changeCode" | "orderCard" | "closeAccount"): void {
        this.setState({...this.state, settingsComponent});
    }

    onChangeCode(isOld: boolean): void {
        const old = this.state.refOldCode.current.value,
            newer = this.state.refNewCode.current.value;

        if (isOld) {
            if (old.length > 4) this.state.refOldCode.current.value = old.substr(0, 4);
            if (/[^0-9.]/g.test(old)) this.state.refOldCode.current.value = this.state.refOldCode.current.value.replaceAll(/[^0-9.]/g, "")
        } else {
            if (newer.length > 4) this.state.refNewCode.current.value = old.substr(0, 4);
            if (/[^0-9.]/g.test(newer)) this.state.refNewCode.current.value = this.state.refNewCode.current.value.replaceAll(/[^0-9.]/g, "")
        }
    }

    getCardStyle(): string {
        switch (this.state.rate) {
            case 0: {
                return cardBlack;
            }
            case 1: {
                return cardGold;
            }
            case 2: {
                return cardPlatinum
            }
            default: {
                return cardBlack;
            }
        }
    }


    render() {
        return <div className="bank">
            {/* <img src={fleeca} className="bank__fleecaImg" alt=""/>
            <img src={lines} className="bank__linesImg" alt=""/> */}

            <div className="exit" onClick={() => this.exit()}>
                <div className="exit-icon">
                    <img src={exitIcon} alt="#"/>
                </div>
                <div className="exit__title">
                    {LangString("components.Bank.Bank.516438be67be829e6d27f1412933a9ce")}
                </div>
            </div>

            <div className="bank-body">

                <div className="bank-body-left">

                    <div className="bank-body-left__card">
                        <img src={this.getCardStyle()} alt=""/>
                        <p>{CEF.user.name}</p>
                    </div>

                    <div className="bank-body-left-content">

                        <div className="bank-body-left-content-yourCard">

                            <div className="__title">
                                {LangString("components.Bank.Bank.052e05e1377df80f61ccae8e1455e896")}
                            </div>

                            <img src={cardIcon} className="bank-body-left-content-yourCard__cardIcon" alt=""/>

                            <span className="bank-body-left-content-yourCard__cardName">{LangString("components.Bank.Bank.c2f09c7b29e5d8ccd704309f1b3f1e69")}</span>

                            <span className="bank-body-left-content-yourCard__cardNumber">
                                <img src={point} alt=""/>
                                <img src={point} alt=""/>
                                <span>{this.state.accountNumber.replace(this.state.accountNumber.slice(0, -4), "")}</span>
                            </span>

                            <span className="bank-body-left-content-yourCard__balance">
                                $ {CEF.user.bank.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}
                            </span>

                        </div>

                        <div className="bank-body-left-content-row">
                            <img src={sharpIcon} alt=""/>
                            <div className="bank-body-left-content-row__title">{LangString("components.Bank.Bank.41fd4b65e83c83c5630302afb431dd4c")}</div>
                            <span>{this.state.accountNumber}</span>
                            <div className="bank-body-left-content-row__hr"/>
                        </div>

                        <div className="bank-body-left-content-row">
                            <img src={starIcon} alt=""/>
                            <div className="bank-body-left-content-row__title">{LangString("components.Bank.Bank.d911f184471b61a75e05269f95169704")}</div>
                            <span>{this.state.rates[this.state.rate].name}</span>
                        </div>

                        <div className="bank-body-left-content-footer displayNone">
                            <div className="bank-body-left-content-footer__title">
                                {LangString("components.Bank.Bank.c23d63021b6fe90ea2f18e218500cae5")}
                            </div>
                            <div className="bank-body-left-content-footer__text">
                                {LangString("components.Bank.Bank.c43cb2a2d99318aaf217ddd3dea096d9")}
                            </div>
                            <div className="bank-body-left-content-footer__input">
                                <img src={minus} alt=""/>
                                <span>%</span>
                                <div/>
                                <input type="number"/>
                                <img src={plus} alt=""/>
                            </div>
                        </div>

                    </div>

                </div>

                <div className="bank-body-right">

                    <div className="bank-body-right-nav">
                        <div className={`${this.state.component === "operations" ? "bank-active" : ""}`}
                             onClick={() => this.setComponent("operations")}>
                            <span>{LangString("components.Bank.Bank.e2a9dad015853517d6a9babd0420ce9f")}</span></div>
                        <div className={`${this.state.component === "taxes" ? "bank-active" : ""}`}
                             onClick={() => this.setComponent("taxes")}>
                            <span>{LangString("components.Bank.Bank.4ee59a9c3673ea0ab6d7d22948aab059")}</span></div>
                        <div className={`${this.state.component === "rate" ? "bank-active" : ""}`}
                             onClick={() => this.setComponent("rate")}>
                            <span>{LangString("components.Bank.Bank.f5f80e458568dce2554d14348a37aee4")}</span></div>
                        <div className={`${this.state.component === "settings" ? "bank-active" : ""}`}
                             onClick={() => this.setComponent("settings")}>
                            <span>{LangString("components.Bank.Bank.6e029a8e3929361e9569bdfbff925739")}</span></div>
                    </div>

                    <div className={`bank-body-right-content bank-body-right-content0 
                    ${this.state.component === "operations" ? "" : "displayNone"}`}>

                        <div className="bank-body-right-content0__switcher">
                            <div className={`${this.state.isCashOut ? "" : "bank-active"}`}
                                 onClick={() => this.setIsCashOut(false)}>{LangString("components.Bank.Bank.e542fc89de31563c787b1c504f28d899")}
                            </div>
                            <div className={`${this.state.isCashOut ? "bank-active" : ""}`}
                                 onClick={() => this.setIsCashOut(true)}>{LangString("components.Bank.Bank.5eef371d852f1fef6e30af3f68a69639")}
                            </div>
                        </div>

                        <div className="bank-body-right-content0-window">

                            <div className="bank-body-right-content0-window__cashBalance">
                                <img src={walletIcon} alt=""/>
                                $ {CEF.user.money.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}
                            </div>

                            <div className="bank-body-right-content0-window__title">
                                {LangString("components.Bank.Bank.f87b26323bd7e1abd8e4db43e18baa91")}
                            </div>

                            <div className="bank-body-right-content0-window-input">
                                <span>$</span>
                                <div/>
                                <input type="number" ref={this.state.refOperationAmount}
                                       onChange={() => this.onChangeOperation(true)}/>
                                {this.state.showMax && <p>{LangString("components.Bank.Bank.4ab27f7290cf35ae855beb49b73386bf")} {this.maxAmount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</p>}
                            </div>

                            <div className="bank-body-right-content0-window-commission">
                                <div>
                                    {LangString("components.Bank.Bank.c43bb43cdad680949391c821b1ae798e")}{this.state.isCashOut ? REMOVAL_BANK_MONEY_PERCENT : 0}{LangString("components.Bank.Bank.ca53bf52629b4cbf4e2276b6c8e576e1")} <span>$
                                    {this.state.isCashOut
                                        ? this.state.commission.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ") : 0}</span>
                                </div>
                                <div>
                                    {LangString("components.Bank.Bank.55803a7ed842c6e9efa951b848dc0cbc")} <span>$ {this.state.totalAmount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</span>
                                </div>
                            </div>

                        </div>

                        <div className="bank-body-right-content0-pinTitle">
                            {LangString("components.Bank.Bank.8dd293222868655047f80dafdb6f8b38")}
                        </div>

                        <div className="bank-body-right-content0-pin">
                            <input ref={this.state.refOperationCode} type="password" placeholder="••••"
                                   onChange={() => this.onChangeOperation(this.state.isCashOut)}/>
                            <div
                                className={`${this.state.activeBtnOperation ? "bank-active" : ""}`}
                                onClick={async () => {
                                    const isPinCorrect: boolean = await CustomEvent.callServer("pin:check", this.state.accountNumber, this.state.refOperationCode.current.value)
                                    if (isPinCorrect)
                                        this.state.isCashOut
                                            ? CustomEvent.triggerServer("bank:witdraw", this.state.bankId, this.state.totalAmount)
                                            : CustomEvent.triggerServer("bank:deposit", this.state.bankId, this.state.totalAmount)
                                }}
                            >
                                {this.state.isCashOut ? LangString("components.Bank.Bank.3269d388b7f1471fde715a6d7875dae6") : LangString("components.Bank.Bank.168b60be60fdecce2992b051e065e569")}
                            </div>
                        </div>

                    </div>

                    <div className={`bank-body-right-content bank-body-right-content1
                    ${this.state.component === "taxes" ? "" : "displayNone"}`}>

                        <div className="bank-body-right-content1-nav">

                            <div
                                className={`bank-body-right-content1-nav-block ${this.state.taxesCat === "houses" ? "bank-active" : ""}`}
                                onClick={() => this.setTaxesCat("houses")}>
                                <img src={houseIcon} alt=""/>
                                <span>{LangString("components.Bank.Bank.e6fb7d1f72854dbb25470f6cad86e88c")}</span>
                                <div>{LangString("components.Bank.Bank.e44a551e6f2c0dc8425b327349678adc")}
                                    <p>$ {this.getTotalAmountForCat("houses").toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</p>
                                </div>
                            </div>
                            <div
                                className={`bank-body-right-content1-nav-block ${this.state.taxesCat === "businesses" ? "bank-active" : ""}`}
                                onClick={() => this.setTaxesCat("businesses")}>
                                <img src={businessIcon} alt=""/>
                                <span>{LangString("components.Bank.Bank.82c057dbb77bc46434b6bc5161971e30")}</span>
                                <div>{LangString("components.Bank.Bank.8c69458cd571e6cf8458c466f6275b5a")}
                                    <p>$ {this.getTotalAmountForCat("businesses").toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</p>
                                </div>
                            </div>
                            <div
                                className={`bank-body-right-content1-nav-block ${this.state.taxesCat === "warehouse" ? "bank-active" : ""}`}
                                onClick={() => this.setTaxesCat("warehouse")}>
                                <img src={businessIcon} alt=""/>
                                <span>{LangString("components.Bank.Bank.b49bd52e8c97f14a02f427612169d1e7")}</span>
                                <div>{LangString("components.Bank.Bank.42bec42113da9a1621fe9774b09ece08")}
                                    <p>$ {this.getTotalAmountForCat("warehouse").toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bank-body-right-content1-title">
                            {this.getTaxName(this.state.taxesCat)}
                            <div className="bank-body-right-content1-title__button"
                                 onClick={() => this.payAllTaxesForCat()}>
                                {LangString("components.Bank.Bank.889dfdf081caa201ea621eed33d420ec")} <span>$ {this.getTotalAmountForCat(this.state.taxesCat).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</span>
                            </div>
                        </div>

                        <div className="bank-body-right-content1-scroll">
                            {
                                this.state.taxes[this.state.taxesCat].map((el, key) => {
                                    const bottomTitle: string = el.address ? el.address : el.numberPlate;

                                    return <div className="bank-body-right-content1-scroll-block" key={key}>

                                        <div className="bank-body-right-content1-scroll-block__left">
                                            <div>{el.name}</div>
                                            <span>{bottomTitle}</span>
                                        </div>
                                        <div className="bank-body-right-content1-scroll-block__right">
                                            <span>$ {(el.maxTaxAmount - el.taxAmountLeft < 0 ? 0 : el.maxTaxAmount - el.taxAmountLeft).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</span>
                                            <div onClick={() => this.payForItem(el.id)}>{LangString("components.Bank.Bank.8bd174e83c38330afe1fd1a0547fa464")}</div>
                                        </div>
                                    </div>
                                })
                            }

                        </div>
                    </div>

                    <div className={`bank-body-right-content bank-body-right-content2
                    ${this.state.component === "rate" ? "" : "displayNone"}`}>

                        <div className="bank-body-right-content2__leftShadow"/>
                        <div className="bank-body-right-content2__rightShadow"/>

                        <div className="bank-body-right-content2__leftButton"
                             onClick={() => this.setChooseRate(false)}/>
                        <div className="bank-body-right-content2__rightButton"
                             onClick={() => this.setChooseRate(true)}/>

                        <div className={`bank-body-right-content2-cards ${this.getTransform()}`}>
                            <div
                                className={`${this.state.chooseRate === 0 ? "bank-active" : ""}`}>
                                <img src={cardBlack} alt=""/>
                            </div>
                            <div
                                className={`${this.state.chooseRate === 1 ? "bank-active" : ""}`}>
                                <img src={cardGold} alt=""/>
                            </div>
                            <div
                                className={`${this.state.chooseRate === 2 ? "bank-active" : ""}`}>
                                <img src={cardPlatinum} alt=""/>
                            </div>

                        </div>

                        <div className="bank-body-right-content2-cardInfo">
                            <div className="bank-body-right-content2-cardInfo__title">
                                {this.state.rates[this.state.chooseRate].name} {LangString("components.Bank.Bank.77d4938bedb1999f01ffcc28dc1a2909")}
                                {/*  Premium, VIP  */}
                            </div>
                            <div className="bank-body-right-content2-cardInfo__li">
                                {
                                    this.state.rates[this.state.chooseRate].benefits.map((el, key) => {
                                        return <span key={key}>{el}</span>
                                    })
                                }
                            </div>
                            <div className="bank-body-right-content2-cardInfo-button">
                                <span>$ {this.state.rates[this.state.chooseRate].amount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</span>
                                <div onClick={() => this.changeRate()}
                                     className={`${this.state.chooseRate <= this.state.rate ? "bank-active" : ""}`}>
                                    {this.state.chooseRate === this.state.rate ? LangString("components.Bank.Bank.e3a27f8e76c0bc0e89efe3367feade1e") : this.state.chooseRate > this.state.rate ? LangString("components.Bank.Bank.a26ad22879455981a6a447a3ce1301f5") : LangString("components.Bank.Bank.80cedcb60f6a0588f1723a23d772d6d9")}
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className={`bank-body-right-content bank-body-right-content3
                    ${this.state.component === "settings" ? "" : "displayNone"}`}>

                        <div className="bank-body-right-content3-buttons">
                            <div className={`${this.state.settingsComponent === "changeCode" ? "bank-active" : ""}`}
                                 onClick={() => this.setSettingsComponent("changeCode")}>{LangString("components.Bank.Bank.a30220aca6c89dadd90e6ed43f341fd3")}
                            </div>
                            <div className={`${this.state.settingsComponent === "orderCard" ? "bank-active" : ""}`}
                                 onClick={() => this.setSettingsComponent("orderCard")}>{LangString("components.Bank.Bank.bd0f85197002c1a9d2a5399547a54902")}
                            </div>
                            <div className={`${this.state.settingsComponent === "closeAccount" ? "bank-active" : ""}`}
                                 onClick={() => this.setSettingsComponent("closeAccount")}>{LangString("components.Bank.Bank.d69b6d0782efef7162f7c886913a7212")}
                            </div>
                        </div>

                        <div className="bank-body-right-content3__hr"/>

                        {this.state.settingsComponent === "changeCode" &&
                        <div className={"bank-body-right-content3-content "}>
                            <div className="bank-body-right-content3-content__title">
                                {LangString("components.Bank.Bank.912dd0651041a4d8f22001242a5e56c0")}
                            </div>
                            <div className="bank-body-right-content3-content__descriptionBig">
                                {LangString("components.Bank.Bank.78457f57197276d2845b1f1a4f568dd8")}
                            </div>
                            <input type="password" placeholder="••••" ref={this.state.refOldCode}
                                   onChange={() => this.onChangeCode(true)}/>
                            <div className="bank-body-right-content3-content__descriptionBig">
                                {LangString("components.Bank.Bank.8dc67b95727180831c5c28568d4bc4e8")}
                            </div>
                            <input type="number" placeholder="••••" ref={this.state.refNewCode}
                                   onChange={() => this.onChangeCode(false)}/>
                            <div className="bank-body-right-content3-content__buttonBig"
                                 onClick={() => this.onClickChangeCode()}>
                                {LangString("components.Bank.Bank.cecaa0aea97f5698dc78ef17a1cad25f")}
                            </div>
                        </div>}

                        {this.state.settingsComponent === "orderCard" &&
                        <div className={"bank-body-right-content3-content"}>
                            <div className="bank-body-right-content3-content__title">
                                {LangString("components.Bank.Bank.9b9ad99e70c0cbba8a8cbeae649c1b32")}
                            </div>
                            <div className="bank-body-right-content3-content__description">
                                {LangString("components.Bank.Bank.894662f5508dcde2670de63715305b49")}
                            </div>
                            <input type="password" placeholder="••••" ref={this.state.refChangePin}
                                   onChange={() => this.onChangeCode(true)}/>
                            <div className="bank-body-right-content3-content__price">
                                <span>{LangString("components.Bank.Bank.0610da5a727f6c1b456a0b4239b0c899")}</span>
                                <p>$ {systemUtil.numberFormat(newBankCardCost)}</p>
                                <div className="bank-body-right-content3-content__button"
                                     onClick={() => this.orderCard()}>
                                    {LangString("components.Bank.Bank.388fc88e69da512c58b5c756d91b6712")}
                                </div>
                            </div>
                        </div>}

                        {this.state.settingsComponent === "closeAccount" &&
                        <div className={"bank-body-right-content3-content"}>
                            <div className="bank-body-right-content3-content__title">
                                {LangString("components.Bank.Bank.516aa8f7917095a6670e8e37b1c7c058")}
                            </div>
                            <div className="bank-body-right-content3-content__description">
                                {LangString("components.Bank.Bank.6ca10189cbf7475e56cc3d9824b9c63d")}
                            </div>
                            <div className="bank-body-right-content3-content__button"
                                 onClick={() => this.closeAccount()}>
                                {LangString("components.Bank.Bank.8a89e6e6c613dd25ce695021f6da133c")}
                            </div>
                        </div>}

                    </div>

                </div>
            </div>
        </div>
    }
}