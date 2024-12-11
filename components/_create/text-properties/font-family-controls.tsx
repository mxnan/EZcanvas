/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { FONT_FAMILIES } from "@/constants/fonts";
import { cn } from "@/lib/utils";

interface FontFamilySelectorProps {
  id: number;
  fontFamily: string;
  onTextChange: (id: number, attribute: string, value: any) => void;
}

export const FontFamilySelector = ({
  id,
  fontFamily,
  onTextChange,
}: FontFamilySelectorProps) => {
  return (
    <Popover>
      <div className="flex flex-col gap-2">
        <Label>Font Family</Label>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            role="combobox"
            className={cn("w-full justify-between p-2")}
          >
            {fontFamily ? fontFamily : "Select font family"}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent sideOffset={8} className="w-full p-2">
        <Command>
          <CommandInput placeholder="Search font family..." className="h-9" />
          <CommandList>
            <CommandEmpty>No font family found.</CommandEmpty>
            {FONT_FAMILIES.map((category) => (
              <CommandGroup key={category.name} heading={category.name}>
                {category.fonts.map((font) => (
                  <CommandItem
                    value={font}
                    key={font}
                    onSelect={() => onTextChange(id, "fontFamily", font)}
                    className="hover:cursor-pointer"
                    style={{ fontFamily: font }}
                  >
                    {font}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4 transition-opacity ease-in-out duration-300",
                        font === fontFamily ? "opacity-100" : "opacity-0"
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