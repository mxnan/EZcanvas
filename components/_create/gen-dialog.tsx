import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface GenerateGifDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isGenerating: boolean;
}

export default function GenerateGifDialog({
  isOpen,
  onClose,
  onConfirm,
  isGenerating,
}: GenerateGifDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Generate GIF</AlertDialogTitle>
          <AlertDialogDescription>
            This will generate an animated GIF with your text overlays and
            animations. The process may take a few seconds. Are you ready to
            proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isGenerating}>Cancel</AlertDialogCancel>
          {/* Replace AlertDialogAction with Button */}
          <Button
            onClick={onConfirm}
            disabled={isGenerating}
            className="gap-2"
            variant="destructive"
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
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}