import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import './style.less'

import svg from '../../assets/images/svg/*.svg';
import {CEF} from "../../modules/CEF";
import {getMaxExpLevel} from "../../../shared/payday";
import {getVipConfig, VipId} from "../../../shared/vip";
import {system} from "../../modules/system";
import {getJobName, JobId} from "../../../shared/jobs";
import { fractionCfg } from '../../modules/fractions';

export class AdminDataSpectateBlock extends Component<{}, {
    history: number[];
    opened: boolean;
    openFullStat?: boolean;
    id?:number;
    name?:string;
    fraction?:number;
    rank?:number;
    warns?:number;
    ping?:number;
    level?:number;
    exp?:number;
    admin?:number;
    helper?:boolean;
    bank?:number;
    money?:number;
    coins?:number;
    job?:JobId;
    vip?:[VipId, number];
}> {


    constructor(props: any) {
        super(props);
        this.state = {
            history: [],
            opened: CEF.test && !CEF.testGui,
        }

        CustomEvent.register('admin:spectate', (id: number, name: string, fraction: number, rank: number, warns: number, ping: number, level: number, exp: number, admin: number, helper: any, bank: number, money: number, coins: number, job: any, vip: any) => {
            this.state.history.splice(this.state.history.findIndex(q => q === id), 1);
            this.setState({ opened: true, name, id, fraction, rank, warns, ping, level, exp, admin, helper, bank, money, coins, vip, job, history: [...this.state.history, id] })
        })
        CustomEvent.register('admin:spectate:stop', () => {
            this.close(true)
        })
    }

    close(ev = false, returnMe = true, tpHim = false, id?: number){
        this.setState({openFullStat: false, opened: false, history: []})
        if(!ev)CustomEvent.triggerClient('admin:spectate:stop', returnMe, tpHim, id)
    }

    componentWillUnmount() {

    }


    render() {
        if (!this.state.opened) return <></>;
        return <section className="admin-follow-wrapper">
            <button className="af-close-follow" onClick={e => {
                e.preventDefault()
                this.close();
            }}>
                <img src={svg["close"]} alt="" />
            </button>
            <div className="af-top-follow-user">
                <div className="flex-line">
                    <button className="arrow-short arrow-left-icon" onClick={e => {
                        e.preventDefault()
                        const index = this.state.history.findIndex(q => q === this.state.id);
                        if(index <= 0) return;
                        CEF.triggerChatCommand('sp', `${this.state.history[index - 1]}`);

                    }}><img src={svg["arrow-left"]} alt="" /></button>
                    <button className="arrow-short arrow-right-icon"  onClick={e => {
                        e.preventDefault()
                        const index = this.state.history.findIndex(q => q === this.state.id);
                        if(index <= 0) return;
                        CustomEvent.triggerServer('admin:spectate:next', this.state.id, this.state.history)

                    }}><img src={svg["arrow-right"]} alt="" /></button>
                </div>
                <p><small>Urmaresti jucatorul</small></p>
                <p className="title-main">{this.state.name}</p>
                <p className="af-follow-id"><i/>{this.state.id}<i/></p>
            </div>
            <div className="af-info-user">
                <p className="title-main tr mb16">Informatii</p>
                <ul className="info-list mb24">
                    <li>
                        <p>Level</p>
                        <p><strong>{this.state.level}</strong> <span>({this.state.exp}/{getMaxExpLevel(this.state.level)})</span></p>
                    </li>
                    {this.state.fraction ? <>
                        <li>
                            <p>Organizatie</p>
                            <p><strong>{fractionCfg.getFractionName(this.state.fraction)}</strong></p>
                        </li>
                        <li>
                            <p>Functie</p>
                            <p><strong>{fractionCfg.getRankName(this.state.fraction, this.state.rank)}</strong></p>
                        </li>
                    </> : <></>}
                </ul>
                <button className="easy-button" onClick={e => {
                    e.preventDefault()
                    this.setState({openFullStat: !this.state.openFullStat})
                }}>
                    <p>Statistica completa</p>
                </button>
            </div>
            <div className="af-buttons-left-bottom">
                <div className="flex-line flex-left">
                    <button className="easy-button" onClick={e => {
                        e.preventDefault()
                        this.close(false, true, true, this.state.id)
                    }}>
                        <p>TP la tine</p>
                    </button>
                    <button className="easy-button" onClick={e => {
                        e.preventDefault()
                        this.close(false, false, false, this.state.id)
                    }}>
                        <p>TP la el</p>
                    </button>
                    <button className="easy-button" onClick={e => {
                        e.preventDefault()
                        CEF.triggerChatCommand('fullhp', `${this.state.id}`)
                    }}>
                        <p>Da HP</p>
                    </button>
                    <button className="easy-button" onClick={e => {
                        e.preventDefault()
                        CEF.triggerChatCommand('kill', `${this.state.id}`)
                    }}>
                        <p>Ucide</p>
                    </button>
                </div>
                <div className="flex-line flex-left">
                    <button className="easy-button" onClick={e => {
                        e.preventDefault()
                        CEF.triggerChatCommand('cmute', `${this.state.id}`)
                    }}>
                        <p>Mute text</p>
                    </button>
                    <button className="easy-button" onClick={e => {
                        e.preventDefault()
                        CEF.triggerChatCommand('vmute', `${this.state.id}`)
                    }}>
                        <p>Mute voce</p>
                    </button>
                    <button className="easy-button" onClick={e => {
                        e.preventDefault()
                        CEF.triggerChatCommand('jail', `${this.state.id}`)
                    }}>
                        <p>Demorgan</p>
                    </button>
                </div>
                <div className="flex-line flex-left">
                    <button className="easy-button" onClick={e => {
                        e.preventDefault()
                        CEF.triggerChatCommand('ban', `${this.state.id}`)
                    }}>
                        <p>Ban personaj</p>
                    </button>
                    <button className="easy-button" onClick={e => {
                        e.preventDefault()
                        CEF.triggerChatCommand('aban', `${this.state.id}`)
                    }}>
                        <p>Ban cont</p>
                    </button>
                </div>
            </div>
            {this.state.openFullStat ? <div className="af-all-stat">
                <ul className="info-list info-list-short mb32">
                    {this.state.vip ? <li>
                        <p>VIP</p>
                        <p><strong>{getVipConfig(this.state.vip[0]).name} pana la {system.timeStampString(this.state.vip[1])}</strong></p>
                    </li> : <></>}
                    {this.state.coins ? <li><p>Monede</p><p><strong>${system.numberFormat(this.state.coins)}</strong></p></li> : <></>}
                    {this.state.money ? <li><p>Cash</p><p><strong>${system.numberFormat(this.state.money)}</strong></p></li> : <></>}
                    {this.state.bank ? <li><p>Balanta bancara</p><p><strong>${system.numberFormat(this.state.bank)}</strong></p></li> : <></>}
                    {this.state.job ? <li><p>Job</p><p><strong>{getJobName(this.state.job)}</strong></p></li> : <></>}
                    {this.state.ping ? <li><p>Ping</p><p><strong>{this.state.ping}ms</strong></p></li> : <></>}
                    {this.state.warns ? <li><p>Avertismente</p><p><strong>{this.state.warns}</strong></p></li> : <></>}
                    {this.state.admin || this.state.helper ? <li>
                        <p>Admin/Helper</p>
                        <p><strong>{this.state.admin ? this.state.admin : 'Nu'}/{this.state.helper ? 'Da' : 'Nu'}</strong></p>
                    </li> : <></>}
                </ul>
            </div> : <></>}
        </section>;
    }

}

