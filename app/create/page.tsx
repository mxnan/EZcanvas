/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";
import Authenticate from "@/components/_create/authenticate";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowRight,
  Download,
  ImageDownIcon,
  Loader,
  MonitorSmartphone,
  SquareX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useGifGenerator } from "@/hooks/use-gif-gen";
import { useUserStore } from "@/store/use-user-store";
import GenCount from "@/components/_create/gen-count";
import PayDialog from "@/components/_create/pay-dialog";
import { ImageProcessorResult } from "@/types/image";
import { useImageProcessor } from "@/components/_create/image-processor";
import { UnsplashDialog } from "@/components/_create/unsplash-dialog";
import dynamic from "next/dynamic";
import {  AnimationType } from "@/types/animation";
import { TextSet } from "@/types/text";
const TextCustomizer = dynamic(
  () => import("@/components/_create/text-customizer"),
  {
    ssr: false,
    loading: () => <div className="h-[170px] animate-pulse bg-secondary/30" />,
  }
);

export default function CreatePage() {
  const { profile, isLoading } = useUserStore();

  if (isLoading) {
    return <Authenticate showDialog={false} />;
  }

  if (!profile) {
    return <Authenticate showDialog={true} />;
  }

  return (
    <section className="relative flex-1 w-full">
      <CreateApp />
    </section>
  );
}
//////////////////////// main app down below ///////////////////////////
// app/app/page.tsx or CreateApp.tsx

function CreateApp() {
  const containerWidth = 450;
  const containerHeight = 300;
  const SCALE_FACTOR = 2;

  // States

  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [textSets, setTextSets] = useState<Array<TextSet>>([]);
  const [isUnsplash, setIsUnsplash] = useState(false);
  const [unsplashUrl, setUnsplashUrl] = useState("");
  const [showPayDialog, setShowPayDialog] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    preview: { width: containerWidth, height: containerHeight },
    final: {
      width: containerWidth * SCALE_FACTOR,
      height: containerHeight * SCALE_FACTOR,
    },
  });

  const { isGenerating, generatedGif, generateGif, setGeneratedGif } =
    useGifGenerator();

  // Callbacks and handlers
  const handleImageProcess = useCallback((result: ImageProcessorResult) => {
    setOriginalImage(result.originalUrl);
    setBackgroundImage(result.bgRemovedUrl);
    setImageDimensions(result.dimensions);
  }, []);

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

  const { handleFileUpload, handleUnsplashUpload } = useImageProcessor({
    onImageProcess: handleImageProcess,
    onLoading: setLoading,
    onShowPayDialog: () => setShowPayDialog(true),
    checkCanGenerate: useUserStore.getState().checkCanGenerate,
    decrementGenerations: useUserStore.getState().decrementGenerations,
    containerWidth,
    containerHeight,
    scaleFactor: SCALE_FACTOR,
  });

  // Handle file uploads from device
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    resetEverything();
    await handleFileUpload(file);

    if (event.target) {
      event.target.value = "";
    }
  };
  // Handle Unsplash URL upload
  const handleUnsplashSubmit = async () => {
    if (!unsplashUrl) {
      toast.error("Please enter a valid URL.");
      return;
    }

    resetEverything();
    await handleUnsplashUpload(unsplashUrl);
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
        // Ensure animation type is included
        animation: textSet.animation || { type: "fadeInSlideUp" },
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
        fontFamily: "Open Sans",
        top: 0,
        left: 0,
        color: "currentColor",
        fontSize: 48,
        fontWeight: 500,
        opacity: 1,
        rotation: 0,
        zIndex: 10,
        animation: {
          type: "fadeInSlideUp", // Default animation
        },
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
  // Add a method to handle animation type change
  const handleAnimationTypeChange = useCallback(
    (id: number, animationType: AnimationType) => {
      setTextSets((prev) =>
        prev.map((textSet) =>
          textSet.id === id
            ? {
                ...textSet,
                animation: {
                  type: animationType,
                },
              }
            : textSet
        )
      );
    },
    []
  );

  // duplicate textset
  const duplicateTextSet = (textSet: TextSet) => {
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
          <GenCount />
          <input
            id="fileInput"
            type="file"
            className="hidden"
            accept=".jpeg, .png, .jpg"
            onChange={handleFileChange}
          />

          <UnsplashDialog
            isOpen={isUnsplash}
            onClose={() => {
              setIsUnsplash(false);
              setUnsplashUrl("");
            }}
            onSubmit={handleUnsplashSubmit}
            url={unsplashUrl}
            onUrlChange={setUnsplashUrl}
          />
        </div>

        {/* Image Preview Section */}
        <div className="relative w-full h-auto flex flex-col xl:flex-row gap-8 p-3 border rounded-2xl">
          {originalImage && backgroundImage ? (
            <div
              className="relative mx-auto xl:mx-8"
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
              <div className="flex flex-col sm:flex-row items-center max-xl:justify-center gap-6 mb-4">
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
                        onAnimationChange={handleAnimationTypeChange}
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
              Note: If you need to modify this GIF, click &quot;Modify this
              further&quot; to return to editing and generate new gif.
              Otherwise, upload a new image to start fresh.
            </p>
          </div>
        )}
      </div>
      <PayDialog
        isOpen={showPayDialog}
        onClose={() => setShowPayDialog(false)}
      />
    </div>
  );
}
