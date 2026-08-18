import { CEF } from '../../../../modules/CEF';
import React, { useEffect, useState } from 'react';
import { fractionCfg } from '../../../../modules/fractions';
import { ICarResponse, ResponseType } from '../../../../../shared/mdt';
import { CustomEvent } from '../../../../modules/custom.event';

interface VehicleProps {
    vehicle: ICarResponse;
}


const VehicleRecord: React.FC<VehicleProps> = ({ vehicle }) => {

    const [signature, setSignature] = useState<string | null>(null);
    const [proofImages, setProofImages] = useState<string[]>([]);
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
        if (vehicle.owner && vehicle.owner.userId) {
            return vehicle.owner.userId;
        }
        return 'N/A';
    };

    const getProofImages = (images: string): string[] => {
        if (!images) return [];
    
        // Split string by commas or spaces
        const allLinks = images.split(/[,\s]+/).filter(link => link.trim() !== '');
    
        // Filter only imgur links
        const imgurLinks = allLinks.filter(link =>
            link.includes('imgur.com') ||
            link.includes('i.imgur.com')
        );
    
        return imgurLinks;
    };

    useEffect(() => {
        // Use proofs if it exists, otherwise try images
        const imagesSource = vehicle.proofs || (vehicle as any).images || '';
        setProofImages(getProofImages(imagesSource));
        
        CustomEvent.callServer("Mdt-GetSignature", vehicle.id, vehicle.signature).then((signature) => {
            if (!signature) return;

            setSignature(signature);
        });
    }, []);


    return <div className="statistics_criminal">
        {vehicle.creator && (
            <div className="statistics_criminal_item">
                <span className="citem-title">
                    Creator
                </span>

                <div className="citem_creator">
                    <img src={CEF.getPassportImageURL(`${vehicle.creator.userId}_passport`)} alt="" />

                    <div className="citem_creator-info">
                        {vehicle.creator.name}
                        <span className="citem_creator-info-title">
                            {vehicle.model && 'Details'}
                        </span>
                        <span className="citem_creator-info-rank">{fractionCfg.getRankName(vehicle.creator.fractionId, vehicle.creator.rank)}</span>
                    </div>
                </div>
            </div>
        )}

        <div className="statistics_criminal_item">
            <span className="citem-title">
                Vehicle <strong>{vehicle.plate}</strong>
            </span>
            <div className="citem_record">
                <img className="citem_record-logo" src={CEF.getVehicleURL(vehicle.model)} alt="" />

                <div className="citem_record-info">
                    {vehicle.name}

                    <span className="citem_record-info-content">
                        <div className="citem_record-info-content-col">
                            <span className="citem_record-info-content-title">
                                Owner
                            </span>
                            {vehicle.owner.name}
                        </div>
                      
                        <div className="citem_record-info-content-col">
                            <span className="citem_record-info-content-title">
                                Date of Creation
                            </span>
                            {new Date(vehicle.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                            <br />
                            {new Date(vehicle.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
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
                                                {proofImages.map((_: string, index: number) => (
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

export default VehicleRecord;
