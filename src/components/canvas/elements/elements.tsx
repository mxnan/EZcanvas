import React from "react";
import { useObjects } from "@/context/object-context";
import { fabric } from "fabric";
import { Button } from "@/components/ui/button";
import { CircleX, Type } from "lucide-react";
import ShapesPopover from "./shapes-popover";
import { generateRandomId } from "@/lib/utils";
import { CustomIText } from "@/types/object"; // Import the custom type
// import SvgPopover from "./svg-popover";

interface ElementsProps {
  fabricCanvasRef: React.RefObject<fabric.Canvas | null>; // Define the prop type
}

const Elements: React.FC<ElementsProps> = ({ fabricCanvasRef }) => {
  const { clearObjects, addObject } = useObjects();

  const addText = () => {
    if (fabricCanvasRef.current) {
      const text = new fabric.IText("EDIT THIS", {
        left: 100,
        top: 100,
        fontSize: 40,
        fill: "white",
        // editable: true, // Make the text editable
      }) as CustomIText; // Type assertion to CustomIText

      // Set a unique ID for the text object
      text.id = generateRandomId(); // Now this works without type errors

      fabricCanvasRef.current.add(text);
      fabricCanvasRef.current.setActiveObject(text);
      fabricCanvasRef.current.renderAll();

      // Create ObjectType with the new text's ID
      const objectType = {
        id: text.id, // Use the ID from the text object
        type: "text",
        properties: text,
      };
      addObject(objectType); // Add the new text to the context
    }
  };

  const clearCanvas = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.clear(); // Clear the canvas
      clearObjects(); // Clear the object context
    }
  };

  return (
    <div className="absolute top-2 left-2 p-1 flex items-center justify-center bg-neutral-800 rounded-xl shadow">
      <ShapesPopover fabricCanvasRef={fabricCanvasRef} />
      {/* <SvgPopover fabricCanvasRef={fabricCanvasRef} /> */}
      <Button variant={"outline"} size={"icon"} onClick={addText}>
        <Type />
      </Button>
      <Button
        onClick={clearCanvas}
        variant={"outline"}
        size={"icon"}
        className="hover:bg-red-500/60"
      >
        <CircleX />
      </Button>
    </div>
  );
};

export default Elements;
