import { useHistoryContext } from '@/context/history-context';
import { useObjectContext } from '@/context/object-context';
import React from 'react';

const Elements: React.FC = () => {
  const { addObject, getNextZIndex } = useObjectContext();
  const { addAction } = useHistoryContext();

  const handleAddShape = (shape: string) => {
    const newObject = {
      id: `${shape}_${Date.now()}`,
      type: shape,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: 30,
      width: 60,
      height: 40,
      text: 'Sample Text',
      zIndex: getNextZIndex(),
    };

    addObject(newObject);
    addAction({ type: 'add', object: newObject });
  };

  return (
    <div className="fixed top-4 left-4 z-10 space-y-2">
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => handleAddShape('circle')}
      >
        Add Circle
      </button>
      <button 
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={() => handleAddShape('rectangle')}
      >
        Add Rectangle
      </button>
      <button 
        className="bg-yellow-500 text-white px-4 py-2 rounded"
        onClick={() => handleAddShape('triangle')}
      >
        Add Triangle
      </button>
      <button 
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={() => handleAddShape('text')}
      >
        Add Text
      </button>
    </div>
  );
};

export default Elements;