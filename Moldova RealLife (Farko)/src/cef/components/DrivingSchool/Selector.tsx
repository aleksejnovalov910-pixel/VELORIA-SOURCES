import React, { Component } from "react";
import motoIcon from "./img/category-1.png";
import carIcon from "./img/category-2.png";
import truckIcon from "./img/category-3.png";
import boatIcon from "./img/category-4.png";
import airIcon from "./img/category-5.png";
import { LICENCE_CENTER_LIST, type LicenceType } from "../../../shared/licence";

interface SelectorProps {
  setSelectedCategory(id: string): void;
  categories: { name: string; id: string; literal: string }[];
  playerLicenses: [LicenceType, number, string][];
}

const categoryIcons: Record<string, string> = {
  moto: motoIcon,
  car: carIcon,
  truck: truckIcon,
  boat: boatIcon,
  air: airIcon,
};

class Selector extends Component<SelectorProps> {
  render() {
    return (
      <div className="driving-school-selector" >
        {this.props.categories.map((category) => {
          // Проверяем, есть ли у игрока лицензия для данной категории
          const hasLicense = this.props.playerLicenses.some(
            ([licenseType]) => licenseType === category.id
          );

          const license = LICENCE_CENTER_LIST.find((license) => license.license.some((l) => l.id == category.id));

          return (
            <div className="driving-school-category" key={category.id}>
              <div className="driving-school-category-title">
                <h3>{category.literal}</h3>
                <h1>{category.name}</h1>
              </div>
              <img
                src={categoryIcons[category.id] || motoIcon}
                alt={category.name}
              />

              <div className="driving-school-category-price">
                $ {license?.license.find((l) => l.id == category.id)?.cost}
              </div>

              {/* Если лицензии нет - кнопка "Select", иначе "Owned" */}
              {hasLicense ? (
                <button type="button" disabled>
                  Ai deja
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => this.props.setSelectedCategory(category.id)}
                >
                  Select
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Selector;
