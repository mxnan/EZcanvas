import Konva from 'konva';
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

// Define the shape of your context
interface CanvasContextType {
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
  stageRef: React.RefObject<Konva.Stage>;
  handleResize: () => void; // Add handleResize to the context
}

// Create the context
const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

// Create a provider component
export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const stageRef = useRef<Konva.Stage | null>(null);

  // Handle window resize
  const handleResize = () => {
    if (stageRef.current) {
      stageRef.current.width(window.innerWidth);
      stageRef.current.height(window.innerHeight);
    }
  };

  // Set up event listener for window resize
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial size
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <CanvasContext.Provider value={{ zoomLevel, setZoomLevel, stageRef, handleResize }}>
      {children}
    </CanvasContext.Provider>
  );
};

// Custom hook to use the Canvas context
// eslint-disable-next-line react-refresh/only-export-components
export const useCanvasContext = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvasContext must be used within a CanvasProvider');
  }
  return context;
};