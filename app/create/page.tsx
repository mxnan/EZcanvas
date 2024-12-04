/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";
import Authenticate from "@/components/_create/authenticate";
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
  Download,
  ImageDownIcon,
  Loader,
  MonitorSmartphone,
  SquareX,
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

import Image from "next/image";
import { useGifGenerator } from "@/hooks/use-gif-gen";
// import { useGifGenerator } from "@/hooks/use-gif";

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
  const containerWidth = 500; // Max preview container width
  const containerHeight = 300; // Max preview container height
  const SCALE_FACTOR = 2; // Scale factor for final GIF resolution

  const [imageDimensions, setImageDimensions] = useState({
    preview: { width: 0, height: 0 },
    final: { width: 0, height: 0 },
  });

  // Calculate both preview and final dimensions
  const calculateDimensions = (
    originalWidth: number,
    originalHeight: number
  ) => {
    let previewWidth = containerWidth;
    let previewHeight = containerHeight;
    const aspectRatio = originalWidth / originalHeight;

    if (originalHeight > originalWidth) {
      // Portrait
      previewHeight = containerHeight;
      previewWidth = previewHeight * aspectRatio;
    } else {
      // Landscape
      previewWidth = containerWidth;
      previewHeight = previewWidth / aspectRatio;
    }

    // Calculate final dimensions (scaled up)
    const finalWidth = previewWidth * SCALE_FACTOR;
    const finalHeight = previewHeight * SCALE_FACTOR;

    return {
      preview: { width: previewWidth, height: previewHeight },
      final: { width: finalWidth, height: finalHeight },
    };
  };

  const [originalImage, setOriginalImage] = useState<string | null>(null); // Original uploaded image
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null); // Background-removed image
  const [loading, setLoading] = useState(false); // Loading state for uploads
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [textSets, setTextSets] = useState<Array<any>>([]); // Text overlays
  const [isUnsplash, setIsUnsplash] = useState(false); // Unsplash upload dialog toggle
  const [unsplashUrl, setUnsplashUrl] = useState(""); // Unsplash image URL
  // Add these new states with your existing ones
  const { isGenerating, generatedGif, generateGif, setGeneratedGif } =
    useGifGenerator();

  // Reset all states to their initial values
  const resetEverything = () => {
    setOriginalImage(null);
    setBackgroundImage(null);
    setTextSets([]);
    setLoading(false);
    setIsUnsplash(false);
    setUnsplashUrl("");
    setGeneratedGif(null); // Now this will work properly
  };

  // Handle file uploads from device
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    resetEverything(); // Reset everything before processing new image
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const result = await removeBackground(file);
      const originalUrl = URL.createObjectURL(file);
      const bgRemovedUrl = URL.createObjectURL(result);

      // Get image dimensions
      const img = new (window as any).Image();
      img.onload = () => {
        const dimensions = calculateDimensions(
          img.naturalWidth,
          img.naturalHeight
        );
        setImageDimensions(dimensions);
      };
      img.src = originalUrl;

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
    resetEverything(); // Reset everything before processing new image
    if (!unsplashUrl) {
      toast.error("Please enter a valid URL.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(unsplashUrl);
      const blob = await response.blob();
      const file = new File([blob], "unsplash-image", { type: blob.type });

      const result = await removeBackground(file);
      const originalUrl = URL.createObjectURL(file);
      const bgRemovedUrl = URL.createObjectURL(result);

      // Get image dimensions
      const img = new (window as any).Image();
      img.onload = () => {
        const dimensions = calculateDimensions(
          img.naturalWidth,
          img.naturalHeight
        );
        setImageDimensions(dimensions);
      };
      img.src = originalUrl;

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

  const handleGifGeneration = async () => {
    if (!originalImage || !backgroundImage || !textSets.length) {
      toast.error("Please add an image and at least one text overlay");
      return;
    }

    try {
      // Scale up text properties for final GIF
      const scaledTextSets = textSets.map((textSet) => ({
        ...textSet,
        fontSize: textSet.fontSize * SCALE_FACTOR,
        // Keep percentage-based properties (top, left) the same
        // as they're relative to dimensions
      }));

      await generateGif({
        images: [originalImage, backgroundImage],
        textData: scaledTextSets,
        gifWidth: imageDimensions.final.width,
        gifHeight: imageDimensions.final.height,
        delay: 0,
      });
    } catch (error) {
      console.error("Error generating GIF:", error);
      toast.error("Failed to generate GIF");
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

  // Download GIF and reset states
  const downloadGif = () => {
    if (!generatedGif) return;
    const link = document.createElement("a");
    link.href = generatedGif;
    link.download = "mxnan-image-text.gif";
    link.click();
    toast.success("GIF downloaded successfully!");
    // resetEverything(); // Reset everything after downloading the GIF
  };

  return (
    <div className="relative pt-20 flex-1 w-full">
      <div className="min-h-screen px-4 lg:px-8 space-y-6 pb-24">
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
        <div className="relative w-full h-auto flex flex-col lg:flex-row gap-8 p-3 border rounded-2xl">
          {originalImage && backgroundImage ? (
            <div
              className="relative mx-auto"
              style={{
                width: imageDimensions.preview.width,
                height: imageDimensions.preview.height,
                maxWidth: "100%",
                aspectRatio: `${imageDimensions.preview.width} / ${imageDimensions.preview.height}`,
              }}
            >
              <div className="flex-1 relative w-full h-full">
                {/* Original Image */}
                <img
                  src={originalImage}
                  alt="Original"
                  style={{
                    width: imageDimensions.preview.width,
                    height: imageDimensions.preview.height,
                  }}
                  className="absolute inset-0 object-contain z-0"
                />
                {/* Text Overlays */}
                {textSets.map((textSet) => (
                  <div
                    key={textSet.id}
                    style={{
                      position: "absolute",
                      top: `${textSet.top}%`,
                      left: `${textSet.left}%`,
                      transform: `translate(-50%, -50%)`,
                      color: textSet.color,
                      fontSize: `${textSet.fontSize}px`,
                      fontWeight: textSet.fontWeight,
                      fontFamily: textSet.fontFamily,
                      zIndex: textSet.zIndex,
                      opacity: textSet.opacity,
                      rotate: `${textSet.rotation}deg`,
                    }}
                    className="whitespace-nowrap"
                  >
                    {textSet.text}
                  </div>
                ))}
                {/* Background-Removed Image */}
                <img
                  src={backgroundImage}
                  alt="Background Removed"
                  style={{
                    width: imageDimensions.preview.width,
                    height: imageDimensions.preview.height,
                  }}
                  className="absolute inset-0 object-contain z-20"
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
                <Button
                  onClick={() => {
                    setTextSets([]);
                    toast.success("Text overlays cleared");
                  }}
                >
                  Reset textsets
                </Button>
                {/* <Button variant="destructive" onClick={resetEverything}>
                  Reset Everything
                </Button> */}
                <Button
                  onClick={handleGifGeneration}
                  disabled={Boolean(
                    isGenerating || !textSets.length || generatedGif
                  )}
                  className="gap-2"
                  variant={"destructive"}
                >
                  {isGenerating ? (
                    <>
                      Generating GIF
                      <Loader className="h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    "Generate GIF"
                  )}
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

        {generatedGif && (
          <div className="mt-6 border rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Generated GIF Preview</h2>
            <div className="relative aspect-video h-96 w-full overflow-hidden rounded-lg">
              <Image
                src={generatedGif}
                alt="Generated GIF"
                fill
                priority
                unoptimized
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-6 flex max-sm:flex-col gap-4 justify-center">
              <Button onClick={downloadGif} className="gap-2">
                <Download className="h-4 w-4" />
                Download GIF
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => {
                  setGeneratedGif(null);
                }}
                className="gap-2"
              >
                <SquareX /> Modify this further
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Note: If you need to modify this GIF, click &quot;Modify this further&quot; to return to editing and generate new gif. Otherwise, upload a new image
              to start fresh.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
