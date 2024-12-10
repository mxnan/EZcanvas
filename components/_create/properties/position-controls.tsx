/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Label } from "../../ui/label";
import { DualRangeSlider } from "../../ui/slider";

interface PositionControlsProps {
  id: number;
  left: number;
  top: number;
  onTextChange: (id: number, attribute: string, value: any) => void;
}

export const PositionControls = ({
  id,
  left,
  top,
  onTextChange,
}: PositionControlsProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:*:w-full gap-8">
      {/* Position X */}
      <div className="flex flex-col gap-4">
        <Label className="whitespace-nowrap">Position X (%)</Label>
        <DualRangeSlider
          label="%"
          labelPosition="bottom"
          lableContenPos="right"
          value={[left]}
          onValueChange={([value]) => {
            if (value !== undefined) {
              onTextChange(id, "left", value);
            }
          }}
          min={0}
          max={100}
          step={1}
          className="mt-2 text-xs font-semibold"
        />
      </div>

      {/* Position Y */}
      <div className="flex flex-col gap-4">
        <Label className="whitespace-nowrap">Position Y (%)</Label>
        <DualRangeSlider
          label="%"
          labelPosition="bottom"
          lableContenPos="right"
          value={[top]}
          onValueChange={([value]) => {
            if (value !== undefined) {
              onTextChange(id, "top", value);
            }
          }}
          min={0}
          max={100}
          step={1}
          className="mt-2 text-xs font-semibold"
        />
      </div>
    </div>
  );
}; 