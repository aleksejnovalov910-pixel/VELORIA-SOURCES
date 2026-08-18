import React from 'react';
import { ICriminalResponse } from '../../../../../shared/mdt';

interface CriminalListProps {
  criminals: ICriminalResponse[];
  onBack: () => void;
  onNewRecord: () => void;
  onViewHistory: (criminal: ICriminalResponse) => void;
}

const CriminalList: React.FC<CriminalListProps> = ({
  criminals,
  onBack,
  onNewRecord,
  onViewHistory
}) => {
  return (
    <div className="mandate-content criminal-record">
      <div className="top">
        <h2>Caziere</h2>
        <div
          className="officers-title"
          style={{width: "100%"}}
        >
          <h1>Nume</h1>
          <h3>Actiuni</h3>
        </div>
        <div className="officers criminal-record" 
          style={{width: "100%"}}
        >
          {criminals.map((item) => (
            <React.Fragment key={item.userId}>
              <div className="officers-title">
                <h4>
                  {item.name}{" "}
                  <span>
                      CNP: <span>{item.userId}</span>
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
                    onClick={() => onViewHistory(item)}
                    className="history"
                  >
                    Istoria
                  </span>
                </h6>
              </div>
            </React.Fragment>
          ))}
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

export default CriminalList; 