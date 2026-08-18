import React from 'react';
import { CustomEvent } from "../../../modules/custom.event";

interface PartDetailsProps {
    componentType: string;
    goBack: () => void;
    availableItems: number[];
    installedItems: number[];
    maxSlots: number;
    addItem: (index: number) => void;
    removeItem: (index: number) => void;
    iconsItems: Record<string, string>;
    upgradeNames: Record<string, any>;
    countUpgradeComponents: number;
}

export const PartDetails: React.FC<PartDetailsProps> = ({
    componentType,
    goBack,
    availableItems,
    installedItems,
    maxSlots,
    addItem,
    removeItem,
    iconsItems,
    countUpgradeComponents,
    upgradeNames
}) => {
    return (
        <div className="parts">
            <h1 className="part-title" onClick={goBack}>
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
                    <path opacity="0.3" d="M7 13L1 7L7 1" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {upgradeNames[componentType][0]}
            </h1>

            <div className="part-list">
                {[...new Array(countUpgradeComponents)].map((_, i) => {
                    let data = installedItems;
                    let itemid = null;
                    if (data)
                        itemid = typeof data == 'object' ? data[i] : data

                    return (
                        <div key={`available-${i}`} className="part">
                            {itemid ? (
                                <>
                                    <img src={iconsItems[`Item_${itemid}`]} alt="" />
                                    <span
                                        onClick={() => removeItem(i)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="2" viewBox="0 0 8 2" fill="none">
                                            <path d="M7 1L1 1" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </span>
                                </>
                            ) : null}
                        </div>
                    );
                })}
            </div>

            <div className="square-grid animated fadeIn">
                {[...new Array(18 * 2)].map((_, i) => {
                    const itemsCheck = (upgradeNames as any)[componentType][3] as number[];
                    const filteredItems = availableItems.filter(item => itemsCheck.includes(item));

                    return (
                        <div key={`inventory-slot-${i}`} className="square">
                            {i < filteredItems.length && (
                                <>
                                    <img src={iconsItems[`Item_${filteredItems[i]}`]} alt="" />
                                    <button className="btn-round add" onClick={() => addItem(i)}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="8"
                                            height="8"
                                            viewBox="0 0 8 8"
                                            fill="none"
                                        >
                                            <path d="M4 1V7M7 4L1 4" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

{/*
<div className="inventory">
{[...new Array(18 * 2)].map((_, i) => {
    // console.log(i)
    const itemsCheck = (upgradeNames as any)[this.state.upgradeComponent][3] as number[]
    const items = this.state.items.filter(q => itemsCheck.includes(q[1]));
    if(items[i]) return <div className="cell" key={`upgrade_my_${i}`}>
        <img src={iconsItems[`Item_${items[i][1]}`]}/>
        <button className="btn-round add" onClick={e => {
            e.preventDefault();
            CustomEvent.triggerServer('mining:component:insert', this.state.id, this.state.upgradeComponent, items[i][0]);
        }}>
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="12" cy="12" r="12" fill="white"/>
                <path
                    d="M11.0001 13V19H13.0001V13H19V11H13.0001V5.00002L11.0001 5.00002V11H5V13H11.0001Z"
                    fill="#8343EB"
                />
            </svg>
        </button>
    </div>
    else return <div className="cell" key={`upgrade_my_${i}`} />
})}
</div> */}