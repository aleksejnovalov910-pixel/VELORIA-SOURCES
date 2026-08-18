import React, { useState, useEffect } from 'react';
import { CustomEvent } from '../../modules/custom.event';

import Menu from './components/Menu';
import Statistics from './components/Statistics';
import Mandates from './components/Mandates';
import Incidents from './components/Incidents';
import CriminalRecord from './components/CriminalRecord';
import Citizens from './components/Citizens';
import Cars from './components/Cars';
import OfficersList from './components/OfficersList';
import './assets/style/style.scss'

import { MdtPages } from './constants';
import { MainMdt } from './components/Main';
import { ICarResponse, ICriminalResponse, IMandateResponse, IncidentResponse, MdtInfo } from '../../../shared/mdt';
import { CEF } from '../../modules/CEF';
import PersonRecord from './components/Records/Person';
import { MandateType } from '../../../shared/mdt';
import { mockLatest } from './mock';
import VehicleRecord from './components/Records/Vehicle';

export const MDT: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState<string>(MdtPages.statistic);

  const [selectedInfo, setSelectedInfo] = useState<string | null>(null);


  const [personRecord, setPersonRecord] = useState<IncidentResponse | ICriminalResponse | IMandateResponse | null>(null);
  const [vehicleRecord, setVehicleRecord] = useState<ICarResponse | null>(null);


  const [info, setInfo] = useState<MdtInfo>(CEF.test ?
    mockLatest : {
      officers: 0,
      mandates: 0,
      calls: 0,
      latest: {
        criminal: [],
        mandates: [],
        incidents: []
      }
    }
  );

  useEffect(() => {
    CEF.playSound("cliekc"); // sunet la selectarea unui articol
    CustomEvent.callServer("Mdt-GetInfoMain").then((data: MdtInfo) => {
      console.log('Data', data);
      if (!data) return;
      setInfo(prevInfo => ({...prevInfo, ...data}));
    });

    CustomEvent.register('Mdt-SetCriminal', (data: string) => {
      console.log('Data', data);
      if (!data) return;
      setInfo(prevInfo => ({
        ...prevInfo, 
        latest: {
          ...prevInfo.latest, 
          criminal: JSON.parse(data)
        }
      }));
    });

    CustomEvent.register('Mdt-SetMandate', (data: string) => {
      console.log('Data', data);
      if (!data) return;
      setInfo(prevInfo => ({
        ...prevInfo, 
        latest: {
          ...prevInfo.latest, 
          mandates: JSON.parse(data)
        }
      }));
    });

    CustomEvent.register('Mdt-SetIncident', (data: string) => {
      console.log('Data', data);
      if (!data) return;
      setInfo(prevInfo => ({
        ...prevInfo, 
        latest: {
          ...prevInfo.latest, 
          incidents: JSON.parse(data)
        }
      }));
    });
  }, []);

  useEffect(() => {
    if (selectedMenu !== null) {
      setSelectedInfo(null);
      setPersonRecord(null);
      setVehicleRecord(null);
      CEF.playSound("cliekc"); // sunet la selectarea unui articol
    }
  }, [selectedMenu]);

  return (
    <div className="mdt-box-tablet animated fadeInUp">
      <div className="mdt_wrapper">
        <div className="mdt-content">
          <Menu
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
          />

          <div className="mdt-section">

            {personRecord ?
              <PersonRecord record={personRecord} backToRecords={() => setSelectedMenu(null)} />
              :
              vehicleRecord ?
                <VehicleRecord vehicle={vehicleRecord} />
                :
                <>
                  {/* POLICE/ MANDATE/ CHALLENGES */}
                  {(selectedMenu === MdtPages.statistic || selectedMenu === null) && (
                    <MainMdt
                      info={[info?.officers, info?.mandates, info?.calls]}
                      selectedInfo={selectedInfo}
                      setSelectedInfo={setSelectedInfo}
                    />
                  )}

                  {/* STATISTIC */}
                  {selectedMenu === MdtPages.statistic && selectedInfo === null && (
                    <Statistics
                      latest={info.latest}
                      setPersonRecord={setPersonRecord}
                    />
                  )}

                  {/* MANDATE */}
                  {selectedMenu === MdtPages.mandate && (
                    <Mandates
                      setPersonRecord={setPersonRecord}
                    />
                  )}

                  {/* INCIDENTS */}
                  {selectedMenu === MdtPages.incidents && (
                    <Incidents
                      setPersonRecord={setPersonRecord}
                    />
                  )}

                  {/* CRIMINAL RECORD */}
                  {selectedMenu === MdtPages.criminals && (
                    <CriminalRecord
                      setPersonRecord={setPersonRecord}
                    />
                  )}

                  {/* CITIZENS */}
                  {selectedMenu === MdtPages.citizens && (
                    <Citizens
                      setVehicleRecord={setVehicleRecord}
                    />
                  )}

                  {/* CARS */}
                  {selectedMenu === MdtPages.cars && (
                    <Cars
                      setVehicleRecord={setVehicleRecord}
                    />
                  )}

                  {selectedInfo && <OfficersList 
                  selectedInfo={selectedInfo as "calls" | "members" | "mandate"}
                  setPersonRecord={setPersonRecord}
                  />}
                </>
            }


          </div>
        </div>
      </div>
    </div>
  );
};


