import React from 'react';
import { MdtInfoTabs } from '../../constants';
const png = Object.fromEntries(
    Object.entries(import.meta.glob("../../assets/img/*.png", { eager: true })).map(
        ([key, value]: [string, any]) => {
            const name = key.match(/\/([^/]+)\.png$/)[1];
            return [name, value.default];
        },
    ),
);

export const MainMdt: React.FC<{
    info: number[],
    selectedInfo: string | null,
    setSelectedInfo: (info: string) => void,
}> = ({ info, setSelectedInfo, selectedInfo }) => {


    return (
        <>
            <div className="mdt-infos">
                <div className="mdt-infos-container">
                    {Object.entries(MdtInfoTabs).map(([key, value], index) => {
                        if (selectedInfo && key !== selectedInfo) return null;

                        return <div
                            key={key}
                            className="mdt-info"
                            onClick={() => {
                                setSelectedInfo(key);
                            }}
                        >
                            <div className="mdt-img">
                                <img
                                    src={png[`top-${index + 1}`]}
                                    alt={value}
                                />
                            </div>
                            <div className="mdt-info-content">
                                <span>{value}</span>
                                <h1>{info?.[index] || 0}</h1>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </>
    );
};


