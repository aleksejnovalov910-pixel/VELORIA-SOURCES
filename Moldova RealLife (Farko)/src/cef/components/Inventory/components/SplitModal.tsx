import React, { useState, useEffect } from "react";
import { InventoryItemCef, convertInventoryItemArrayToObject } from "../../../../shared/inventory";
import "./SplitModal.scss";
import { CEF } from "../../../modules/CEF";

// @ts-ignore
const svg = Object.fromEntries(
  Object.entries(import.meta.glob("../images/svg/*.svg", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.svg$/)[1];
      //@ts-ignore
      return [name, value.default];
    },
  ),
);

interface SplitModalProps {
  isOpen: boolean;
  item: InventoryItemCef;
  onClose: () => void;
  onSplit: (amount: number) => void;
}

const mockItem: InventoryItemCef = [
  103, 800, 10, "Asaa", "ASdasd", 
] as unknown as InventoryItemCef;

export const SplitModal: React.FC<SplitModalProps> = ({ isOpen, item, onClose, onSplit }) => {
  const [amount, setAmount] = useState<number>(1);
  
  if (CEF.test) {
    item = mockItem;
  }

  const actualItem = CEF.test && !item ? mockItem : item;
  const itemObj = convertInventoryItemArrayToObject(actualItem);
  const maxAmount = itemObj.count;

  useEffect(() => {
    if (isOpen) {
      setAmount(1);
    }
  }, [isOpen]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      setAmount(1);
    } else {
      setAmount(Math.min(Math.max(1, value), maxAmount - 1));
    }
  };

  const handleIncrement = () => {
    setAmount(prev => Math.min(prev + 1, maxAmount - 1));
  };

  const handleDecrement = () => {
    setAmount(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSplit(amount);
    onClose();
  };

  const shouldShow = CEF.test ? (isOpen || localStorage.getItem('forceOpenSplitModal') === 'true') : isOpen;
  
  if (!shouldShow) return null;

  return (
    <div className="split-modal-overlay">
      <div className="split-modal">
        <div className="split-modal-header">
          <h2>Separa obiectul</h2>
          <button 
            type="button"
            className="close-button"
            onClick={onClose}
          >
            <img 
              tabIndex={-1}
              src={svg.close}
              width="24"
              height="24"
              alt=""
            />
          </button>
        </div>
        
        <div className="split-modal-content">
          <div className="split-modal-item-info">
            <p>Cantitate: {maxAmount}</p>
            <p>Cantitatea de separare:</p>
          </div>
          
          <form onSubmit={handleSubmit} className="split-modal-form">
            <div className="split-modal-input-group">
              <button 
                type="button" 
                className="split-modal-button"
                onClick={handleDecrement}
              >
                -
              </button>
              
              <input
                type="number"
                min={1}
                max={maxAmount - 1}
                value={amount}
                onChange={handleAmountChange}
                className="split-modal-input"
              />
              
              <button 
                type="button" 
                className="split-modal-button"
                onClick={handleIncrement}
              >
                +
              </button>
            </div>
            
            <div className="split-modal-slider">
              <div className="split-modal-range-container">
                <div className="split-modal-range-track">
                  <div 
                    className="split-modal-range-progress"
                    style={{ width: `${((amount - 1) / (maxAmount - 2)) * 100}%` }}
                  ></div>
                </div>
                <input
                  type="range"
                  min={1}
                  max={maxAmount - 1}
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                  className="split-modal-range"
                />
              </div>
              <div className="split-modal-range-labels">
                <span>1</span>
                <span>{maxAmount - 1}</span>
              </div>
            </div>
            
            <div className="split-modal-actions">
              <button 
                type="submit" 
                className="split-modal-submit"
              >
                Separa
              </button>
              
              <button 
                type="button" 
                className="split-modal-cancel"
                onClick={onClose}
              >
                Anuleaza
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
