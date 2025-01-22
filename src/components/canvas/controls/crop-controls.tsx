// src/components/canvas/controls/crop-controls.tsx
import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useObjects } from "@/context/object-context";
import { generateRandomId } from "@/lib/utils";
import { CustomFabricImage } from "@/types/object";

interface CropperProps {
  activeObject: fabric.Image;
  fabricCanvasRef: React.RefObject<fabric.Canvas | null>;
  onFinishCrop: () => void;
}

const Cropper: React.FC<CropperProps> = ({
  activeObject,
  fabricCanvasRef,
  onFinishCrop,
}) => {
  const cropRectRef = useRef<fabric.Rect | null>(null);
  const { addObject } = useObjects(); // Get the addObject function from context

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Disable image manipulation during cropping
    activeObject.set({
      selectable: false,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
    });

    // Create crop overlay
    const cropRect = new fabric.Rect({
      left: activeObject.left,
      top: activeObject.top,
      width: activeObject.getScaledWidth(),
      height: activeObject.getScaledHeight(),
      fill: "#FFB800",
      opacity: 0.3,
      stroke: "#FFB800",
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      cornerColor: "#FFB800",
      cornerStrokeColor: "#FFB800",
      cornerStyle: "circle",
      cornerSize: 10,
      transparentCorners: false,
      selectable: true,
      hasControls: true,
      lockRotation: true,
      name: "cropRect",
    });

    cropRectRef.current = cropRect;
    canvas.add(cropRect);
    canvas.setActiveObject(cropRect);
    canvas.renderAll();

    // Cleanup function
    return () => {
      if (canvas && cropRectRef.current) {
        canvas.remove(cropRectRef.current);
        canvas.renderAll();
      }
    };
  }, [activeObject, fabricCanvasRef]);

  const handleCrop = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !cropRectRef.current) return;

    try {
      // Get crop dimensions
      const rect = cropRectRef.current;
      const img = activeObject;

      // Calculate crop coordinates relative to image
      const imgElement = img.getElement();
      const left = (rect.left! - img.left!) / (img.scaleX || 1);
      const top = (rect.top! - img.top!) / (img.scaleY || 1);
      const width = rect.getScaledWidth() / (img.scaleX || 1);
      const height = rect.getScaledHeight() / (img.scaleY || 1);

      // Create temporary canvas for cropping
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const ctx = tempCanvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(
          imgElement,
          left,
          top,
          width,
          height,
          0,
          0,
          width,
          height
        );

        // Inside your handleCrop function
        fabric.Image.fromURL(
          tempCanvas.toDataURL(),
          (croppedImg: fabric.Image) => {
            // Cast to CustomFabricImage
            const customCroppedImg = croppedImg as CustomFabricImage;

            // Set a unique ID for the cropped image
            const croppedImageId = generateRandomId();
            customCroppedImg.set({
              left: rect.left,
              top: rect.top,
              scaleX: img.scaleX,
              scaleY: img.scaleY,
              id: croppedImageId, // Set the ID for the cropped image
            });

            // Add the new cropped image to the context
            addObject({
              id: croppedImageId, // Use the generated ID
              type: "image",
              properties: customCroppedImg,
            });

            // Add the cropped image to the canvas
            canvas.add(customCroppedImg);
            canvas.setActiveObject(customCroppedImg);
            canvas.renderAll();

            // Restore original image properties to make it selectable again
            img.set({
              selectable: true,
              hasControls: true,
              lockMovementX: false,
              lockMovementY: false,
            });

            // canvas.setActiveObject(img); // Optionally set the original image as active
            canvas.renderAll();
            onFinishCrop();
          }
        );
      }
    } catch (error) {
      console.error("Error during crop:", error);
      onFinishCrop(); // Ensure we clean up even if there's an error
    }
  };

  const handleCancel = () => {
    const canvas = fabricCanvasRef.current;
    if (canvas && cropRectRef.current) {
      // Remove the crop rectangle
      canvas.remove(cropRectRef.current);
      cropRectRef.current = null;

      // Restore original image properties
      activeObject.set({
        selectable: true,
        hasControls: true,
        lockMovementX: false,
        lockMovementY: false,
      });

      canvas.setActiveObject(activeObject); // Set the original image as active
      canvas.renderAll();
      onFinishCrop(); // Call the finish crop function to close the cropper
    }
  };

  return (
    <div className="fixed top-2 left-1/2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCrop}
        className="bg-green-500 hover:bg-green-600"
      >
        <Check className="h-4 w-4 mr-2" />
        Done
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCancel}
        className="hover:bg-red-500/60"
      >
        <X className="h-4 w-4 mr-2" />
        Cancel
      </Button>
    </div>
  );
};

export default Cropper;
