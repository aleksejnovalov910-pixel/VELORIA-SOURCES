import React, { useState } from 'react';
import { ICitizenDetails } from '../../../../../../shared/mdt';
import temp1 from '../../../assets/img/temp-1.png';
import { CEF } from '../../../../../modules/CEF';

interface CitizenProfileProps {
  citizen: ICitizenDetails;
  onBack: () => void;
}

const CitizenProfile: React.FC<CitizenProfileProps> = ({ 
  citizen, 
  onBack 
}) => {

  const [selectedTab, setSelectedTab] = useState<number | null>(null);



  const ActiveCriminalRecords = citizen.criminalRecords?.filter((record) => record?.paid === false);

  return (
    <div className="mandate citizens">
      <div
        className="mandate-content"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <div className="top">
          <h2>
            Detalii despre cetatean ( CNP: {citizen.userId} )
          </h2>

          <div className="citizen-profile">
            <img src={CEF.getPassportImageURL(`${citizen.userId}_passport`)} alt="" />
            <div className="citizen-profile-details">
              <h1>{citizen.name}</h1>
              <div className="citizen-profile-contact">
                <h6>
                  Varsta <span>{citizen.age}</span>
                </h6>
                <h6>
                  Numar telefon{" "}
                  <span>{citizen.phone}</span>
                </h6>
              </div>
            </div>
          </div>

          {/* Licenses Tab */}
          <div
            className={`latest licenses citizens ${
              selectedTab === 1 ? "opened" : ""
            }`}
          >
            <h2
              onClick={() =>
                setSelectedTab(selectedTab === 1 ? null : 1)
              }
            >
              Licente
              {selectedTab === 1 ? (
                <span>▲</span>
              ) : (
                <span>▼</span>
              )}
            </h2>
            <div className="info">
              {citizen.licenses.map((license) => (
                <h1
                  style={{
                    color:
                      license.date < new Date()
                      ? "green"
                      : "red",
                }}
              >
                <span>🗸</span>
                {license.licenceType}: {license.date < new Date() ? "Valid" : "Not Valid"}
              </h1>
              ))}

              {/* <h1
                style={{
                  color:
                    citizen.pass === false
                      ? "red"
                      : "green",
                }}
              >
                <span>🛈</span>Pass status: {citizen.pass ? "Valid" : "Not Valid"}
              </h1> */}
            </div>
          </div>

          {/* Criminal Records Tab */}
          <div
            className={`latest licenses citizens ${
              selectedTab === 2 ? "opened" : ""
            }`}
          >
            <h2
              onClick={() =>
                setSelectedTab(selectedTab === 2 ? null : 2)
              }
            >
              Caziere
              {selectedTab === 2 ? (
                <span>▲</span>
              ) : (
                <span>▼</span>
              )}
            </h2>
            <div className="info">
              <h3>
                Active
                <span>{ActiveCriminalRecords.length || 0}</span>
              </h3>
              <h3>
                Platite
                <span style={{ background: "#1EE696" }}>
                  {citizen.criminalRecords.length - ActiveCriminalRecords.length || 0}
                </span>
              </h3>
            </div>
          </div>

          {/* Incidents Tab */}
          <div
            className={`latest licenses citizens ${
              selectedTab === 3 ? "opened" : ""
            }`}
          >
            <h2
              onClick={() =>
                setSelectedTab(selectedTab === 3 ? null : 3)
              }
            >
              Incidente
              {selectedTab === 3 ? (
                <span>▲</span>
              ) : (
                <span>▼</span>
              )}
            </h2>
            <div className="info">
              <h3>
                Incidente
                <span>{citizen.incidents.length || 0}</span>
              </h3>
            </div>
          </div>

            {/* Mandates Tab */}
            <div
            className={`latest licenses citizens ${
              selectedTab === 4 ? "opened" : ""
            }`}
          >
            <h2
              onClick={() =>
                setSelectedTab(selectedTab === 4 ? null : 4)
              }
            >
              Mandate
              {selectedTab === 4 ? (
                <span>▲</span>
              ) : (
                <span>▼</span>
              )}
            </h2>
            <div className="info">
              <h3>
                Mandate
                <span>{citizen.mandates.length || 0}</span>
              </h3>
            </div>
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
    </div>
  );
};

export default CitizenProfile; 