import React from 'react';
import { ICarResponse } from '../../../../../shared/mdt';

interface SearchResultsProps {
  result: ICarResponse;
  onBack: () => void;
  setVehicleRecord: (vehicle: ICarResponse) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ result, onBack, setVehicleRecord }) => {
  if (!result) {
    return (
      <div>
        <button onClick={onBack}>Inapoi</button>
        <div>Nu sau gasit omologari</div>
      </div>
    );
  }

  return (
    <div className="search-results">
      <button onClick={onBack}>Inapoi</button>
      <h3>Rezultat cautare</h3>
      <div className="officers">
        <div className="officers-title">
          <h1>Numar inmatriculare</h1>
          <h3>Elemente</h3>
          <h3 style={{ marginRight: "10px" }}>Data</h3>
        </div>
        <div key={result.plate} className="officers-title" onClick={() => setVehicleRecord(result)}>
          <h4>{result.plate}</h4>
          <h6>
            {Object.entries(result.elements)
              .filter(([_, value]) => value)
              .map(([key]) => key)
              .join(', ')}
          </h6>
          <h6 style={{ marginRight: "10px" }}>
            {new Date(result.date).toLocaleDateString()}
          </h6>
        </div>
      </div>
    </div>
  );
};

export default SearchResults; 