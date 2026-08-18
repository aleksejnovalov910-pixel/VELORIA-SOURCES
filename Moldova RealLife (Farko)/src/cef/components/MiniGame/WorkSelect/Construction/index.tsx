import React, { useEffect, useRef } from "react";
import "./style.scss"
import { Construction } from "./component";
import { JobDataProps } from "../WindowCleaning";


export const ConstructionJob = ({ jobConfig, level, exp, job, myjob, task, selectWork, leaveJob }: JobDataProps) => {
  const containerRef = useRef(null);

  useEffect(() => {
    function adjustZoom() {
      const container = containerRef.current;
      if (container) {
        const zoomCountOne = window.innerWidth / 1920;
        const zoomCountTwo = window.innerHeight / 1080;

        if (zoomCountOne < zoomCountTwo) {
          container.style.zoom = zoomCountOne;
        } else {
          container.style.zoom = zoomCountTwo;
        }
      }
    }

    adjustZoom();
    window.addEventListener("resize", adjustZoom);

    return () => {
      window.removeEventListener("resize", adjustZoom);
    };
  }, []);

  return (
    <div className="construction-container-box">
      <div className="box" ref={containerRef}>
        <Construction
          jobConfig={jobConfig}
          level={level}
          exp={exp}
          job={job}
          myjob={myjob}
          task={task}
          selectWork={selectWork}
          leaveJob={leaveJob}
        />
      </div>
    </div>
  );
};


