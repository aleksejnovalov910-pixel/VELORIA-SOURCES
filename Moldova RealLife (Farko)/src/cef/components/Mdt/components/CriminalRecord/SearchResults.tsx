import React from 'react';
import { ICriminalResponse } from '../../../../../shared/mdt';


interface SearchResultsProps {
  criminal: ICriminalResponse[];
  onBack: () => void;
  setPersonRecord: (personRecord: ICriminalResponse | null) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  criminal,
  onBack,
  setPersonRecord,
}) => {
  return (
    <>
      <div className="officers ">
        <div className="officers-title">
          <h1>Full Name</h1>
          <h3>Action</h3>
          <h3 style={{ marginRight: "10px" }}>
            Date
          </h3>
        </div>
        {criminal.map((element) => (
          <div
            key={`criminal-${element.userId}-${element?.date}`}
            className="officers-title clickable"
            onClick={() => setPersonRecord(element)}
          >
            <h4>
              {element.name}{" "}
              <span>
                CNP: <span>{element.userId}</span>
              </span>
            </h4>

            <h6>
              {element.description}
            </h6>

            <h6 style={{ marginRight: "10px" }}>
              {new Date(element.date).toLocaleDateString()}
            </h6>
          </div>
        ))}
      </div >
      <button
        onClick={onBack}
        type="button"
        className="all-incidents"
      >
        Back
      </button>
    </>
  );
};

export default SearchResults; 