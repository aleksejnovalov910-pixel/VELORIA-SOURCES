import React, { RefObject, useState, useCallback, useMemo } from 'react';
import location from '../../assets/img/location.png';
import { CustomEvent } from '../../../../modules/custom.event';
import { CEF } from '../../../../modules/CEF';
import { IMandate, MandateType } from '../../../../../shared/mdt';
import { validateImages } from '../CriminalRecord/form';

interface MandateFormProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  clearCanvas: (ref: RefObject<HTMLCanvasElement>) => void;
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

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}

export const FormTextArea: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = "Enter the value",
  className = ""
}) => (
  <>
    <span>{label}</span>
    <textarea
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      className={className}
    />
  </>
);

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = "Enter the value",
  type = "text",
  className = ""
}) => (
  <>
    <span>{label}</span>
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      className={className}
    />
  </>
);

const AddressField: React.FC<FormFieldProps> = (props) => (
  <>
    <span>{props.label}</span>
    <div className="section-address">
      <input
        type={props.type}
        placeholder={props.placeholder}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        className={props.className}
      />
      <img src={location} alt="Location" />
    </div>
  </>
);

const OrderTypeCheckbox: React.FC<{
  type: MandateType;
  isChecked: boolean;
  onChange: (type: MandateType) => void;
  label: string;
}> = ({ type, isChecked, onChange, label }) => (
  <label className="checkbox-container">
    <input
      type="checkbox"
      checked={isChecked}
      onChange={() => onChange(type)}
    />
    <span className="checkmark"></span>
    <h5>{label}</h5>
  </label>
);

const useFormState = (initialState: IMandate) => {
  const [formData, setFormData] = useState<IMandate>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'personsInvolved') {
      setFormData(prev => ({
        ...prev,
        personsInvolved: [value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, []);

  const handleOrderTypeChange = useCallback((type: MandateType) => {
    setFormData(prev => ({
      ...prev,
      orderType: type
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialState);
  }, [initialState]);

  return {
    formData,
    isSubmitting,
    setIsSubmitting,
    handleInputChange,
    handleOrderTypeChange,
    resetForm,
    setFormData
  };
};

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

const MandateForm: React.FC<MandateFormProps> = ({
  canvasRef,
  clearCanvas,
}) => {
  const initialFormState: IMandate = useMemo(() => ({
    orderTime: '',
    personsInvolved: [''],
    orderType: MandateType.SEARCH,
    address: '',
    description: '',
    proofs: '',
    signature: '',
    orderTitle: ''
  }), []);

  const {
    formData,
    isSubmitting,
    setIsSubmitting,
    handleInputChange,
    handleOrderTypeChange,
    resetForm,
    setFormData
  } = useFormState(initialFormState);

  const {
    handleStartDrawing,
    handleDraw,
    handleStopDrawing,
    handleClearCanvas,
    getSignatureData,
    validateSignature
  } = useSignatureCanvas(canvasRef, clearCanvas);

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

  const validateForm = useCallback((form: IMandate): FormValidationResult => {
    const result: FormValidationResult = {
      isValid: true,
      errors: {},
      parsedData: {
        orderTime: form.orderTime,
        address: form.address,
        description: form.description,
        proofs: form.proofs,
        orderType: form.orderType,
        orderTitle: form.orderTitle,
        signature: form.signature
      }
    };

    if (!form.orderTitle.trim()) {
      result.errors.orderTitle = 'Order title is required';
      result.isValid = false;
    }

    if (!form.orderTime) {
      result.errors.orderTime = 'Order time is required';
      result.isValid = false;
    }

    const personsInput = Array.isArray(form.personsInvolved) ? form.personsInvolved[0] || '' : '';
    const personsValidation = validatePersons(personsInput);
    if (!personsValidation.isValid) {
      result.errors.personsInvolved = personsValidation.errorMessage || 'Invalid player IDs format';
      result.isValid = false;
    } else if (personsValidation.parsedPersons && result.parsedData) {
      result.parsedData.personsInvolved = personsValidation.parsedPersons;
    }

    if (!form.orderType) {
      result.errors.orderType = 'At least one order type must be selected';
      result.isValid = false;
    }

    if (!form.address.trim()) {
      result.errors.address = 'Address is required';
      result.isValid = false;
    }

    if (form.address && form.address.length > 300) {
      result.errors.address = 'Address must be less than 300 characters';
      result.isValid = false;
    }

    if (!validateImages(form.proofs)) {
      result.errors.proofs = 'Proofs are required';
      result.isValid = false;
    }

    if (!validateSignature()) {
      result.errors.signature = 'Signature is required';
      result.isValid = false;
    }

    return result;
  }, [validatePersons, validateSignature]);

  const handleCancel = useCallback(() => {
    setFormData({
      orderTime: '',
      personsInvolved: [''],
      orderType: MandateType.SEARCH,
      address: '',
      description: '',
      proofs: '',
      signature: '',
      orderTitle: ''
    });
    handleClearCanvas();
  }, [handleClearCanvas]);

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

    const signatureData = getSignatureData();
    if (!signatureData) {
      CEF.alert.setAlert('error', 'Failed to get signature data');
      setIsSubmitting(false);
      return;
    }

    if (validation.parsedData) {
      validation.parsedData.signature = signatureData;
    }
    console.log(validation.parsedData);

    CustomEvent.callServer('Mdt-AddMandate', JSON.stringify(validation.parsedData))
      .then((response) => {
        handleCancel();
        console.log('Mandate added successfully:', response);
      })
      .catch((error) => {
        console.error('Error adding mandate:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }, [formData, validateForm, getSignatureData, setIsSubmitting, handleCancel]);

  return (
    <div className="mandate-content">
      <h2>Create an order</h2>

      <FormField
        label="Order title"
        name="orderTitle"
        value={formData.orderTitle}
        onChange={handleInputChange}
      />

      <FormField
        label="Order time"
        name="orderTime"
        value={formData.orderTime}
        onChange={handleInputChange}
        type="datetime-local"
      />

      <FormField
        label="Persons involved"
        name="personsInvolved"
        value={Array.isArray(formData.personsInvolved) ? formData.personsInvolved[0] || '' : ''}
        onChange={handleInputChange}
        placeholder="Enter player IDs (separated by spaces or commas)"
      />

      <div className="order-type">
        <h3>Order type</h3>

        <OrderTypeCheckbox
          type={MandateType.SEARCH}
          isChecked={formData.orderType === MandateType.SEARCH}
          onChange={handleOrderTypeChange}
          label="Search"
        />

        <OrderTypeCheckbox
          type={MandateType.ARREST}
          isChecked={formData.orderType === MandateType.ARREST}
          onChange={handleOrderTypeChange}
          label="Arrest"
        />

        <OrderTypeCheckbox
          type={MandateType.CAUTION}
          isChecked={formData.orderType === MandateType.CAUTION}
          onChange={handleOrderTypeChange}
          label="Caution"
        />
      </div>

      <AddressField
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleInputChange}
      />

      <FormTextArea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
      />

      <FormField
        label="Proofs"
        name="proofs"
        value={formData.proofs}
        onChange={handleInputChange}
        placeholder="Enter proofs(imgur.com/...)"
      />

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

export default MandateForm;
