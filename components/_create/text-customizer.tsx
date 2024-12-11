import React, { useState } from "react";
import { buttonVariants } from "../ui/button";
import { Eraser, Copy } from "lucide-react";
import Accordion from "../ui/accordion";
import { cn } from "@/lib/utils";
import { TextSet } from "@/types/text";
import { TextInput } from "./text-properties/input-controls";
import { PositionControls } from "./text-properties/position-controls";
import { FontFamilySelector } from "./text-properties/font-family-controls";
import { ColorPicker } from "./text-properties/color-controls";
import { AnimationSelector } from "./text-properties/anim-controls";
import { FontProperties } from "./text-properties/font-controls";
import { TransformControls } from "./text-properties/transform-controls";

interface TextCustomizerProps {
  textSet: TextSet;
  onTextChange: (id: number, attribute: string, value: string) => void;
  onDelete: (id: number) => void;
  onDuplicate: (textSet: TextSet) => void;
  onAnimationChange?: (id: number, animationType: string) => void;
}

const TextCustomizer = ({
  textSet,
  onTextChange,
  onDelete,
  onDuplicate,
  onAnimationChange,
}: TextCustomizerProps) => {
  const [isOpen, setIsOpen] = useState(false);

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
        <div className="flex flex-col gap-4 pb-6">
          {/* Text Input */}
          <TextInput
            id={textSet.id}
            text={textSet.text}
            onTextChange={onTextChange}
          />

          {/* Position Controls */}
          <PositionControls
            id={textSet.id}
            left={textSet.left}
            top={textSet.top}
            onTextChange={onTextChange}
          />

          {/* Font and Animation Controls */}
          <div className="py-4 flex flex-col items-center xl:flex-row xl:items-center xl:justify-around gap-4">
            <FontFamilySelector
              id={textSet.id}
              fontFamily={textSet.fontFamily}
              onTextChange={onTextChange}
            />
            <ColorPicker
              id={textSet.id}
              color={textSet.color}
              onTextChange={onTextChange}
            />
            <AnimationSelector
              id={textSet.id}
              animation={textSet.animation}
              onAnimationChange={onAnimationChange!}
            />
          </div>

          {/* Font Properties */}
          <FontProperties
            id={textSet.id}
            fontWeight={textSet.fontWeight}
            fontSize={textSet.fontSize}
            onTextChange={onTextChange}
          />

          {/* Transform Controls */}
          <TransformControls
            id={textSet.id}
            rotation={textSet.rotation}
            opacity={textSet.opacity}
            zIndex={textSet.zIndex}
            onTextChange={onTextChange}
          />
        </div>
      </div>
    </Accordion>
  );
};

export default TextCustomizer;
