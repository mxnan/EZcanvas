/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Label } from "../../ui/label";
import { DualRangeSlider } from "../../ui/slider";

interface FontPropertiesProps {
  id: number;
  fontWeight: number;
  fontSize: number;
  onTextChange: (id: number, attribute: string, value: any) => void;
}

export const FontProperties = ({
  id,
  fontWeight,
  fontSize,
  onTextChange,
}: FontPropertiesProps) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Font Weight */}
      <div className="flex flex-col gap-2">
        <Label>Font Weight</Label>
        <DualRangeSlider
          label="w"
          labelPosition="bottom"
          lableContenPos="right"
          value={[fontWeight]}
          onValueChange={([value]) => {
            if (value !== undefined) {
              onTextChange(id, "fontWeight", value);
            }
          }}
          min={100}
          max={900}
          step={100}
          className="mt-2 text-xs font-semibold"
        />
      </div>

      {/* Font Size */}
      <div className="flex flex-col gap-2">
        <Label>Font Size</Label>
        <DualRangeSlider
          label="px"
          labelPosition="bottom"
          lableContenPos="right"
          value={[fontSize]}
          onValueChange={([value]) => {
            if (value !== undefined) {
              onTextChange(id, "fontSize", value);
            }
          }}
          min={4}
          max={200}
          step={2}
          className="mt-2 text-xs font-semibold"
        />
      </div>
    </div>
  );
}; 