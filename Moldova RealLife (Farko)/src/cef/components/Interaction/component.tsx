import React, { useState } from "react";
import './style.scss'
import { Category } from "./Interaction";
import imgBg from './assets/img/img-bg.png'
import back from './assets/img/back.png'

import { CEF } from '../../modules/CEF';
import centerHuman from "./assets/centerHuman.svg";
import centerVehicle from "./assets/centerVehicle.svg";

const icons = Object.fromEntries(
	Object.entries(import.meta.glob("./assets/26/*.svg", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.svg$/)[1];
			return [name, value.default];
		},
	),
);
type Item = {
  id: number;
  name: string;
  subitems?: { id: number; name: string }[];
}

type Props = {
  cats: Category[];
  elements: { [key: string]: any[] };
  selectedCat: Category | null;
  clickItem: (key: string) => void;
  isVehicle: boolean;
  resetCat: () => void;
}

export const InteractMenu = ({ cats, elements, selectedCat, clickItem, isVehicle, resetCat }: Props) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const getItems = () => {
    if (selectedCat === null) {
      return cats.filter(c => c.key != '').concat(elements[''] || []);
    } else {
      if (!elements[selectedCat.key]) return [];
      return elements[selectedCat.key];
    }
  }

  const allItems = getItems();
  
  const needsPagination = allItems.length > 8;
  
  const currentItems = needsPagination 
    ? allItems.slice(currentPage * 8, (currentPage + 1) * 8)
    : allItems;
  
  const totalPages = Math.ceil(allItems.length / 8);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <div className="interact-menu">
      {selectedCat !== null && <div onClick={resetCat} style={{ zIndex: "10" }}>
        <img
          src={back}
          alt="toggle"
          className="menu-toggle-img"
        />
      </div>}

      {selectedCat === null && <div
        onClick={() => {
          CEF.gui.setGui(null)
        }}
        style={{ zIndex: "10" }}
      >
        <span className="menu-toggle-bg">
        <img
          src={isVehicle ? centerVehicle : centerHuman}
          alt="toggle"
          className="menu-toggle-img"
        />
        </span>
      </div>}

      <div className={`menu-items ${isVisible ? "visible" : ""}`}>
        {currentItems.map((item, index) => (
          <div
            key={index}
            className="item"
            onClick={() => {
              clickItem(item.key);
            }}
          >
            <div className="img">
              <img src={icons[item?.img ?? '']} alt="" />
              <img className="img-bg" src={imgBg} alt="" />
            </div>

            <h1>{item?.title ?? "item.name"}</h1>
          </div>
        ))}
      </div>

      {needsPagination && (
        <div className="pagination-controls">
          <div className="pagination-button prev" onClick={prevPage}>
            <span>←</span>
          </div>
          <div className="pagination-info">
            {currentPage + 1}/{totalPages}
          </div>
          <div className="pagination-button next" onClick={nextPage}>
            <span>→</span>
          </div>
        </div>
      )}
    </div>
  );
};