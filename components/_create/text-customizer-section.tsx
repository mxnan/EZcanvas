/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { TextSet } from "@/types/text";
import dynamic from "next/dynamic";
import GenerateGifDialog from "./gen-dialog";

const TextCustomizer = dynamic(() => import("./text-customizer"), {
  ssr: false,
  loading: () => <div className="h-[170px] animate-pulse bg-secondary/30" />,
});

interface TextCustomizerSectionProps {
  textSets: Array<TextSet>;
  isGenerating: boolean;
  generatedGif: string | null;
  onAddNewText: () => void;
  onClearText: () => void;
  onGenerateGif: () => void;
  onTextChange: (id: number, attribute: string, value: any) => void;
  onTextDelete: (id: number) => void;
  onTextDuplicate: (textSet: TextSet) => void;
  onAnimationChange: (id: number, animationType: string) => void;
}

export const TextCustomizerSection = ({
  textSets,
  isGenerating,
  generatedGif,
  onAddNewText,
  onClearText,
  onGenerateGif,
  onTextChange,
  onTextDelete,
  onTextDuplicate,
  onAnimationChange,
}: TextCustomizerSectionProps) => {
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);

  const handleGenerateClick = () => {
    if (!textSets.length) {
      toast.error("Please add at least one text overlay");
      return;
    }
    setShowGenerateDialog(true);
  };

  const handleConfirm = async () => {
    try {
      await onGenerateGif();
      // Dialog will only close after GIF generation is complete
      setShowGenerateDialog(false);
    } catch (error) {
      console.error("Error generating GIF:", error);
      toast.error("Failed to generate GIF");
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-4">
        <Button onClick={onAddNewText} disabled={Boolean(generatedGif)}>
          Add New Text Overlay
        </Button>
        <Button
          disabled={Boolean(!textSets.length || generatedGif)}
          onClick={() => {
            onClearText();
            toast.success("Text overlays cleared");
          }}
        >
          Reset textsets
        </Button>
        <Button
          onClick={handleGenerateClick}
          disabled={Boolean(!textSets.length || generatedGif)}
          className="gap-2"
          variant={"destructive"}
        >
          Start
        </Button>
      </div>

      <GenerateGifDialog
        isOpen={showGenerateDialog}
        onClose={() => setShowGenerateDialog(false)}
        onConfirm={handleConfirm}
        isGenerating={isGenerating}
      />

      <ScrollArea className="relative min-h-24 max-h-[30rem] overflow-y-scroll space-y-3 border p-3 rounded-2xl">
        {textSets.length > 0 ? (
          [...textSets]
            .reverse()
            .map((textSet) => (
              <TextCustomizer
                key={textSet.id}
                textSet={textSet}
                onTextChange={onTextChange}
                onDelete={onTextDelete}
                onDuplicate={onTextDuplicate}
                onAnimationChange={onAnimationChange}
              />
            ))
        ) : (
          <div className="absolute inset-0 ">
            <div className="relative h-full flex flex-wrap gap-4 items-center justify-center overflow-hidden">
              Add some textsets here <Loader className="animate-spin" />
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
