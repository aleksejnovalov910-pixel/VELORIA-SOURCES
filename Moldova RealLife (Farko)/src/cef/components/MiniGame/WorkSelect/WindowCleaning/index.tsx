import React, { useEffect, useRef } from "react";
import "./style.scss"
import { JobId, jobData } from "shared/jobs";
import { Cleaner } from "./cleaning";


export type JobDataProps = {
  jobConfig: jobData;
  level?: number;
  exp?: number;
  job?: JobId;
  myjob?: JobId;
  task?: number;
  selectWork?: (id: number) => void;
  leaveJob?: () => void;
}
const CleaningJob = ({ jobConfig, level, exp, job, myjob, task, selectWork, leaveJob }: JobDataProps) => {
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
    <div className="cleaner-container-box">
      <div className="box" ref={containerRef}>
        <Cleaner
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


export default CleaningJob;