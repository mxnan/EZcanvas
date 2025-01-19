import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { useCanvas } from "@/context/canvas-context";
import { Button } from "../ui/button";
import { LucideZoomIn } from "lucide-react";
import Elements from "./elements/elements";

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { canvasOptions, setCanvasOptions, zoomLevel, setZoomLevel } =
    useCanvas();
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    // Initialize Fabric.js canvas
    fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
      width: canvasOptions.width,
      height: canvasOptions.height,
    });

    // Handle zoom on mouse wheel
    fabricCanvasRef.current.on("mouse:wheel", function (opt) {
      const delta = opt.e.deltaY;
      let zoom = fabricCanvasRef.current?.getZoom() || 1;
      zoom *= 0.999 ** delta;

      // Limit zoom levels
      const minZoom = 0.5;
      const maxZoom = 2;
      zoom = Math.max(minZoom, Math.min(maxZoom, zoom));

      // Zoom to the mouse position
      fabricCanvasRef.current?.zoomToPoint(
        { x: opt.e.offsetX, y: opt.e.offsetY },
        zoom
      );

      // Update zoom level in context
      setZoomLevel(parseFloat(zoom.toFixed(2)));

      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    // Clean up on unmount
    return () => {
      fabricCanvasRef.current?.dispose();
    };
  }, [canvasOptions, setZoomLevel]);

  // Update canvas size on window resize
  const updateCanvasSize = React.useCallback(() => {
    if (canvasRef.current) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setCanvasOptions({ width, height });
      fabricCanvasRef.current?.setDimensions({ width, height });
    }
  }, [setCanvasOptions]);

  useEffect(() => {
    updateCanvasSize(); // Set initial size
    window.addEventListener("resize", updateCanvasSize); // Update size on resize

    return () => {
      window.removeEventListener("resize", updateCanvasSize); // Clean up listener
    };
  }, [updateCanvasSize]);

  // base canvas code /////////////////////////

  // const addRectangle = () => {
  //   const rect = new fabric.Rect({
  //     left: 100,
  //     top: 100,
  //     fill: "red",
  //     width: 50,
  //     height: 50,
  //   });
  //   fabricCanvasRef.current?.add(rect);
  //   fabricCanvasRef.current?.requestRenderAll(); // Ensure the canvas is rendered after adding the object
  // };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="z-0 fixed inset-0 rounded-lg shadow-xl w-full h-full"
      />
       <Elements fabricCanvasRef={fabricCanvasRef} /> {/* Pass the ref as a prop */}
      <Button
        variant={"outline"}
        className="fixed bottom-2 right-2"
        size={"sm"}
      >
        <LucideZoomIn /> {zoomLevel.toFixed(2)}x
      </Button>
    </>
  );
};

export default Canvas;
