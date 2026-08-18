import React from 'react';
import { CEF } from '../../../../modules/CEF';
import { ICitizen, ICriminal, ICriminalResponse } from '../../../../../shared/mdt';

interface CitizenResultsProps {
  citizen: ICitizen;
  onBack: () => void;
  onNewRecord: () => void;
  mockCriminals: ICriminalResponse[];
  onViewHistory: (citizen: ICitizen) => void;
}

const CitizenResults: React.FC<CitizenResultsProps> = ({
  citizen,
  onBack,
  onNewRecord,
  mockCriminals,
  onViewHistory
}) => {
 

  return (
    <div className="mandate-content criminal-record">
      <div className="top">
        <h2>Rezultat cautare</h2>
        <div
          className="officers-title" style={{width: "100%"}}
        >
          <h1>Nume</h1>
          <h3>Actiuni</h3>
        </div>
        <div className="officers criminal-record">
          <div className="officers-title"  style={{width: "100%"}}>
            <h4>
              {citizen.name}{" "}
              <span>
                CNP: <span>{citizen.userId}</span>
              </span>
            </h4>
            <h6>  
              <span 
                className="new"
                onClick={onNewRecord}
              >
                Cazier nou
              </span>
              <span
                onClick={() => onViewHistory(citizen)}
                className="history"
              >
                Istorie
              </span>
            </h6>
          </div>
        </div>
        <button
          type="button"
          className="all-incidents"
          onClick={onBack}
        >
          Inapoi
        </button>
      </div>
    </div>
  );
};

export default CitizenResults; 