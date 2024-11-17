/* eslint-disable @typescript-eslint/no-explicit-any */
// components/TextCustomizer.tsx
import React from 'react';

interface TextCustomizerProps {
  textSet: any;
  onTextChange: (id: number, attribute: string, value: any) => void;
  onDelete: (id: number) => void;
}

const TextCustomizer: React.FC<TextCustomizerProps> = ({ textSet, onTextChange, onDelete }) => {
  const handleChange = (attribute: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.target.value;
    onTextChange(textSet.id, attribute, value);
  };

  return (
    <div className="p-4 border rounded mb-2">
      <input
        type="text"
        value={textSet.text}
        onChange={handleChange('text')}
        placeholder="Edit Text"
      />
      <input
        type="color"
        value={textSet.color}
        onChange={handleChange('color')}
      />
      <input
        type="number"
        value={textSet.fontSize}
        onChange={handleChange('fontSize')}
      />
      {/* Add other controls as needed, such as for font, position, rotation */}
      <button onClick={() => onDelete(textSet.id)}>Remove</button>
    </div>
  );
};

export default TextCustomizer;
