// src/components/canvas/controls/image-controls.tsx
import React, { useState, useEffect } from "react";
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

interface FilterState {
  [key: string]: number | boolean;
}

const ImageControls: React.FC<ImageControlsProps> = ({
  activeObject,
  fabricCanvasRef,
  isediting,
  setIsEditing, // Destructure setter function
}) => {
  const [activeFilters, setActiveFilters] = useState<FilterState>({});

  // Initialize active filters from the image on component mount or object change
  useEffect(() => {
    if (activeObject && activeObject instanceof fabric.Image) {
      const newFilters: FilterState = {};
      
      if (activeObject.filters && activeObject.filters.length > 0) {
        activeObject.filters.forEach(filter => {
          if (filter instanceof fabric.Image.filters.Grayscale) {
            newFilters.grayscale = true;
          }
          else if (filter instanceof fabric.Image.filters.Sepia) {
            newFilters.sepia = true;
          }
          else if (filter instanceof fabric.Image.filters.Invert) {
            newFilters.invert = true;
          }
          else if (filter instanceof fabric.Image.filters.Brightness) {
            newFilters.brightness = filter.brightness;
          }
          else if (filter instanceof fabric.Image.filters.Contrast) {
            newFilters.contrast = filter.contrast;
          }
          else if (filter instanceof fabric.Image.filters.Saturation) {
            newFilters.saturation = filter.saturation;
          }
          else if (filter instanceof fabric.Image.filters.Blur) {
            newFilters.blur = filter.blur;
          }
        });
      }
      
      setActiveFilters(newFilters);
    }
  }, [activeObject]);

  if (!activeObject || !(activeObject instanceof fabric.Image)) {
    return null; // Return null if no active image object
  }
  const handleCropStart = () => {
    setIsEditing(true); // Set editing state to true
  };

  const handleCropEnd = () => {
    setIsEditing(false); // Set editing state to false
  };

  const applyFilter = (filter: string, value?: number) => {
    // Initialize filters array if needed
    if (!activeObject.filters) {
      activeObject.filters = [];
    }

    // Reset all filters
    if (filter === "none") {
      activeObject.filters = [];
      setActiveFilters({});
      activeObject.applyFilters();
      fabricCanvasRef.current?.renderAll();
      return;
    }

    // Create a copy of the current filters to modify
    const newActiveFilters = { ...activeFilters };
    let filterIndex = -1;

    // Find existing filter index
    activeObject.filters.forEach((f, index) => {
      if (
        (filter === "grayscale" && f instanceof fabric.Image.filters.Grayscale) ||
        (filter === "sepia" && f instanceof fabric.Image.filters.Sepia) ||
        (filter === "invert" && f instanceof fabric.Image.filters.Invert) ||
        (filter === "brightness" && f instanceof fabric.Image.filters.Brightness) ||
        (filter === "contrast" && f instanceof fabric.Image.filters.Contrast) ||
        (filter === "saturation" && f instanceof fabric.Image.filters.Saturation) ||
        (filter === "blur" && f instanceof fabric.Image.filters.Blur)
      ) {
        filterIndex = index;
      }
    });

    // Add, update, or remove filter based on type and value
    switch (filter) {
      case "grayscale":
        if (filterIndex >= 0) {
          activeObject.filters.splice(filterIndex, 1);
          delete newActiveFilters.grayscale;
        } else {
          activeObject.filters.push(new fabric.Image.filters.Grayscale());
          newActiveFilters.grayscale = true;
        }
        break;
      
      case "sepia":
        if (filterIndex >= 0) {
          activeObject.filters.splice(filterIndex, 1);
          delete newActiveFilters.sepia;
        } else {
          activeObject.filters.push(new fabric.Image.filters.Sepia());
          newActiveFilters.sepia = true;
        }
        break;
      
      case "invert":
        if (filterIndex >= 0) {
          activeObject.filters.splice(filterIndex, 1);
          delete newActiveFilters.invert;
        } else {
          activeObject.filters.push(new fabric.Image.filters.Invert());
          newActiveFilters.invert = true;
        }
        break;
      
      case "brightness":
        if (value !== undefined) {
          if (filterIndex >= 0) {
            activeObject.filters[filterIndex] = new fabric.Image.filters.Brightness({ brightness: value });
          } else {
            activeObject.filters.push(new fabric.Image.filters.Brightness({ brightness: value }));
          }
          newActiveFilters.brightness = value;
        } else if (filterIndex >= 0) {
          activeObject.filters.splice(filterIndex, 1);
          delete newActiveFilters.brightness;
        } else {
          activeObject.filters.push(new fabric.Image.filters.Brightness({ brightness: 0.1 }));
          newActiveFilters.brightness = 0.1;
        }
        break;
      
      case "contrast":
        if (value !== undefined) {
          if (filterIndex >= 0) {
            activeObject.filters[filterIndex] = new fabric.Image.filters.Contrast({ contrast: value });
          } else {
            activeObject.filters.push(new fabric.Image.filters.Contrast({ contrast: value }));
          }
          newActiveFilters.contrast = value;
        } else if (filterIndex >= 0) {
          activeObject.filters.splice(filterIndex, 1);
          delete newActiveFilters.contrast;
        } else {
          activeObject.filters.push(new fabric.Image.filters.Contrast({ contrast: 0.1 }));
          newActiveFilters.contrast = 0.1;
        }
        break;
      
      case "saturation":
        if (value !== undefined) {
          if (filterIndex >= 0) {
            activeObject.filters[filterIndex] = new fabric.Image.filters.Saturation({ saturation: value });
          } else {
            activeObject.filters.push(new fabric.Image.filters.Saturation({ saturation: value }));
          }
          newActiveFilters.saturation = value;
        } else if (filterIndex >= 0) {
          activeObject.filters.splice(filterIndex, 1);
          delete newActiveFilters.saturation;
        } else {
          activeObject.filters.push(new fabric.Image.filters.Saturation({ saturation: 0.1 }));
          newActiveFilters.saturation = 0.1;
        }
        break;
      
      case "blur":
        if (value !== undefined) {
          if (filterIndex >= 0) {
            activeObject.filters[filterIndex] = new fabric.Image.filters.Blur({ blur: value });
          } else {
            activeObject.filters.push(new fabric.Image.filters.Blur({ blur: value }));
          }
          newActiveFilters.blur = value;
        } else if (filterIndex >= 0) {
          activeObject.filters.splice(filterIndex, 1);
          delete newActiveFilters.blur;
        } else {
          activeObject.filters.push(new fabric.Image.filters.Blur({ blur: 0.1 }));
          newActiveFilters.blur = 0.1;
        }
        break;
    }

    // Update state and apply filters
    setActiveFilters(newActiveFilters);
    activeObject.applyFilters();
    fabricCanvasRef.current?.renderAll();
  };

  return (
   
    <>
    <div className="z-[999] fixed top-1/2 right-2 p-2 flex flex-col gap-2">
      <FilterPicker 
        onApplyFilter={applyFilter} 
        activeFilters={activeFilters} 
      />
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
