import React, { RefObject, useState, useCallback } from 'react';
import { CustomEvent } from '../../../../modules/custom.event';
import { CEF } from '../../../../modules/CEF';
import { validateImages } from '../CriminalRecord/form';
import { Incident } from '../../../../../shared/mdt';
import { FormTextArea } from '../Mandates/form';

interface IncidentFormProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  clearCanvas: () => void;
}

interface ParsedPersonsResult {
  isValid: boolean;
  parsedPersons?: string[];
  errorMessage?: string;
}

interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  parsedData?: Record<string, any>;
}

// Хук для работы с подписью на холсте
const useSignatureCanvas = (canvasRef: RefObject<HTMLCanvasElement>, clearCanvasFn: () => void) => {
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
    clearCanvasFn();
  }, [clearCanvasFn]);

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
        return true; // Если найден хотя бы один непрозрачный пиксель
      }
    }

    return false; // Подпись не найдена
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

const IncidentForm: React.FC<IncidentFormProps> = ({
  canvasRef,
  clearCanvas,
}) => {
  const initialFormState: Incident = {
    orderTime: '',
    // @ts-ignore
    personsInvolved: '',
    // @ts-ignore
    policeOfficersInvolved: '',
    vehiclesInvolved: "",
    description: '',
    proofs: '',
    signature: ''
  };

  const [formData, setFormData] = useState<Incident>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleStartDrawing,
    handleDraw,
    handleStopDrawing,
    handleClearCanvas,
    getSignatureData,
    validateSignature
  } = useSignatureCanvas(canvasRef, clearCanvas);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePersons = useCallback((personsInput: string): ParsedPersonsResult => {
    if (personsInput.trim() === '') {
      return { isValid: false, errorMessage: 'Field is required' };
    }

    // Split by spaces or commas and filter out empty strings
    const playerIds = personsInput.split(/[\s,]+/).filter(id => id.trim() !== '');
    
    if (playerIds.length === 0) {
      return {
        isValid: false,
        errorMessage: 'At least one player ID is required'
      };
    }

    // Validate each ID is a valid number
    const invalidIds = playerIds.filter(id => !/^\d+$/.test(id));
    if (invalidIds.length > 0) {
      return {
        isValid: false,
        errorMessage: `Invalid player IDs: ${invalidIds.join(', ')}. Only numeric IDs are allowed`
      };
    }

    return {
      isValid: true,
      parsedPersons: playerIds
    };
  }, []);

  const validateForm = useCallback((form: Incident): FormValidationResult => {
    const result: FormValidationResult = {
      isValid: true,
      errors: {},
      parsedData: {
        orderTime: form.orderTime,
        vehiclesInvolved: form.vehiclesInvolved,
        description: form.description,
        proofs: form.proofs
      }
    };

    if (!form.orderTime.trim()) {
      result.errors.orderTime = 'Order time is required';
      result.isValid = false;
    }

    if (form.personsInvolved) {
      const personsValidation = validatePersons(Array.isArray(form.personsInvolved) ? form.personsInvolved.join(' ') : form.personsInvolved);
      if (!personsValidation.isValid) {
        result.errors.personsInvolved = personsValidation.errorMessage || 'Invalid player IDs format';
        result.isValid = false;
      } else if (personsValidation.parsedPersons) {
        if (result.parsedData) {
          result.parsedData.personsInvolved = personsValidation.parsedPersons;
        }
      }
    }

    if (form.policeOfficersInvolved) {
      const officersValidation = validatePersons(Array.isArray(form.policeOfficersInvolved) ? form.policeOfficersInvolved.join(' ') : form.policeOfficersInvolved);
      if (!officersValidation.isValid) {
        result.errors.policeOfficersInvolved = officersValidation.errorMessage || 'Invalid officers format';
        result.isValid = false;
      } else if (officersValidation.parsedPersons) {
        if (result.parsedData) {
          result.parsedData.policeOfficersInvolved = officersValidation.parsedPersons;
        }
      }
    }

    if (!form.description.trim()) {
      result.errors.description = 'Description is required';
      result.isValid = false;
    }

    if (form.description && form.description.length > 450) {
      result.errors.description = 'Description must be less than 450 characters';
      result.isValid = false;
    }

    if (!validateImages(form.proofs)) {
      result.isValid = false;
    }

    // Проверка подписи
    if (!validateSignature()) {
      result.errors.signature = 'Signature is required';
      result.isValid = false;
    }

    return result;
  }, [validatePersons, validateSignature]);

  const handleSubmit = useCallback(() => {
    setIsSubmitting(true);

    const validation = validateForm(formData);

    if (!validation.isValid) {
      const firstErrorKey = Object.keys(validation.errors)[0];
      if (firstErrorKey) {
        CEF.alert.setAlert('error', validation.errors[firstErrorKey]);
      } else {
        CEF.alert.setAlert('error', 'Please check the form for errors');
      }
      setIsSubmitting(false);
      return;
    }

    // Получаем данные подписи в формате base64
    const signatureData = getSignatureData();
    if (!signatureData) {
      CEF.alert.setAlert('error', 'Failed to get signature data');
      setIsSubmitting(false);
      return;
    }

    // Добавляем подпись в отправляемые данные
    if (validation.parsedData) {
      validation.parsedData.signature = signatureData;
    }

    CustomEvent.callServer('Mdt-AddIncident', JSON.stringify(validation.parsedData))
      .then((response) => {
        handleCancel();
        console.log('Incident added successfully:', response);
      })
      .catch((error) => {
        console.error('Error adding incident:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }, [formData, validateForm, getSignatureData]);

  const handleCancel = useCallback(() => {
    setFormData(initialFormState);
    handleClearCanvas();
  }, [initialFormState, handleClearCanvas]);

  return (
    <div className="mandate-content">
      <h2>Create an Incident</h2>

      <span>Incident title</span>
      <input
        type="text"
        placeholder="Enter the value"
        name="title"
        value={formData.orderTitle}
        onChange={handleInputChange}
      />

      <span>Order time</span>
      <input
        type="datetime-local"
        placeholder="Enter the value"
        name="orderTime"
        value={formData.orderTime}
        onChange={handleInputChange}
      />

      <span>Persons involved</span>
      <input
        type="text"
        placeholder="Enter player IDs (separated by spaces or commas)"
        name="personsInvolved"
        value={formData.personsInvolved}
        onChange={handleInputChange}
      />

      <span>Police officers involved</span>
      <input
        type="text"
        placeholder="Enter officer IDs (separated by spaces or commas)"
        name="policeOfficersInvolved"
        value={formData.policeOfficersInvolved}
        onChange={handleInputChange}
      />

      <span>Vehicles involved</span>
      <input
        type="text"
        placeholder="Enter vehicles names"
        name="vehiclesInvolved"
        value={formData.vehiclesInvolved}
        onChange={handleInputChange}
      />

      <FormTextArea
        label="Description"
        placeholder="Enter description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
      />

      <span>Proofs</span>
      <input
        type="text"
        placeholder="Enter proofs(imgur.com/...)"
        name="proofs"
        value={formData.proofs}
        onChange={handleInputChange}
      />

      {/* Signature */}
      <span>Signature</span>
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
        Clean
      </button>
      <div className="mandate-controls">
        <button
          type="button"
          className="create"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create'}
        </button>
        <button
          type="button"
          className="cancel"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default IncidentForm; 