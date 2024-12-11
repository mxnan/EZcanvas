"use client";
import Authenticate from "@/components/_create/dialog/authenticate";
import { buttonVariants } from "@/components/ui/button";
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
  ImageDownIcon,
  Loader,
  MonitorSmartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGifGenerator } from "@/hooks/use-gif-gen";
import { useUserStore } from "@/store/use-user-store";
import GenCount from "@/components/_create/gen-count";
import { ImageDimensions, ImageProcessorResult } from "@/types/image";
import { useImageProcessor } from "@/components/_create/image-processor";
import dynamic from "next/dynamic";
import { TextSet } from "@/types/text";
import { ImagePreview } from "@/components/_create/image-preview";
import { TextCustomizerSection } from "@/components/_create/sections/text-customizer-section";
import { GeneratedGifSection } from "@/components/_create/sections/generated-gif-section";


const UnsplashDialog = dynamic(
  () => import("@/components/_create/dialog/unsplash-dialog"),
  {
    ssr: false,
    loading: () => <div className="animate-pulse bg-secondary/30 h-[300px]" />,
  }
);

const PayDialog = dynamic(() => import("@/components/_create/dialog/pay-dialog"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-secondary/30 h-[300px]" />,
});

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

function CreateApp() {
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions>({
    preview: { width: 0, height: 0 },
    final: { width: 0, height: 0 },
  });

  // Calculate container dimensions based on viewport and device
  const containerWidth = Math.min(window.innerWidth * 0.8, 400);
  const containerHeight = Math.min(window.innerHeight * 0.6, 300);

  // States
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [textSets, setTextSets] = useState<Array<TextSet>>([]);
  const [isUnsplash, setIsUnsplash] = useState(false);
  const [unsplashUrl, setUnsplashUrl] = useState("");
  const [showPayDialog, setShowPayDialog] = useState(false);

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
    setGeneratedGif(null);
  };

  const { handleFileUpload, handleUnsplashUpload } = useImageProcessor({
    onImageProcess: handleImageProcess,
    onLoading: setLoading,
    onShowPayDialog: () => setShowPayDialog(true),
    checkCanGenerate: useUserStore.getState().checkCanGenerate,
    decrementGenerations: useUserStore.getState().decrementGenerations,
    containerWidth,
    containerHeight,
    scaleFactor: 2,
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
      const scaledTextSets = textSets.map((textSet) => ({
        ...textSet,
        animation: textSet.animation || { type: "" },
      }));

      await generateGif({
        images: [originalImage, backgroundImage],
        textData: scaledTextSets,
        previewWidth: imageDimensions.preview.width,
        previewHeight: imageDimensions.preview.height,
      });
    } catch (error) {
      console.error("Error generating GIF:", error);
      toast.error("Failed to generate GIF");
    }
  };

  // Text management functions
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
          type: "",
        },
      },
    ]);
  };

  const handleAttributeChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const handleAnimationTypeChange = useCallback(
    (id: number, animationType: string) => {
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

  const duplicateTextSet = (textSet: TextSet) => {
    const newId = Math.max(...textSets.map((set) => set.id), 0) + 1;
    setTextSets((prev) => [...prev, { ...textSet, id: newId }]);
  };

  return (
    <div className="relative pt-20 flex-1 w-full">
      <div className="min-h-screen px-4 lg:px-8 space-y-6 pb-24">
        {/* Upload Section */}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
          <h1 className="text-4xl text-start font-extrabold">
            Create Your GIF
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={loading}>
              <button
                className={cn(
                  "font-extrabold",
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
                  className="text-lg cursor-pointer font-extrabold"
                  onClick={() => setIsUnsplash(true)}
                >
                  <ImageDownIcon className="h-10 w-10 stroke-[2px]" /> from
                  Unsplash
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <button
                  className="text-lg cursor-pointer font-extrabold"
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

        {/* Image Preview and Text Customizer Section */}
        <div className="relative w-full h-auto flex flex-col lg:flex-row items-center gap-8 p-3 border rounded-2xl">
          <ImagePreview
            originalImage={originalImage}
            backgroundImage={backgroundImage}
            imageDimensions={imageDimensions}
            textSets={textSets}
          />

          {originalImage && backgroundImage && (
            <TextCustomizerSection
              textSets={textSets}
              isGenerating={isGenerating}
              generatedGif={generatedGif}
              onAddNewText={addNewTextSet}
              onClearText={() => setTextSets([])}
              onGenerateGif={handleGifGeneration}
              onTextChange={handleAttributeChange}
              onTextDelete={removeTextSet}
              onTextDuplicate={duplicateTextSet}
              onAnimationChange={handleAnimationTypeChange}
            />
          )}
        </div>

        {/* Generated GIF Section */}
        <GeneratedGifSection
          generatedGif={generatedGif}
          onReset={() => setGeneratedGif(null)}
        />
      </div>

      <PayDialog
        isOpen={showPayDialog}
        onClose={() => setShowPayDialog(false)}
      />
    </div>
  );
}
