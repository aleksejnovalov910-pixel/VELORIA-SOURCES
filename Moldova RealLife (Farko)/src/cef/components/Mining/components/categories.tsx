import React, { useState } from 'react';


interface Part {
    id: number;
    name: string;
    image: string;
}

interface CategoriesProps {
    openUpgrade: (part: string) => void;
}
const iconsItems: Record<string, string> = Object.fromEntries(
	Object.entries(
		import.meta.glob("../img/*.png", { eager: true }) as Record<string, { default: string }>
	).map(([key, value]) => {
		const name = key.match(/\/([^/]+)\.png$/)?.[1] || '';
		return [name, value.default];
	}),
);

export const Categories: React.FC<CategoriesProps> = ({ openUpgrade }) => {
   

    const partComponentMap: Record<number, string> = {
        1: "videocards",
        2: "powers",
        3: "rams",
        4: "cpu",
        5: "alghoritm"
    };


    const handlePartSelect = (partId: number) => {
        const componentName = partComponentMap[partId];
        if (componentName) {
            openUpgrade(componentName);
        }
    };

    return (
        <>
            <div className="components animated fadeIn">
                <div
                    className="video-card component"
                    onClick={() => handlePartSelect(1)}
                >
                    <img src={iconsItems["videocard"]} alt="" />
                    <h1>Placi video</h1>
                </div>
                <div
                    className="power component"
                    onClick={() => handlePartSelect(2)}
                >
                    <img src={iconsItems["power"]} alt="" />
                    <h1>Surse de alimentare</h1>
                </div>
                <div
                    className="ram component"
                    onClick={() => handlePartSelect(3)}
                >
                    <img src={iconsItems["ram"]} alt="" />
                    <h1>Memorie RAM</h1>
                </div>
            </div>

            <div className="components animated fadeIn">
                <div
                    className="cpu component"
                    onClick={() => handlePartSelect(4)}
                >
                    <img src={iconsItems["cpu"]} alt="" />
                    <h1>CPU</h1>
                </div>
                <div
                    className="software component"
                    onClick={() => handlePartSelect(5)}
                >
                    <img src={iconsItems["software"]} alt="" />
                    <h1>Software</h1>
                </div>
            </div>
        </>
    )
}

