/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState } from 'react';
import { CanvasObject, useObjectContext } from './object-context'; // Import the ObjectContext

// Define types for our history management

interface HistoryAction {
  type: 'add' | 'remove' ;
  object: CanvasObject;
}

// Define the shape of your context
interface HistoryContextType {
  history: HistoryAction[]; // Array to hold history of actions
  currentIndex: number; // Current index in the history
  addAction: (action: HistoryAction) => void; // Function to add an action to history
  undo: () => void; // Function to undo the last action
  redo: () => void; // Function to redo the last undone action
  canUndo: boolean;
  canRedo: boolean;
}

// Create the context
const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

// Create a provider component
export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryAction[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const { addObject, removeObject } = useObjectContext(); // Access ObjectContext functions

  const canUndo = currentIndex >= 0;
  const canRedo = currentIndex < history.length - 1;

  const addAction = (action: HistoryAction) => {
    const updatedHistory = history.slice(0, currentIndex + 1); // Remove future actions
    const newHistory = [...updatedHistory, action];
    console.log('Adding action to history:', action);
    console.log('Current history state:', { 
      historyLength: newHistory.length, 
      currentIndex: currentIndex + 1 
    });
    setHistory(newHistory);
    setCurrentIndex(currentIndex + 1);
  };

  const undo = () => {
    if (!canUndo) return;
    
    const actionToUndo = history[currentIndex];
    console.log('Undoing action:', actionToUndo);
    
    if (actionToUndo.type === 'add') {
      removeObject(actionToUndo.object.id);
    } else if (actionToUndo.type === 'remove') {
      addObject(actionToUndo.object);
    }
    
    setCurrentIndex(currentIndex - 1);
  };
  
  const redo = () => {
    if (!canRedo) return;
    
    const actionToRedo = history[currentIndex + 1];
    console.log('Redoing action:', actionToRedo);
    
    if (actionToRedo.type === 'add') {
      addObject(actionToRedo.object);
    } else if (actionToRedo.type === 'remove') {
      removeObject(actionToRedo.object.id);
    }
    
    setCurrentIndex(currentIndex + 1);
  };
  return (
    <HistoryContext.Provider 
      value={{ 
        history, 
        currentIndex, 
        addAction, 
        undo, 
        redo, 
        canUndo, 
        canRedo 
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

// Custom hook to use the History context
// eslint-disable-next-line react-refresh/only-export-components
export const useHistoryContext = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistoryContext must be used within a HistoryProvider');
  }
  return context;
};