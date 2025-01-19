/* eslint-disable @typescript-eslint/no-explicit-any */
// src/context/ObjectContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ObjectType {
  id: string;
  type: string; // e.g., "shape", "image", "text", etc.
  properties: any; // Define a more specific type based on your needs
}

interface ObjectContextType {
  objects: ObjectType[];
  setObjects: React.Dispatch<React.SetStateAction<ObjectType[]>>;
  addObject: (object: ObjectType) => void;
  clearObjects: () => void;
}

const ObjectContext = createContext<ObjectContextType | undefined>(undefined);

export const ObjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [objects, setObjects] = useState<ObjectType[]>([]);

  const addObject = (object: ObjectType) => {
    setObjects((prev) => [...prev, object]);
  };

  const clearObjects = () => {
    setObjects([]);
  };

  return (
    <ObjectContext.Provider value={{ objects, setObjects, addObject, clearObjects }}>
      {children}
    </ObjectContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useObjects = (): ObjectContextType => {
  const context = useContext(ObjectContext);
  if (!context) {
    throw new Error("useObjects must be used within an ObjectProvider");
  }
  return context;
};