// src/components/canvas/controls/image-controls.tsx
import React from "react";
import { fabric } from "fabric";
import { CustomFabricObject } from "@/types/object"; // Import the custom type
import FilterPicker from "./filter-picker";
import Cropper from "./crop-controls";
import { Button } from "@/components/ui/button";
import { Crop } from "lucide-react";
import BgRemoval from "./bg-removal";

interface ImageControlsProps {
  activeObject: CustomFabricObject | null;
  fabricCanvasRef: React.RefObject<fabric.Canvas | null>;
  isediting: boolean; // Accept isediting
  setIsEditing: (editing: boolean) => void; // Accept setter function

}

const ImageControls: React.FC<ImageControlsProps> = ({
  activeObject,
  fabricCanvasRef,
  isediting,
  setIsEditing, // Destructure setter function
}) => {

  if (!activeObject || !(activeObject instanceof fabric.Image)) {
    return null; // Return null if no active image object
  }
  const handleCropStart = () => {
    setIsEditing(true); // Set editing state to true
  };

  const handleCropEnd = () => {
    setIsEditing(false); // Set editing state to false
  };


  const applyFilter = (filter: string) => {
    // Clear existing filters if "None" is selected
    if (filter === "none") {
      activeObject.filters = []; // Clear all filters
    } else {
      // Initialize filters if undefined
      if (!activeObject.filters) {
        activeObject.filters = [];
      }

      // Check if the filter is already applied
      const filterTypes = activeObject.filters.map((f) => f.constructor); // Get the constructor of each filter
      let filterToAdd;

      switch (filter) {
        case "grayscale":
          filterToAdd = new fabric.Image.filters.Grayscale();
          break;
        case "sepia":
          filterToAdd = new fabric.Image.filters.Sepia();
          break;
        case "invert":
          filterToAdd = new fabric.Image.filters.Invert();
          break;
        case "brightness":
          filterToAdd = new fabric.Image.filters.Brightness({
            brightness: 0.1,
          }); // Example value
          break;
        case "contrast":
          filterToAdd = new fabric.Image.filters.Contrast({ contrast: 0.1 }); // Example value
          break;
        default:
          return; // Exit if the filter is not recognized
      }

      // Only add the filter if it is not already applied
      if (!filterTypes.includes(filterToAdd.constructor)) {
        activeObject.filters.push(filterToAdd);
      }
    }

    activeObject.applyFilters();
    fabricCanvasRef.current?.renderAll();
  };

  return (
   
    <>
    <div className="z-[999] fixed top-1/2 right-2 p-2 flex flex-col gap-2">
      <FilterPicker onApplyFilter={applyFilter} />
      <Button
        variant="outline"
        size="icon"
        onClick={handleCropStart}
        disabled={isediting} // Disable button if editing
      >
        <Crop className="h-4 w-4" />
      </Button>
      <BgRemoval activeObject={activeObject as fabric.Image} fabricCanvasRef={fabricCanvasRef} />
      
    </div>
    {isediting && (
      <Cropper
        activeObject={activeObject as fabric.Image}
        fabricCanvasRef={fabricCanvasRef}
        onFinishCrop={handleCropEnd}
      />
    )}
  </>

  );
};

export default ImageControls;
