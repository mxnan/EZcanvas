import { useState, useCallback } from 'react';
import { encode } from 'modern-gif';
import { TextSet } from '@/app/create/page';
import { toast } from 'sonner';
import { ANIMATION_PRESETS } from '@/constants/variants';

interface GifOptions {
  images: string[];
  textData: TextSet[];
  gifWidth?: number;
  gifHeight?: number;
  delay?: number;
}

export function useGifGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGif, setGeneratedGif] = useState<string | null>(null);

  const generateGif = useCallback(async (options: GifOptions) => {
    setIsGenerating(true);
    
    try {
      // Load images first
      const [baseImage, bgRemovedImage] = await Promise.all(
        options.images.map(async (imgUrl) => {
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.crossOrigin = "anonymous";
            img.src = imgUrl;
          });
          return img;
        })
      );

      // Create frames for animation
      const frameCount = 60; // Number of frames for animation
      const frames = [];

      for (let i = 0; i < frameCount; i++) {
        const progress = i / (frameCount - 1); // 0 to 1
        
        const canvas = document.createElement('canvas');
        canvas.width = options.gifWidth || 1024;
        canvas.height = options.gifHeight || 768;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        if (!ctx) throw new Error('Failed to get canvas context');

        // Draw base image
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

        // Draw animated text overlays
        options.textData.forEach(textSet => {
          ctx.save();
          
          const preset = ANIMATION_PRESETS[textSet.animation];
          let x = (canvas.width * textSet.left) / 100;
          let y = (canvas.height * textSet.top) / 100;
          let scale = 1;
          let opacity = textSet.opacity;
          let rotation = (textSet.rotation * Math.PI) / 180;

          // Apply animation based on preset
          if (preset) {
            const { initial, animate } = preset.variant;
            
            // Interpolate animation properties
            if ('x' in initial && 'x' in animate) {
              const startX = initial.x || 0;
              const endX = Array.isArray(animate.x) ? animate.x[0] : animate.x || 0;
              x += startX + (endX - startX) * progress;
            }
            
            if ('y' in initial && 'y' in animate) {
              const startY = initial.y || 0;
              const endY = Array.isArray(animate.y) ? animate.y[0] : animate.y || 0;
              y += startY + (endY - startY) * progress;
            }

            if ('scale' in initial && 'scale' in animate) {
              const startScale = initial.scale || 1;
              const endScale = Array.isArray(animate.scale) ? animate.scale[0] : animate.scale || 1;
              scale = startScale + (endScale - startScale) * progress;
            }

            if ('opacity' in initial && 'opacity' in animate) {
              const startOpacity = initial.opacity || 1;
              const endOpacity = Array.isArray(animate.opacity) ? animate.opacity[0] : animate.opacity || 1;
              opacity = startOpacity + (endOpacity - startOpacity) * progress;
            }

            if ('rotate' in initial && 'rotate' in animate) {
              const startRotation = (initial.rotate || 0) * Math.PI / 180;
              const endRotation = ((Array.isArray(animate.rotate) ? animate.rotate[0] : animate.rotate) || 0) * Math.PI / 180;
              rotation += startRotation + (endRotation - startRotation) * progress;
            }
          }

          // Apply text styles
          ctx.font = `${textSet.fontWeight} ${textSet.fontSize}px ${textSet.fontFamily}`;
          ctx.fillStyle = textSet.color;
          ctx.globalAlpha = opacity;
          
          // Apply transforms
          ctx.translate(x, y);
          ctx.rotate(rotation);
          ctx.scale(scale, scale);
          
          // Draw text
          const metrics = ctx.measureText(textSet.text);
          ctx.fillText(textSet.text, -metrics.width / 2, 0);
          
          ctx.restore();
        });

        // Draw background-removed image on top
        ctx.drawImage(bgRemovedImage, 0, 0, canvas.width, canvas.height);

        // Get frame data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        frames.push({
          data: imageData.data,
          delay: options.delay || 50 // Shorter delay for smoother animation
        });
      }

      // Generate GIF
      const output = await encode({
        width: options.gifWidth || 800,
        height: options.gifHeight || 600,
        frames
      });

      const blob = new Blob([output], { type: 'image/gif' });
      const gifUrl = URL.createObjectURL(blob);
      
      setGeneratedGif(gifUrl);
      toast.success('GIF generated successfully!');
      return gifUrl;
    } catch (error) {
      console.error('GIF generation error:', error);
      toast.error('Failed to generate GIF');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    isGenerating,
    generatedGif,
    generateGif,
  };
}