/* eslint-disable @next/next/no-img-element */

"use client";
import Authenticate from "@/components/_create/authenticate";
import TextCustomizer from "@/components/_create/text-customizer";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/utils/supabase/client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { removeBackground } from "@imgly/background-removal";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader } from "lucide-react";
import { Input } from "@/components/ui/input";

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
  const [originalImage, setOriginalImage] = useState<string | null>(null); // Original uploaded image
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null); // Background-removed image
  const [loading, setLoading] = useState(false); // Loading state for uploads
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [textSets, setTextSets] = useState<Array<any>>([]); // Text overlays
  const [isUnsplash, setIsUnsplash] = useState(false); // Unsplash upload dialog toggle
  const [unsplashUrl, setUnsplashUrl] = useState(""); // Unsplash image URL

  // Handle file uploads from device
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setOriginalImage("");
    setBackgroundImage("");
    setLoading(true); // Show loading spinner
    try {
      const result = await removeBackground(file); // Remove background
      const originalUrl = URL.createObjectURL(file);
      const bgRemovedUrl = URL.createObjectURL(result);

      setOriginalImage(originalUrl); // Store the original image
      setBackgroundImage(bgRemovedUrl); // Store the background-removed image

      toast.success("Image uploaded and processed successfully!");
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process the image.");
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // Handle Unsplash URL upload
  const handleUnsplashSubmit = async () => {
    if (!unsplashUrl) {
      toast.error("Please enter a valid URL.");
      return;
    }
    setOriginalImage("");
    setBackgroundImage("");
    setLoading(true); // Show loading spinner
    setIsUnsplash(false); // Close dialog
    try {
      const response = await fetch(unsplashUrl);
      const blob = await response.blob();
      const file = new File([blob], "unsplash-image", { type: blob.type });

      const result = await removeBackground(file);
      const originalUrl = URL.createObjectURL(file);
      const bgRemovedUrl = URL.createObjectURL(result);

      setOriginalImage(originalUrl); // Store the original image
      setBackgroundImage(bgRemovedUrl); // Store the background-removed image

      toast.success("Unsplash image processed successfully!");
    } catch (error) {
      console.error("Error processing Unsplash image:", error);
      toast.error("Failed to process the Unsplash image.");
    } finally {
      setLoading(false); // Hide loading spinner
      setUnsplashUrl(""); // Clear input
    }
  };

  // Add a new text overlay
  const addNewTextSet = () => {
    const newId = Math.max(...textSets.map((set) => set.id), 0) + 1;
    setTextSets((prev) => [
      ...prev,
      {
        id: newId,
        text: "Edit Text",
        fontFamily: "Inter",
        top: 0,
        left: 0,
        color: "#ffffff",
        fontSize: 24,
        fontWeight: "bold",
        opacity: 1,
        rotation: 0,
      },
    ]);
  };

  // Update attributes of a specific text overlay
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAttributeChange = (id: number, attribute: string, value: any) => {
    setTextSets((prev) =>
      prev.map((set) => (set.id === id ? { ...set, [attribute]: value } : set))
    );
  };

  // Remove a specific text overlay
  const removeTextSet = (id: number) => {
    setTextSets((prev) => prev.filter((set) => set.id !== id));
  };

  return (
    <div className="relative pt-20 flex-1 w-full">
      <div className="min-h-screen px-4 lg:px-8 space-y-12">
        {/* Upload Section */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-6xl text-center font-mono font-extrabold">
            Create Your GIF
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"default"} disabled={loading}>
                {loading ? (
                  <>
                    Processing ...
                    <Loader className="animate-spin" />
                  </>
                ) : (
                  <> Upload Image</>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Button variant="ghost" onClick={() => setIsUnsplash(true)}>
                  Upload from Unsplash
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button
                  variant="ghost"
                  onClick={() => document.getElementById("fileInput")?.click()}
                >
                  Upload from Device
                </Button>
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
            <AlertDialog defaultOpen>
              <AlertDialogTrigger>
                <> </>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Enter Unsplash URL</AlertDialogTitle>
                  <AlertDialogDescription>
                    Provide a direct Unsplash image link.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Input
                  value={unsplashUrl}
                  onChange={(e) => setUnsplashUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/.."
                />
                <div className="flex justify-end gap-2 mt-4">
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
                </div>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Image Preview Section */}
        <div className="relative flex flex-col lg:flex-row gap-8 p-3 border rounded-2xl">
          {originalImage && backgroundImage ? (
            <div className="relative w-full h-[71vh] border rounded-2xl overflow-hidden">
              {/* Original Image */}
              <img
                src={originalImage}
                alt="Original"
                className="absolute inset-0 object-cover w-full h-full z-0"
              />
              {/* Text Overlays */}
              {textSets.map((textSet) => (
                <div
                  key={textSet.id}
                  style={{
                    position: "absolute",
                    top: `${textSet.top}%`,
                    left: `${textSet.left}%`,
                    transform: `translate(-50%, -50%) rotate(${textSet.rotation}deg)`,
                    color: textSet.color,
                    fontSize: `${textSet.fontSize}px`,
                    fontWeight: textSet.fontWeight,
                    fontFamily: textSet.fontFamily,
                    opacity: textSet.opacity,
                    zIndex: 5,
                  }}
                >
                  {textSet.text}
                </div>
              ))}
              {/* Background-Removed Image */}
              <img
                src={backgroundImage}
                alt="Background Removed"
                className="absolute inset-0 object-cover w-full h-full z-10"
              />
            </div>
          ) : (
            <div className="relative flex-1 w-full min-h-[60vh] rounded-2xl overflow-hidden">
              <Image
                src="/assets/luffy.gif"
                alt="suspense"
                fill
                priority
                unoptimized
                className="object-cover"
              />
            </div>
          )}

          {/* Text Customization Section */}
          {originalImage && backgroundImage && (
            <div className="flex flex-col w-full">
              <div className="flex items-center gap-6 my-5">
                <Button onClick={addNewTextSet}>Add New Text Overlay</Button>
                <Button
                  variant="destructive"
                  onClick={() => setOriginalImage("")}
                >
                  Reset Everything
                </Button>
              </div>
              <ScrollArea className="h-[60vh] space-y-3 border p-3 rounded-2xl">
                {textSets.length > 0 ? (
                  textSets.map((textSet) => (
                    <TextCustomizer
                      key={textSet.id}
                      textSet={textSet}
                      onTextChange={handleAttributeChange}
                      onDelete={removeTextSet}
                    />
                  ))
                ) : (
                  <h3 className="font-semibold">No Text Overlays Added Yet.</h3>
                )}
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
