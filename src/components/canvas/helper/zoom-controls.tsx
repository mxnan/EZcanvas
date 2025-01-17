import { useCanvas } from "@/context/canvas-context";
import React from "react";


const ZoomControls = () => {
  const { canvasOptions, setCanvasOptions } = useCanvas();

  const handleZoomIn = () => {
    setCanvasOptions((prev) => ({
      ...prev,
      width: prev.width * 1.1,
      height: prev.height * 1.1,
    }));
  };

  const handleZoomOut = () => {
    setCanvasOptions((prev) => ({
      ...prev,
      width: prev.width * 0.9,
      height: prev.height * 0.9,
    }));
  };

  return (
    <div className="absolute top-4 right-4 flex space-x-2">
      <button onClick={handleZoomIn} className="bg-blue-500 text-white p-2 rounded">
        Zoom In
      </button>
      <button onClick={handleZoomOut} className="bg-red-500 text-white p-2 rounded">
        Zoom Out
      </button>
    </div>
  );
};

export default ZoomControls;
