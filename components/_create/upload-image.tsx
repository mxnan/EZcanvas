// components/UploadImage.tsx
import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";
interface UploadImageProps {
  onImageUpload: (url: string) => void;
}

const UploadImage: React.FC<UploadImageProps> = ({ onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUnsplash, setIsUnsplash] = useState(false);
  const [unsplashUrl, setUnsplashUrl] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onImageUpload(imageUrl);
      toast.success("IMAGE UPLOADED !");
    }
  };

  // New function to handle device upload
  const handleDeviceUpload = () => {
    fileInputRef.current?.click();
   
  };
  const handleUnsplashUpload = () => {
    toast.warning("enter url of image");
    setIsUnsplash(true);
  };

  const handleUnsplashSubmit = () => {
    if (unsplashUrl) {
      onImageUpload(unsplashUrl);
      setIsUnsplash(false);
      setUnsplashUrl('');
      toast.success("UNSPLASH IMAGE ADDED!");
    } else {
      toast.error("Please enter a valid URL");
    }
  };

  return (
    <div>
   
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Upload here ?</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Button variant={"ghost"} onClick={handleUnsplashUpload}>
              Unsplash
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button variant={"ghost"} onClick={handleDeviceUpload}>
              From Device
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        // style={{ display: 'none' }}
        // accept="image/*"
        accept=".jpeg, .png, .jpg"
        onChange={handleFileChange}
      />
      {isUnsplash && (
        <AlertDialog defaultOpen>
          <AlertDialogTrigger>
            <> </>
          </AlertDialogTrigger>
          <AlertDialogContent className="md:max-w-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Copy and paste URL </AlertDialogTitle>
              <AlertDialogDescription>
                You already know from where 
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex flex-col gap-4">
              <Input 
                value={unsplashUrl}
                onChange={(e) => setUnsplashUrl(e.target.value)}
                placeholder="https://unsplash.com/..."
              />
              <div className="flex w-full justify-end gap-2">
                <Button variant="default" onClick={handleUnsplashSubmit}>Upload</Button>
                <Button variant="destructive" onClick={() => {
                  setIsUnsplash(false);
                  setUnsplashUrl('');
                }}>
                  Cancel
                </Button>
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default UploadImage;
