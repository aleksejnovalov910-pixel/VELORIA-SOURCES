import React, { useState, useCallback, useRef, useEffect } from 'react';
import { CustomEvent } from '../../../../modules/custom.event';
import { CEF } from '../../../../modules/CEF';
import { ICriminal, ICitizen } from '../../../../../shared/mdt';
import { FormTextArea } from '../Mandates/form';

interface CriminalFormProps {
  onCancel: () => void;
  selectedCitizen: ICitizen;
}

export const validateImages = (proofs: string) => {
  if (!proofs.trim()) {
    CEF.alert.setAlert('error', 'Proofs are required');
    return false;
  }

  const images = proofs.split(',').map(img => img.trim());

  if (images.length === 0) {
    CEF.alert.setAlert('error', 'At least one image proof is required');
    return false;
  }

  for (const image of images) {


    if (!image.includes('imgur.com')) {
      CEF.alert.setAlert('error', 'Only Imgur links are allowed');
      return false;
    }

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const hasValidExtension = imageExtensions.some(ext => image.toLowerCase().endsWith(ext));

    if (!hasValidExtension) {
      CEF.alert.setAlert('error', 'Image links must end with a valid image extension (.jpg, .jpeg, .png, .gif, .webp)');
      return false;
    }
  }

  return true;
}

const Form: React.FC<CriminalFormProps> = ({
  onCancel,
  selectedCitizen,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [formData, setFormData] = useState<ICriminal>({
    userId: selectedCitizen.userId,
    description: '',
    proofs: '',
    signature: '',
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const container = canvas.parentElement;
        if (container) {
          canvas.width = container.clientWidth;
          canvas.height = container.clientHeight;
        }
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
      }
    }
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

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
  }, []);

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
  }, [isDrawing]);

  const handleStopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const getSignatureData = useCallback((): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const dataUrl = canvas.toDataURL('image/png');
    return dataUrl;
  }, []);

  const validateSignature = useCallback((): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    for (let i = 3; i < imageData.length; i += 4) {
      if (imageData[i] > 0) {
        return true; // If at least one non-transparent pixel is found
      }
    }

    return false; // No signature found
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.userId || !formData.description) {
      CEF.alert.setAlert('error', 'CNP and description are required');
      return;
    }

    if (formData.description && formData.description.length > 300) {
      CEF.alert.setAlert('error', 'Description must be less than 300 characters');
      return;
    }

    const proofsValidation = validateImages(formData.proofs);

    if (!proofsValidation) {
      return;
    }

    if (!validateSignature()) {
      CEF.alert.setAlert('error', 'Signature is required');
      return;
    }

    setIsSubmitting(true);

    const signatureData = getSignatureData();
    if (!signatureData) {
      CEF.alert.setAlert('error', 'Failed to get signature data');
      setIsSubmitting(false);
      return;
    }

    const recordData: ICriminal = {
      userId: formData.userId,
      description: formData.description,
      proofs: formData.proofs,
      signature: signatureData,
    };

    if (CEF.test) {
      setTimeout(() => {
        handleCancel();
        setIsSubmitting(false);
        CEF.alert.setAlert('success', 'Criminal record added successfully');
      }, 800);
    }

    CustomEvent.callServer('Mdt-CriminalRecordAdd', JSON.stringify(recordData))
      .then((response) => {
        handleCancel();
        console.log('Criminal record added successfully:', response);
      })
      .catch((error) => {
        console.error('Error adding criminal record:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleCancel = () => {
    setFormData({
      userId: 0,
      description: '',
      proofs: '',
      signature: '',
    });
    clearCanvas();
    onCancel();
  };

  return (
    <div className="mandate-content mdt_criminal-form " >
      <h2>Create a Criminal Record</h2>
      <div className="criminal-form-img">
        <img src={CEF.getPassportImageURL(`${selectedCitizen.userId}_passport`)} alt="Citizen" />
        {selectedCitizen.name || "Nick Gross"}
      </div>

      <span>CNP</span>
      <input
        type="text"
        placeholder="Enter CNP"
        name="userId"
        value={formData.userId}
        onChange={handleInputChange}
      />
      <FormTextArea
        label="Description"
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
        onClick={clearCanvas}
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

export default Form; 