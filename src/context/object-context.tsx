// src/context/ObjectContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ObjectType {
  id: string;
  type: string; // e.g., "shape", "image", "text", etc.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: any; // Define a more specific type based on your needs
}

interface ObjectContextType {
  objects: ObjectType[];
  setObjects: React.Dispatch<React.SetStateAction<ObjectType[]>>;
}

const ObjectContext = createContext<ObjectContextType | undefined>(undefined);

export const ObjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [objects, setObjects] = useState<ObjectType[]>([]);

  return (
    <ObjectContext.Provider value={{ objects, setObjects }}>
      {children}
    </ObjectContext.Provider>
  );
};

export const useObjects = (): ObjectContextType => {
  const context = useContext(ObjectContext);
  if (!context) {
    throw new Error("useObjects must be used within an ObjectProvider");
  }
  return context;
};