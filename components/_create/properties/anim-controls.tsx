/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from "react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../ui/command";
import { motion } from "framer-motion";
import { ANIMATION_REGISTRY } from "@/registry/anim-reg";
import { cn } from "@/lib/utils";

interface AnimationSelectorProps {
  id: number;
  animation: { type: string } | undefined;
  onAnimationChange: (id: number, animationType: string) => void;
}

export const AnimationSelector = ({
  id,
  animation,
  onAnimationChange,
}: AnimationSelectorProps) => {
  return (
    <Popover>
      <div className="flex flex-col gap-2">
        <Label>Animation Style</Label>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            role="combobox"
            className={cn("w-full justify-between")}
          >
            {animation?.type
              ? ANIMATION_REGISTRY[animation.type]?.description
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
                  heading={category.charAt(0).toUpperCase() + category.slice(1)}
                >
                  {Object.entries(ANIMATION_REGISTRY)
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    .filter(([_, config]) => config.category === category)
                    .map(([key, config]) => (
                      <CommandItem
                        key={key}
                        value={key}
                        onSelect={() => onAnimationChange?.(id, key)}
                        className="flex items-center gap-4 p-2"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{config.description}</div>
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
                            animation?.type === key ? "opacity-100" : "opacity-0"
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
  );
}; 