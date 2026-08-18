import React, { useState, useEffect, useRef } from 'react';
import location from '../../assets/img/location.png';
import { CustomEvent } from '../../../../modules/custom.event';
import { CEF } from '../../../../modules/CEF';
import { validateSearch } from '../Mandates';
import IncidentForm from './form';
import { Incident, IncidentResponse } from '../../../../../shared/mdt';
import { startDrawing, draw, clearCanvas } from '../../components/utils/CanvasUtil';
import { mockCitizens, mockIncidentData } from './mock';



interface IncidentsProps {
    setPersonRecord: (person: IncidentResponse | null) => void;
}



const Incidents: React.FC<IncidentsProps> = ({
  setPersonRecord
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [citizen, setCitizen] = useState<IncidentResponse[] | null>(null);
  const [allIncidents, setAllIncidents] = useState<IncidentResponse[] | null>(null);

  const canvasRefIncidents = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRefIncidents.current) {
      const canvas = canvasRefIncidents.current;
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 2;
          ctx.lineJoin = 'round';
          ctx.lineCap = 'round';
        }
      }
    }
  }, [canvasRefIncidents]);



  const handleClearCanvas = () => {
    clearCanvas(canvasRefIncidents);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!validateSearch(e.target.value)) return;
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsLoadingSearch(true);

      if (CEF.test) {
        setTimeout(() => {
          const foundCitizen = mockCitizens.find(
            c => c.userId.toString() === searchQuery.trim() ||
              c.name.toLowerCase() === searchQuery.trim().toLowerCase()
          );

          if (foundCitizen) {
            setCitizen([foundCitizen]);
          } else {
            CEF.alert.setAlert('error', 'Citizen not found');
            setCitizen(null);
          }

          setIsLoadingSearch(false);
        }, 800);
      }

      CustomEvent.callServer('Mdt-GetIncident', searchQuery)
        .then((response) => {
          if (response) {
            setCitizen(response);
          } else {
            setCitizen(null);
          }
        })
        .catch((error) => {
          console.error('Error searching incidents:', error);
          setCitizen(null);
        })
        .finally(() => {
          setIsLoadingSearch(false);
        });
    }
  };


  const handleViewCitizen = (selectedCitizen: IncidentResponse) => {
    const citizenIncidents = mockIncidentData[selectedCitizen.userId];
    if (citizenIncidents) {
      setAllIncidents(citizenIncidents as unknown as IncidentResponse[]);
    }
  };

  const handleCitizenBack = () => {
    setCitizen(null);
    setSearchQuery('');
  };

  const handleGetAllIncidents = () => {
    if (CEF.test) {
      const randomCitizenId = Math.floor(Math.random() * 3) + 1;
      setAllIncidents(mockIncidentData[randomCitizenId] as unknown as IncidentResponse[]);
      setCitizen(null);
    }

    CustomEvent.callServer('Mdt-GetAllIncidents')
      .then((response) => {
        if (response) {
          setAllIncidents(response);
        }
      })
      .catch((error) => {
        console.error('Error getting all incidents:', error);
      });
  };

  const handleBackToForm = () => {
    setAllIncidents(null);
  };

  return (
    <div className="mdt-section-content section-mandate">
      <div className="mandate">
        <div className="mandate-content">
          <h2>Search for Incidents</h2>

          {citizen === null ? (
            <>
              <input
                type="text"
                placeholder="Enter name or ID"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={isLoadingSearch}
              >
                {isLoadingSearch ? 'Searching...' : 'Search'}
              </button>
              <button
                type="button"
                className="all-incidents"
                onClick={handleGetAllIncidents}
              >
                All Incidents
              </button>
            </>
          ) : (
            <>
              <div className="officers">
                <div className="officers-title">
                  <h1>Full Name</h1>
                  <h3>Description</h3>
                  <h3 style={{ marginRight: "10px" }}>
                    Date
                  </h3>
                </div>
                {citizen.map((element) => (
                  <div
                    className="officers-title clickable"
                    onClick={() => setPersonRecord(element)}
                  >
                    <h4>
                      {element.name}{" "}
                      <span>
                        CNP: <span>{element.userId}</span>
                      </span>
                    </h4>
                    <h6>{element.description}</h6>
                    <h6 style={{ marginRight: "10px" }}>
                      {element.orderTime}
                    </h6>
                  </div>
                ))}
              </div>
              <button
                onClick={handleCitizenBack}
                type="button"
                className="all-incidents"
              >
                Back
              </button>
            </>
          )}
        </div>
      </div>

      {allIncidents !== null ? (
        <div className="mandate">
          <div className="mandate-content all-incidents">
            <h2>All Incidents</h2>
            <div className="officers-title" style={{ width: "100%" }}>
              <h1>Full Name</h1>
              <h3>Incident</h3>
              <h3 style={{ marginRight: "10px" }}>Date</h3>
            </div>
            <div className="officers" style={{ width: "100%" }}>
              {allIncidents.map((item, index) => (
                <div
                  key={index}
                  className="officers-title" 
                  style={{ width: "100%" }}
                  onClick={() => setPersonRecord(item)}
                >
                  <h4>
                    {item.name}{" "}
                    <span>
                      CNP: <span>{item.userId}</span>
                    </span>
                  </h4>
                  <h6>{item.description}</h6>
                  <h6 style={{ marginRight: "10px" }}>
                    {item.orderTime}
                  </h6>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="all-incidents"
              onClick={handleBackToForm}
            >
              Back
            </button>
          </div>
        </div>
      ) : (
        <div className="mandate">
          <IncidentForm 
            canvasRef={canvasRefIncidents}
            clearCanvas={handleClearCanvas}
          />
        </div>
      )}
    </div>
  );
};

export default Incidents; 