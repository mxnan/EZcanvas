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
          <AlertDialogTitle className="text-2xl font-bold">
            Generate GIF
          </AlertDialogTitle>{" "}
          <AlertDialogDescription>
            <span className="text-sm py-4 text-muted-foreground">
              Before generating the GIF, ensure that all values are selected and
              adjusted according to your preferences.
            </span>
          </AlertDialogDescription>
          <div className="p-4 rounded-lg *:font-semibold border border-orange-700 dark:border-yellow-500">
            <p className="font-bold text-lg text-red-500">Important Notice</p>
            <p className="text-sm text-muted-foreground mt-2">
              This process may take some time depending on the size of the image
              and the complexity of the animations applied.
            </p>
            <p className="text-sm text-muted-foreground  mt-2">
              During GIF generation, the screen will become unresponsive, and
              your browser may display a &quot;Page Unresponsive&quot; message.
            </p>
            <p className="text-orange-700 dark:text-yellow-500">
              Please wait patiently for the loader to complete, and your GIF
              will be generated successfully.
            </p>
            <p className="text-sm text-muted-foreground  mt-2">
              Will work on making this process smoother in the future.
            </p>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isGenerating}>Cancel</AlertDialogCancel>

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
