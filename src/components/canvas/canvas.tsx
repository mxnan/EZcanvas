import React, { useEffect, useRef } from "react";
// import { fabric } from "fabric";
import { useCanvas } from "@/context/canvas-context";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const { canvasOptions } = useCanvas();
  // const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  // useEffect(() => {
  //   // Initialize Fabric.js canvas
  //   fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
  //     width: canvasOptions.width,
  //     height: canvasOptions.height,
  //   });

  //   // Clean up on unmount
  //   return () => {
  //     fabricCanvasRef.current?.dispose();
  //   };
  // }, [canvasOptions]);

  return (
    <canvas
      ref={canvasRef}
      className="bg-stone-700/10 rounded-lg shadow-xl w-full h-full"
    />
  );
};

export default Canvas;
