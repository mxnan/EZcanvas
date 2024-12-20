import React from "react";
import Image from "next/image";

import { Download, SquareX } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface GeneratedGifSectionProps {
  generatedGif: string | null;
  onReset: () => void;
}

export const GeneratedGifSection = ({
  generatedGif,
  onReset,
}: GeneratedGifSectionProps) => {
  if (!generatedGif) return null;

  const downloadGif = () => {
    const link = document.createElement("a");
    link.href = generatedGif;
    link.download = "mxnan-image-text.gif";
    link.click();
    toast.success("GIF downloaded successfully!");
  };

  return (
    <div className="mt-6 border border-orange-700 dark:border-yellow-500 rounded-lg p-4">
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
        <Button variant={"destructive"} onClick={onReset} className="gap-2">
          <SquareX /> Modify this further
        </Button>
      </div>
      <p className="text-center text-sm text-muted-foreground mt-4">
        <strong className="text-red-500">Note:</strong> If you need to modify
        this GIF, click &quot;Modify this further&quot; to return to editing and
        generate new gif. Otherwise, upload a new image to start fresh.
      </p>
    </div>
  );
};
