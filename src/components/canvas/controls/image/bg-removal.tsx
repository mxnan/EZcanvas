import React, { useState, useEffect, useCallback } from "react";
import { fabric } from "fabric";
import { Button } from "@/components/ui/button";
import { ImageMinus, Loader } from "lucide-react"; // Assuming you have a loader icon
import useBgRemoval from "@/hooks/useBgremoval"; // Import the custom hook
import { useObjects } from "@/context/object-context";
import { CustomFabricImage } from "@/types/object"; // Import the custom type
import { generateRandomId } from "@/lib/utils";

interface BgRemovalProps {
  activeObject: fabric.Image;
  fabricCanvasRef: React.RefObject<fabric.Canvas | null>;
}

const BgRemoval: React.FC<BgRemovalProps> = ({
  activeObject,
  fabricCanvasRef,
}) => {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const { loading, resultBlob, error } = useBgRemoval(imageDataUrl);
  const { addObject } = useObjects(); // Get the addObject function from context

  // Cleanup function to reset state
  const resetState = useCallback(() => {
    setImageDataUrl(null);
  }, []);

  const handleBgRemoval = useCallback(() => {
    alert(
      "Please do not select any other object while the background removal is in progress."
    );
    const imgElement = activeObject.getElement() as HTMLImageElement;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;

    if (!ctx) throw new Error("Could not get canvas context");
    ctx.drawImage(imgElement, 0, 0);
    const dataUrl = canvas.toDataURL("image/png");

    setImageDataUrl(dataUrl);
  }, [activeObject]);

  useEffect(() => {
    if (resultBlob) {
      const resultUrl = URL.createObjectURL(resultBlob);

      fabric.Image.fromURL(resultUrl, (newImg: fabric.Image) => {
        // Cast to CustomFabricImage
        const customNewImg = newImg as CustomFabricImage;

        const bgremovedImageId = generateRandomId();

        customNewImg.set({
          left: activeObject.left,
          top: activeObject.top,
          scaleX: activeObject.scaleX,
          scaleY: activeObject.scaleY,
          id: bgremovedImageId, // Set the ID for the cropped image
        });

        // Add the new background-removed image to the context
        addObject({
          id: bgremovedImageId, // Generate a unique ID
          type: "image",
          properties: customNewImg, // Use the new image properties
        });

        fabricCanvasRef.current?.add(customNewImg);
        fabricCanvasRef.current?.setActiveObject(customNewImg);
        fabricCanvasRef.current?.renderAll();

        // Cleanup
        URL.revokeObjectURL(resultUrl);
        resetState();
      });
    }
  }, [resultBlob, activeObject, fabricCanvasRef, resetState, addObject]);

  useEffect(() => {
    if (error) {
      console.error("Background removal error:", error);
      resetState();
    }
  }, [error, resetState]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleBgRemoval}
      disabled={loading}
    >
      {loading ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <ImageMinus className="h-4 w-4" />
      )}
    </Button>
  );
};

export default BgRemoval;
