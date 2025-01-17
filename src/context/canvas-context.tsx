// src/context/CanvasContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface CanvasOptions {
  width: number;
  height: number;
  backgroundColor: string;
}

interface CanvasContextType {
  canvasOptions: CanvasOptions;
  setCanvasOptions: React.Dispatch<React.SetStateAction<CanvasOptions>>;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [canvasOptions, setCanvasOptions] = useState<CanvasOptions>({
    width: 800,
    height: 600,
    backgroundColor: "#ffffff",
  });

  return (
    <CanvasContext.Provider value={{ canvasOptions, setCanvasOptions }}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = (): CanvasContextType => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
};