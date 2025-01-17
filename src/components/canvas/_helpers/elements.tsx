import { useHistoryContext } from '@/context/history-context';
import { useObjectContext } from '@/context/object-context';
import React from 'react';

const Elements: React.FC = () => {
  const { addObject, getNextZIndex } = useObjectContext();
  const { addAction } = useHistoryContext();

  const handleAddShape = (shape: string) => {
    let newObject;

    switch (shape) {
      case 'circle':
        newObject = {
          id: `circle_${Date.now()}`,
          type: 'circle',
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          radius: 50, // Default radius for circles
          zIndex: getNextZIndex(),
        };
        break;

      case 'rectangle':
        newObject = {
          id: `rectangle_${Date.now()}`,
          type: 'rectangle',
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          width: 100, // Default width for rectangles
          height: 100, // Default height for rectangles
          zIndex: getNextZIndex(),
        };
        break;

      case 'triangle':
        newObject = {
          id: `triangle_${Date.now()}`,
          type: 'triangle',
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          width: 100, // Default width for triangles
          height: 100, // Default height for triangles
          zIndex: getNextZIndex(),
        };
        break;

      case 'text':
        newObject = {
          id: `text_${Date.now()}`,
          type: 'text',
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          text: 'Hello', // Default text
          fontSize: 40, // Default font size
          zIndex: getNextZIndex(),
        };
        break;

      default:
        return; // Exit if shape type is not recognized
    }

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