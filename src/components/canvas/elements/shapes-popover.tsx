import React from "react";
import {
  PopoverTrigger,
  PopoverContent,
  Popover,
} from "@/components/ui/popover";
import { fabric } from "fabric";
import { Button } from "@/components/ui/button";
import { Circle,  RectangleEllipsis,  RectangleHorizontal, Shapes, Star, Triangle } from "lucide-react";

interface ShapesPopoverProps {
  fabricCanvasRef: React.RefObject<fabric.Canvas | null>;
}

const ShapesPopover: React.FC<ShapesPopoverProps> = ({ fabricCanvasRef }) => {
  const addShape = (shape: string) => {
    if (fabricCanvasRef.current) {
      let newShape;

      switch (shape) {
        case "rectangle":
          newShape = new fabric.Rect({
            left: 100,
            top: 100,
            fill: "red",
            width: 50,
            height: 50,
            selectable: true,
          });
          break;
        case "circle":
          newShape = new fabric.Circle({
            left: 100,
            top: 100,
            radius: 25,
            fill: "blue",
            selectable: true,
          });
          break;
        case "ellipse":
          newShape = new fabric.Ellipse({
            left: 100,
            top: 100,
            rx: 40,
            ry: 20,
            fill: "green",
            selectable: true,
          });
          break;
        case "triangle":
          newShape = new fabric.Triangle({
            left: 100,
            top: 100,
            width: 50,
            height: 50,
            fill: "yellow",
            selectable: true,
          });
          break;
        case "star":
          newShape = new fabric.Polygon(
            [
              { x: 0, y: -50 },
              { x: 20, y: -20 },
              { x: 50, y: -20 },
              { x: 30, y: 0 },
              { x: 40, y: 50 },
              { x: 0, y: 20 },
              { x: -40, y: 50 },
              { x: -30, y: 0 },
              { x: -50, y: -20 },
              { x: -20, y: -20 },
            ],
            {
              left: 100,
              top: 100,
              fill: "orange",
              selectable: true,
            }
          );
          break;
        default:
          console.warn("Unknown shape type");
          return; // Exit if the shape type is unknown
      }

      if (newShape) {
        fabricCanvasRef.current.add(newShape);
        fabricCanvasRef.current.setActiveObject(newShape);
        fabricCanvasRef.current.renderAll();
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} size={"icon"}>
          <Shapes />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" sideOffset={10} className="p-2 w-min">
        <div className="flex flex-col justify-center space-y-2">
          <Button
            variant={"default"}
            size={"icon"}
            onClick={() => addShape("rectangle")}
          >
            <RectangleHorizontal />
          </Button>
          <Button
            variant={"default"}
            size={"icon"}
            onClick={() => addShape("circle")}
          >
            <Circle />
            
          </Button>
          <Button
            variant={"default"}
            size={"icon"}
            onClick={() => addShape("ellipse")}
          >
            <RectangleEllipsis /> 
          </Button>
          <Button
            variant={"default"}
            size={"icon"}
            onClick={() => addShape("triangle")}
          >
            <Triangle />
          </Button>
          <Button
            variant={"default"}
            size={"icon"}
            onClick={() => addShape("star")}
          >
            <Star />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShapesPopover;
