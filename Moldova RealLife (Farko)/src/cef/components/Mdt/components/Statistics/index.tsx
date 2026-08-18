import React, { useEffect, useState } from 'react';
import { LatestData, IncidentResponse, ICriminalResponse, IMandateResponse } from '../../../../../shared/mdt';
import { CEF } from '../../../../modules/CEF';
interface StatisticsProps {
  latest: LatestData;
  setPersonRecord: (record: ICriminalResponse | IncidentResponse | IMandateResponse) => void;
}

const NAMES = {
  criminal: "LATEST CRIMINAL RECORDS",
  mandates: "LATEST MANDATES",
  incidents: "LATEST INCIDENTS"
}
const Statistics: React.FC<StatisticsProps> = ({
  latest,
  setPersonRecord,
}) => {
  const [latestData, setLatestData] = useState<LatestData>(latest);
  const [openedLatest, setOpenedLatest] = useState<string | null>(null);
  useEffect(() => {
    setLatestData(latest);
  }, [latest]);

  useEffect(() => {
    if (!openedLatest) {
      setPersonRecord(null);
    }
  }, [openedLatest, setPersonRecord]);


  const handleRecordClick = (key: string, item: ICriminalResponse | IncidentResponse | IMandateResponse) => {
    if (key === openedLatest) {
      setPersonRecord(item);
    }
  };


  return (
    <div className="mdt-section-content">

      {Object.entries(latestData).map(([key, sections]) => (
        <div
          key={key}
          className={`latest ${key === openedLatest ? "opened" : ""}`}
        >
          <h2
            onClick={() =>
              setOpenedLatest(
                openedLatest === key ? null : key
              )
            }
          >
            {NAMES[key as keyof typeof NAMES] ?? ""}{" "}
            {key === openedLatest ? (
              <span>▲</span>
            ) : (
              <span>▼</span>
            )}
          </h2>
          <ul>
            {sections.length > 0 ? (
              sections.map((item: ICriminalResponse | IncidentResponse | IMandateResponse, index: number) => {
                let minutesAgo;
                try {
                  minutesAgo = Math.floor((Date.now() - new Date(item.date).getTime()) / 60000);
                  if (isNaN(minutesAgo) || minutesAgo < 0) {
                    minutesAgo = 0;
                  }
                } catch (e) {
                  minutesAgo = 0;
                }

                return (
                  <li
                    key={index}
                    className="latest-record"
                    onClick={() => handleRecordClick(key, item)}
                  >
                    <img src={CEF.getPassportImageURL(`${item.userId}_passport`)} alt="" />

                    <h1>
                      <span className="name">
                        {item.name}
                        {/* @ts-ignore */}
                        <h5>● {item?.orderTitle || item.description || ""}</h5>
                      </span>{" "}
                      <span className="date">
                        {minutesAgo} min ago
                      </span>
                    </h1>
                  </li>
                );
              })
            ) : (
              <li className="latest-record no-data">
                <h1>No data available</h1>
              </li>
            )}
          </ul>
        </div>
      ))}

    </div>
  );
};

export default Statistics; 