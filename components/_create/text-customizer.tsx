/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button, buttonVariants } from "../ui/button";
import { Eraser, Copy, CheckIcon } from "lucide-react";
import { Label } from "../ui/label";
import Accordion from "../ui/accordion";
import { cn } from "@/lib/utils";
import { DualRangeSlider } from "../ui/slider";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { ALL_FONTS } from "@/constants/fonts";

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
        <div className="flex-1">
          {" "}
          <div className="flex flex-col">
            <div className="flex flex-row gap-8 w-full justify-between">
              {/* text input */}
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
              </div>{" "}
              {/* Color Picker */}
              <div className="flex  flex-col gap-3">
                <Label htmlFor={`color-${textSet.id}`}>Color</Label>
                <HexColorPicker
                  color={textSet.color}
                  onChange={(newColor) =>
                    onTextChange(textSet.id, "color", newColor)
                  }
                  className="w-full "
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
            </div>
            <div>
              <Popover>
                <div className="flex flex-col items-start justify-start my-8">
                  <Label>Font Family</Label>
                  <PopoverTrigger asChild>
                    <Button
                      variant="secondary"
                      role="combobox"
                      className={cn("w-[240px] justify-between mt-3 p-2")}
                    >
                      {textSet.fontFamily
                        ? textSet.fontFamily
                        : "Select font family"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                </div>
                <PopoverContent sideOffset={8} className="w-full p-2">
                  <Command>
                    <CommandInput
                      placeholder="Search font family..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No font family found.</CommandEmpty>
                      <CommandGroup heading="Available Fonts">
                        {ALL_FONTS.map((font) => (
                          <CommandItem
                            value={font}
                            key={font}
                            onSelect={() =>
                              onTextChange(textSet.id, "fontFamily", font)
                            }
                            className="hover:cursor-pointer"
                            style={{ fontFamily: font }}
                          >
                            {font}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4 transition-opacity ease-in-out duration-300",
                                font === textSet.fontFamily
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
