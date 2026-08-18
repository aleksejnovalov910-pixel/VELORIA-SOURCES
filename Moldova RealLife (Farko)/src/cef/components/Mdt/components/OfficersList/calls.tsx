import React from 'react';
import okImg from '../../assets/img/buttons/ok.png';
import phoneImg from '../../assets/img/buttons/phone.png';
import cancelImg from '../../assets/img/buttons/cancel.png';
import locationImg from '../../assets/img/buttons/location.png';
import { CallList } from '../../../../../shared/mdt';
import { CustomEvent } from '../../../../modules/custom.event';

type CallsProps = {
    infoData: CallList;
    getData: (selectedInfo: string) => void;
}

const Calls = ({ infoData, getData }: CallsProps) => {


    const acceptCall = (id: number) => {
        CustomEvent.callServer("Mdt-AcceptCall", id).then(() => {
            getData("calls")
        })
    }

    const rejectCall = (id: number) => {
        CustomEvent.callServer("Mdt-RejectCall", id).then(() => {
            getData("calls")
        })
    }


    return (
        <>
            <div className="officers-title">
                <h1 style={{ width: "10%" }}>Full Name</h1>
                <h2 style={{ textAlign: "left", width: "35%" }}>
                    Description
                </h2>
                <h3 style={{ textAlign: "left", width: "30%" }}>
                    Location
                </h3>
                <h3 style={{ textAlign: "left", width: "10%" }}>Date</h3>
                <h3 style={{ textAlign: "right", width: "15%" }}>
                    Actions
                </h3>
            </div>
            <div className="officers">
                {infoData.map((item) => {
                    let minutesAgo;
                    try {
                        minutesAgo = Math.floor(
                            (Date.now() - new Date(item.date).getTime()) / 60000
                        );
                        if (isNaN(minutesAgo) || minutesAgo < 0) {
                            minutesAgo = 0;
                        }
                    } catch (e) {
                        minutesAgo = 0;
                    }

                    return (
                        <div
                            key={item.id}
                            className="officers-title challenges"
                        >
                            <h4>{item.name}</h4>
                            <h5>{item.description}</h5>
                            <h6 style={{ width: "30%" }}>{item.location}</h6>
                            <h6>{minutesAgo} min ago</h6>
                            <h6 style={{ textAlign: "right", width: "15%" }}>
                                <img src={phoneImg} alt="" onClick={() => acceptCall(item.id)} />
                                <img src={cancelImg} alt="" onClick={() => rejectCall(item.id)} />
                            </h6>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default Calls;
