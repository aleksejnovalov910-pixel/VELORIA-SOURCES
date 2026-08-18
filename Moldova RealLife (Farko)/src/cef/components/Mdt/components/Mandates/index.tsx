import React, { useState, useEffect, useRef } from 'react';
import location from '../../assets/img/location.png';
import { CustomEvent } from '../../../../modules/custom.event';
import { CEF } from '../../../../modules/CEF';
import { ICriminalResponse, IMandateResponse, IncidentResponse, MandateType } from '../../../../../shared/mdt';
import MandateForm from './form';
import { clearCanvas } from '../../components/utils/CanvasUtil';

interface MandateForm {
  orderTime: string;
  personsInvolved: string;
  orderType: {
    [MandateType.SEARCH]: boolean;
    [MandateType.ARREST]: boolean;
    [MandateType.CAUTION]: boolean;
  };
  address: string;
  description: string;
  proofs: string;
}

export const validateSearch = (data: string) => {
  if (data.trim() === '') {
    CEF.alert.setAlert('error', 'Field is required');
    return false;
  }

  const isId = /^\d+$/.test(data.trim());

  const isName = /^[A-Za-zА-Яа-яЁёІіЇїЄє]+(?: [A-Za-zА-Яа-яЁёІіЇїЄє]+)*$/.test(data.trim());

  if (!isId && !isName) {
    CEF.alert.setAlert('error', 'Input must be either an ID or a name');
    return false;
  }

  return data.trim();
}

type MandatesProps = {
  setPersonRecord: (person: IMandateResponse | null) => void;
}

const Mandates: React.FC<MandatesProps> = ({ setPersonRecord }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [citizen, setCitizen] = useState<IMandateResponse[] | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mockCitizens: IMandateResponse[] = [
    {
      userId: 1,
      name: 'John Doe',
      orderType: MandateType.SEARCH,
      date: new Date(),
      orderTitle: 'Search',
      orderTime: new Date().toLocaleString(),
      personsInvolved: ['John Doe'],
      address: '123 Main St',
      description: 'Search for a missing person',
      proofs: 'Proofs',
      signature: 'Signature',
    },
    {
      userId: 2,
      name: 'Jane Smith',
      orderType: MandateType.ARREST,
      date: new Date(),
      orderTitle: 'Arrest',
      orderTime: new Date().toLocaleString(),
      personsInvolved: ['Jane Smith'],
      address: '456 Elm St',
      description: 'Arrest for a traffic violation',
      proofs: 'Proofs',
      signature: 'Signature',
    }
  ];

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
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
  }, [canvasRef]);

  const handleClearCanvas = () => {
    clearCanvas(canvasRef);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    const validatedQuery = validateSearch(searchQuery);
    if (!validatedQuery) return;

    setIsLoadingSearch(true);

    if (CEF.test) {
      setTimeout(() => {
        const foundCitizen = mockCitizens.find(
          c => c.userId.toString() === validatedQuery ||
            c.name.toLowerCase() === validatedQuery.toLowerCase()
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

    CustomEvent.callServer('Mdt-GetMandate', validatedQuery )
      .then((response) => {
        console.log("Mdt-GetMandate", response)
        if (response) {
          setCitizen(response);
        }
      })
      .catch((error) => {
        console.error('Error searching mandates:', error);
        setCitizen(null);
      })
      .finally(() => {
        setIsLoadingSearch(false);
      });
  };

  const handleCitizenBack = () => {
    setCitizen(null);
    setSearchQuery('');
  };

  return (
    <div className="mdt-section-content section-mandate">
      <div className="mandate">
        <div className="mandate-content">
          <h2>Search for Orders</h2>

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
            </>
          ) : (
            <>
              <div className="officers">
                <div className="officers-title">
                  <h1>Full Name</h1>
                  <h3>Order Type</h3>
                  <h3 style={{ marginRight: "10px" }}>
                    Time
                  </h3>
                </div>
                {citizen && citizen.length > 0 && citizen.map((element) => (
                  <div
                    key={`citizen-${element.userId}`}
                    className="officers-title clickable"
                    onClick={() => setPersonRecord(element)}
                  >
                    <h4>
                      {element.name}{" "}
                      <span>
                        CNP: <span>{element.userId}</span>
                      </span>
                    </h4>
                    <h6>{element.orderType}</h6>
                    <h6 style={{ marginRight: "10px" }}>
                      {element.orderTime?.toLocaleString()}
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

      <div className="mandate">
        <MandateForm 
          canvasRef={canvasRef} 
          clearCanvas={handleClearCanvas}
        />
      </div>
    </div>
  );
};

export default Mandates; 