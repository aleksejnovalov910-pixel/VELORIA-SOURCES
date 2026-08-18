import React, { useState, useEffect, useRef } from 'react';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import OmologationForm from './Form';
import { ICarResponse } from '../../../../../shared/mdt';
import { CustomEvent } from '../../../../modules/custom.event';
import { CEF } from '../../../../modules/CEF';
import { startDrawing, draw, clearCanvas } from '../../components/utils/CanvasUtil';

const mockResults: ICarResponse = {
  model: 'ABC123',
  date: new Date(),
  elements: 'glazing',
  proofs: 'url1,url2',
  signature: 'base64-signature',
  plate: 'ABC123',
  name: 'ABC123',
  owner: {
    userId: 1,
    name: 'ABC123'
  }
}

type CarsProps = {
  setVehicleRecord: (vehicle: ICarResponse) => void;
}
const Cars: React.FC<CarsProps> = ({ setVehicleRecord }) => {
  const [searchResult, setSearchResult] = useState<ICarResponse | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const canvasRefCars = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRefCars.current) {
      const canvas = canvasRefCars.current;
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 2;
          ctx.lineJoin = 'round';
          ctx.lineCap = 'round';
        }
      }
    }
  }, [canvasRefCars]);

  const handleBack = () => {
    setShowResults(false);
    setSearchResult(null);
  };

  const handleSearch = async(query: string) => {
    console.log('Searching for:', query);

    const res = await CustomEvent.callServer('Mdt-GetCar', query)
    
    if (res) {
      setSearchResult(res);
      setShowResults(true);
    }
    else {
      CEF.alert.setAlert("error", "Car not found");
    }

    if (CEF.test) {
      setSearchResult(mockResults);
      setShowResults(true);
    }
  }

  return (
    <div className="mdt-section-content section-mandate">
      <div className="mandate">
        {showResults ? (
          <div className="mandate-content">
            <SearchResults
              result={searchResult}
              onBack={handleBack}
              setVehicleRecord={setVehicleRecord}
            />
          </div>
        ) : (
          <div className="mandate-content">
            <h2>Cauta omologari</h2>
            <SearchForm
              onSearch={handleSearch}
            />
          </div>
        )}
      </div>

      <div className="mandate">
        <OmologationForm
          canvasRef={canvasRefCars}
          clearCanvas={clearCanvas}
        />
      </div>
    </div>
  );
};

export default Cars; 