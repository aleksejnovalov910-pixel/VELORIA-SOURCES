import React, { useEffect, useState } from 'react';
import { CustomEvent } from '../../../../modules/custom.event';
import okImg from '../../assets/img/buttons/ok.png';
import phoneImg from '../../assets/img/buttons/phone.png';
import cancelImg from '../../assets/img/buttons/cancel.png';
import locationImg from '../../assets/img/buttons/location.png';
import { CallList, IMandateResponse, MembersList } from '../../../../../shared/mdt';
import Calls from './calls';
import { CEF } from '../../../../modules/CEF';
import { mockOfficersList } from './mockData';
import { fractionCfg } from '../../../../modules/fractions';
import MandatesList from './mandatesList';


interface OfficersListProps {
  selectedInfo: "members" | "calls" | "mandate" | null;
  setPersonRecord: (personRecord: IMandateResponse) => void;
}


const OfficersList: React.FC<OfficersListProps> = ({ selectedInfo, setPersonRecord }) => {
  const [infoData, setInfoData] = useState<MembersList | CallList | null>(null);

  useEffect(() => {
    if (selectedInfo) {

      if (CEF.test) {
        const mockData = mockOfficersList(selectedInfo);
        setInfoData(mockData);
        return;
      }

      getData(selectedInfo);
    }
  }, [selectedInfo]);

  const getData = (selectedInfo: string) => {
    CustomEvent.callServer("Mdt-GetOfficersList", selectedInfo)
      .then((data: MembersList | CallList) => {
        if (!data) return;
        setInfoData(data);
      });
  }


  const renderOfficersList = () => {
    console.log(selectedInfo);
    switch (selectedInfo) {
      case "members": // Police officers
        if (Array.isArray(infoData) && infoData.length > 0 && 'serviceLife' in infoData[0]) {
          const membersList = infoData as MembersList;
          return (
            <>
              <div className="officers-title">
                <h1>Full Name</h1>
                <h2>Service life</h2>
                <h3>Rank</h3>
              </div>
              <div className="officers">
                {membersList.map((item) => (
                  <div key={item.id} className="officers-title">
                    <h4>
                      {item.name}{" "}
                      <span>
                        CNP: <span>{item.id}</span>
                      </span>
                    </h4>
                    <h5>{item.serviceLife}</h5>
                    <h6>
                      <span>{fractionCfg.getRankName(CEF.user.fraction, item.rank)}</span>
                    </h6>
                  </div>
                ))}
              </div>
            </>
          );
        }
        return null;
      case "calls": // Calls
        if (Array.isArray(infoData) && infoData.length > 0 && 'location' in infoData[0]) {
          return <Calls infoData={infoData as CallList} getData={getData} />
        }
        return null;

      case "mandate": // Mandates
        return <MandatesList setPersonRecord={setPersonRecord} />
      default:
        return null;
    }
  };

  return <div className="mdt-section-content">{renderOfficersList()}</div>;
};

export default OfficersList; 