/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Authenticate from "@/components/_create/authenticate";
import TextCustomizer from "@/components/_create/text-customizer";
import UploadImage from "@/components/_create/upload-image";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

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
  const [image, setImage] = useState<string | null>(null); // Stores the uploaded image URL
  const [loading, setLoading] = useState(false); // Manages loading state
  const [textSets, setTextSets] = useState<Array<any>>([]); // Stores text overlays and their attributes

  // Handle image upload callback with loader
  const handleImageUpload = async (url: string) => {
    try {
      setLoading(true);

      // Validate if it's a valid Unsplash URL
      if (url.includes("images.unsplash.com")) {
        // Make sure the URL is properly formatted
        const imageUrl = new URL(url);
        console.log(imageUrl.href);
        console.log("Processing Unsplash URL:", imageUrl.toString());
        setImage(imageUrl.toString());
      } else if (url.startsWith("blob:")) {
        // Handle local file uploads
        setImage(url);
      } else {
        throw new Error("Invalid image URL");
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to load image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addNewTextSet = () => {
    const newId = Math.max(...textSets.map((set) => set.id), 0) + 1;
    setTextSets((prev) => [
      ...prev,
      {
        id: newId,
        text: "Edit Text",
        fontFamily: "Arial",
        top: 10,
        left: 10,
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        opacity: 1,
        rotation: 0,
      },
    ]);
  };

  const handleAttributeChange = (id: number, attribute: string, value: any) => {
    setTextSets((prev) =>
      prev.map((set) => (set.id === id ? { ...set, [attribute]: value } : set))
    );
  };

  const removeTextSet = (id: number) => {
    setTextSets((prev) => prev.filter((set) => set.id !== id));
  };

  return (
    <div className="relative  mt-32 flex-1 w-full">
      <div className="min-h-screen flex flex-col items-center p-10">
        <h1 className="text-2xl font-semibold mb-6">Create Your GIF</h1>

        {/* Image Upload Component */}
        <UploadImage onImageUpload={handleImageUpload} />

        {/* Display loading spinner or message if loading */}
        {loading && <p>Loading image...</p>}

        {/* Image Preview with Text Overlays */}
        {image && !loading && (
          <div className="relative mt-6 border border-gray-300 rounded-lg overflow-hidden">
            <div className="relative w-full h-[50vh] aspect-[4/3]">
              {image.startsWith("blob:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt="Uploaded"
                  className="object-cover w-full h-full"
                />
              ) : (
                <Image
                  src={image}
                  alt="Uploaded"
                  fill
                  priority
                  quality={75}
                  className="object-cover w-full h-full"
                  sizes="(100vw 100vh)"
                />
              )}
            </div>

            {/* Render each text overlay */}
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
                  whiteSpace: "nowrap",
                }}
              >
                {textSet.text}
              </div>
            ))}
          </div>
        )}

        {/* Controls for Adding and Customizing Text */}
        <div className="flex flex-col items-center w-full mt-6">
          {image && (
            <Button onClick={addNewTextSet} className="mb-4">
              Add New Text Overlay
            </Button>
          )}

          {/* Text Customizer for Each Overlay */}
          {textSets.map((textSet) => (
            <TextCustomizer
              key={textSet.id}
              textSet={textSet}
              onTextChange={handleAttributeChange}
              onDelete={removeTextSet}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
