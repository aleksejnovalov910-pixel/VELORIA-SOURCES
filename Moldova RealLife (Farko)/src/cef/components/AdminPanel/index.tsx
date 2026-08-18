import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import './style.less'
import {CEF} from '../../modules/CEF';
import {CustomEventHandler} from "../../../shared/custom.event";
import Select from 'react-select'
import Draggable from 'react-draggable';
import {system} from "../../modules/system";

const choices = [
    {id: 'stats', name: 'Informatii', needTime: false, needReason: false, needOnline: false},
    {id: 'choice', name: 'Actiuni suplimentare', needTime: false, needReason: false, needOnline: false},
    {id: 'ban', name: 'Ban personaj', needTime: true, needReason: true, needOnline: false},
    {id: 'aban', name: 'Ban cont', needTime: true, needReason: true, needOnline: false},
    {id: 'kick', name: 'Kick', needTime: false, needReason: true, needOnline: true},
    {id: 'kill', name: 'Ucide', needTime: false, needReason: false, needOnline: true},
    {id: 'fullhp', name: 'Vindeca', needTime: false, needReason: false, needOnline: true},
    //{id: 'jail', name: 'Demorgan', needTime: true, needReason: true, needOnline: false},
    {id: 'cmute', name: 'Mute text', needTime: true, needReason: true, needOnline: true},
    {id: 'vmute', name: 'Mute voce', needTime: true, needReason: true, needOnline: true},
    {id: 'freeze', name: 'Freeze', needTime: false, needReason: false, needOnline: true},
    {id: 'tp', name: 'TP la tinta', needTime: false, needReason: false, needOnline: true},
    {id: 'tpm', name: 'TP la tine', needTime: false, needReason: false, needOnline: true},
    {id: 'sp', name: 'Spectate', needTime: false, needReason: false, needOnline: true},
    {id: 'cuff', name: 'Catuse', needTime: false, needReason: false, needOnline: true},


]

export class AdminPanelComponent extends Component<{}, {
    /** Определяет статус отображения. Полезно если для отображения компонента необходимо не только его включить, а так же и получить какие то данные от клиента или сервера */
    show: boolean,
    id: number,
    players: [number, string][],
    data?:[string, any][]
    /** Пример каких либо данных */
    choice: typeof choices[number]['id'],
    choiceTime: string,
    inputTime: number,
    inputReason: string,
    spam?:boolean
    inSp?:boolean
}> {
    /** Это наш ивент, через который интерфейс может получать данные от клиента или сервера */
    private ev: CustomEventHandler;
    private ev2: CustomEventHandler;

    constructor(props: any) {
        super(props);
        this.state = {
            inputReason: '',
            choiceTime: 'm',
            inputTime: 0,
            id: 0,
            players: CEF.test ? [
                [10, 'Xander Test'],
                [11, 'Xander Test 1'],
                [12, 'Xander Test 2'],
                [13, 'Xander Test 3'],
            ] : [],
            /** По умолчанию используется значение CEF.test. true будет если мы в браузере проверяем интерфейс.*/
            show: false,
            choice: choices[0].id,
            inSp: CEF.test
        }
        // Если необходимо - можно объявить ивент для получения данных от клиента или сервера.
        this.ev = CustomEvent.register('admin:panel:show', (status: boolean, players: [number, string][], id: number) => {
            this.setState({
                id: id ? id : this.state.id,
                show: status,
                players: players || [],
                data: !id || this.state.id === id ? this.state.data : null,
                inSp: !!id ? true : this.state.inSp,
            })
        })
        this.ev2 = CustomEvent.register('admin:panel:stats:data', (id: number, data:[string, any][]) => {
            if(this.state.id !== id) return;
            this.setState({data})
        })
    }

    get choice(){
        return choices.find(q => q.id === this.state.choice)
    }

    componentWillUnmount() {
        // Удаляем ивент при выгрузке компонента, при новом вызове этого компонента ивент будет создан повторно
        if (this.ev) this.ev.destroy()
        if (this.ev2) this.ev2.destroy()
    }

    get searchParams() {
        return [...this.state.players.map((q, i) => {
            return {value: `${q[0]}`, label: `[${q[0]}] ${q[1]}`}
        }), {value: `OFFLINE`, label: `OFFLINE`, disabled: true}]
    }

    get searchTime() {
        return [
            {value: `m`, label: `minute`},
            {value: `h`, label: `ore`},
            {value: `d`, label: `zile`},
        ]
    }

    ioOnline(){
        return this.state.players && this.state.players.find(q => q[0] === this.state.id)
    }

    render() {
        // Pana cand nu am primit date prin eveniment (sau nu testam interfata prin browser), nu afisam nimic
        if (!this.state.show) return <></>;
        // Aici returneaza interfata propriu-zisa (cu un exemplu de date despre jucator care sunt deja stocate in interfata fara a fi nevoie sa fie primite din evenimente)
        return <Draggable handle=".title">
            <div className={'admin_panel_block'}>
                <h2 className={'title'}>Actiuni rapide</h2>
                {this.state.inSp ? <button className={'choiceButton'} onClick={e => {
                    e.preventDefault()
                    CustomEvent.triggerClient('admin:spectate:stop', true, false)
                    this.setState({inSp: false})
                }}>STOP SPEC</button> : <></>}
                <Select onChange={e => {
                    const id = parseInt((e as any).value)
                    this.setState({id: isNaN(id) ? 0 : id, data: this.state.id === id ? this.state.data : null});
                }} classNamePrefix={'user_role'}
                        value={this.searchParams.find(q => q.value == this.state.id.toString() || q.value === 'OFFLINE')}
                        options={this.searchParams}/>
                        ID: <input type="number" className={'choiceButton'} value={this.state.id} onChange={e => {
                            e.preventDefault();
                            this.setState({id: e.currentTarget.valueAsNumber, data: this.state.id === e.currentTarget.valueAsNumber ? this.state.data : null})
                        }} /><br/>
                {choices.map(choice => {
                    if(choice.needOnline && !this.ioOnline()) return <></>;
                    return <button className={'choiceButton '+(this.choice.id === choice.id ? 'selected' : '')} key={choice.id} onClick={e => {
                        e.preventDefault()
                        this.setState({choice: choice.id})
                    }}>{choice.name}</button>
                })}
                <br/>
                {this.choice ? <>

                    {this.choice.needTime ? <>
                        <button className={'choiceButton'} disabled={true}>⌛</button>
                        {this.searchTime.map(q => {
                            return <button key={`admin_panel_time_${q.value}`} className={'choiceButton '+(this.state.choiceTime === q.value ? 'selected' : '')} onClick={e => {
                                e.preventDefault()
                                this.setState({choiceTime: q.value})
                            }}>{q.label}</button>
                        })}

                        <input className={'choiceButton'} type="number" min={0} max={600} step={1} value={this.state.inputTime} onChange={e => {
                        e.preventDefault();
                        this.setState({inputTime: e.currentTarget.valueAsNumber})
                    }} /></> : <></>}

                    {this.choice.needReason ? <textarea className={'choiceButton textarea'} placeholder={'Introdu motivul'} value={this.state.inputReason} onChange={e => {
                        e.preventDefault()
                        this.setState({inputReason: e.currentTarget.value})
                    }}/> : <></>}
                </> : <></>}

                <div className={'stats'}>
                    <div className={'stats_title'}>Informatii</div>
                    <div className={'stats_item'}>
                        <div>Status</div>
                        <div>{this.ioOnline() ? 'ONLINE' : "OFFLINE"}</div>
                    </div>
                    {this.state.data ? this.state.data.map((q, i) => {
                        return <div className={'stats_item'} key={`stats_item_${i}`}>
                            <div>{q[0]}</div>
                            <div>{q[1]}</div>
                        </div>
                    }) : <></>}
                </div>

                {this.state.id && this.choice ? <button className={'choiceButton press'} onClick={e => {
                    e.preventDefault()
                    if(this.state.spam) return CEF.alert.setAlert('error', 'Asteapta inainte sa trimiti urmatoarea comanda')
                    if(this.choice.needReason && this.state.inputReason?.length < 3) return CEF.alert.setAlert('error', 'Introdu motivul')
                    if(this.choice.needTime && (!this.state.inputTime || this.state.inputTime < 0)) return CEF.alert.setAlert('error', 'Introdu timpul')
                    this.setState({spam: true});
                    setTimeout(() => {
                        this.setState({spam: false});
                    }, 1000)
                    CEF.triggerChatCommand('adminPanel', this.choice.id, `${this.state.id}`, this.state.choiceTime, this.state.inputTime.toString(), ...(this.state.inputReason.split(' ').map(q => system.filterInput(q))))
                }}>Executa</button> : <></>}
            </div>
        </Draggable>;
    }
}