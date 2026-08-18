
import React, { useState, useEffect, useRef } from "react";
import "./style.scss"
import constructionrImg from '../assets/img/construction.png'
import exit from '../assets/img/exit.svg'
import icoImg from '../assets/img/constructIco.svg'
import { CEF } from '../../../../modules/CEF';
import { JobDataProps } from "../WindowCleaning";
import { wrapFirstWord } from "../WindowCleaning/cleaning";
import { JOB_MAX_EXP } from "../../../../../shared/jobs"


export const Construction = ({ jobConfig, level, task, exp, selectWork }: JobDataProps) => {
  


    const close = () => {
        CEF.gui.setGui(null);
        CEF.playSound("cliekc"); // sunet la selectarea unui articol
        
    }

    const findMaxLvl = () => {
        let maxLvl = 0;
        jobConfig.tasks.forEach((item) => {
            if (item.level && item.level > maxLvl) {
                maxLvl = item.level;

            }
        });
        return maxLvl;
    }

    const maxLvl = findMaxLvl() || 1;

    return (
        <>
            <div className="construction-exit">
                <p>Exit</p>
                <div className="exit-img" onClick={close}>
                    <img src={exit} alt="Exit" />
                </div>
            </div>
            <div className="construction-box">
                <div className="top">
                    <div className="title">
                        <div className="title-img">

                            <img src={icoImg} alt="" />
                            <h1>
                                {wrapFirstWord(jobConfig.name)}
                            </h1>
                        </div>
                        <p>
                            {jobConfig.full_desc}
                        </p>
                        <div className="your-experience">
                            <h3>{level || 0} LVL</h3>
                            <h4>({exp?.toFixed(0) || 0}/{JOB_MAX_EXP}) XP</h4>
                        </div>
                    </div>
                    <img className="construction-img" src={constructionrImg} alt="" />
                </div>
                <div className="content">
                    {jobConfig.tasks.map((item, index) => (
                        <div className="level" key={`task_${index}`}>
                            <div className="level-title">
                                <h1>{item.name}</h1>
                                <p>{item.desc}</p>
                            </div>
                            <div className="controls">
                                <div className="buttons-top">Plata $ {item.money}</div>
                                <div className="buttons-top">Experienta {item.exp || 1}</div>
                                <div className="buttons-top">
                                    LVL necesar: {item.level || 0}
                                </div>

                                {item.level && item.level > level ?
                                    null :

                                    <button onClick={() => selectWork(index)} className="button">{task === index ? "Demisioneaza" : "Angajaza-te"}</button>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
