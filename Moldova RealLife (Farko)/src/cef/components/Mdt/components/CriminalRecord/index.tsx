import React, { useState, useCallback } from 'react';
import { validateSearch } from '../Mandates';
import { CEF } from '../../../../modules/CEF';
import CriminalForm from './form';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import CitizenResults from './CitizenResults';
import CriminalList from './CriminalList';
import CriminalHistory from './CriminalHistory';
import { mockCriminals, mockCitizens } from './mockData';
import { ICitizen, ICriminalResponse, ICriminal } from '../../../../../shared/mdt';
import { CustomEvent } from '../../../../modules/custom.event';

interface CriminalRecordProps {
  setPersonRecord: (personRecord: ICriminalResponse | null) => void;
}

const CriminalRecord: React.FC<CriminalRecordProps> = ({
  setPersonRecord,
}) => {

  // Global search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResultCriminal, setSearchResultCriminal] = useState<ICriminalResponse[] | null>(null);

  // Citizen search
  const [citizenSearchQuery, setCitizenSearchQuery] = useState('');
  const [searchedCitizen, setSearchedCitizen] = useState<ICitizen | null>(null);

  // Add missing states
  const [selectedCriminal, setSelectedCriminal] = useState<number | null>(null);
  
  // Add the missing criminals state
  const [criminals, setCriminals] = useState<ICriminalResponse[] | null>(null);

  const [showCriminalForm, setShowCriminalForm] = useState<boolean>(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!validateSearch(e.target.value)) return;
    setSearchQuery(e.target.value);
  };

  const handleCitizenSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!validateSearch(e.target.value)) return;
    setCitizenSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (!validateSearch(searchQuery)) return;

    setIsLoadingSearch(true);

    if (CEF.test) {
      setTimeout(() => {
        // Convert mockCriminals to ICriminalResponse[]
        const mockCriminalsResponse = mockCriminals.map(criminal => ({
          ...criminal,
          date: new Date(),
        })) as ICriminalResponse[];
        
        const foundCriminal = mockCriminalsResponse.find(
          c => c.userId.toString() === searchQuery.trim() ||
            c.name.toLowerCase() === searchQuery.trim().toLowerCase()
        );

        if (foundCriminal) {
          setSearchResultCriminal([foundCriminal]);
        } else {
          CEF.alert.setAlert('error', 'Criminal not found');
          setSearchResultCriminal(null);
        }

        setIsLoadingSearch(false);
      }, 800);
    }

    CustomEvent.callServer('Mdt-CriminalRecordSearch', searchQuery)
      .then((data: ICriminalResponse[]) => {
        console.log(data);
        if (!data) return;
        setSearchResultCriminal(data);
      })
      .catch((error) => {
        CEF.alert.setAlert('error', 'Criminal not found');
      }).finally(() => {
        setIsLoadingSearch(false);
      });
  };

  const handleCitizenSearch = () => {
    console.log('try 2');
    if (!validateSearch(citizenSearchQuery)) return;
    console.log('try 3');
    setIsLoadingSearch(true);

    if (CEF.test) {
      setTimeout(() => {
        const foundCitizen = mockCitizens.find(
          citizen => citizen.userId.toString() === citizenSearchQuery.trim() ||
            citizen.name.toLowerCase() === citizenSearchQuery.trim().toLowerCase()
        );

        if (foundCitizen) {
          setSearchedCitizen(foundCitizen);          
            
        } else {
          CEF.alert.setAlert('error', 'Citizen not found');
          setSearchedCitizen(null);
        }

        setIsLoadingSearch(false);
      }, 800);
    }

    CustomEvent.callServer('Mdt-GetCitizen', JSON.stringify(citizenSearchQuery))
      .then((data: ICitizen) => {
        if (!data) return;
        setSearchedCitizen(data);
      })
      .catch((error) => {
        CEF.alert.setAlert('error', 'Criminal not found');
      })
      .finally(() => {
        setIsLoadingSearch(false);
      });
  };

  const handleCancel = () => {
    setShowCriminalForm(false);
    setSearchedCitizen(null);
    setCriminals(null);
  };

  const handleRecordSearchBack = () => {
    setSearchResultCriminal(null);
    setSearchQuery('');
  };

  const handleNewRecord = () => {
    setShowCriminalForm(true);
  };


  const handleBack = () => {
    setSelectedCriminal(null);
  };

  const handleViewHistory = (citizen: ICitizen) => {
    setSelectedCriminal(citizen.userId ?? null);
  };

  return (
    <div className="mdt-section-content">
      {showCriminalForm && searchedCitizen ? (
        <div className="mandate">
          <CriminalForm
            onCancel={handleCancel}
            selectedCitizen={searchedCitizen}
          />
        </div>
      ) : selectedCriminal ? (
        <div className="mandate">
          <CriminalHistory
            citizen={searchedCitizen}
            onBack={handleBack}
            setPersonRecord={setPersonRecord}
          />
        </div>
      ) : (
        <>
          <div className="mandate">
            <div className="mandate-content">
              <h2>Search for Record</h2>

              {searchResultCriminal === null ? (
                <SearchForm
                  searchQuery={searchQuery}
                  isLoading={isLoadingSearch}
                  onSearch={handleSearch}
                  onSearchChange={handleSearchChange}
                />
              ) : (
                <SearchResults
                  criminal={searchResultCriminal}
                  setPersonRecord={setPersonRecord}
                  onBack={handleRecordSearchBack}
                />
              )}
            </div>
          </div>
      
          <div className="mandate">
            {(!criminals && !searchedCitizen) && (
              <div className="mandate-content criminal-record">
                <div className="top">
                  <h2>create a criminal record</h2>
                  <span>Сitizen's name</span>
                  <input
                    type="text"
                    placeholder="Enter name or ID"
                    value={citizenSearchQuery}
                    onChange={handleCitizenSearchChange}
                  />
                  <button
                    type="button"
                    className="all-incidents searching"
                    onClick={handleCitizenSearch}
                    disabled={isLoadingSearch}
                  >
                    Search
                  </button>
                </div>
              </div>
            )}
            {searchedCitizen && !showCriminalForm && !criminals && (
              <CitizenResults
                citizen={searchedCitizen}
                onBack={handleCancel}
                onNewRecord={handleNewRecord}
                onViewHistory={handleViewHistory}
                mockCriminals={mockCriminals}
              />
            )}
            {criminals && !showCriminalForm && (
              <CriminalList
                criminals={criminals}
                onBack={handleCancel}
                onNewRecord={handleNewRecord}
                onViewHistory={handleViewHistory}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CriminalRecord; 