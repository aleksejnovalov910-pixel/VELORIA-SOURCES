import React, { useState, useEffect } from 'react';

import { ICitizenDetails, ICarResponse } from '../../../../../shared/mdt';
import CarSearch from './components/CarSearch';
import CitizenSearch from './components/CitizenSearch';
import CitizenProfile from './components/CitizenProfile';
import CitizenResult from './components/CitizenResult';
import CarResult from './components/CarResult';
import { mockCitizens } from './mockData';

interface CitizensProps {
  setVehicleRecord: (vehicle: ICarResponse) => void;
}

const Citizens: React.FC<CitizensProps> = ({
}) => {
  const [citizen, setCitizen] = useState<ICitizenDetails | null>(null);
  const [selectedCitizen, setSelectedCitizen] = useState<ICitizenDetails | null>(null);
  const [car, setCar] = useState<ICarResponse | null>(null);
  const viewCitizen = (citizen: ICitizenDetails) => {
    setSelectedCitizen(citizen);
  };

  const handleCitizenBack = () => {
    setCitizen(null);
  };

  const handleCarBack = () => {
    setCar(null);
  };

  const handleCitizenViewBack = () => {
    setSelectedCitizen(null);
  };

  return (
    <div className="mdt-section-content">
      {selectedCitizen === null ? (
        <>
          <div className="mandate">
            {citizen === null ? (
              <CitizenSearch
                setCitizen={setCitizen}
              />
            ) : (
              <CitizenResult
                citizen={citizen}
                onViewCitizen={viewCitizen}
                onBack={handleCitizenBack}
              />
            )}
          </div>

          <div className="mandate">
            {car === null ? (
              <CarSearch setCar={setCar} />
            ) : (
              <CarResult car={car} onBack={handleCarBack} />
            )}
          </div>
        </>
      ) : (
        <CitizenProfile
          citizen={selectedCitizen}
          onBack={handleCitizenViewBack}
        />
      )}
    </div>
  );
};

export default Citizens; 