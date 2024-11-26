/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { buttonVariants } from "../ui/button";
import { Eraser, Copy } from "lucide-react";
import { Label } from "../ui/label";
import Accordion from "../ui/accordion";
import { cn } from "@/lib/utils";
import { DualRangeSlider } from "../ui/slider";
import { HexColorPicker } from "react-colorful";

interface TextCustomizerProps {
  textSet: {
    id: number;
    text: string;
    color: string;
    fontSize: number;
    fontFamily: string;
    top: number;
    left: number;
    rotation: number;
    opacity: number;
    zIndex: number;
    fontWeight: number;
  };
  onTextChange: (id: number, attribute: string, value: any) => void;
  onDelete: (id: number) => void;
  onDuplicate: (textSet: any) => void;
}

const TextCustomizer = ({
  textSet,
  onTextChange,
  onDelete,
  onDuplicate,
}: TextCustomizerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const maxCharacters = 50;

  const handleChange =
    (attribute: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (value.length <= maxCharacters) {
        onTextChange(textSet.id, attribute, value);
      }
    };

  return (
    <Accordion
      title={textSet.text || "Text Overlay"}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      rightElement={
        <div className="flex gap-2">
          <span
            className={cn(
              buttonVariants({
                variant: "default",
                size: "icon",
              })
            )}
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(textSet);
            }}
          >
            <Copy className="h-4 w-4" />
          </span>
          <span
            className={cn(
              buttonVariants({
                variant: "destructive",
                size: "icon",
              })
            )}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(textSet.id);
            }}
          >
            <Eraser className="h-4 w-4" />
          </span>
        </div>
      }
    >
      <div className="space-y-3">
        <div>
          <div className="flex flex-row gap-8 w-full justify-between">
            <div className="flex flex-col w-full ">
              {/* Text Input */}
              <div className="flex flex-col gap-2">
                <Label htmlFor={`text-${textSet.id}`}>Text Content</Label>
                <Input
                  id={`text-${textSet.id}`}
                  type="text"
                  value={textSet.text}
                  onChange={handleChange("text")}
                  placeholder="Edit Text"
                  className="w-full"
                />
                <div className="text-sm text-gray-500">
                  {textSet.text.length}/{maxCharacters} characters
                </div>
              </div>
              <div className="py-6 flex flex-col gap-8">
                {/* Font Weight Slider */}
                <div className="flex flex-col w-full  gap-2">
                  <Label>Font Weight</Label>
                  <DualRangeSlider
                    label="w"
                    labelPosition="bottom"
                    lableContenPos="right"
                    value={[textSet.fontWeight]}
                    onValueChange={([value]) => {
                      if (value !== undefined) {
                        onTextChange(textSet.id, "fontWeight", value);
                      }
                    }}
                    min={100}
                    max={900}
                    step={100}
                    className="mt-2 text-xs font-semibold"
                  />
                </div>
                {/* Z-Index Slider */}
                <div className="flex flex-col w-full  gap-2">
                  <Label>Z-Index</Label>
                  <DualRangeSlider
                    label="z"
                    labelPosition="bottom"
                    lableContenPos="right"
                    value={[textSet.zIndex]}
                    onValueChange={([value]) => {
                      if (value !== undefined) {
                        onTextChange(textSet.id, "zIndex", value);
                      }
                    }}
                    min={0}
                    max={30}
                    step={1}
                    className="mt-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="py-6 flex flex-col gap-12 ">
                {/* Font Size Slider */}
                <div className="flex flex-col w-full  gap-2">
                  <Label>Font Size</Label>
                  <DualRangeSlider
                    label="px"
                    labelPosition="bottom"
                    lableContenPos="right"
                    value={[textSet.fontSize]}
                    onValueChange={([value]) => {
                      if (value !== undefined) {
                        onTextChange(textSet.id, "fontSize", value);
                      }
                    }}
                    min={4}
                    max={900}
                    step={4}
                    className="mt-2 text-xs font-semibold"
                  />
                </div>
                {/* Font Family */}
                <div className="flex flex-col w-full lg:w-max  gap-2">
                  <Label htmlFor={`fontFamily-${textSet.id}`}>
                    Font Family
                  </Label>
                  <Input
                    id={`fontFamily-${textSet.id}`}
                    type="text"
                    value={textSet.fontFamily}
                    onChange={handleChange("fontFamily")}
                    placeholder="Inter"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            {/* Color Picker */}
            <div className="flex flex-col gap-3">
              <Label htmlFor={`color-${textSet.id}`}>Color</Label>
              <HexColorPicker
                color={textSet.color}
                onChange={(newColor) =>
                  onTextChange(textSet.id, "color", newColor)
                }
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Position Controls */}
        <div className="py-6 flex flex-col xl:flex-row xl:justify-around gap-8">
          <div className="flex flex-col xl:w-full  gap-2">
            <Label className="whitespace-nowrap">Position X (%)</Label>
            <DualRangeSlider
              label="%"
              labelPosition="bottom"
              lableContenPos="right"
              value={[textSet.left]}
              onValueChange={([value]) => {
                if (value !== undefined) {
                  onTextChange(textSet.id, "left", value);
                }
              }}
              min={0}
              max={100}
              step={1}
              className="mt-2 text-xs font-semibold"
            />
          </div>
          <div className="flex flex-col xl:w-full  gap-2">
            <Label className="whitespace-nowrap">Position Y (%)</Label>
            <DualRangeSlider
              label="%"
              labelPosition="bottom"
              lableContenPos="right"
              value={[textSet.top]}
              onValueChange={([value]) => {
                if (value !== undefined) {
                  onTextChange(textSet.id, "top", value);
                }
              }}
              min={0}
              max={100}
              step={1}
              className="mt-2 text-xs font-semibold"
            />
          </div>
        </div>

        {/* Rotation and Opacity */}
        <div className="py-6 flex flex-col xl:flex-row xl:justify-around gap-8">
          <div className="flex flex-col xl:w-full  gap-2">
            <Label className="whitespace-nowrap">Rotation (deg)</Label>
            <DualRangeSlider
              label="°"
              labelPosition="bottom"
              lableContenPos="right"
              value={[textSet.rotation]}
              onValueChange={([value]) => {
                if (value !== undefined) {
                  onTextChange(textSet.id, "rotation", value);
                }
              }}
              min={0}
              max={360}
              step={1}
              className="mt-2 text-xs font-semibold"
            />
          </div>

          <div className="flex flex-col xl:w-full  gap-2">
            <Label className="whitespace-nowrap">Opacity (%)</Label>
            <DualRangeSlider
              label="%"
              labelPosition="bottom"
              lableContenPos="right"
              value={[textSet.opacity * 100]}
              onValueChange={([value]) => {
                if (value !== undefined) {
                  onTextChange(textSet.id, "opacity", value / 100);
                }
              }}
              min={0}
              max={100}
              step={1}
              className="mt-2 text-xs font-semibold"
            />
          </div>
        </div>
      </div>
    </Accordion>
  );
};

export default TextCustomizer;
