/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Loader } from "lucide-react";
import { TextSet } from "@/types/text";
import { ImageDimensions } from "@/types/image";

interface ImagePreviewProps {
  originalImage: string | null;
  backgroundImage: string | null;
  imageDimensions: ImageDimensions;
  textSets: Array<TextSet>;
}

export const ImagePreview = ({
  originalImage,
  backgroundImage,
  imageDimensions,
  textSets,
}: ImagePreviewProps) => {
  if (!originalImage || !backgroundImage) {
    return (
      <div className="relative flex-1 flex items-center justify-center w-full min-h-[60vh] rounded-2xl overflow-hidden">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto xl:mx-8"
      style={{
        width: imageDimensions.preview.width,
        height: imageDimensions.preview.height,
        maxWidth: "100%",
        aspectRatio: `${imageDimensions.preview.width} / ${imageDimensions.preview.height}`,
      }}
    >
      <div className="flex-1 relative w-full h-full">
        {/* Original Image */}
        <img
          src={originalImage}
          alt="Original"
          style={{
            width: imageDimensions.preview.width,
            height: imageDimensions.preview.height,
          }}
          className="absolute inset-0 object-contain z-0"
        />
        {/* Text Overlays */}
        {textSets.map((textSet) => (
          <div
            key={textSet.id}
            style={{
              position: "absolute",
              top: `${textSet.top}%`,
              left: `${textSet.left}%`,
              transform: `translate(-50%, -50%)`,
              color: textSet.color,
              fontSize: `${textSet.fontSize}px`,
              fontWeight: textSet.fontWeight,
              fontFamily: textSet.fontFamily,
              zIndex: textSet.zIndex,
              opacity: textSet.opacity,
              rotate: `${textSet.rotation}deg`,
            }}
            className="whitespace-nowrap"
          >
            {textSet.text}
          </div>
        ))}
        {/* Background-Removed Image */}
        <img
          src={backgroundImage}
          alt="Background Removed"
          style={{
            width: imageDimensions.preview.width,
            height: imageDimensions.preview.height,
          }}
          className="absolute inset-0 object-contain z-20"
        />
      </div>
    </div>
  );
}; 