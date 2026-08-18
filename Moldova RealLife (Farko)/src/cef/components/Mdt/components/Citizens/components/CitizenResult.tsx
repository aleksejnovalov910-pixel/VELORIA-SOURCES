import React from 'react';
import { ICitizenDetails } from '../../../../../../shared/mdt';


interface CitizenResultProps {
  citizen: ICitizenDetails;
  onViewCitizen: (citizen: ICitizenDetails) => void;
  onBack: () => void;
}

const CitizenResult: React.FC<CitizenResultProps> = ({ citizen, onViewCitizen, onBack }) => {

  console.log(citizen);
  return (
    <div className="mandate-content">
      <h2>Rezultat cautare</h2>
      <div className="officers">
        <div className="officers-title">
          <h1>Nume</h1>
          <h3>Varsta</h3>
          <h3 style={{ marginRight: "10px" }}>
            Numar telefon
          </h3>
        </div>
        <div
          className="officers-title clickable"
          onClick={() => onViewCitizen(citizen)}
        >
          <h4>
            {citizen.name}{" "}
            <span>
              CNP: <span>{citizen.userId}</span>
            </span>
          </h4>
          <h6>{citizen.age}</h6>
          <h6 style={{ marginRight: "10px" }}>
            {citizen.phone}
          </h6>
        </div>
      </div>
      <button
        onClick={onBack}
        type="button"
        className="all-incidents"
      >
        Inapoi
      </button>
    </div>
  );
};

export default CitizenResult; 