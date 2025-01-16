import { useCanvasContext } from "@/context/canvas-context";
import { useObjectContext } from "@/context/object-context";
import Konva from "konva";
import React from "react";
import { Stage, Layer, Text, Line, Rect, Circle } from "react-konva";
import Elements from "./_helpers/elements";
import HistoryButton from "./_helpers/history-button";

// Define component with proper types
const Canvas: React.FC = () => {
  const { zoomLevel, setZoomLevel, stageRef, handleResize } =
    useCanvasContext();
  const { objects } = useObjectContext(); // Get objects from ObjectContext

  //zoom limiter
  const minZoom = 0.5;
  const maxZoom = 2;

  // uef for resizing
  React.useEffect(() => {
    handleResize(); // Set initial size
  }, [handleResize]);

  // Zoom handler
  const handleWheel = (event: Konva.KonvaEventObject<WheelEvent>) => {
    event.evt.preventDefault(); // Prevent default scrolling behavior

    const stage = stageRef.current;
    if (!stage) return;

    const scaleBy = 1.05; // Zoom factor
    const oldScale = stage.scaleX(); // Current scale of the stage
    const pointer = stage.getPointerPosition(); // Get the pointer position on canvas

    if (!pointer) return;

    // Calculate the mouse point on the canvas
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    // Calculate the new scale
    let newScale =
      event.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    // Ensure newScale is within minZoom and maxZoom limits
    newScale = Math.max(minZoom, Math.min(maxZoom, newScale));

    // Apply new scale and adjust position to keep zoom centered
    stage.scale({ x: newScale, y: newScale });
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);

    // Update zoom level state
    setZoomLevel(parseFloat(newScale.toFixed(2)));
    stage.batchDraw(); // Optimize redraws
  };

  return (
    <div className="fixed inset-0 z-0 w-full h-full overflow-hidden bg-black">
      {/* Konva Stage */}
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        scaleX={zoomLevel}
        scaleY={zoomLevel}
        ref={stageRef}
        onWheel={handleWheel} // Attach zoom functionality
        // style={{ border: "1px solid #ddd" }}
      >
        <Layer>
          {objects
            .sort((a, b) => a.zIndex - b.zIndex) // Sort by zIndex
            .map((object) => {
              switch (object.type) {
                case "circle":
                  return (
                    <Circle
                      key={object.id}
                      x={object.x}
                      y={object.y}
                      radius={object.radius}
                      fill="red"
                    />
                  );
                case "rectangle":
                  return (
                    <Rect
                      key={object.id}
                      x={object.x}
                      y={object.y}
                      width={object.width}
                      height={object.height}
                      fill="green"
                    />
                  );
                case "triangle":
                  return (
                    <Line
                      key={object.id}
                      points={[
                        object.x,
                        object.y,
                        object.x + 50,
                        object.y + 50,
                        object.x - 50,
                        object.y + 50,
                      ]}
                      fill="blue"
                      closed
                    />
                  );
                case "text":
                  return (
                    <Text
                      key={object.id}
                      x={object.x}
                      y={object.y}
                      text={object.text}
                      fontSize={20}
                      fill="white"
                    />
                  );
                default:
                  return null;
              }
            })}
        </Layer>
      </Stage>
      <Elements />

      {/* Zoom Level Indicator */}
      <div className="fixed bottom-4 right-4 bg-white text-black text-sm p-2 rounded shadow">
        <HistoryButton />
        <span> Zoom: {zoomLevel}x</span>
      </div>
    </div>
  );
};

export default Canvas;
