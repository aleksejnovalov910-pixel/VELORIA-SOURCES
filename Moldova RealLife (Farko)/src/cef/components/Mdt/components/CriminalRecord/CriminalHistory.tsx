import React, { useEffect, useState } from 'react';
import { ICitizen, ICriminalResponse } from '../../../../../shared/mdt';
import { CustomEvent } from '../../../../modules/custom.event';
interface CriminalHistoryProps {
  citizen: ICitizen;
  onBack: () => void;
  setPersonRecord: (personRecord: ICriminalResponse | null) => void;
}

const CriminalHistory: React.FC<CriminalHistoryProps> = ({
  citizen,
  onBack,
  setPersonRecord
}) => {

  const [criminalHistory, setCriminalHistory] = useState<ICriminalResponse[]>([]);

  useEffect(() => {

    if (!citizen || !citizen.userId) return;

    CustomEvent.callServer('Mdt-GetAllCriminals', citizen.userId).then((elements) => {
      if (elements) {
        setCriminalHistory(elements);
      }
    });

  }, [citizen]);

  return (
    <div className="mandate-content">
      <h2>Istorie caziere</h2>
      <button type="button" className="back-button" onClick={onBack}>
        Inapoi la cautare
      </button>
      <div className="officers-title crimes" style={{ width: '100%' }}>
        <h1>Nume</h1>
        <h1>Crima</h1>
        <h3>Publicat</h3>
        <h3>data</h3>
      </div>
      <div className="officers crimes" style={{ width: '100%' }}>
        {criminalHistory && criminalHistory.length > 0 ? (
          criminalHistory.map((criminal, index) => (
            <React.Fragment key={index}>
              <div className="officers-title" style={{ width: '100%' }}
                onClick={() => setPersonRecord(criminal)}
              >
                <h4>{criminal.name}</h4>
                <h4>{criminal.description}</h4>
                <h6>{new Date(criminal.date).toLocaleDateString()}</h6>
              </div>
            </React.Fragment>
          ))
        ) : (
          <div className="officers-title">
            <h4>Nu a fost gasit nici un cazier</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default CriminalHistory; 