import React, { RefObject, useCallback, useState } from 'react';
import { ICarForm } from '../../../../../shared/mdt';
import { CustomEvent } from '../../../../modules/custom.event';
import { CEF } from '../../../../modules/CEF';
import { validateImages } from '../CriminalRecord/form';

interface OmologationFormProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  clearCanvas: (ref: RefObject<HTMLCanvasElement>) => void;
}

interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  parsedData?: Record<string, any>;
}

const useSignatureCanvas = (canvasRef: RefObject<HTMLCanvasElement>, clearCanvasFn: (ref: RefObject<HTMLCanvasElement>) => void) => {
  const [isDrawing, setIsDrawing] = useState(false);

  const handleStartDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
  }, [canvasRef]);

  const handleDraw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  }, [canvasRef, isDrawing]);

  const handleStopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const handleClearCanvas = useCallback(() => {
    if (canvasRef.current) {
      clearCanvasFn(canvasRef);
    }
  }, [canvasRef, clearCanvasFn]);

  const getSignatureData = useCallback((): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const dataUrl = canvas.toDataURL('image/png');
    return dataUrl;
  }, [canvasRef]);

  const validateSignature = useCallback((): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    for (let i = 3; i < imageData.length; i += 4) {
      if (imageData[i] > 0) {
        return true;
      }
    }

    return false;
  }, [canvasRef]);

  return {
    isDrawing,
    handleStartDrawing,
    handleDraw,
    handleStopDrawing,
    handleClearCanvas,
    getSignatureData,
    validateSignature
  };
};

const OmologationForm: React.FC<OmologationFormProps> = ({
  canvasRef,
  clearCanvas
}) => {

  const [formData, setFormData] = useState<ICarForm>({
    plate: '',
    elements: {
      glazing: false,
      xenon: false,
      neon: false
    },
    proofs: '',
    signature: ''
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (element: "glazing" | "xenon" | "neon") => {
    setFormData(prev => ({
      ...prev,
      elements: {
        ...prev.elements,
        [element]: !prev.elements[element]
      }
    }));
  };

  const {
    handleStartDrawing,
    handleDraw,
    handleStopDrawing,
    handleClearCanvas,
    getSignatureData,
    validateSignature
  } = useSignatureCanvas(canvasRef, clearCanvas);

  const validateForm = useCallback((form: ICarForm): FormValidationResult => {
    const result: FormValidationResult = {
      isValid: true,
      errors: {},
      parsedData: { ...form }
    };

    if (!form.plate.trim()) {
      result.errors.plate = 'Numar inmatriculare';
      result.isValid = false;
    }
    
    if (!validateImages(form.proofs)) {
      result.isValid = false;
    }

    if (!validateSignature()) {
      result.errors.signature = 'Semneaza';
      result.isValid = false;
    }

    return result;
  }, [validateSignature]);

  const handleSubmit = () => {
    setIsSubmitting(true);

    const validation = validateForm(formData);

    if (!validation.isValid) {
      // CEF.alert.setAlert('error', 'Form validation failed');
      setIsSubmitting(false);
      return;
    }

    const signatureData = getSignatureData();
    if (!signatureData) {
      console.error('Failed to get signature data');
      setIsSubmitting(false);
      return;
    }

    if (validation.parsedData) {
      validation.parsedData.signature = signatureData;
    }

    console.log('Submitting form data:', validation.parsedData);

    CustomEvent.callServer('Mdt-AddCar', JSON.stringify(validation.parsedData))
      .then((response) => {
        CEF.alert.setAlert('success', 'Omologare cu succes');
        setIsSubmitting(false);
        handleCancel();
      })
      .catch((error) => {
        setIsSubmitting(false);
        CEF.alert.setAlert('error', 'Omologarea nu a fost creata');
      });

  };

  const handleCancel = () => {
    setFormData({
      plate: '',
      elements: {
        glazing: false,
        xenon: false,
        neon: false
      },
      proofs: '',
      signature: ''
    });
    handleClearCanvas();
  };

  return (
    <div className="mandate-content">
      <h2>Omologari</h2>
      <span>Numar inmatriculare</span>
      <input
        type="text"
        placeholder="Nr. inmatriculare"
        name="plate"
        value={formData.plate}
        onChange={handleInputChange}
      />

      <div className="order-type">
        <h3>Elemente omologate</h3>

        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={formData.elements.glazing}
            onChange={() => handleCheckboxChange('glazing')}
          />
          <span className="checkmark"></span>
          <h5>Glazing</h5>
        </label>

        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={formData.elements.xenon}
            onChange={() => handleCheckboxChange('xenon')}
          />
          <span className="checkmark"></span>
          <h5>Xenon</h5>
        </label>

        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={formData.elements.neon}
            onChange={() => handleCheckboxChange('neon')}
          />
          <span className="checkmark"></span>
          <h5>Neon</h5>
        </label>
      </div>

      <span>Imagini vehicul</span>
      <input
        type="text"
        placeholder="link-uri care se termina in .png/.jpg separate prin virgula"
        name="proofs"
        value={formData.proofs}
        onChange={handleInputChange}
      />

      {/* Signature */}
      <span>Semnatura</span>
      <div className="write-signature">
        <canvas
          ref={canvasRef}
          className="sigCanvas"
          onMouseDown={handleStartDrawing}
          onMouseMove={handleDraw}
          onMouseUp={handleStopDrawing}
          onMouseLeave={handleStopDrawing}
        ></canvas>
      </div>

      <button
        type="button"
        className="clean"
        onClick={handleClearCanvas}
      >
        Sterge
      </button>
      <div className="mandate-controls">
        <button
          type="button"
          className="create"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Se creaza...' : 'Creaza'}
        </button>
        <button
          type="button"
          className="cancel"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Anuleaza
        </button>
      </div>
    </div>
  );
};

export default OmologationForm; 