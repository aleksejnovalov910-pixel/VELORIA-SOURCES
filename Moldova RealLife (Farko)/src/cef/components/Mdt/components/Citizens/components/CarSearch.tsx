import React, { useState } from 'react';
import { CustomEvent } from '../../../../../modules/custom.event';
import { mockCars } from '../mockData';
import { ICarResponse } from '../../../../../../shared/mdt';
import { CEF } from '../../../../../modules/CEF';

interface CarSearchProps {
  setCar: (car: ICarResponse | null) => void;
}

const CarSearch: React.FC<CarSearchProps> = ({ setCar }) => {
  const [carSearchQuery, setCarSearchQuery] = useState('');
  const [isLoadingCar, setIsLoadingCar] = useState(false);

  const handleCarSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCarSearchQuery(e.target.value);
  };

  const handleCarSearch = () => {
    if (carSearchQuery.trim()) {
      setIsLoadingCar(true);
      
    
      if (CEF.test) {
        setTimeout(() => {
          const searchTerm = carSearchQuery.toLowerCase();
          const result = mockCars.find(
            car => 
              car.name.toLowerCase().includes(searchTerm) || 
              car.plate.toLowerCase().includes(searchTerm) ||
              car.owner.name.toLowerCase().includes(searchTerm)
          );
          
          setCar(result || null);
          setIsLoadingCar(false);
        }, 500);
        return;
      }
      

      CustomEvent.callServer('Mdt-GetCar', carSearchQuery)
        .then((response) => {
          if (response) {
            setCar(response);
          } else {
            setCar(null);
          }
        })
        .catch((error) => {
          console.error('Error searching car:', error);
          setCar(null);
        })
        .finally(() => {
          setIsLoadingCar(false);
        });
    }
  };



  return (
    <div className="mandate-content">
      <h2>Cauta vehicul</h2>
      <input
        type="text"
        placeholder="Nr. inmatriculare"
        value={carSearchQuery}
        onChange={handleCarSearchChange} 
      />
      <button
        onClick={handleCarSearch}
        type="button"
        disabled={isLoadingCar}
      >
        {isLoadingCar ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
};

export default CarSearch; 