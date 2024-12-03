/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";
import Authenticate from "@/components/_create/authenticate";
import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/utils/supabase/client";
import "@/app/fonts.css";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { removeBackground } from "@imgly/background-removal";

import {
  ArrowRight,
  ImageDownIcon,
  Loader,
  MonitorSmartphone,
} from "lucide-react";
import { Input } from "@/components/ui/input";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ANIMATION_PRESETS } from "@/constants/variants";

const TextCustomizer = dynamic(
  () => import("@/components/_create/text-customizer"),
  {
    ssr: false,
    loading: () => <div className="h-[200px] animate-pulse bg-secondary/30" />,
  }
);
// type AnimationVariants = {
//   [key: string]: any;
// };

// Text Set Types
export interface TextSet {
  id: number;
  text: string;
  fontFamily: string;
  top: number;
  left: number;
  color: string;
  fontSize: number;
  fontWeight: number;
  opacity: number;
  rotation: number;
  zIndex: number;
  animation: keyof typeof ANIMATION_PRESETS;
}

export default function CreatePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false); // Set loading to false once user check completes
    };
    fetchUser();
  }, [supabase]);

  if (loading) {
    return null; // Optionally, you could show a spinner or loading text here
  }

  if (!user) {
    return <Authenticate />;
  }
  ////////////////////////// supabase logic /////////////////////////////

  return (
    <section className="relative flex-1 w-full ">
      <CreateApp />
    </section>
  );
}
//////////////////////// main app down below ///////////////////////////
// app/app/page.tsx or CreateApp.tsx

function CreateApp() {
  const [originalImage, setOriginalImage] = useState<string | null>(null); // Original uploaded image
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null); // Background-removed image
  const [loading, setLoading] = useState(false); // Loading state for uploads
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [textSets, setTextSets] = useState<Array<any>>([]); // Text overlays
  const [isUnsplash, setIsUnsplash] = useState(false); // Unsplash upload dialog toggle
  const [unsplashUrl, setUnsplashUrl] = useState(""); // Unsplash image URL

  // Reset all states to their initial values
  const resetEverything = () => {
    setOriginalImage(null);
    setBackgroundImage(null);
    setTextSets([]);
    setLoading(false);
    setIsUnsplash(false);
    setUnsplashUrl("");
  };

  // Handle file uploads from device
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset everything before processing new image
    resetEverything();
    setLoading(true);

    try {
      const result = await removeBackground(file);
      const originalUrl = URL.createObjectURL(file);
      const bgRemovedUrl = URL.createObjectURL(result);

      setOriginalImage(originalUrl);
      setBackgroundImage(bgRemovedUrl);
      toast.success("Image uploaded and processed successfully!");
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process the image.");
    } finally {
      setLoading(false);
      // Reset the file input value so the same file can be uploaded again
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  // Handle Unsplash URL upload
  const handleUnsplashSubmit = async () => {
    if (!unsplashUrl) {
      toast.error("Please enter a valid URL.");
      return;
    }

    // Reset everything before processing new image
    resetEverything();
    setLoading(true);

    try {
      const response = await fetch(unsplashUrl);
      const blob = await response.blob();
      const file = new File([blob], "unsplash-image", { type: blob.type });

      const result = await removeBackground(file);
      const originalUrl = URL.createObjectURL(file);
      const bgRemovedUrl = URL.createObjectURL(result);

      setOriginalImage(originalUrl);
      setBackgroundImage(bgRemovedUrl);
      toast.success("Unsplash image processed successfully!");
    } catch (error) {
      console.error("Error processing Unsplash image:", error);
      toast.error("Failed to process the Unsplash image.");
    } finally {
      setLoading(false);
    }
  };

  // Add a new text overlay
  const addNewTextSet = () => {
    const newId = Math.max(...textSets.map((set) => set.id), 0) + 1;
    setTextSets((prev) => [
      ...prev,
      {
        id: newId,
        text: "Change this",
        fontFamily: "Inter",
        top: 0,
        left: 0,
        color: "currentColor",
        fontSize: 48,
        fontWeight: 500,
        opacity: 1,
        rotation: 0,
        zIndex: 10,
        animation: "none",
      },
    ]);
  };

  // Update attributes of a specific text overlay
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAttributeChange = useCallback(
    (id: number, attribute: string, value: any) => {
      setTextSets((prev) =>
        prev.map((set) =>
          set.id === id ? { ...set, [attribute]: value } : set
        )
      );
    },
    []
  );

  const removeTextSet = useCallback((id: number) => {
    setTextSets((prev) => prev.filter((set) => set.id !== id));
  }, []);

  // duplicate textset
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const duplicateTextSet = (textSet: any) => {
    const newId = Math.max(...textSets.map((set) => set.id), 0) + 1;
    setTextSets((prev) => [...prev, { ...textSet, id: newId }]);
  };

  return (
    <div className="relative pt-20 flex-1 w-full">
      <div className="min-h-screen px-4 lg:px-8 space-y-6">
        {/* Upload Section */}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
          <h1 className="text-4xl text-start  font-extrabold">
            Create Your GIF
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={loading}>
              <button
                className={cn(
                  " font-extrabold",
                  buttonVariants({ variant: "default" })
                )}
              >
                {loading ? (
                  <>
                    Processing ...
                    <Loader className="animate-spin" />
                  </>
                ) : (
                  <>
                    Upload Image
                    <ArrowRight className="-rotate-45 w-5 h-5 stroke-[3px]" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              sideOffset={10}
              className="flex flex-col gap-1 p-2 w-full"
            >
              <DropdownMenuItem asChild>
                <button
                  className=" text-lg cursor-pointer font-extrabold"
                  onClick={() => setIsUnsplash(true)}
                >
                  <ImageDownIcon className="h-10 w-10 stroke-[2px]" /> from
                  Unsplash
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <button
                  className=" text-lg cursor-pointer font-extrabold"
                  onClick={() => document.getElementById("fileInput")?.click()}
                >
                  <MonitorSmartphone className="h-10 w-10 stroke-[2px]" /> from
                  Device
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <input
            id="fileInput"
            type="file"
            className="hidden"
            accept=".jpeg, .png, .jpg"
            onChange={handleFileChange}
          />

          {isUnsplash && (
            <Dialog open={isUnsplash} onOpenChange={setIsUnsplash}>
              <DialogContent
                className="max-w-4xl"
                onInteractOutside={(e) => {
                  e.preventDefault();
                  setIsUnsplash(false);
                  setUnsplashUrl("");
                }}
              >
                <DialogHeader>
                  <DialogTitle>Enter Unsplash URL</DialogTitle>
                  <DialogDescription>
                    Provide a direct Unsplash image link.
                  </DialogDescription>
                </DialogHeader>
                <Input
                  value={unsplashUrl}
                  onChange={(e) => setUnsplashUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/.."
                />
                <DialogFooter className="flex justify-end gap-2 mt-4">
                  <Button variant="default" onClick={handleUnsplashSubmit}>
                    Upload
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setIsUnsplash(false);
                      setUnsplashUrl("");
                    }}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Image Preview Section */}
        <div className="relative w-full h-auto flex flex-col lg:flex-row gap-8 p-3 border rounded-2xl ">
          {originalImage && backgroundImage ? (
            <div className="relative h-[24rem] lg:h-[24rem] aspect-video backdrop-blur-xl lg:border-y-2 overflow-hidden">
              <div className="flex-1">
                {/* Original Image */}
                <img
                  src={originalImage}
                  alt="Original"
                  className="absolute inset-0 object-contain w-full h-full z-0"
                />
                {/* Text Overlays */}
                {textSets.map((textSet) => (
                  <motion.div
                    key={textSet.id}
                    style={{
                      top: `${textSet.top}%`,
                      left: `${textSet.left}%`,
                      zIndex: textSet.zIndex,
                      opacity: textSet.opacity,
                      rotate: textSet.rotation,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
                  >
                    <motion.div
                      style={{
                        color: textSet.color,
                        fontSize: `${textSet.fontSize}px`,
                        fontWeight: textSet.fontWeight,
                        fontFamily: textSet.fontFamily,
                      }}
                      initial={
                        ANIMATION_PRESETS[textSet.animation]?.variant.initial
                      }
                      animate={
                        ANIMATION_PRESETS[textSet.animation]?.variant.animate
                      }
                      transition={{ type: "tween" }}
                    >
                      {textSet.text}
                    </motion.div>
                  </motion.div>
                ))}
                {/* Background-Removed Image */}
                <img
                  src={backgroundImage}
                  alt="Background Removed"
                  className="absolute inset-0 object-contain w-full h-full z-20"
                />
              </div>
            </div>
          ) : (
            <div className="relative flex-1 flex items-center justify-center w-full min-h-[60vh] rounded-2xl overflow-hidden">
              <Loader className="animate-spin" />
            </div>
          )}

          {/* Text Customization Section */}
          {originalImage && backgroundImage && (
            <div className="flex flex-col w-full">
              <div className="flex flex-col sm:flex-row items-center max-lg:justify-center gap-6 mb-4">
                <Button onClick={addNewTextSet}>Add New Text Overlay</Button>
                <Button variant="destructive" onClick={resetEverything}>
                  Reset Everything
                </Button>
              </div>
              <ScrollArea className="relative h-[40rem] lg:h-[35.7rem] space-y-3 border p-3 rounded-2xl">
                {textSets.length > 0 ? (
                  [...textSets]
                    .reverse()
                    .map((textSet) => (
                      <TextCustomizer
                        key={textSet.id}
                        textSet={textSet}
                        onTextChange={handleAttributeChange}
                        onDelete={removeTextSet}
                        onDuplicate={duplicateTextSet}
                      />
                    ))
                ) : (
                  <div className="absolute inset-0">
                    <div className="relative h-full flex items-center justify-center overflow-hidden ">
                      <Loader className="animate-spin" />
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
