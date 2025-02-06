import React, { useEffect, useRef, lazy, Suspense } from "react";
import { fabric } from "fabric";
import { useCanvas } from "@/context/canvas-context";
import { Button } from "../ui/button";
import {
  Focus,
  HardDriveDownload,
  LogIn,
  LogOut,
  LucideZoomIn,
} from "lucide-react";
import Elements from "./elements/elements";
import Loader from "../ui/loader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/user-context";

// Dynamically import ObjectCounter
const DynamicObjectCounter = lazy(() => import("./elements/object-counter"));
const SharedControls = lazy(() => import("./controls/shared-controls"));
const ObjSpecificControls = lazy(
  () => import("./controls/obj-specific-controls")
);

// Constants for snapping
// const EDGE_DETECTION = 5; // pixels to snap

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user, signInWithGoogle, signOut } = useAuth();
  const { canvasOptions, setCanvasOptions, zoomLevel, setZoomLevel } =
    useCanvas();
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  // uef for canvas init
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
      preserveObjectStacking: true,

      // selection: false, // Disable group selection
    });

    // Handle zoom on mouse wheel
    fabricCanvasRef.current.on("mouse:wheel", function (opt) {
      const delta = opt.e.deltaY;
      let zoom = fabricCanvasRef.current?.getZoom() || 1;
      zoom *= 0.999 ** delta;

      // Limit zoom levels
      const minZoom = 0.1;
      const maxZoom = 3;
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

    const canvas = fabricCanvasRef.current;

    // Setup object moving event handler
    // canvas.on('object:moving', function(e) {
    //   const obj = e.target;
    //   if (!obj) return;

    //   // Update object coordinates
    //   obj.setCoords();

    //   // Get canvas dimensions
    //   const canvasWidth = canvas.width ?? 0;
    //   const canvasHeight = canvas.height ?? 0;

    //   // // Prevent objects from leaving canvas
    //   // if (obj.left < EDGE_DETECTION) obj.set({ left: 0 });
    //   // if (obj.top < EDGE_DETECTION) obj.set({ top: 0 });

    //   const objWidth = obj.getScaledWidth();
    //   const objHeight = obj.getScaledHeight();

    //   if ((objWidth + (obj.left ?? 0)) > (canvasWidth - EDGE_DETECTION)) {
    //     obj.set({ left: canvasWidth - objWidth });
    //   }
    //   if ((objHeight + (obj.top ?? 0)) > (canvasHeight - EDGE_DETECTION)) {
    //     obj.set({ top: canvasHeight - objHeight });
    //   }

    //   // Snap to other objects
    //   // canvas.forEachObject((targetObj) => {
    //   //   if (targetObj === obj) return;

    //   //   const active = obj;
    //   //   const target = targetObj;

    //   //   // Ensure both objects have their coordinates set
    //   //   active.setCoords();
    //   //   target.setCoords();

    //   //   // Skip if either object doesn't have coordinates
    //   //   if (!active.oCoords || !target.oCoords) return;

    //   //   // Snap to edges
    //   //   // Right to Left
    //   //   if (Math.abs(active.oCoords.tr.x - target.oCoords.tl.x) < EDGE_DETECTION) {
    //   //     obj.set({ left: target.left - active.getScaledWidth() });
    //   //   }
    //   //   // Left to Right
    //   //   if (Math.abs(active.oCoords.tl.x - target.oCoords.tr.x) < EDGE_DETECTION) {
    //   //     obj.set({ left: target.left + target.getScaledWidth() });
    //   //   }
    //   //   // Bottom to Top
    //   //   if (Math.abs(active.oCoords.br.y - target.oCoords.tr.y) < EDGE_DETECTION) {
    //   //     obj.set({ top: target.top - active.getScaledHeight() });
    //   //   }
    //   //   // Top to Bottom
    //   //   if (Math.abs(target.oCoords.br.y - active.oCoords.tr.y) < EDGE_DETECTION) {
    //   //     obj.set({ top: target.top + target.getScaledHeight() });
    //   //   }

    //   //   // Snap alignments
    //   //   // Vertical alignment
    //   //   if (Math.abs((active.top ?? 0) - (target.top ?? 0)) < EDGE_DETECTION) {
    //   //     obj.set({ top: target.top });
    //   //   }
    //   //   // Horizontal alignment
    //   //   if (Math.abs((active.left ?? 0) - (target.left ?? 0)) < EDGE_DETECTION) {
    //   //     obj.set({ left: target.left });
    //   //   }

    //   //   // // Highlight intersecting objects
    //   //   // if (active.intersectsWithObject(target)) {
    //   //   //   target.set({
    //   //   //     strokeWidth: 2,
    //   //   //     stroke: 'red'
    //   //   //   });
    //   //   // } else {
    //   //   //   target.set({
    //   //   //     strokeWidth: 0,
    //   //   //     stroke: "transparent"
    //   //   //   });
    //   //   // }
    //   // });

    //   // Render changes
    //   canvas.renderAll();
    // });

    // Clean up on unmount
    return () => {
      fabricCanvasRef.current?.dispose();
      canvas.off("object:moving");
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

  // uef for canvas size
  useEffect(() => {
    updateCanvasSize(); // Set initial size
    window.addEventListener("resize", updateCanvasSize); // Update size on resize

    return () => {
      window.removeEventListener("resize", updateCanvasSize); // Clean up listener
    };
  }, [updateCanvasSize]);

  // // uef for drag and drop
  // useEffect(() => {
  //   const canvas = fabricCanvasRef.current?.getElement().parentElement;
  //   if (!canvas) return;

  //   const handleDragOver = (e: DragEvent) => {
  //     e.preventDefault();
  //     e.stopPropagation();
  //   };

  //   const handleDrop = (e: DragEvent) => {
  //     e.preventDefault();
  //     e.stopPropagation();

  //     const files = e.dataTransfer?.files;
  //     if (files && files[0] && fabricCanvasRef.current) {
  //       const file = files[0];
  //       if (!file.type.startsWith('image/')) return;

  //       const reader = new FileReader();
  //       reader.onload = (event) => {
  //         fabric.Image.fromURL(event.target?.result as string, (img) => {
  //           const fabricImage = img as unknown as CustomFabricObject;
  //           fabricImage.id = generateRandomId();

  //           // Position the image where it was dropped
  //           const canvasOffset = canvas.getBoundingClientRect();
  //           const zoom = fabricCanvasRef.current?.getZoom() || 1;
  //           fabricImage.left = (e.clientX - canvasOffset.left) / zoom;
  //           fabricImage.top = (e.clientY - canvasOffset.top) / zoom;

  //           fabricImage.scaleToWidth(200); // Set default width

  //           fabricCanvasRef.current?.add(fabricImage);
  //           fabricCanvasRef.current?.setActiveObject(fabricImage);
  //           fabricCanvasRef.current?.renderAll();

  //           // Add to context
  //           addObject({
  //             id: fabricImage.id,
  //             type: "image",
  //             properties: fabricImage,
  //           });
  //         });
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };

  //   canvas.addEventListener('dragover', handleDragOver);
  //   canvas.addEventListener('drop', handleDrop);

  //   return () => {
  //     canvas.removeEventListener('dragover', handleDragOver);
  //     canvas.removeEventListener('drop', handleDrop);
  //   };
  // }, [addObject]);

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

  // focus on selected object
  const focusOnSelectedObject = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    // Get the center point of the object
    const objectCenter = activeObject.getCenterPoint();
    const zoom = 1; // Set zoom to 1

    if (canvas.viewportTransform) {
      // Calculate center of viewport
      const vpCenter = {
        x: canvas.getWidth() / 2,
        y: canvas.getHeight() / 2,
      };

      // Set zoom first
      canvas.setZoom(zoom);
      setZoomLevel(zoom);

      // Calculate the difference between viewport center and object center
      canvas.viewportTransform[4] = vpCenter.x - objectCenter.x * zoom;
      canvas.viewportTransform[5] = vpCenter.y - objectCenter.y * zoom;

      canvas.renderAll();
    }
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="canvas-background z-0 fixed inset-0 rounded-lg shadow-xl w-full h-full"
      />
      <>
        <Elements fabricCanvasRef={fabricCanvasRef} />
        <Suspense fallback={<Loader />}>
          {" "}
          <DynamicObjectCounter fabricCanvasRef={fabricCanvasRef} />
          <SharedControls fabricCanvasRef={fabricCanvasRef} />
          <ObjSpecificControls fabricCanvasRef={fabricCanvasRef} />
        </Suspense>
      </>
      <div className="fixed bottom-2 right-2 flex items-center gap-2">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"outline"}
                size={"icon"}
                onClick={focusOnSelectedObject}
              >
                <Focus />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={10}>
              <p className="text-xs font-bold">Focus</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button variant={"outline"}>
          <LucideZoomIn /> {zoomLevel.toFixed(2)}x
        </Button>
      </div>
      <div className="fixed flex gap-2 items-center top-2 right-2">
        {user && user.avatar_url && (
          <img
            src={user.avatar_url}
            alt="User Avatar"
            className="w-8 h-8 rounded-xl"
          />
        )}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={user ? signOut : signInWithGoogle}
              >
                {user ? <LogOut /> : <LogIn />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={10}>
              <p className="text-xs font-bold">
                {user ? "Sign Out" : "Sign In"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"destructive"}
                // className="fixed top-2 right-2"
                size={"sm"}
                onClick={downloadCanvasAsPNG} // Set up the download function
              >
                <HardDriveDownload />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={10}>
              <p className="text-xs font-bold">Download</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
};

export default Canvas;
