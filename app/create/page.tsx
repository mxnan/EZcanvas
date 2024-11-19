/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Authenticate from "@/components/_create/authenticate";
import TextCustomizer from "@/components/_create/text-customizer";
import UploadImage from "@/components/_create/upload-image";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/utils/supabase/client";
import { ArrowDownLeft } from "lucide-react";
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
    <div className="relative  pt-32 flex-1 w-full">
      <div className="min-h-screen px-4 lg:px-8 space-y-12">
        <div className="flex flex-col items-center gap-4">
          {" "}
          <h1 className="text-6xl text-center font-mono font-extrabold">
            Create Your GIF
          </h1>
          <UploadImage onImageUpload={handleImageUpload} />
          {/* {loading && <p>Uploading , removing bg ...</p>} */}
        </div>

        <div className="relative flex flex-col lg:flex-row max-lg:gap-10 p-3 border rounded-2xl">
          {image && !loading ? (
            <div className="border rounded-2xl overflow-hidden">
              <div className="relative w-full h-[71vh] aspect-video">
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
                    quality={100}
                    className="object-cover w-full h-full"
                    sizes="(100vw 100vh)"
                  />
                )}
              </div>

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
          ) : (
            <div className="relative flex-1 w-full min-h-[60vh] rounded-2xl overflow-hidden">
              {" "}
              <Image
                src="/assets/luffy.gif"
                alt="suspense"
                fill
                priority
                unoptimized
                className="object-cover h-1/2 w-1/2 "
              />
            </div>
          )}

          {image && (
            <div className="relative w-full flex flex-col ">
              <div className="flex max-sm:flex-col items-center gap-6 my-5 w-max max-lg:mx-auto lg:pl-8">
                <Button onClick={addNewTextSet} className="">
                  Add New Text Overlay
                </Button>{" "}
                <Button
                  onClick={() => {
                    setImage("");
                  }}
                  variant={"destructive"}
                >
                  Create GIF ? <ArrowDownLeft />
                </Button>{" "}
              </div>

              <ScrollArea className="h-[62vh] w-full p-2">
                {textSets.map((textSet) => (
                  <TextCustomizer
                    key={textSet.id}
                    textSet={textSet}
                    onTextChange={handleAttributeChange}
                    onDelete={removeTextSet}
                  />
                ))}
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
