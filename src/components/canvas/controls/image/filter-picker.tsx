// src/components/canvas/controls/filter-picker.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Blend } from "lucide-react";

interface FilterOption {
  name: string;
  value: string;
  hasSlider: boolean;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
}

interface FilterPickerProps {
  onApplyFilter: (filter: string, value?: number) => void;
  activeFilters: Record<string, number | boolean>;
}

const FilterPicker: React.FC<FilterPickerProps> = ({ onApplyFilter, activeFilters }) => {
  const [sliderValues, setSliderValues] = useState<Record<string, number>>(
    Object.entries(activeFilters)
      .filter(([_, value]) => typeof value === 'number')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value as number }), {})
  );

  const filters: FilterOption[] = [
    { name: "None", value: "none", hasSlider: false, defaultValue: 0, min: 0, max: 0, step: 0 },
    { name: "Grayscale", value: "grayscale", hasSlider: false, defaultValue: 0, min: 0, max: 0, step: 0 },
    { name: "Sepia", value: "sepia", hasSlider: false, defaultValue: 0, min: 0, max: 0, step: 0 },
    { name: "Invert", value: "invert", hasSlider: false, defaultValue: 0, min: 0, max: 0, step: 0 },
    { name: "Brightness", value: "brightness", hasSlider: true, defaultValue: 0, min: -1, max: 1, step: 0.05 },
    { name: "Contrast", value: "contrast", hasSlider: true, defaultValue: 0, min: -1, max: 1, step: 0.05 },
    { name: "Saturation", value: "saturation", hasSlider: true, defaultValue: 0, min: -1, max: 1, step: 0.05 },
    { name: "Blur", value: "blur", hasSlider: true, defaultValue: 0, min: 0, max: 1, step: 0.05 },
  ];

  const handleSliderChange = (filter: string, value: number) => {
    setSliderValues(prev => ({ ...prev, [filter]: value }));
    onApplyFilter(filter, value);
  };

  const getActiveState = (filter: string) => {
    return filter in activeFilters;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className={Object.keys(activeFilters).length > 0 ? "bg-primary/20" : ""}
        >
          <Blend />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="left"
        sideOffset={10}
        className="p-3 w-64 flex flex-col gap-3"
      >
        <h3 className="text-sm font-medium">Image Filters</h3>
        
        {/* Reset button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onApplyFilter("none")}
          className="mb-2"
        >
          Reset All Filters
        </Button>

        <div className="space-y-4">
          {filters.map((filter) => (
            <div key={filter.value} className="space-y-2">
              <div className="flex items-center justify-between">
                <Button
                  variant={getActiveState(filter.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => onApplyFilter(filter.value)}
                  className="w-full justify-start"
                >
                  {filter.name}
                </Button>
              </div>

              {filter.hasSlider && getActiveState(filter.value) && (
                <div className="px-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs">{filter.min}</p>
                    <p className="text-xs font-medium">
                      {sliderValues[filter.value]?.toFixed(2) || filter.defaultValue}
                    </p>
                    <p className="text-xs">{filter.max}</p>
                  </div>
                  <input
                    type="range"
                    min={filter.min}
                    max={filter.max}
                    step={filter.step}
                    value={sliderValues[filter.value] ?? filter.defaultValue}
                    onChange={(e) => handleSliderChange(filter.value, parseFloat(e.target.value))}
                    className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPicker;
