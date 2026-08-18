import React from 'react';
import { ICarResponse } from '../../../../../../shared/mdt';

interface CarResultProps {
  car: ICarResponse;
  onBack: () => void;
}

const CarResult: React.FC<CarResultProps> = ({ car, onBack }) => {
  return (
    <div className="mandate-content">
      <h2>Cauta vehicul</h2>
      <div className="officers">
        <div className="officers-title">
          <h1>Nume</h1>
          <h3 style={{ marginRight: "10px" }}>Nr. inmatriculare</h3>
          <h3 style={{ marginRight: "10px" }}>Proprietar</h3>
        </div>
        <div className="officers-title">
          <h4>{car.name}</h4>
          <h6 style={{ marginRight: "10px" }}>
            {car.plate}
          </h6>
          <h6 style={{ marginRight: "10px" }}>
            {car.owner.name}
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

export default CarResult; 