import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useObjects } from "@/context/object-context";
import { fabric } from "fabric";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  FlipHorizontal,
  FlipVertical,
  Trash2,
} from "lucide-react";
import { CustomFabricObject } from "@/types/object";
import { motion, AnimatePresence } from "framer-motion";
import { generateRandomId } from "@/lib/utils";

interface SharedControlsProps {
  fabricCanvasRef: React.RefObject<fabric.Canvas | null>;
}

const SharedControls: React.FC<SharedControlsProps> = ({ fabricCanvasRef }) => {
  const { removeObject, addObject } = useObjects();
  const [activeObjectId, setActiveObjectId] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getActiveObject = () => {
    return fabricCanvasRef.current?.getActiveObject() as CustomFabricObject;
  };

  useEffect(() => {
    const canvas = fabricCanvasRef.current;

    if (!canvas) return;

    const updateActiveObject = () => {
      const activeObject = getActiveObject();
      if (activeObject) {
        setActiveObjectId(activeObject.id);
      } else {
        setActiveObjectId(null);
      }
    };

    // Listen for selection events
    canvas.on("selection:created", updateActiveObject);
    canvas.on("selection:cleared", updateActiveObject);

    // Clean up event listeners on unmount
    return () => {
      canvas.off("selection:created", updateActiveObject);
      canvas.off("selection:cleared", updateActiveObject);
    };
  }, [fabricCanvasRef, getActiveObject]);

  const handleDelete = () => {
    if (activeObjectId) {
      const activeObject = getActiveObject();
      if (activeObject && fabricCanvasRef.current) {
        fabricCanvasRef.current.remove(activeObject);
        removeObject(activeObjectId);
        fabricCanvasRef.current.renderAll();
      }
    }
  };

  const handleDuplicate = () => {
    const activeObject = getActiveObject();
    if (activeObject && fabricCanvasRef.current) {
      activeObject.clone((cloned: CustomFabricObject) => {
        cloned.set({
          left: activeObject.left! + 20,
          top: activeObject.top! + 20,
        });
        cloned.id = generateRandomId();

        fabricCanvasRef.current?.add(cloned);
        fabricCanvasRef.current?.setActiveObject(cloned);
        fabricCanvasRef.current?.renderAll();
     // Determine the type of the active object and map it to a generic type
     let objectType: string;

     if (activeObject instanceof fabric.IText) {
       objectType = "text"; // For text objects
     } else if (activeObject instanceof fabric.Image) {
       objectType = "image"; // For image objects
     } else if (activeObject instanceof fabric.Path || 
                activeObject instanceof fabric.Rect || 
                activeObject instanceof fabric.Circle || 
                activeObject instanceof fabric.Ellipse || 
                activeObject instanceof fabric.Triangle) {
       objectType = "shape"; // For all shape types
     } else {
       objectType = "unknown"; // Fallback for any other types
     }
     // Create ObjectType with the new cloned object's ID
     const objectTypeData = {
       id: cloned.id,
       type: objectType, // Set the standardized type
       properties: cloned,
     };
     addObject(objectTypeData); // Add the new object to the context
      });
    }
  };

  const handleFlip = (direction: "x" | "y") => {
    const activeObject = getActiveObject();
    if (activeObject) {
      if (direction === "x") {
        activeObject.set("flipX", !activeObject.flipX);
      } else {
        activeObject.set("flipY", !activeObject.flipY);
      }
      fabricCanvasRef.current?.renderAll();
    }
  };

  const handleMoveLayer = (direction: "up" | "down") => {
    const activeObject = getActiveObject();
    if (activeObject && fabricCanvasRef.current) {
      if (direction === "up") {
        activeObject.bringForward();
      } else {
        activeObject.sendBackwards();
      }
      fabricCanvasRef.current?.renderAll();
    }
  };

  return (
    <AnimatePresence>
      {activeObjectId && (
        <motion.div
          className="absolute bottom-2 left-[42%]   p-2 bg-neutral-800 rounded-xl shadow flex items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={handleDelete}
            className="hover:bg-red-500/60"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDuplicate}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleMoveLayer("up")}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleMoveLayer("down")}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleFlip("x")}>
            <FlipHorizontal className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleFlip("y")}>
            <FlipVertical className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SharedControls;
