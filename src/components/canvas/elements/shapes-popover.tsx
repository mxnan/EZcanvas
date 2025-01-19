import React from "react";
import {
  PopoverTrigger,
  PopoverContent,
  Popover,
} from "@/components/ui/popover";
import { fabric } from "fabric";
import { Button } from "@/components/ui/button";
import {
  Circle,
  RectangleEllipsis,
  RectangleHorizontal,
  Shapes,
  Star,
  Triangle,
} from "lucide-react";
import { useObjects } from "@/context/object-context";
import { generateRandomId } from "@/lib/utils";

interface ShapesPopoverProps {
  fabricCanvasRef: React.RefObject<fabric.Canvas | null>;
}

const ShapesPopover: React.FC<ShapesPopoverProps> = ({ fabricCanvasRef }) => {
  const { addObject } = useObjects(); // Accessing the context to add objects

  const addShape = (shape: string) => {
    if (fabricCanvasRef.current) {
      let newShape;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let objectType: { id: string; type: string; properties: any }; // Define the objectType

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
          {  const starPath = createStarPath(5, 20, 50); // 5 points, inner radius 20, outer radius 50
            newShape = new fabric.Path(starPath, {
              left: 100,
              top: 100,
              fill: "orange",
              selectable: true,
            });}
            break;
        default:
          console.warn("Unknown shape type");
          return; // Exit if the shape type is unknown
      }

      if (newShape) {
        fabricCanvasRef.current.add(newShape);
        fabricCanvasRef.current.setActiveObject(newShape);
        fabricCanvasRef.current.renderAll();
        // Create ObjectType with a random ID
        objectType = {
          id: generateRandomId(),
          type: "shape",
          properties: newShape,
        }; // Create ObjectType
        console.log(objectType)
        addObject(objectType); // Add the new shape to the context
      
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

export const createStarPath = (
  points: number,
  inner: number,
  outer: number
): string => {
  let path = "M ";
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = (i * Math.PI) / points;
    const x = radius * Math.sin(angle);
    const y = radius * Math.cos(angle);
    path += `${x},${y} `;
  }
  path += "z";
  return path;
};