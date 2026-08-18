import { LangString } from "../../modules/lang";
import React, {Component} from "react";
import "./style.less"
import {systemUtil} from "../../../shared/system";
import {CustomEvent} from "../../modules/custom.event";
import {VEHICLE_REGISTRATION_TARIFS} from "../../../shared/vehicle.registration";
import {DONATE_MONEY_NAMES} from "../../../shared/economy";
import {CEF} from "../../modules/CEF";

export class VehicleRegisterBlock extends Component<{}, {
    openAuction?: boolean,
    openAuctionMenu?: boolean,
    alreadyHave?: boolean;
    id: number,
    numbers: { number: string, name: string, cost: number, seller?: number }[],
    phone_cost: number,
    sim_cost: number,
    loaded: boolean
}>{

    constructor(props: any) {
        super(props);
        this.state = {
            loaded: false,
            alreadyHave: false,
            id: 1,
            numbers: [

            ],
            phone_cost: 10000,
            sim_cost: 500,
        }


        CustomEvent.register("vehicle:register", (alreadyHave: boolean) => {
            this.setState({ alreadyHave, loaded: true})
        })

    }



    render() {
        if(!this.state.loaded) return <></>;
        return <>

            <div className="salon-wrapper">
                <p className="section-fly-title">{LangString("components.VehicleRegister.index.c4da118b1104f10a6184d6645ef2a2a1")}{this.state.id}</p>

                <div className="box-white wide posrev ui-tabs ui-corner-all ui-widget ui-widget-content" id="tabsSalon">
                    {/* <div className="header-menu">
                        <ul className="button-list wide ui-tabs-nav ui-corner-all ui-helper-reset ui-helper-clearfix ui-widget-header" role="tablist">
                            <li className={"ui-tabs-tab ui-corner-top ui-state-default ui-tab " + (!this.state.openAuction ? ' active ui-tabs-active ui-state-active' : '')}><a href="#" className="ui-tabs-anchor" onClick={e => {
                                e.preventDefault();
                                this.setState({ openAuction: false })
                            }}>Услуги</a></li>
                            <li role="tab" className={"ui-tabs-tab ui-corner-top ui-state-default ui-tab" + (this.state.openAuction ? ' active ui-tabs-active ui-state-active' : '')}><a href="#" className="ui-tabs-anchor" onClick={e => {
                                e.preventDefault();
                                this.setState({ openAuction: true })
                            }}>Аукцион</a></li>
                        </ul>
                    </div> */}
                    <div className="box-content">
                        {this.state.openAuction ? <div id="auctionnumbers" className="content-in posrev p20 ui-tabs-panel ui-corner-bottom ui-widget-content" aria-labelledby="ui-id-2" role="tabpanel" aria-hidden="true">
                            {!this.state.openAuctionMenu ? <>

                                <button className="primary-button auction-in wide mininormal mb10" onClick={e => {
                                    e.preventDefault();
                                    this.setState({ openAuctionMenu: true})
                                }}>
                                    <p>{LangString("components.VehicleRegister.index.a3462e4f8ade5bf1324564fb324bcbc6")}</p>
                                </button>
                                <div className="auction-th flexbetween">
                                    <p>{LangString("components.VehicleRegister.index.29ec38751523ed3cf040a701fe3a942b")}</p>
                                    <p>{LangString("components.VehicleRegister.index.ba11ae9d6d58e2d9b56053efcbd74870")}</p>
                                    <p>{LangString("components.VehicleRegister.index.a109b956e428efc2373e1502e176fd0b")}</p>
                                </div>
                                <div className="list-buy">
                                    
                                    {this.state.numbers ? this.state.numbers.map(phone => {
                                        return <a href="#" className="list-buy-item">
                                            <p>{phone.number}</p>
                                            <p className="mini">{phone.name} {phone.seller ? `(#${phone.seller})` : ""}</p>
                                            <span className="price-bage">${systemUtil.numberFormat(phone.cost)}</span>
                                        </a>
                                    }) : <></>}
                                </div>
                            </> : <>
                                    <button className="primary-button auction-in wide mininormal mb10" onClick={e => {
                                        e.preventDefault();
                                        this.setState({ openAuctionMenu: false })
                                    }}>
                                        <p>{LangString("components.VehicleRegister.index.65ac2f4bc2a359fa8830324b0dd4c912")}</p>
                                    </button>
                                    <div className="sell-number-info">{LangString("components.VehicleRegister.index.8b1f1c16aaff06b1ec06586cbf493eb3")}<br/>
                                    {LangString("components.VehicleRegister.index.a18fe5f97a97a856d06c7e991948ce43")}<br />
                                    {LangString("components.VehicleRegister.index.64f823f22359fac31f2ab16b115d15ca")}<br />
                                    {LangString("components.VehicleRegister.index.785775090d64b9cc306304a74fc0fa53")}<br />
                                    {LangString("components.VehicleRegister.index.27a1b4e523954b7ff60634df2ae08408")}<br />
                                    </div>
                                    <div className="number-sell-input-block">
                                        <p>{LangString("components.VehicleRegister.index.83886dd435fd3dbf04f9db74424c554c")}</p>
                                        <input type="number" className='number-sell-input' />
                                    </div>
                            </>}

                        </div> : <div id="numbersphones" className="content-in p20 ui-tabs-panel ui-corner-bottom ui-widget-content" aria-labelledby="ui-id-1" role="tabpanel" aria-hidden="false">
                                <div className="list-buy">
                                    <div className="sell-number-info">{LangString("components.VehicleRegister.index.6635d7a3e23ffe6c92caf1890a7a7286")}</div>
                                    {VEHICLE_REGISTRATION_TARIFS.map((item, index) => {
                                        return <a href="#" className="list-buy-item" onClick={e => {
                                            e.preventDefault();
                                            CustomEvent.callServer("vehiclenumber:buy", index)
                                        }}>
                                            <p>{item[0]}</p>
                                            <span className={`price-bage ${item[2] ? "donate" : ""}`}>{item[2] ? "" : "$"}{systemUtil.numberFormat(item[1])} {item[2] ? DONATE_MONEY_NAMES[2] : ""}</span>
                                        </a>
                                    })}
                                    <a href="#" className="list-buy-item close-menu" onClick={e => {
                                       CEF.gui.setGui(null);
                                    }}>
                                        <p>{LangString("components.VehicleRegister.index.73971c17e2b62eede2d70eb72d9a355d")}</p>
                                    </a>
                                </div>
                            </div>}
                    </div>
                </div>
            </div>

        </>
    }
}