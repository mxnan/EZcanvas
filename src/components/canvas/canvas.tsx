import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { useCanvas } from "@/context/canvas-context";
import { Button } from "../ui/button";
import { HardDriveDownload, LucideZoomIn } from "lucide-react";
import Elements from "./elements/elements";

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { canvasOptions, setCanvasOptions, zoomLevel, setZoomLevel } =
    useCanvas();
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    // Set default control properties for all objects
    fabric.Object.prototype.set({
      borderColor: "#4B9CFF",
      borderScaleFactor: 2,
      padding: 10,
      borderOpacityWhenMoving: 0.3,
      cornerStyle: "circle",
      cornerColor: "#84cc16",
      cornerStrokeColor: "#22c55e",
      cornerSize: 12,
      transparentCorners: false,
      hasRotatingPoint: true,
      lockScalingFlip: true,
    });

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

  // Function to download canvas as PNG
  const downloadCanvasAsPNG = () => {
    if (fabricCanvasRef.current) {
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: "png",
        quality: 1, // Quality of the image
      });
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "demo.png"; // Name of the downloaded file
      link.click();
    }
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="canvas-background z-0 fixed inset-0 rounded-lg shadow-xl w-full h-full"
      />
      <Elements fabricCanvasRef={fabricCanvasRef} />
      <Button
        variant={"outline"}
        className="fixed bottom-2 left-2"
        size={"sm"}
      >
        show object count here 
      </Button>
      <Button
        variant={"outline"}
        className="fixed bottom-2 right-2"
        size={"sm"}
      >
        <LucideZoomIn /> {zoomLevel.toFixed(2)}x
      </Button>
      <Button
        variant={"destructive"}
        className="fixed top-2 right-2"
        size={"sm"}
        onClick={downloadCanvasAsPNG} // Set up the download function
      >
        <HardDriveDownload />
      </Button>
    </>
  );
};

export default Canvas;
