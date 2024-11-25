/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import {  buttonVariants } from "../ui/button";
import { Eraser } from "lucide-react";
import { Label } from "../ui/label";
import Accordion from "../ui/accordion";
import { cn } from "@/lib/utils";

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
  };
  onTextChange: (id: number, attribute: string, value: any) => void;
  onDelete: (id: number) => void;
}

const TextCustomizer = ({
  textSet,
  onTextChange,
  onDelete,
}: TextCustomizerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange =
    (attribute: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      onTextChange(textSet.id, attribute, event.target.value);
    };

  return (
    <Accordion
      title={textSet.text || "Text Overlay"}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      rightElement={
        <span
          className={cn(
            "",
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
      }
    >
      <div className="space-y-3">
        {/* Text Input */}
        <div>
          <Label htmlFor={`text-${textSet.id}`}>Text Content</Label>
          <Input
            id={`text-${textSet.id}`}
            type="text"
            value={textSet.text}
            onChange={handleChange("text")}
            placeholder="Edit Text"
            className="w-full"
          />
        </div>

        {/* Color and Font Size Group */}
        <div className="flex gap-3">
          <div className="w-1/3">
            <Label htmlFor={`color-${textSet.id}`}>Color</Label>
            <Input
              id={`color-${textSet.id}`}
              type="color"
              value={textSet.color}
              onChange={handleChange("color")}
              className="w-full h-10"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor={`fontSize-${textSet.id}`}>Font Size</Label>
            <Input
              id={`fontSize-${textSet.id}`}
              type="number"
              value={textSet.fontSize}
              onChange={handleChange("fontSize")}
              placeholder="24"
              className="w-full"
            />
          </div>
        </div>

        {/* Position Controls */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor={`left-${textSet.id}`}>Position X (%)</Label>
            <Input
              id={`left-${textSet.id}`}
              type="number"
              value={textSet.left}
              onChange={handleChange("left")}
              placeholder="0"
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor={`top-${textSet.id}`}>Position Y (%)</Label>
            <Input
              id={`top-${textSet.id}`}
              type="number"
              value={textSet.top}
              onChange={handleChange("top")}
              placeholder="0"
              className="w-full"
            />
          </div>
        </div>

        {/* Rotation and Opacity */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor={`rotation-${textSet.id}`}>Rotation (deg)</Label>
            <Input
              id={`rotation-${textSet.id}`}
              type="number"
              value={textSet.rotation}
              onChange={handleChange("rotation")}
              placeholder="0"
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor={`opacity-${textSet.id}`}>Opacity</Label>
            <Input
              id={`opacity-${textSet.id}`}
              type="number"
              value={textSet.opacity}
              onChange={handleChange("opacity")}
              placeholder="1"
              step="0.1"
              min="0"
              max="1"
              className="w-full"
            />
          </div>
        </div>

        {/* Font Family */}
        <div>
          <Label htmlFor={`fontFamily-${textSet.id}`}>Font Family</Label>
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
    </Accordion>
  );
};

export default TextCustomizer;
