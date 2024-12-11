/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Label } from "../../ui/label";
import { DualRangeSlider } from "../../ui/slider";

interface TransformControlsProps {
  id: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  onTextChange: (id: number, attribute: string, value: any) => void;
}

export const TransformControls = ({
  id,
  rotation,
  opacity,
  zIndex,
  onTextChange,
}: TransformControlsProps) => {
  return (
    <div className="flex flex-col gap-8">
      {/* Z-Index */}
      <div className="flex flex-col gap-2">
        <Label>Z-Index</Label>
        <DualRangeSlider
          label="z"
          labelPosition="bottom"
          lableContenPos="right"
          value={[zIndex]}
          onValueChange={([value]) => {
            if (value !== undefined) {
              onTextChange(id, "zIndex", value);
            }
          }}
          min={0}
          max={30}
          step={1}
          className="mt-2 text-xs font-semibold"
        />
      </div>

      {/* Rotation */}
      <div className="flex flex-col gap-4">
        <Label className="whitespace-nowrap">Rotation (deg)</Label>
        <DualRangeSlider
          label="°"
          labelPosition="bottom"
          lableContenPos="right"
          value={[rotation]}
          onValueChange={([value]) => {
            if (value !== undefined) {
              onTextChange(id, "rotation", value);
            }
          }}
          min={0}
          max={360}
          step={1}
          className="mt-2 text-xs font-semibold"
        />
      </div>

      {/* Opacity */}
      <div className="flex flex-col gap-2">
        <Label className="whitespace-nowrap">Opacity (%)</Label>
        <DualRangeSlider
          label="%"
          labelPosition="bottom"
          lableContenPos="right"
          value={[opacity * 100]}
          onValueChange={([value]) => {
            if (value !== undefined) {
              onTextChange(id, "opacity", value / 100);
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