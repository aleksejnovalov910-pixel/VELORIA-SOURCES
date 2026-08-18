import { CEF } from '../../../../modules/CEF';
import React, { useEffect, useState } from 'react';
import { fractionCfg } from '../../../../modules/fractions';
import { ICriminalResponse, IncidentResponse, IMandateResponse, ResponseType } from '../../../../../shared/mdt';
import { CustomEvent } from '../../../../modules/custom.event';

import deleteIcon from '../../assets/img/deleteIcon.svg';

interface RecordProps {
    record: ICriminalResponse | IncidentResponse | IMandateResponse;
    backToRecords: () => void;
}


const getProofImages = (images: string): string[] => {
    if (!images) return [];

    // Разделяем строку по запятым или пробелам
    const allLinks = images.split(/[,\s]+/).filter(link => link.trim() !== '');

    // Фильтруем только ссылки imgur
    const imgurLinks = allLinks.filter(link =>
        link.includes('imgur.com') ||
        link.includes('i.imgur.com')
    );

    return imgurLinks;
};


const PersonRecord: React.FC<RecordProps> = ({ record, backToRecords }) => {

    const recordTypeTitles: Record<ResponseType, string> = {
        [ResponseType.Criminal]: "viewing a criminal record",
        [ResponseType.Mandate]: "viewing a mandate",
        [ResponseType.Incident]: "viewing an incident",
        [ResponseType.Car]: "viewing a car record"
    };

    const getRecordType = (): ResponseType => {
        if ('orderTitle' in record && 'orderType' in record) {
            return ResponseType.Mandate;
        }
        if ('personsInvolved' in record && 'policeOfficersInvolved' in record && 'vehiclesInvolved' in record) {
            return ResponseType.Incident;
        }
        if ('paid' in record) {
            return ResponseType.Criminal;
        }
        if (Object.values(ResponseType).includes(record.signature as ResponseType)) {
            return record.signature as ResponseType;
        }
        return ResponseType.Criminal;
    };

    const recordType = getRecordType();

    const getRecordTypeTitle = () => {
        return recordTypeTitles[recordType] || "viewing a record";
    };

    const [proofImages, setProofImages] = useState<string[]>([]);
    const [signature, setSignature] = useState<string | null>(null);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === proofImages.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? proofImages.length - 1 : prevIndex - 1
        );
    };

    const getUserId = () => {
        if ('userId' in record && record.userId) {
            return record.userId;
        }
        return 'N/A';
    };

    const deletePersonData = async() => {
        const res = await CustomEvent.callServer("Mdt-DeletePersonData", record.id);
        if (res) {
            backToRecords();
        }
    }


    useEffect(() => {
        setProofImages(getProofImages(record.proofs));
        CustomEvent.callServer("Mdt-GetSignature", record.id, record.signature).then((signature) => {
            if (!signature) return;

            setSignature(signature);
        });


    }, []);

    return <div className="statistics_criminal">
        {record.creator && (
            <div className="statistics_criminal_item">
                <span className="citem-title">
                    Creator
                </span>

                <div className="citem_creator">
                    <img src={CEF.getPassportImageURL(`${record.creator.userId}_passport`)} alt="" />

                    <div className="citem_creator-info">
                        {record.creator.name}
                        <span className="citem_creator-info-title">
                            {record.description && 'Details'}
                        </span>
                        <span className="citem_creator-info-rank">{fractionCfg.getRankName(record.creator.fractionId, record.creator.rank)}</span>
                    </div>
                </div>
            </div>
        )}

        <div className="statistics_criminal_item">
            <span className="citem-title">
                {getRecordTypeTitle()} <strong>#{
                    'id' in record
                        ? String(record.id)
                        : 'N/A'
                }</strong>
            </span>
            <div className="citem_record">
                <img className="citem_record-logo" src={CEF.getPassportImageURL(`${getUserId()}_passport`)} alt="" />

                <div className="citem_record-info">
                    {'name' in record && record.name}

                    <span className="citem_record-info-content">
                        <div className="citem_record-info-content-col">
                            <span className="citem_record-info-content-title">
                                CNP
                            </span>
                            {getUserId()}
                        </div>
                        <div className="citem_record-info-content-col description">
                            <span className="citem_record-info-content-title">
                                {recordType === ResponseType.Criminal ? 'Crime' : recordType === ResponseType.Mandate ? 'Mandate' : recordType === ResponseType.Incident ? 'Incident' : 'Record'}
                            </span>
                            {record.description || 'No description available'}

                        </div>
                        <div className="citem_record-info-content-col">
                            <span className="citem_record-info-content-title">
                                Date of Creation
                            </span>
                            {new Date(record.date).toLocaleDateString()}
                            <br />
                            {new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {signature && (
                            <div className="citem_record-info-content-col">
                                <span className="citem_record-info-content-title">
                                    Signature
                                </span>
                                <img className='citem_record-info-content-signature' src={signature} alt="signature" />
                            </div>
                        )}
                    </span>

                    {/* Mandate */}
                    {recordType === ResponseType.Mandate && (
                        <span className="citem_record-info-content">
                            <div className="citem_record-info-content-col">
                                <span className="citem_record-info-content-title">
                                    Order Title
                                </span>
                                {(record as IMandateResponse).orderTitle}
                            </div>

                            <div className="citem_record-info-content-col">
                                <span className="citem_record-info-content-title">
                                    Persons Involved
                                </span>
                                {Array.isArray((record as IMandateResponse).personsInvolved)
                                    ? (record as IMandateResponse).personsInvolved.join(', ')
                                    : (record as IMandateResponse).personsInvolved}
                            </div>

                            <div className="citem_record-info-content-col">
                                <span className="citem_record-info-content-title">
                                    Order Type
                                </span>
                                {(record as IMandateResponse).orderType}
                            </div>

                            <div className="citem_record-info-content-col">
                                <span className="citem_record-info-content-title">
                                    Address
                                </span>
                                {(record as IMandateResponse).address}
                            </div>
                            {CEF.user.rank >= 5 && (
                                <div className="citem_record-info-content-delete" onClick={deletePersonData}>
                                    <img src={deleteIcon} alt="delete" />
                                </div>
                            )}
                        </span>
                    )}

                    {/* Incident */}
                    {recordType === ResponseType.Incident && (
                        <span className="citem_record-info-content">
                            <div className="citem_record-info-content-col">
                                <span className="citem_record-info-content-title">
                                    Persons Involved
                                </span>
                                {(record as IncidentResponse).personsInvolved?.join(', ')}
                            </div>

                            <div className="citem_record-info-content-col">
                                <span className="citem_record-info-content-title">
                                    Police Officers Involved
                                </span>
                                {(record as IncidentResponse).policeOfficersInvolved?.join(', ')}
                            </div>

                            <div className="citem_record-info-content-col">
                                <span className="citem_record-info-content-title">
                                    Vehicles Involved
                                </span>
                                {(record as IncidentResponse).vehiclesInvolved}
                            </div>
                            {CEF.user.rank >= 5 && (
                                <div className="citem_record-info-content-delete" onClick={deletePersonData}>
                                    <img src={deleteIcon} alt="delete" />
                                </div>
                            )}
                        </span>
                    )}

                    <span className="citem_record-info-content">
                        {proofImages.length > 0 && (
                            <div className="citem_record-info-proofs">
                                <div className="carousel-controls">
                                    {proofImages.length > 1 && (
                                        <button className="carousel-control prev" onClick={prevImage}>
                                            &#10094;
                                        </button>
                                    )}
                                    <div className="carousel-image-container">
                                        <img
                                            src={proofImages[currentImageIndex]}
                                            alt={`Proof ${currentImageIndex + 1}`}
                                            className="carousel-image"
                                        />
                                        {proofImages.length > 1 && (
                                            <div className="carousel-indicators">
                                                {proofImages.map((_, index) => (
                                                    <span
                                                        key={index}
                                                        className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                                                        onClick={() => setCurrentImageIndex(index)}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {proofImages.length > 1 && (
                                        <button className="carousel-control next" onClick={nextImage}>
                                            &#10095;
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </span>
                </div>
            </div>
        </div>
    </div>;
};

export default PersonRecord;
