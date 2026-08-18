import { MdtPages } from '../../constants';
import { CEF } from '../../../../modules/CEF';
import React from 'react';


const png = Object.fromEntries(
  Object.entries(import.meta.glob("../../assets/img/*.png", { eager: true })).map(
    ([key, value]: [string, any]) => {
      const name = key.match(/\/([^/]+)\.png$/)[1];
      return [name, value.default];
    },
  ),
);


interface MenuItem {
  id: number;
  name: string;
}

interface MenuProps {
  selectedMenu: string;
  setSelectedMenu: (id: string | null) => void;
}

const Menu: React.FC<MenuProps> = ({
  selectedMenu,
  setSelectedMenu,
}) => {
  return (
    <div className="menu-mdt">
      <div className="menu-top-mdt">
        <img className="mdt-logo" src={png['mdt-logo']} alt="" />
        <div className="menu-items-mdt">

          { Object.entries(MdtPages).map(([key, value], index) => (
            <div
              key={key}
              className={`menu-item-mdt ${selectedMenu === key ? "selected" : ""}`}
              onClick={() => {
                setSelectedMenu(key);
                CEF.playSound("cliekc"); // sunet la selectarea unui articol
              }}
            >
              <div className="menu-img-mdt">
                <img src={png[(index + 1).toString()]} alt={value} />
              </div>
              <h1>{value}</h1>
            </div>
          ))}

          <div className="menu-item-mdt exit-main" onClick={() => CEF.gui.setGui(null)}>
            <div className="menu-img-mdt">
              <img src={png['exit']} alt="" />
            </div>
            <h1>Exit</h1>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Menu; 