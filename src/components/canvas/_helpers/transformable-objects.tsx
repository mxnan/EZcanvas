/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect } from "react";
import { Circle, Rect, Line, Text, Transformer } from "react-konva";
import { CanvasObject, useObjectContext } from "@/context/object-context";

interface TransformableObjectProps {
  object: CanvasObject;
  isSelected: boolean;
  onSelect: () => void;
}

const TransformableObject: React.FC<TransformableObjectProps> = ({
  object,
  isSelected,
  onSelect,
}) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const { objects, setObjects } = useObjectContext();

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleTransformEnd = () => {
    if (!shapeRef.current) return;

    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const rotation = node.rotation();

    // Reset scale and update dimensions
    node.scaleX(1);
    node.scaleY(1);

    const updatedObjects = objects.map((obj) => {
      if (obj.id === object.id) {
        const baseUpdate = {
          ...obj,
          x: node.x(),
          y: node.y(),
          width: (object.width || 0) * scaleX,
          height: (object.height || 0) * scaleY,
          rotation: rotation,
        };

        switch (obj.type) {
          case "circle":
            return {
              ...baseUpdate,
              radius: (obj.radius || 30) * scaleX,
            };
          case "rectangle":
            return {
              ...baseUpdate,
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
            };
          case "triangle": {
            // For triangle, we need to scale the points
            const scale = scaleX; // Use single scale factor for uniform scaling
            return {
              ...baseUpdate,
              width: (obj.width || 100) * scale,
              height: (obj.height || 100) * scale,
            };
          }
          case "text":
            return {
              ...baseUpdate,
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
              fontSize: (obj.fontSize || 20) * scaleX,
            };
          default:
            return obj;
        }
      }
      return obj;
    });

    setObjects(updatedObjects);
  };

  const handleDragEnd = () => {
    if (!shapeRef.current) return;

    const node = shapeRef.current;
    const updatedObjects = objects.map((obj) => {
      if (obj.id === object.id) {
        return {
          ...obj,
          x: node.x(),
          y: node.y(),
        };
      }
      return obj;
    });

    setObjects(updatedObjects);
  };

  const shapeProps = {
    ref: shapeRef,
    draggable: true,
    onClick: onSelect,
    onTap: onSelect,
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
    rotation: object.rotation || 0,
  };

  const renderShape = () => {
    switch (object.type) {
      case "circle":
        return (
          <Circle
            {...shapeProps}
            x={object.x}
            y={object.y}
            radius={object.radius}
            fill="red"
          />
        );
      case "rectangle":
        return (
          <Rect
            {...shapeProps}
            x={object.x}
            y={object.y}
            width={object.width}
            height={object.height}
            fill="green"
          />
        );
      case "triangle": {
        const width = object.width || 100;
        const height = object.height || 100;
        return (
          <Line
            {...shapeProps}
            x={object.x}
            y={object.y}
            points={[
              0,
              -height / 2, // top
              width / 2,
              height / 2, // bottom right
              -width / 2,
              height / 2, // bottom left
            ]}
            closed
            fill="blue"
          />
        );
      }
      case "text":
        return (
          <Text
            {...shapeProps}
            x={object.x}
            y={object.y}
            text={object.text}
            fontSize={object.fontSize || 20}
            fill="white"
            width={object.width}
            height={object.height}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderShape()}
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
          // Anchor customization
          anchorCornerRadius={999}
          anchorSize={10}
          anchorStyleFunc={(anchor) => {
            // Custom anchor styling
            anchor.fill("#4299e1"); // Blue fill
            anchor.stroke("#010101"); // White border
            anchor.strokeWidth(2); // Border thickness
            anchor.cornerRadius(999); // Circular anchors
            anchor.shadowColor("#000000"); // Shadow color
            anchor.shadowBlur(4); // Shadow blur
            anchor.shadowOpacity(0.3); // Shadow opacity
            anchor.shadowOffset({ x: 1, y: 1 }); // Shadow offset
          }}
          // Border customization
          borderStroke="#4299e1" // Border color
          borderStrokeWidth={2} // Border thickness
          borderDash={[]} // Solid line (use [5, 5] for dashed)
          // Padding
          padding={10} // Space between border and shape
          // Enabled features
          rotateEnabled={true} // Allow rotation
          keepRatio={false} // Allow non-uniform scaling
          centeredScaling={false} // Scale from corners
          // Rotation snaps
          rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
          rotationSnapTolerance={5} // Degrees of snap tolerance
          // Transform behavior
          flipEnabled={true} // Allow flipping
          resizeEnabled={true} // Allow resizing
          enabledAnchors={[
            "top-left",
            "top-center",
            "top-right",
            "middle-right",
            "middle-left",
            "bottom-left",
            "bottom-center",
            "bottom-right",
          ]}
        />
      )}
    </>
  );
};

export default TransformableObject;
