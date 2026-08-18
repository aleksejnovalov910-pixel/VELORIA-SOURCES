import React, { useEffect, useState } from 'react';
import { CustomEvent } from '../../../../modules/custom.event';
import { IMandateResponse } from '../../../../../shared/mdt';


interface MandatesListProps {
    setPersonRecord: (personRecord: IMandateResponse) => void;
}

const MandatesList: React.FC<MandatesListProps> = ({ setPersonRecord }) => {
    const [loading, setLoading] = useState(true);
    const [mandates, setMandates] = useState<IMandateResponse[]>([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const PAGE_SIZE = 50; 

    const loadMandates = (pageNumber: number) => {
        setLoading(true);
        CustomEvent.callServer('Mdt-GetAllMandates', JSON.stringify({ page: pageNumber, limit: PAGE_SIZE }))
            .then((response) => {
                setLoading(false);
                if (!response) return;
                
                if (pageNumber === 0) {
                    setMandates(response);
                } else {
                    setMandates(prev => [...prev, ...response]);
                }
                

                setHasMore(response.length === PAGE_SIZE);
            })
            .catch(error => {
                console.error("Error loading mandates:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadMandates(0);
    }, []);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        loadMandates(nextPage);
    };

    return (
        <>
            <div className="officers-title crimes" style={{ width: '100%' }}>
                <h1>Full Name</h1>
                <h1>Order title</h1>
                <h3>Order type</h3>
                <h3>Date</h3>
            </div>
            <div className="officers crimes" style={{ width: '100%' }}>
                {mandates && mandates.length > 0 ? (
                    mandates.map((mandate, index) => (
                        <React.Fragment key={index}>
                            <div className="officers-title" style={{ width: '100%' }}
                                onClick={() => setPersonRecord(mandate)}
                            >
                                <h4>{mandate.name}</h4>
                                <h4>{mandate.orderTitle}</h4>
                                <h6>{mandate.orderType}</h6>
                                <h6>{new Date(mandate.date).toLocaleDateString()}</h6>
                            </div>
                        </React.Fragment>
                    ))
                ) : (
                    <div className="officers-title" style={{ width: '100%' }}>
                        <h4>No mandates found</h4>
                    </div>
                )}
                
                {hasMore && (
                    <div className="load-more-container" style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                        <button 
                            className="load-more-button" 
                            onClick={handleLoadMore}
                            disabled={loading}
                            style={{ 
                                padding: '0.741vh 1.389vh', 
                                background: '#2a2a2a', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '0.37vh',
                                cursor: loading ? 'default' : 'pointer',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Loading...' : 'Load More'}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default MandatesList;