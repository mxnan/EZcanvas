import React from "react";
import { useObjects } from "@/context/object-context";
import { fabric } from "fabric";
import {
  Layers,
  Shapes,
  FileText,
  Star,
  Triangle,
  Circle,
  RectangleEllipsis,
  RectangleHorizontal,
} from "lucide-react"; // Remove unused imports
import { Button } from "../../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CustomFabricObject } from "@/types/object"; // Add type import

interface ObjectCounterProps {
  fabricCanvasRef: React.RefObject<fabric.Canvas | null>;
}

// Add these type definitions
interface FabricImage extends fabric.Image {
  getSrc(): string;
}

interface ObjectPreview {
  id: string;
  type: string;
  properties: CustomFabricObject;
}

const ObjectCounter: React.FC<ObjectCounterProps> = ({ fabricCanvasRef }) => {
  const { objects } = useObjects();

  // Add this function to get the latest canvas object
  const getLatestCanvasObject = (objectId: string) => {
    fabricCanvasRef.current?.renderAll();
    return fabricCanvasRef.current
      ?.getObjects()
      .find(
        (obj) => (obj as CustomFabricObject).id === objectId
      ) as CustomFabricObject;
  };

  const handleObjectClick = (objectId: string) => {
    const object = fabricCanvasRef.current
      ?.getObjects()
      .find((obj) => (obj as CustomFabricObject).id === objectId);

    if (object) {
      fabricCanvasRef.current?.setActiveObject(object);
      fabricCanvasRef.current?.renderAll();
    } else {
      console.warn(`Object with ID ${objectId} not found.`);
    }
  };

  const renderObjectPreview = (object: ObjectPreview) => {
    switch (object.type) {
      case "image": {
        return (
          <img
            src={(object.properties as unknown as FabricImage).getSrc()}
            alt="Object Preview"
            className="w-8 h-8 object-cover rounded"
          />
        );
      }

      case "text": {
        return <FileText className="w-6 h-6" />;
      }

      case "shape": {
        const shapeType =
          object.properties instanceof fabric.Rect
            ? "Rectangle"
            : object.properties instanceof fabric.Circle
            ? "Circle"
            : object.properties instanceof fabric.Ellipse
            ? "Ellipse"
            : object.properties instanceof fabric.Triangle
            ? "Triangle"
            : "Shape";
        const shapeColor = String(object.properties.fill || "currentColor");
        switch (shapeType) {
          case "Rectangle":
            return (
              <RectangleHorizontal
                className="w-6 h-6"
                style={{ color: shapeColor }}
              />
            );
          case "Circle":
            return <Circle className="w-6 h-6" style={{ color: shapeColor }} />;
          case "Ellipse":
            return (
              <RectangleEllipsis
                className="w-6 h-6"
                style={{ color: shapeColor }}
              />
            );
          case "Triangle":
            return (
              <Triangle className="w-6 h-6" style={{ color: shapeColor }} />
            );
          default:
            return <Star className="w-6 h-6" style={{ color: shapeColor }} />;
        }
      }

      default:
        return <Shapes className="w-6 h-6" />;
    }
  };

  const renderTooltipContent = (object: ObjectPreview) => {
    // Get the latest canvas object
    const latestObject = getLatestCanvasObject(object.id);

    if (object.type === "text") {
      const textObject = latestObject as unknown as fabric.IText;
      return (
        <div className="flex flex-col items-center gap-1">
          <p
            className="text-xs font-medium p-2 rounded bg-black"
            style={{
              color: String(textObject.fill || "currentColor"),
            }}
          >
            {textObject.text || "Empty Text"}
          </p>
        </div>
      );
    }

    return null; // Return null for shapes as they are shown as icons
  };

  return (
    <TooltipProvider>
      <div className="fixed left-2 top-1/2 p-2 rounded shadow flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" disabled={objects.length === 0}>
              <Layers />
              <span className="ml-1 font-bold">{objects.length}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            sideOffset={10}
            className="p-2 w-auto max-h-64 overflow-y-auto"
          >
            <div className="flex flex-col gap-2">
              {objects.map((object) => (
                <Tooltip key={object.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleObjectClick(object.id)}
                      className="flex items-center justify-center w-10 h-10"
                    >
                      {renderObjectPreview(object)}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="p-2">
                    {renderTooltipContent(object)}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </TooltipProvider>
  );
};

export default ObjectCounter;
