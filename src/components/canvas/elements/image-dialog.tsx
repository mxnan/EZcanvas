import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageIcon, Upload } from "lucide-react";
import { fabric } from "fabric";
import { CustomFabricObject } from "@/types/object";
import { generateRandomId } from "@/lib/utils";

interface ImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fabricCanvasRef: React.RefObject<fabric.Canvas | null>;
  addObject: (object: { id: string; type: string; properties: CustomFabricObject }) => void;
}

const ImageDialog = ({
  isOpen,
  onClose,
  fabricCanvasRef,
  addObject,
}: ImageDialogProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer?.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) handleFile(file);
  };

  const addImageToCanvas = () => {
    if (!previewUrl || !fabricCanvasRef.current) return;
    setIsUploading(true);

    fabric.Image.fromURL(previewUrl, (img) => {
      const fabricImage = img as unknown as CustomFabricObject;
      fabricImage.id = generateRandomId();

      // Center the image on the canvas
      fabricImage.left = (fabricCanvasRef.current?.width || 0) / 2 - 100;
      fabricImage.top = (fabricCanvasRef.current?.height || 0) / 2 - 100;

      fabricCanvasRef.current?.add(fabricImage);
      fabricCanvasRef.current?.setActiveObject(fabricImage);
      fabricCanvasRef.current?.renderAll();

      addObject({
        id: fabricImage.id,
        type: "image",
        properties: fabricImage,
      });

      // Reset and close
      setIsUploading(false);
      setPreviewUrl(null);
      onClose();
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md z-[999]">
        <DialogHeader>
          <DialogTitle>Add Image</DialogTitle>
          <DialogDescription>Upload an image from your device</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            className={`
              border-2 border-dashed rounded-xl p-6
              ${dragActive ? "border-blue-500 " : "border-neutral-800"}
              transition-colors duration-200 ease-in-out
              flex flex-col items-center justify-center gap-4
              cursor-pointer
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <div className="relative w-full aspect-video">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="rounded-md object-contain w-full h-full"
                />
              </div>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-gray-600" />
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Drag and drop an image, or click to select
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Supports: JPG, PNG (max 10MB)
                  </p>
                </div>
              </>
            )}
              
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={addImageToCanvas}
              disabled={!previewUrl || isUploading}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <Upload className="w-4 h-4 animate-bounce" />
                  Adding...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Add to Canvas
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDialog;