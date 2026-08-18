import React, { useState } from 'react';
import { CustomEvent } from '../../../../../modules/custom.event';
import { validateSearch } from '../../Mandates';
import {  mockCitizens } from '../mockData';
import { ICitizenDetails } from '../../../../../../shared/mdt';
import { CEF } from '../../../../../modules/CEF';

interface CitizenSearchProps {
  setCitizen: (citizen: ICitizenDetails | null) => void;
}

const CitizenSearch: React.FC<CitizenSearchProps> = ({ setCitizen }) => {
  const [citizenSearchQuery, setCitizenSearchQuery] = useState('');
  const [isLoadingCitizen, setIsLoadingCitizen] = useState(false);


  const handleCitizenSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCitizenSearchQuery(e.target.value);
  };

  const handleCitizenSearch = () => {
    console.log('try');
    const query = validateSearch(citizenSearchQuery);
    if (!query) return;
    
    if (citizenSearchQuery.trim()) {
      setIsLoadingCitizen(true);
      
      if (CEF.test) {
        setTimeout(() => {
          const searchTerm = citizenSearchQuery.toLowerCase().trim();
          const result = mockCitizens.find(
            citizen => 
              citizen.name.toLowerCase().includes(searchTerm) || 
              citizen.userId.toString() === searchTerm
          );
          
          if (result) {
            setCitizen(result);
          } else {
            setCitizen(null);
          }
          
          setIsLoadingCitizen(false);
        }, 500); 
        return;
      }
      
      console.log('send', query);
      CustomEvent.callServer('Mdt-GetCitizen', JSON.stringify(query))
        .then((response) => {
          console.log(response);
          if (response) {
            setCitizen(response);
          } else {
            setCitizen(null);
          }
        })
        .catch((error) => {
          console.error('Error searching citizen:', error);
          setCitizen(null);
        })
        .finally(() => {
          setIsLoadingCitizen(false);
        });
    }
  };

 

  return (
    <div className="mandate-content">
      <h2>Cauta cetatian</h2>
      <input
        type="text"
        placeholder="Introduce CNP"
        value={citizenSearchQuery}
        onChange={handleCitizenSearchChange}
     
      />
      <button
        onClick={handleCitizenSearch}
        type="button"
        disabled={isLoadingCitizen}
      >
        {isLoadingCitizen ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
};

export default CitizenSearch; 