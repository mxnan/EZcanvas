// src/components/canvas/controls/color-picker.tsx
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";

interface ColorPickerProps {
  currentColor: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  currentColor,
  onChange,
}) => {
  const defaultColors = [
    "#000000",
    "#ffffff",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#808080",
    "#800000",
  ];

  const handleColorSelect = (color: string) => {
    onChange(color);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          style={{ backgroundColor: currentColor }}
        />
      </PopoverTrigger>
      <PopoverContent
        side="top"
        sideOffset={10}
        className="p-2 grid grid-cols-3 gap-2 w-36"
      >
        {defaultColors.map((color) => (
          <Button
            key={color}
            variant="outline"
            size="icon"
            style={{ backgroundColor: color }}
            onClick={() => handleColorSelect(color)}
          />
        ))}{" "}
        <input
          type="color"
          value={currentColor}
          onChange={(e) => onChange(e.target.value)}
          className="hidden"
        />
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
