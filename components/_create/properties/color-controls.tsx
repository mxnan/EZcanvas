/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  id: number;
  color: string;
  onTextChange: (id: number, attribute: string, value: any) => void;
}

export const ColorPicker = ({ id, color, onTextChange }: ColorPickerProps) => {
  return (
    <div className="py-6">
      <HexColorPicker
        color={color}
        onChange={(newColor) => onTextChange(id, "color", newColor)}
      />
    </div>
  );
}; 