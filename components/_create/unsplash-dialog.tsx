import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UnsplashDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string) => Promise<void>;
  url: string;
  onUrlChange: (url: string) => void;
}

export function UnsplashDialog({ isOpen, onClose, onSubmit, url, onUrlChange }: UnsplashDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl"
        onInteractOutside={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        <DialogHeader>
          <DialogTitle>Enter Unsplash URL</DialogTitle>
          <DialogDescription>
            Provide a direct Unsplash image link.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://images.unsplash.com/.."
        />
        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="default" onClick={() => onSubmit(url)}>
            Upload
          </Button>
          <Button
            variant="destructive"
            onClick={onClose}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}