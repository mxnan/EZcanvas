/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { FONT_FAMILIES } from "@/constants/fonts";
import { motion } from "framer-motion";
import { ANIMATION_REGISTRY } from "@/registry/anim-reg";
import { TextSet } from "@/types/text";

interface TextCustomizerProps {
  textSet: TextSet;
  onTextChange: (id: number, attribute: string, value: any) => void;
  onDelete: (id: number) => void;
  onDuplicate: (textSet: TextSet) => void;
  onAnimationChange?: (id: number, animationType: string) => void;
}

const TextCustomizer = ({
  textSet,
  onTextChange,
  onDelete,
  onDuplicate,
  onAnimationChange, // Add this
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
      <div className="space-y-6">
        {/* Text Input Section */}
        <div className="flex flex-col gap-4 pb-6">
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
          {/* Position Controls */}
          <div className="flex flex-col lg:flex-row lg:*:w-full gap-8">
            {/* Position X */}
            <div className="flex flex-col gap-4">
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

            {/* Position Y */}
            <div className="flex flex-col gap-4">
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
          {/* Font and Animation Controls */}
          <div className="py-4 flex flex-col items-center xl:flex-row xl:items-center xl:justify-around gap-4">
            {/* Font Family */}
            <Popover>
              <div className="flex flex-col gap-2">
                <Label>Font Family</Label>
                <PopoverTrigger asChild>
                  <Button
                    variant="secondary"
                    role="combobox"
                    className={cn("w-full justify-between p-2")}
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
                    {FONT_FAMILIES.map((category) => (
                      <CommandGroup key={category.name} heading={category.name}>
                        {category.fonts.map((font) => (
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
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {/* Color Picker */}
            <div className="py-6">
              <HexColorPicker
                color={textSet.color}
                onChange={(newColor) =>
                  onTextChange(textSet.id, "color", newColor)
                }
                className=""
              />
            </div>
            {/* Animation Style */}
            <Popover>
              <div className="flex flex-col gap-2">
                <Label>Animation Style</Label>
                <PopoverTrigger asChild>
                  <Button
                    variant="secondary"
                    role="combobox"
                    className={cn("w-full justify-between")}
                  >
                    {textSet.animation?.type
                      ? ANIMATION_REGISTRY[textSet.animation.type]?.description
                      : "Select animation"}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
              </div>
              <PopoverContent className="w-[400px] p-4" align="start">
                <Command>
                  <CommandInput placeholder="Search animations..." />
                  <CommandList>
                    <CommandEmpty>No animations found.</CommandEmpty>
                    {Object.entries(ANIMATION_REGISTRY)
                      .reduce((acc, [_, config]) => {
                        if (!acc.includes(config.category)) {
                          acc.push(config.category);
                        }
                        return acc;
                      }, [] as string[])
                      .map((category) => (
                        <CommandGroup
                          key={category}
                          heading={
                            category.charAt(0).toUpperCase() + category.slice(1)
                          }
                        >
                          {Object.entries(ANIMATION_REGISTRY)
                            .filter(
                              ([_, config]) => config.category === category
                            )
                            .map(([key, config]) => (
                              <CommandItem
                                key={key}
                                value={key}
                                onSelect={() =>
                                  onAnimationChange?.(textSet.id, key)
                                }
                                className="flex items-center gap-4 p-2"
                              >
                                <div className="flex-1">
                                  <div className="font-medium">
                                    {config.description}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Duration: {config.duration}ms
                                  </div>
                                </div>
                                <div className="w-24">
                                  <motion.div
                                    className="h-12 bg-secondary/20 rounded-md flex items-center justify-center"
                                    initial={Object.fromEntries(
                                      Object.entries(config.properties).map(
                                        ([key, [initial]]) => [key, initial]
                                      )
                                    )}
                                    animate={Object.fromEntries(
                                      Object.entries(config.properties).map(
                                        ([key, [, final]]) => [key, final]
                                      )
                                    )}
                                    transition={{
                                      duration: config.duration / 60,
                                      ease: config.easing,
                                      repeat: Infinity,
                                      repeatDelay: 1,
                                    }}
                                  >
                                    <span className="text-xs">Preview</span>
                                  </motion.div>
                                </div>
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    textSet.animation?.type === key
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Font Properties */}
          <div className="flex flex-col gap-4">
            {/* Font Weight */}
            <div className="flex flex-col gap-2">
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

            {/* Font Size */}
            <div className="flex flex-col gap-2">
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
                max={200}
                step={2}
                className="mt-2 text-xs font-semibold"
              />
            </div>

            {/* Z-Index */}
            <div className="flex flex-col gap-2">
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

          {/* Rotation and Opacity */}
          <div className="mt-4 flex flex-col gap-8">
            {/* Rotation */}
            <div className="flex flex-col gap-4">
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

            {/* Opacity */}
            <div className="flex flex-col gap-2">
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
      </div>
    </Accordion>
  );
};

export default TextCustomizer;
