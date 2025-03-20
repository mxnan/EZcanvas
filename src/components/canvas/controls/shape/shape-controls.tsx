// src/components/canvas/controls/shape-controls.tsx
import React from "react";
import { fabric } from "fabric";
import { CustomFabricObject } from "@/types/object"; // Import the custom type
import ColorPicker from "../color-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CornerDownLeft } from "lucide-react";

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

  const handleBorderRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeObject instanceof fabric.Rect) {
      const value = parseInt(e.target.value);
      activeObject.set("rx", value);
      activeObject.set("ry", value);
      fabricCanvasRef.current?.renderAll();
    }
  };

  // Only show border radius control for rectangles
  const showBorderRadiusControl = activeObject instanceof fabric.Rect;

  return (
    <div className="p-2">
      <ColorPicker
        currentColor={activeObject.fill as string}
        onChange={handleColorChange}
      />
      {showBorderRadiusControl && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              // style={{ backgroundColor: borderColor }}
            >
              <CornerDownLeft className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="left"
            sideOffset={10}
            className="p-2 w-full flex items-center gap-2"
          >
            <div className="w-full">
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={
                  activeObject instanceof fabric.Rect ? activeObject.rx || 0 : 0
                }
                onChange={handleBorderRadiusChange}
                className="w-32 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Add more shape controls as needed */}
    </div>
  );
};

export default ShapeControls;
