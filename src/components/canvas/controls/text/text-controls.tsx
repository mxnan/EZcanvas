// src/components/canvas/controls/text-controls.tsx
import React from "react";
import { fabric } from "fabric";
import { CustomFabricObject } from "@/types/object"; // Import the custom type
import ColorPicker from "../color-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  BookType,
  Check,
  CornerDownLeft,
  Italic,
  MoveHorizontal,
  MoveVertical,
  Scale3d,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TextControlsProps {
  activeObject: CustomFabricObject | null;
  fabricCanvasRef: React.RefObject<fabric.Canvas | null>;
}

const TextControls: React.FC<TextControlsProps> = ({
  activeObject,
  fabricCanvasRef,
}) => {
  const [isItalic, setIsItalic] = React.useState(false); // State to track italic status
  const [selectedFont, setSelectedFont] = React.useState<string>(""); // State to track selected font
  const [skewX, setSkewX] = React.useState(0); // State for skewX
  const [skewY, setSkewY] = React.useState(0); // State for skewY
  const [borderColor, setBorderColor] = React.useState<string>("#000000");
  const [borderThickness, setBorderThickness] = React.useState<number>(0.5);

  // Updated font families to use the specified fonts
  const fontFamilies = [
    { label: "Bangers", value: "Bangers" },
    { label: "Black Ops One", value: "Black Ops One" },
    { label: "Bruno Ace SC", value: "Bruno Ace SC" },
    { label: "Metrophobic", value: "Metrophobic" },
    { label: "Nerko One", value: "Nerko One" },
    { label: "Permanent Marker", value: "Permanent Marker" },
    { label: "Protest Revolution", value: "Protest Revolution" },
    { label: "Russo One", value: "Russo One" },
    { label: "Staatliches", value: "Staatliches" },
    { label: "Wallpoet", value: "Wallpoet" },
    // ... existing fonts ...
    { label: "Bungee Shade", value: "Bungee Shade" }, // 3D shadow effect
    { label: "Creepster", value: "Creepster" }, // Horror style
    { label: "Faster One", value: "Faster One" }, // Racing style
    { label: "Monoton", value: "Monoton" }, // Retro neon
    { label: "Press Start 2P", value: "Press Start 2P" }, // 8-bit pixel
    { label: "Rubik Glitch", value: "Rubik Glitch" }, // Glitch effect
    { label: "Rubik Vinyl", value: "Rubik Vinyl" }, // Record label style
    { label: "Silkscreen", value: "Silkscreen" }, // Clean pixel
    { label: "VT323", value: "VT323" }, // Terminal style
    { label: "Nabla", value: "Nabla" }, // 3D isometric
    { label: "Tilt Prism", value: "Tilt Prism" }, // Prismatic effect
    { label: "Pixelify Sans", value: "Pixelify Sans" }, // Modern pixel
    { label: "Bungee Spice", value: "Bungee Spice" }, // Spicy gradient
    { label: "Butcherman", value: "Butcherman" }, // Horror carved
    { label: "Nosifer", value: "Nosifer" }, // Gothic metal
    { label: "Rubik Burned", value: "Rubik Burned" }, // Burned effect
    { label: "Rubik Maps", value: "Rubik Maps" }, // Map style
    { label: "Stick", value: "Stick" }, // Stick figure
    { label: "Tourney", value: "Tourney" }, // Sports display
    { label: "Zen Tokyo Zoo", value: "Zen Tokyo Zoo" }, // Japanese display
  ];

  if (!activeObject || !(activeObject instanceof fabric.IText)) {
    return null; // Return null if no active text object
  }

  const handleBorderColorChange = (color: string) => {
    setBorderColor(color);
    if (activeObject) {
      activeObject.set({ stroke: color });
      fabricCanvasRef.current?.renderAll();
    }
  };

  const handleBorderThicknessChange = (value: number) => {
    setBorderThickness(value);
    if (activeObject) {
      activeObject.set({ strokeWidth: value });
      fabricCanvasRef.current?.renderAll();
    }
  };

  const handleColorChange = (color: string) => {
    activeObject.set({ fill: color });
    fabricCanvasRef.current?.renderAll();
  };

  const handleTextAlign = (alignment: string) => {
    activeObject.set({ textAlign: alignment });
    fabricCanvasRef.current?.renderAll();
  };

  const toggleItalic = () => {
    const newItalicState = !isItalic;
    setIsItalic(newItalicState);
    activeObject.set({ fontStyle: newItalicState ? "italic" : "normal" });
    fabricCanvasRef.current?.renderAll();
  };

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    activeObject.set({ fontFamily: font });
    fabricCanvasRef.current?.renderAll();
  };

  const handleSkewChange = (axis: "x" | "y", value: number) => {
    if (axis === "x") {
      setSkewX(value);
      activeObject.set({ skewX: value });
    } else {
      setSkewY(value);
      activeObject.set({ skewY: value });
    }
    fabricCanvasRef.current?.renderAll();
  };

  return (
    <div className="p-2 flex flex-col gap-2">
      <ColorPicker
        currentColor={activeObject.fill as string}
        onChange={handleColorChange}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"} size={"icon"}>
            <AlignJustify />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="left"
          sideOffset={10}
          className="w-min flex gap-1 p-2"
        >
          <Button
            onClick={() => handleTextAlign("center")}
            variant={"default"}
            size={"icon"}
          >
            <AlignCenter />{" "}
          </Button>
          <Button
            onClick={() => handleTextAlign("left")}
            variant={"default"}
            size={"icon"}
          >
            <AlignLeft />{" "}
          </Button>
          <Button
            onClick={() => handleTextAlign("right")}
            variant={"default"}
            size={"icon"}
          >
            <AlignRight />{" "}
          </Button>
        </PopoverContent>
      </Popover>
      <Button
        variant={isItalic ? "default" : "outline"}
        size={"icon"}
        onClick={toggleItalic} // Add onClick handler
        // className={isItalic ? "text-blue-500" : ""} // Optional: Change color if italic
      >
        <Italic />
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"} size={"icon"}>
            <BookType />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="left" sideOffset={10} className="p-2 w-[210px]">
          <Command>
            <CommandInput
              placeholder="Search font..."
              className="h-8 placeholder:text-xs"
            />
            <CommandList className="max-h-64 overflow-y-auto">
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {fontFamilies.map((font) => (
                  <CommandItem
                    key={font.value}
                    value={font.value}
                    onSelect={() => handleFontChange(font.value)}
                    className="truncate text-xs"
                  >
                    {font.label}
                    <Check
                      className={
                        selectedFont === font.value
                          ? "opacity-100"
                          : "opacity-0"
                      }
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"} size={"icon"}>
            <Scale3d />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="left" sideOffset={10}>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MoveHorizontal className="w-4 h-4" />
              <input
                type="range"
                min="-60"
                max="60"
                value={skewX}
                className="flex-1 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                onChange={(e) =>
                  handleSkewChange("x", parseInt(e.target.value))
                }
              />
              <span className="text-xs w-8 text-right">{skewX}°</span>
            </div>
            <div className="flex items-center gap-2">
              <MoveVertical className="w-4 h-4" />
              <input
                type="range"
                min="-60"
                max="60"
                value={skewY}
                className="flex-1 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                onChange={(e) =>
                  handleSkewChange("y", parseInt(e.target.value))
                }
              />
              <span className="text-xs w-8 text-right">{skewY}°</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {/* Combined Popover for Border Color and Thickness */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            // style={{ backgroundColor: borderColor }}
          >
            <CornerDownLeft className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="left"
          sideOffset={10}
          className="p-2 w-full flex items-center gap-2"
        >
          <ColorPicker
            currentColor={borderColor}
            onChange={handleBorderColorChange}
          />
          <div className="w-full">
            <input
              type="range"
              min="0"
              max="4"
              step="0.4"
              value={borderThickness}
              onChange={(e) =>
                handleBorderThicknessChange(parseFloat(e.target.value))
              }
              className="h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TextControls;
