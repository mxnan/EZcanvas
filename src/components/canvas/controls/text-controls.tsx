// src/components/canvas/controls/text-controls.tsx
import React from "react";
import { fabric } from "fabric";
import { CustomFabricObject } from "@/types/object"; // Import the custom type
import ColorPicker from "./color-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TextControlsProps {
  activeObject: CustomFabricObject | null;
  fabricCanvasRef: React.RefObject<fabric.Canvas | null>;
}

const TextControls: React.FC<TextControlsProps> = ({
  activeObject,
  fabricCanvasRef,
}) => {
  if (!activeObject || !(activeObject instanceof fabric.IText)) {
    return null; // Return null if no active text object
  }

  const handleColorChange = (color: string) => {
    activeObject.set({ fill: color });
    fabricCanvasRef.current?.renderAll();
  };

  const handleTextAlign = (alignment: string) => {
    activeObject.set({ textAlign: alignment });
    fabricCanvasRef.current?.renderAll();
  };

  return (
    <div className="p-2 flex flex-col gap-2">
      <ColorPicker
        currentColor={activeObject.fill as string}
        onChange={handleColorChange}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"} size={"icon"}>
            <AlignJustify />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="left"
          sideOffset={10}
          className="w-min flex gap-1 p-2"
        >
          <Button
            onClick={() => handleTextAlign("center")}
            variant={"default"}
            size={"icon"}
          >
            <AlignCenter />{" "}
          </Button>
          <Button
            onClick={() => handleTextAlign("left")}
            variant={"default"}
            size={"icon"}
          >
            <AlignLeft />{" "}
          </Button>
          <Button
            onClick={() => handleTextAlign("right")}
            variant={"default"}
            size={"icon"}
          >
            <AlignRight />{" "}
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TextControls;
