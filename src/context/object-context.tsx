/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState } from 'react';

export interface CanvasObject {
  id: string;
  type: string;
  x: number;
  y: number;
  radius?: number; // Optional for circles
  width?: number; // Optional for rectangles and triangles
  height?: number; // Optional for rectangles and triangles
  text?: string; // Optional for text objects
  fontSize?: number; // Optional for text objects
  zIndex: number;
  rotation?: number; // Add rotation property
}

interface ObjectContextType {
  objects: CanvasObject[];
  setObjects: React.Dispatch<React.SetStateAction<CanvasObject[]>>;
  addObject: (object: CanvasObject) => void;
  removeObject: (id: string) => void;
  getNextZIndex: () => number;
}

const ObjectContext = createContext<ObjectContextType | undefined>(undefined);

export const ObjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [objects, setObjects] = useState<CanvasObject[]>([]);

  const getNextZIndex = () => objects.length;

  const addObject = (object: CanvasObject) => {
    const newObject = {
      ...object,
      zIndex: object.zIndex ?? getNextZIndex(),
    };
    console.log('Adding object:', newObject);
    setObjects(prevObjects => [...prevObjects, newObject]);
  };

  const removeObject = (id: string) => {
    console.log('Removing object with ID:', id);
    setObjects(prevObjects => prevObjects.filter(obj => obj.id !== id));
  };

  return (
    <ObjectContext.Provider value={{ 
      objects,
      setObjects, 
      addObject, 
      removeObject,
      getNextZIndex 
    }}>
      {children}
    </ObjectContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useObjectContext = () => {
  const context = useContext(ObjectContext);
  if (!context) {
    throw new Error('useObjectContext must be used within an ObjectProvider');
  }
  return context;
};