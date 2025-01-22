// src/components/canvas/controls/filter-picker.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Blend } from "lucide-react";

interface FilterPickerProps {
  onApplyFilter: (filter: string) => void;
}

const FilterPicker: React.FC<FilterPickerProps> = ({ onApplyFilter }) => {
  const filters = [
    { name: "None", value: "none" }, // Add None option to clear filters
    { name: "Grayscale", value: "grayscale" },
    { name: "Sepia", value: "sepia" },
    { name: "Invert", value: "invert" },
    { name: "Brightness", value: "brightness" },
    { name: "Contrast", value: "contrast" },
    // Add more filters as needed
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} size={"icon"}>
        <Blend />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        sideOffset={10}
        className="p-2 w-min flex flex-col gap-1"
      >
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={"default"}
            size={"sm"}
            onClick={() => onApplyFilter(filter.value)}
          >
            {filter.name}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default FilterPicker;
