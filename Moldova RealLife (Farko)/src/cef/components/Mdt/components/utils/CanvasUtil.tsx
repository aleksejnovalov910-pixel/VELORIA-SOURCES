import { RefObject, useEffect } from 'react';

export const setupCanvas = (canvas: HTMLCanvasElement | null): void => {
  if (canvas && canvas.parentElement) {
    const parent = canvas.parentElement;
    const width = parent.offsetWidth;
    const height = parent.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
    }
  }
};

export const startDrawing = (e: React.MouseEvent, ref: RefObject<HTMLCanvasElement>): void => {
  if (!ref.current) return;
  
  const { offsetX, offsetY } = e.nativeEvent;
  const ctx = ref.current.getContext("2d");
  if (ctx) {
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  }
};

export const draw = (e: React.MouseEvent, ref: RefObject<HTMLCanvasElement>, isDrawing: boolean): void => {
  if (!isDrawing || !ref.current) return;
  
  const { offsetX, offsetY } = e.nativeEvent;
  const ctx = ref.current.getContext("2d");
  if (ctx) {
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  }
};

export const clearCanvas = (ref: RefObject<HTMLCanvasElement>): void => {
  const canvas = ref.current;
  if (canvas) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
};

export const useCanvasSetup = (
  canvasRefs: RefObject<HTMLCanvasElement>[]
): void => {
  useEffect(() => {
    canvasRefs.forEach(ref => {
      if (ref.current) {
        setupCanvas(ref.current);
      }
    });

    const handleResize = () => {
      canvasRefs.forEach(ref => {
        if (ref.current) {
          setupCanvas(ref.current);
        }
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasRefs]);
}; 