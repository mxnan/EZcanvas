// src/components/canvas/controls/shape-controls.tsx
import React from "react";
import { fabric } from "fabric";
import { CustomFabricObject } from "@/types/object"; // Import the custom type
import ColorPicker from "./color-picker";

interface ShapeControlsProps {
  activeObject: CustomFabricObject | null;
  fabricCanvasRef: React.RefObject<fabric.Canvas | null>;
}

const ShapeControls: React.FC<ShapeControlsProps> = ({
  activeObject,
  fabricCanvasRef,
}) => {
  if (
    !activeObject ||
    !(
      activeObject instanceof fabric.Path ||
      activeObject instanceof fabric.Rect ||
      activeObject instanceof fabric.Circle ||
      activeObject instanceof fabric.Ellipse ||
      activeObject instanceof fabric.Triangle
    )
  ) {
    return null; // Return null if no active shape object
  }
  const handleColorChange = (color: string) => {
    activeObject.set({ fill: color });
    fabricCanvasRef.current?.renderAll();
  };

  return (
    <div className="p-2">
      <ColorPicker
        currentColor={activeObject.fill as string}
        onChange={handleColorChange}
      />
      {/* <h3>Shape Controls</h3>
      <label>
        Fill Color:
        <input
          type="color"
          value={activeObject.fill as string} // Type assertion to ensure value is a string
          onChange={(e) => {
            activeObject.set({ fill: e.target.value });
            fabricCanvasRef.current?.renderAll();
          }}
        />
      </label> */}
      {/* Add more shape controls as needed */}
    </div>
  );
};

export default ShapeControls;
