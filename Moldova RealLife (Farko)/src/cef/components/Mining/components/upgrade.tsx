import React from "react";

interface UpgradeMiningProps {
    nextLevel?: number;
    cost?: number;
    onConfirm?: () => void;
    onCancel?: () => void;
}

export const UpgradeMining: React.FC<UpgradeMiningProps> = ({ nextLevel = 5, cost = 999999999, onConfirm, onCancel }) => {
    const formattedCost = cost.toLocaleString();
    
    return (
        <div className="mining-upgrade">
            <div className="mining-upgrade_container">

                <h6><span>Upgrade</span></h6>
                <p>Esti sigur ca vrei sa imbunatatesti ferma la nivelul  
                   <span>&nbsp;&nbsp;{nextLevel}</span> pentru <span>${formattedCost}</span>?</p>

                <div className="mining-upgrade_container-buttons">
                    <button className="orange-one" onClick={onConfirm}>Upgrade</button>
                    <button onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

