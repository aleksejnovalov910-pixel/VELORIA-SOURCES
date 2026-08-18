import React, { Component } from "react";
import "./style.less";
import "../../style/style.css"
const png = Object.fromEntries(
    Object.entries(import.meta.glob("../../img/*.png", { eager: true })).map(
        ([key, value]) => {
            const name = key.match(/\/([^/]+)\.png$/)[1];
            return [name, value.default];
        },
    ),
);
const svg = Object.fromEntries(
    Object.entries(import.meta.glob("../../img/*.svg", { eager: true })).map(
        ([key, value]) => {
            const name = key.match(/\/([^/]+)\.svg$/)[1];
            return [name, value.default];
        },
    ),
);
import { getJobData, getJobName, getLevelByExp, IJobUserMenu } from "../../../../../shared/jobs";
import { CustomEventHandler } from '../../../../../shared/custom.event'
import { CustomEvent } from '../../../../modules/custom.event'
import { IUserStatsDto } from '../../../../../shared/userStats'
import { systemUtil } from '../../../../../shared/system'
import { CEF } from '../../../../modules/CEF';

export class Statistic extends Component<{
    totalPlayerTime: number
}, {
    username: string,
    kills: number,
    death: number,
    regDate: string,

    playTimeTotal: number,
    playTimeMouth: number,
    playTimeToday: number,

    moneyTotal: number,
    moneyMouth: number,
    moneyToday: number,
    moneySpent: number,

    jobs: IJobUserMenu[],
    page: number
}> {

    constructor(props: any) {
        super(props);

        this.state = {
            username: "User Name",
            kills: 100,
            death: 50,
            regDate: "20 января 1998",

            // Отыграно всего
            playTimeTotal: parseInt((this.props.totalPlayerTime / 60).toString()),
            // Отыграно за месяц
            playTimeMouth: 50,
            // Отыграно сегодня
            playTimeToday: 12,

            // Заработано всего
            moneyTotal: 200000000,
            // Заработано за месяц
            moneyMouth: 50000,
            // Заработано сегодня
            moneyToday: 1000,
            // Потрачено всего
            moneySpent: 300000000,

            jobs: CEF.test ? [
                { img: "fish", title: "Рыбалка", lvl: 2, maxLvl: 5, exp: 5000, maxExp: 10000 },
                { img: "fish", title: "Рыбалка", lvl: 1, maxLvl: 5, exp: 4000, maxExp: 10000 },
                { img: "fish", title: "Рыбалка", lvl: 3, maxLvl: 5, exp: 3000, maxExp: 10000 },
                { img: "fish", title: "Рыбалка", lvl: 4, maxLvl: 5, exp: 2000, maxExp: 10000 },
                // { img: "fish", title: "Электрик", lvl: 1, maxLvl: 5, exp: 4500, maxExp: 10000 },
            ] : [],

            page: 0
        };

        console.log(this.state.jobs[this.state.page] ? (this.state.jobs[this.state.page].exp / this.state.jobs[this.state.page].maxExp) * 100 : 0);
    }

    public componentDidMount() {
        CustomEvent.callServer('userStats:get').then((response: IUserStatsDto) => {
            console.log(JSON.stringify(response))

            const jobs: IJobUserMenu[] = []
            for (let job in response.workStats) {
                const jobData = getJobData(job as any)
                if (!jobData) continue
                const exp = response.workStats[job]
                jobs.push({
                    img: jobData.name,
                    exp,
                    lvl: getLevelByExp(exp),
                    maxLvl: 5,
                    maxExp: 1000,
                    title: jobData.name
                })
            }

            this.setState({
                death: response.userStats?.totalDeaths ?? 0,
                kills: response.userStats?.totalKills ?? 0,

                moneyMouth: response.monthlyMoneyEarned,
                moneyToday: response.dailyMoneyEarned,

                moneySpent: response.userStats?.totalMoneySpend ?? 0,
                moneyTotal: response.userStats?.totalMoneyEarned ?? 0,

                playTimeToday: response.dailyOnline,
                playTimeMouth: response.monthlyOnline,
                // playTimeTotal: response.userStats?.totalPlayedTime ?? 0,

                regDate: systemUtil.timeStampString(response.regDate, true),
                username: CEF.user.name,

                jobs: jobs
            })
        })
    }

    kd() {
        return this.state.death == 0 ? 0 : (this.state.kills / this.state.death).toFixed(2)
    }

    moneyPrettify(sum: number) {
        return sum.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ');
    }

    maxPage(): number {
        const num = this.state.jobs.length;
        if (num <= 1) return 0;
        return num - 1;
    }

    setPage(toggle: boolean): void {
        const currentPage = this.state.page;
        const maxPage = this.maxPage();

        if (toggle === true && currentPage >= maxPage) return;
        if (toggle === false && currentPage <= 0) return;

        const newPage = toggle ? currentPage + 1 : currentPage - 1;
        this.setState({ page: newPage });
    }

    preRenderCheck(index: number): boolean {
        index += 1;

        const min = this.state.page * 4,
            max = min + 5;

        return index > min && index < max;
    }

    render() {
        return <div className="umenu-statss">
            <div className="umenu-title">Statistici</div>
            <div className="umenu-subtitle">Informatii despre personajul tau</div>
            <div className="umenu-info">
                <div className="umenu-character">
                    <img src={svg['user']} alt="" />
                    <div className="umenu-name">{this.state.username}</div>
                    <div className="umenu-static">ID: #{CEF.id}</div>
                </div>
                <div className="umenu-item">
                    <img src={svg['murders']} alt="" />
                    <div className="umenu-text">Numar de crime</div>
                    <div className="umenu-value">{this.state.kills}</div>
                </div>
                <div className="umenu-item">
                    <img src={svg['death']} alt="" />
                    <div className="umenu-text">Numar de decese</div>
                    <div className="umenu-value">{this.state.death}</div>
                </div>
                <div className="umenu-item">
                    <img src={svg['murdeaths']} alt="" />
                    <div className="umenu-text">Crime/Decese</div>
                    <div className="umenu-value">{this.kd()}</div>
                </div>
            </div>
            <div className="umenu-statistics">
                <div className="umenu-title">Informatie</div>
                <div className="umenu-item">
                    <div className="umenu-text">Data inregistrarii</div>
                    <div className="umenu-value">{this.state.regDate}</div>
                </div>
                <div className="umenu-item">
                    <div className="umenu-text">Timp total jucat</div>
                    <div className="umenu-value">{this.state.playTimeTotal}H</div>
                </div>
                <div className="umenu-item">
                    <div className="umenu-text">Timp de joc in aceasta luna</div>
                    <div className="umenu-value">{this.state.playTimeMouth}H</div>
                </div>
                <div className="umenu-item">
                    <div className="umenu-text">Timp de joc astazi</div>
                    <div className="umenu-value"> {this.state.playTimeToday}H</div>
                </div>
                <div className="umenu-item">
                    <div className="umenu-text">Bani totali castigati</div>
                    <div className="umenu-value">$ {this.moneyPrettify(this.state.moneyTotal)}</div>
                </div>
                <div className="umenu-item">
                    <div className="umenu-text">Bani castigati luna curenta</div>
                    <div className="umenu-value">$ {this.moneyPrettify(this.state.moneyMouth)}</div>
                </div>
                <div className="umenu-item">
                    <div className="umenu-text">Bani castigati astazi</div>
                    <div className="umenu-value">$ {this.moneyPrettify(this.state.moneyToday)}</div>
                </div>
                <div className="umenu-item">
                    <div className="umenu-text">Total cheltuit</div>
                    <div className="umenu-value">$ {this.moneyPrettify(this.state.moneySpent)}</div>
                </div>

            </div>
            <div className="umenu-works">
                <div className="umenu-title">Job</div>
                <div className="umenu-vectors">
                    <div className="umenu-vector" onClick={() => this.setPage(false)}>
                        <img src={svg['left-vector']} alt="" />
                    </div>
                    <div className="umenu-vector" onClick={() => this.setPage(true)}>
                        <img src={svg['left-vector']} className="umenu-works-vector-right" alt="" />
                    </div>
                </div>
                {this.state.jobs.length > 0 && (
                    <div className="umenu-item umenu-slider">
                        <img src={png['works']} alt="" />
                        <div className="umenu-best">Activ</div>
                        <div className="umenu-title">{this.state.jobs[this.state.page]?.title || 'No Job'}</div>
                        <div className="umenu-boxes">
                            <div className="umenu-box">
                                <div className="umenu-text">Nivelul tau</div>
                                <div className="umenu-value">{(this.state.jobs[this.state.page]?.lvl || 0) + 1}<span>/ {this.state.jobs[this.state.page]?.maxLvl || 1}</span></div>
                            </div>
                            <div className="umenu-box">
                                <div className="umenu-text">Experienta</div>
                                <div className="umenu-value"> {this.state.jobs[this.state.page]?.exp || 0}<span>/ {this.state.jobs[this.state.page]?.maxExp || 1000}</span>EXP</div>
                            </div>
                        </div>
                        <div className="umenu-slider-progress">
                            <div className="#187e0b" style={{
                                width: `${this.state.jobs[this.state.page] ? (this.state.jobs[this.state.page].exp / this.state.jobs[this.state.page].maxExp) * 100 : 0}%`
                            }}></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    }
}