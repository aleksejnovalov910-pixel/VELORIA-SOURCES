import React from "react";
import "./style.scss"
import cleanerImg from '../assets/img/cleaner.png'
import exit from '../assets/img/exit.svg'
import icoImg from '../assets/img/ico.svg'
import { JobDataProps } from ".";
import { CEF } from '../../../../modules/CEF';

export function wrapFirstWord(text: string) {
    const words = text.trim().split(" ");
    if (words.length === 0) return text;
    return (
        <>
            <span>{words[0]}</span> {words.slice(1).join(" ")}
        </>
    );
}

export const Cleaner = ({ jobConfig, level, task, exp, selectWork }: JobDataProps) => {


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
            <div className="cleaner-exit">
                <p>Exit</p>
                <div className="exit-img" onClick={close}>
                    <img src={exit} alt="Exit" />
                </div>
            </div>
            <div className="cleaner-box">
                <div className="left">

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
                            {/* <div className="your-experience">
                                <h3>LVL</h3>
                                <h4>{'('+level}/{maxLvl + ')'}</h4>
                            </div> */}
                        </div>
                    </div>
                    <div className="content">
                        {jobConfig.tasks.map((item, index) => (
                            <div className="level" key={`task_${index}`}>
                                <div className="level-title">
                                    <h1>{item.name}</h1>
                                    <p>{item.desc}</p>
                                </div>

                                <div className="controls">
                                    <div className="buttons-top">Plata ${item.money}</div>
                                    {/* <div className="buttons-top">Experienta {item.exp || 1}</div> */}

                                    {item.level && item.level > level ?
                                        <>
                                            LVL necesar: {item.level}
                                        </> :

                                        <button onClick={() => selectWork(index)} className="button">{task === index ? "Demisioneaza" : "Angajaza-te"}</button>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="right">
                    <img className="cleaner-img" src={cleanerImg} alt="" />
                </div>
            </div>
        </>
    );
};
