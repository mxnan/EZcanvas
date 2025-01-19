// src/context/CanvasContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface CanvasOptions {
  width: number;
  height: number;
}

interface CanvasContextType {
  canvasOptions: CanvasOptions;
  setCanvasOptions: React.Dispatch<React.SetStateAction<CanvasOptions>>;
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
  handleResize: () => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [canvasOptions, setCanvasOptions] = useState<CanvasOptions>({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  
  // Handle window resize
  const handleResize = () => {
    setCanvasOptions({ width: window.innerWidth, height: window.innerHeight });
  };

  // Set up event listener for window resize
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial size
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <CanvasContext.Provider value={{ canvasOptions, setCanvasOptions, zoomLevel, setZoomLevel, handleResize }}>
      {children}
    </CanvasContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCanvas = (): CanvasContextType => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
};