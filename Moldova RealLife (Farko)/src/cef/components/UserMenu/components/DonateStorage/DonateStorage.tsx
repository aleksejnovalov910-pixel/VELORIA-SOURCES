import React, { useCallback, useLayoutEffect, useState } from "react";
import "./style.less"

const svg = Object.fromEntries(
    Object.entries(import.meta.glob("../../img/*.svg", { eager: true })).map(
        ([key, value]) => {
            const name = key.match(/\/([^/]+)\.svg$/)[1];
            return [name, value.default];
        },
    ),
);
const png = Object.fromEntries(
    Object.entries(import.meta.glob("../../img/*.png", { eager: true })).map(
        ([key, value]) => {
            const name = key.match(/\/([^/]+)\.png$/)[1];
            return [name, value.default];
        },
    ),
);
import '../../style/style.css'
import { IDonateStorageItem, IDonateStorageMenu } from "../../../../../shared/donateStorage";
import { getBaseItemNameById, inventoryShared, ITEM_TYPE } from "../../../../../shared/inventory";
import { CustomEvent } from "../../../../modules/custom.event";

const images = Object.fromEntries(
    Object.entries(import.meta.glob("../../../../../shared/icons/*.png", { eager: true })).map(
        ([key, value]) => {
            const name = key.match(/\/([^/]+)\.png$/)[1];
            return [name, value.default];
        },
    ),
);

const DonateStorage = () => {

    const [storage, setStorage] = useState<IDonateStorageItem[]>([]);
    const [inventory, setInventory] = useState<IDonateStorageItem[]>([]);

    useLayoutEffect(() => {
        const ev = CustomEvent.register("donateStorage:setData", (inventoryDTO, storageDTO) => {
            setInventory(inventoryDTO);
            setStorage(storageDTO);
        });

        CustomEvent.triggerServer('donateStorage:update');

        return () => ev.destroy();
    }, []);

    const [menu, setMenu] = useState<IDonateStorageMenu>({
        show: false,
        name: '',
        styles: {
            display: 'none',
            position: 'absolute',
            left: `0px`,
            top: `0px`
        },
        toStorage: false
    });



    const [target, setTarget] = useState<number>(-1);

    const openInteraction = useCallback(
        (event: React.MouseEvent<HTMLDivElement, MouseEvent>, toStorage: boolean, id: number) => {

            let itemName: string = '',
                targetItem: IDonateStorageItem;

            if (toStorage) {
                targetItem = inventory.find(el => el.id === id);
            } else {
                targetItem = storage.find(el => el.id === id);
            }

            if (target) {
                itemName = getBaseItemNameById(targetItem.item_id);

                if (targetItem.serial) {
                    let cfg = inventoryShared.get(targetItem.item_id);

                    if (cfg && cfg.type === ITEM_TYPE.CLOTH) {
                        itemName += ` (${targetItem.serial})`
                    }
                }
            }

            setMenu({
                show: true,
                name: itemName,
                styles: {
                    display: 'block',
                    position: 'absolute',
                    left: `${event.screenX * 0.8}px`,
                    top: `${event.screenY * 0.8}px`
                },
                toStorage
            })

            setTarget(id);

        }, [storage, inventory]);

    const closeInteraction = useCallback(() => {
        setMenu({
            show: false,
            name: '',
            styles: {
                display: 'none',
                position: 'absolute',
                left: `0px`,
                top: `0px`
            },
            toStorage: false
        })
    }, []);

    const transfer = useCallback(() => {
        if (!target) return;

        CustomEvent.triggerServer('donateStorage:transfer', target, menu.toStorage);

        closeInteraction()
    }, [target, menu]);

    const generateItems = (count: number) => {
        return Array.from({ length: count }, (_, index) => (
            <div className="umenu-sitem" key={index}></div>
        ));
    };

    const generateItemS = (count: number) => {
        return Array.from({ length: count }, (_, index) => (
            <div className="umenu-sitem" key={index}>
                <div className="umenu-selected">
                    <img src={png['meat']} alt="" />
                    <div className="umenu-amount">x1</div>
                    <div className="umenu-text">Meat</div>
                </div>
            </div>
        ));
    };

    return <>
        <div className="umenu-sttorage">
            <div className="umenu-title">Depozit</div>
            <div className="umenu-subtitle">Momentan indisponibil</div>
            <div className="umenu-inv">
                <div className="umenu-title">Inventarul tau</div>
                <div className="umenu-size">
                    <img src={svg['unlimited']} alt="" />
                    <div className="umenu-text">KG</div>
                </div>
                <div className="umenu-sitems">
                    {generateItems(42)}
                </div>
                <div className="umenu-sitems umenu-sitems-content">
                    {inventory.map((el, key) => {
                        return <div className="umenu-sitem" key={key} onClick={(e) => openInteraction(e, true, el.id)}>
                            <div className="umenu-selected">
                                <img src={images[`Item_${el.item_id}`]} alt="" />
                                <div className="umenu-amount">x1</div>
                                <div className="umenu-text">Meat</div>
                            </div>
                        </div>
                    })}

                </div>
            </div>
            <div className="umenu-donated">
                <div className="umenu-title">Depozit pentru obiectele din shop</div>
                <div className="umenu-size">
                    <img src={svg['unlimited']} alt="" />
                    <div className="umenu-text">KG</div>
                </div>
                <div className="umenu-ditems">
                    {storage.map((el, key) => {
                        return <div className="umenu-ditem" key={key} onClick={(e) => openInteraction(e, false, el.id)}>
                            <img src={images[`Item_${el.item_id}`]} alt="" />
                            <div className="umenu-text">Porsche 911</div>
                        </div>
                    })}
                </div>
            </div>
        </div>
    </>

}

export default DonateStorage;