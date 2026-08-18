import React, { Component, createRef } from "react";
import { CustomEvent } from "../../../modules/custom.event";
import art from "./../../DrivingSchool/imgs/autoschool-art.png";
import "./assets/style.less";

import "./farmer/style/style.scss"
import './marihuana/style/style.scss'

import work from "./assets/work.svg";
import cancel from "./assets/cancel.svg";
import { getJobData, getLevelByExp, JOB_MAX_EXP, JobId, jobsList } from "../../../../shared/jobs";
import { system } from "../../../modules/system";
import { CEF } from "../../../modules/CEF";
import { CustomEventHandler } from "../../../../shared/custom.event";

import ico from "./farmer/img/ico.svg"
import bus from "./farmer/img/bus.png"
import exitIcon from "./farmer/img/exit.svg"

import mico from "./marihuana/img/ico.svg"
import mbus from "./marihuana/img/bus.png"
import CleaningJob from './WindowCleaning';
import { ConstructionJob } from './Construction';


export class WorkSelect extends Component<{}, {
    /** Работа */
    job?: JobId,
    /** Работа */
    myjob?: JobId,
    /** Выбранное задание */
    task?: number,
    /** Опыт работы */
    exp: number,
    /** Переодеты ли мы в форму */
    // clothe: boolean,
    // /** Есть ли возможность переодеться */
    // clotheneed: boolean,
    block?: boolean,
}> {
    private ev: CustomEventHandler;
    containerRef = createRef<HTMLDivElement>();

    constructor(props: any) {
        super(props);
        this.state = {
            exp: 0,
            // clothe: false,
            // clotheneed: true,
            job: CEF.test ? system.randomArrayElement(jobsList).id : null
            // job: "garden"

        }
        this.ev = CustomEvent.register("job:data", (job: JobId, myjob: JobId, task: number, exp: number) => {
            this.setState({ job, myjob, task, exp });
        })
    }

    componentWillUnmount() {
        if (this.ev) this.ev.destroy();
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

    selectWork = (id: number) => {
        if (this.state.block) return;
        setTimeout(() => {
            this.setState({ block: false })
        }, 1000)
        if (id === this.task) {
            this.setState({ task: null, block: true });
            CustomEvent.triggerServer("job:task:stop");

        } else {
            // this.setState( {task: id, block: true});
            CustomEvent.triggerServer("job:task", this.job, id)
        }
        CEF.gui.setGui(null);
        CEF.playSound("cliekc"); // sunet la selectarea unui articol
    }

    selectWorkCustom = (id: number) => {
        if (this.state.block) return;
        setTimeout(() => {
            this.setState({ block: false })
        }, 1000)
        if (id === this.task) {
            this.setState({ task: null, block: true });
            CustomEvent.triggerServer("job:task:stop");
            this.setState({ myjob: null, block: true });
            CustomEvent.triggerServer("job:leave");
        } else {
            // this.setState( {task: id, block: true});
            this.setState({ myjob: this.job, block: true });
            CustomEvent.triggerServer("job:join", this.job);
            CustomEvent.triggerServer("job:task", this.job, id)

        }
        CEF.gui.setGui(null);
        CEF.playSound("cliekc"); // sunet la selectarea unui articol
    }


    close() {
        CEF.gui.setGui(null);
        CEF.playSound("cliekc"); // sunet la selectarea unui articol

    }

    joinJob() {
        if (this.state.block) return;
        setTimeout(() => {
            this.setState({ block: false })
        }, 1000)
        this.setState({ myjob: this.job, block: true });
        CustomEvent.triggerServer("job:join", this.job);
        CEF.playSound("cliekc"); // sunet la selectarea unui articol
    }
    leaveJob() {
        if (this.state.block) return;
        setTimeout(() => {
            this.setState({ block: false })
        }, 1000)
        this.setState({ myjob: null, block: true });
        CustomEvent.triggerServer("job:leave");
        CEF.gui.setGui(null);
        CEF.playSound("cliekc"); // sunet la selectarea unui articol
    }

    // selectClothes = () => {
    //     if(this.state.block) return;
    //     setTimeout(() => {
    //         this.setState({block: false})
    //     }, 1000)
    //     CustomEvent.triggerServer('job:dress', this.job, !this.state.clothe)
    //     this.setState( {...this.state, clothe:!this.state.clothe, block: true});
    // }

    get task() {
        return this.state.task;
    }

    get jobConfig() {
        if (!this.state.job) return null
        //        console.log( getJobData(this.state.job) );
        return getJobData(this.state.job);
    }
    get job() {
        return this.state.job
    }
    get level() {
        return getLevelByExp(this.state.exp);
    }

    fastSelectWork = (id: number) => {
        if (this.state.block) return;

        setTimeout(() => {
            this.setState({ block: false })
        }, 1000);

        if (this.state.myjob !== this.job) {
            this.setState({ myjob: this.job, block: true });
            CustomEvent.triggerServer('job:join', this.job);
            CEF.playSound("cliekc"); // sunet la selectarea unui articol

        }

        setTimeout(() => {
            if (id === this.task) {
                this.setState({ task: null, block: true });
                CustomEvent.triggerServer('job:task:stop');
            } else {
                // this.setState( {task: id, block: true});
                CustomEvent.triggerServer('job:task', this.job, id)
            }
            CEF.gui.setGui(null);
        }, 300);


    }
    render() {
        if (!this.jobConfig) return <></>;

        if (this.job === "builder")
            return (
                <ConstructionJob
                    jobConfig={this.jobConfig}
                    level={this.level}
                    exp={this.state.exp}
                    job={this.job}
                    myjob={this.state.myjob}
                    task={this.task}
                    selectWork={this.fastSelectWork}
                    leaveJob={this.leaveJob}
                />
            );

        if (this.job === "cleaning")
            return (
                <CleaningJob
                    jobConfig={this.jobConfig}
                    level={this.level}
                    exp={this.state.exp}
                    job={this.job}
                    myjob={this.state.myjob}
                    task={this.task}
                    selectWork={this.fastSelectWork}
                    leaveJob={this.leaveJob}
                />
            );

        return (
            <>
                {/* JOBURI NORMALE */}
                {this.job !== "garden" && this.job !== "marihuana" && (
                    <div className="workmenu">
                        <div className="workmenu_grid" />
                        <div className="workmenu_main">
                            <div style={{ position: "relative", height: "85vh", width: "43.5vh" }}>
                                <img style={{ position: "absolute", bottom: "-7.5vh", marginLeft: "5vh" }} src={art} />
                            </div>
                            <div className="workmenu_types">
                                <h1>{this.jobConfig.name}</h1>
                                <div className="workmenu_header">
                                    <div>
                                        <p style={{ width: "20vh", marginBottom: "1vh" }}>{this.jobConfig.full_desc}</p>
                                        <p style={{ width: "20vh", marginBottom: "1vh", opacity: 0.8 }}>
                                            {this.level} LVL. ({this.state.exp.toFixed(0)} / {JOB_MAX_EXP}) XP
                                        </p>
                                    </div>
                                    {this.state.myjob !== this.job ? (
                                        <div className="workmenu_skin workmenu_ind">
                                            <div
                                                className="workmenu_key"
                                                style={{ backgroundColor: "#EB5757" }}
                                                onClick={() => this.joinJob()}
                                            >
                                                <img src={work} />
                                                <h4>Cauta un job</h4>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="workmenu_skin">
                                            <div
                                                className="workmenu_key"
                                                style={{ backgroundColor: "#EB5757" }}
                                                onClick={() => this.leaveJob()}
                                            >
                                                <img src={work} />
                                                <h4>Demisioneaza</h4>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {this.state.myjob === this.job && (
                                    <div className="workmenu_types_items">
                                        {this.jobConfig.tasks.map((item, index) => (
                                            <div key={`task_${index}`} className="workmenu_types_item">
                                                <h2 style={{ marginBottom: "1vh" }}>{item.name}</h2>
                                                <p style={{ marginBottom: "1vh" }}>{item.desc}</p>
                                                <div className="workmenu_price">Plata ${system.numberFormat(item.money)}</div>
                                                {/* <div className="workmenu_price">Experienta ta {item.exp || 1}</div> */}
                                                {item.level && item.level > this.level ? (
                                                    <div className="workmenu_price">LVL necesar: {item.level}</div>
                                                ) : (
                                                    <div className="workmenu_key" onClick={() => this.selectWork(index)}>
                                                        <img src={this.state.task === index ? cancel : work} />
                                                        <h4>{this.state.task === index ? "Resign" : "Calm down"}</h4>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* JOB GRADINAR */}
                {this.job === "garden" && (
                    <div className="farmerjob-container-box">
                        <div className="farmerjob-box" ref={this.containerRef}>
                            <div className="farmerjob-exit">
                                <p>Exit</p>
                                <div className="exit-img" onClick={this.close}>
                                    <img src={exitIcon} alt="Exit" />
                                </div>
                            </div>

                            <div className="farmerjob-gas-station-box">
                                <div className="farmerjob-top">
                                    <div className="farmerjob-title">
                                        <div className="farmerjob-title-img">
                                            <img src={ico} alt="" />
                                            <h1>
                                                <span>Job</span> Gradinar
                                            </h1>
                                        </div>
                                        <p>{this.jobConfig.full_desc}</p>
                                        <div className="farmerjob-your-experience">
                                            <h3>Experienta ta</h3>
                                            <h4>{this.level} LVL. ({this.state.exp.toFixed(0)} / {JOB_MAX_EXP}) XP</h4>
                                        </div>
                                    </div>
                                    <img className="farmerjob-bus" src={bus} alt="" />
                                </div>

                                <div className="farmerjob-content">
                                    {this.jobConfig.tasks.map((item, index) => (
                                        <div className="farmerjob-level" key={`task_${index}`}>
                                            <div className="farmerjob-level-title">
                                                <h1>{item.name}</h1>
                                                <p>{item.desc}</p>
                                            </div>
                                            <div className="farmerjob-controls">
                                                <div className="farmerjob-buttons-top">
                                                    Plata $ {system.numberFormat(item.money)}
                                                </div>
                                                {/* <div className="farmerjob-buttons-top">
                                                    Experienta adaugata {item.exp || 1}
                                                </div> */}
                                                {/* {item.level >= 1 && (
                                                    <div className="farmerjob-buttons-top">LVL necesar {item.level}</div>
                                                )} */}

                                                {this.state.myjob !== this.job ? (
                                                    <>
                                                        {this.level >= (item.level || 0) ? (
                                                            <button
                                                                className="farmerjob-button"
                                                                onClick={() => this.selectWorkCustom(index)}
                                                            >
                                                                Angajeaza-te
                                                            </button>
                                                        ) : (
                                                            <div className="farmerjob-buttons-top">
                                                                LVL necesar {item.level || 1}
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        {this.level >= (item.level || 0) && (
                                                            <button
                                                                className="farmerjob-button"
                                                                onClick={() => this.leaveJob()}
                                                            >
                                                                Demisioneaza
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* JOB MARIHUANA */}
                {this.job === "marihuana" && (
                    <div className="marihuanajob-tonys-garage-container-box">
                        <div className="marihuanajob-box" ref={this.containerRef}>
                            <div className="marihuanajob-exit">
                                <p>Exit</p>
                                <div className="exit-img" onClick={this.close}>
                                    <img src={exitIcon} alt="Exit" />
                                </div>
                            </div>

                            <div className="marihuanajob-gas-station-box">
                                <div className="marihuanajob-top">
                                    <div className="marihuanajob-title">
                                        <div className="marihuanajob-title-img">
                                            <img src={mico} alt="" />
                                            <h1>
                                                <span>Garajul lui</span> Tony
                                            </h1>
                                        </div>
                                        <p>{this.jobConfig.full_desc}</p>
                                        <div className="marihuanajob-your-experience">
                                            <h3>Experienta ta</h3>
                                            <h4>
                                                {this.level} LVL. ({this.state.exp.toFixed(0)} / {JOB_MAX_EXP}) XP
                                            </h4>
                                        </div>
                                    </div>
                                    <img className="marihuanajob-bus" src={mbus} alt="" />
                                </div>

                                <div className="marihuanajob-content">
                                    {this.jobConfig.tasks.map((item, index) => (
                                        <div className="marihuanajob-level" key={`task_${index}`}>
                                            <div className="marihuanajob-level-title">
                                                <h1>{item.name}</h1>
                                                <p>{item.desc}</p>
                                            </div>

                                            <div className="marihuanajob-controls">
                                                <div className="marihuanajob-buttons-top">
                                                    Plata $ {system.numberFormat(item.money)}
                                                </div>
                                                {/* <div className="marihuanajob-buttons-top">
                                                    Experienta adaugata {item.exp || 1}
                                                </div> */}
                                                {/* {item.level >= 1 && (
                                                    <div className="marihuanajob-buttons-top">
                                                        LVL necesar {item.level}
                                                    </div>
                                                )} */}

                                                {this.state.myjob !== this.job ? (
                                                    <>
                                                        {this.level >= (item.level || 0) ? (
                                                            <button
                                                                className="marihuanajob-button"
                                                                onClick={() => this.selectWorkCustom(index)}
                                                            >
                                                                Angajeaza-te
                                                            </button>
                                                        ) : (
                                                            <div className="marihuanajob-buttons-top">
                                                                LVL necesar {item.level || 0}
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <button
                                                        className="marihuanajob-button"
                                                        onClick={() => this.leaveJob()}
                                                    >
                                                        Demisioneaza
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }
}