import React from "react";
import { useObjects } from "@/context/object-context";
import { fabric } from "fabric";
import { FileImage, Layers, Shapes, Type } from "lucide-react"; // Import icons for shapes
import { Button } from "../../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

interface ObjectCounterProps {
  fabricCanvasRef: React.RefObject<fabric.Canvas | null>;
}

const ObjectCounter: React.FC<ObjectCounterProps> = ({ fabricCanvasRef }) => {
  const { objects } = useObjects(); // Access the objects from context
  const handleObjectClick = (objectId: string) => {
    const object = fabricCanvasRef.current
      ?.getObjects()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .find((obj) => (obj as any).id === objectId);
    if (object) {
      fabricCanvasRef.current?.setActiveObject(object);
      fabricCanvasRef.current?.renderAll();
    } else {
      console.warn(`Object with ID ${objectId} not found.`);
    }
  };

  const iconMap: { [key: string]: React.ReactNode } = {
    shape: <Shapes />,
    text: <Type />,
    image: <FileImage />,
    // Add more mappings as needed
  };

  return (
    <div className="fixed bottom-2 left-2 p-2 rounded shadow flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            size={"sm"}
            disabled={objects.length === 0}
          >
            <Layers /> {/* Icon for the object count */}
            <span className="ml-1 font-bold">{objects.length}</span>{" "}
            {/* Display object count */}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          sideOffset={10}
          className="p-2 w-48 max-h-40 overflow-y-auto"
        >
          <div className="grid grid-cols-4 gap-2">
            {objects.map((object) => (
              <Button
                key={object.id}
                variant={"outline"}
                size={"icon"}
                onClick={() => handleObjectClick(object.id)}
                className="flex items-center justify-center"
              >
                {iconMap[object.type] || object.type}{" "}
                {/* Display the icon or type if icon is not available */}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ObjectCounter;
