// src/components/canvas/controls/obj-specific-controls.tsx
import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
import { CustomFabricObject } from "@/types/object"; // Import the custom type
import { motion, AnimatePresence } from "framer-motion";
import TextControls from "./text/text-controls";
import ImageControls from "./image/image-controls";
import ShapeControls from "./shape/shape-controls";

const ObjSpecificControls: React.FC<{
  fabricCanvasRef: React.RefObject<fabric.Canvas | null>;
}> = ({ fabricCanvasRef }) => {
  const [activeObject, setActiveObject] = useState<CustomFabricObject | null>(
    null
  );
  const [objectType, setObjectType] = useState<string | null>(null);
  const [isediting, setIsEditing] = useState(false); // Add isediting state

  useEffect(() => {
    const canvas = fabricCanvasRef.current;

    if (!canvas) return;

    const updateActiveObject = () => {
        // Don't update active object if we're cropping
        if (isediting) return;
      const obj = canvas.getActiveObject() as CustomFabricObject;
      if (obj) {
        setActiveObject(obj);
        // Determine the type of the active object
        if (obj instanceof fabric.IText) {
          setObjectType("text");
        } else if (obj instanceof fabric.Image) {
          setObjectType("image");
        } else if (
          obj instanceof fabric.Path ||
          obj instanceof fabric.Rect ||
          obj instanceof fabric.Circle ||
          obj instanceof fabric.Ellipse ||
          obj instanceof fabric.Triangle
        ) {
          setObjectType("shape");
        } else {
          setObjectType(null);
        }
      } else {
        setActiveObject(null);
        setObjectType(null);
      }
    };

    // Listen for selection events
    canvas.on("selection:created", updateActiveObject);
    canvas.on("selection:updated", updateActiveObject); // Listen for updated selection
    canvas.on("selection:cleared", updateActiveObject);

    // Clean up event listeners on unmount
    return () => {
      canvas.off("selection:created", updateActiveObject);
      canvas.off("selection:updated", updateActiveObject); // Clean up updated selection listener
      canvas.off("selection:cleared", updateActiveObject);
    };
  }, [fabricCanvasRef,isediting]);



  const renderControls = () => {
    if (!activeObject) return null;

    switch (objectType) {
      case "text":
        return (
          <motion.div
            key="text-controls"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <TextControls
              activeObject={activeObject}
              fabricCanvasRef={fabricCanvasRef}
            />
          </motion.div>
        );
      case "image":
        return (
          <motion.div
            key="image-controls"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}    
          >
            <ImageControls
              activeObject={activeObject}
              fabricCanvasRef={fabricCanvasRef}
              isediting={isediting} // Pass isediting down
              setIsEditing={setIsEditing} // Pass down the setter function
            />
          </motion.div>
        );
      case "shape":
        return (
          <motion.div
            key="shape-controls"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <ShapeControls
              activeObject={activeObject}
              fabricCanvasRef={fabricCanvasRef}
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="z-[999]">
      <AnimatePresence mode="wait">
        {objectType && renderControls()}{" "}
        {/* Only render controls if objectType is set */}
      </AnimatePresence>
    </div>
  );
};

export default ObjSpecificControls;
