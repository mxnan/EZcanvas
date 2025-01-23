// import React from "react";
// import {
//   PopoverTrigger,
//   PopoverContent,
//   Popover,
// } from "@/components/ui/popover";
// import { fabric } from "fabric";
// import { Button } from "@/components/ui/button";
// import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react"; // Import arrow icons
// import { useObjects } from "@/context/object-context";
// import { generateRandomId } from "@/lib/utils";
// import { createRoot } from "react-dom/client"; // Import createRoot
// import { Shapes } from "lucide-react";

// interface SvgPopoverProps {
//   fabricCanvasRef: React.RefObject<fabric.Canvas | null>;
// }

// const SvgPopover: React.FC<SvgPopoverProps> = ({ fabricCanvasRef }) => {
//   const { addObject } = useObjects(); // Accessing the context to add objects

//   // Array of arrow icons
//   const svgs = [
//     { name: "ArrowUp", component: ArrowUp },
//     { name: "ArrowDown", component: ArrowDown },
//     { name: "ArrowLeft", component: ArrowLeft },
//     { name: "ArrowRight", component: ArrowRight },
//   ];

//   const addSvgIcon = (IconComponent: React.FC) => {
//     if (fabricCanvasRef.current) {
//       // Create a temporary DOM element to render the SVG
//       const tempDiv = document.createElement("div");
//       const root = createRoot(tempDiv); // Create a root for the temporary div

//       // Test with a simple SVG string
//       const testSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" fill="blue" /></svg>`;
//       tempDiv.innerHTML = testSvg; // Directly set the innerHTML for testing

//       // Ensure the SVG element is rendered
//       const svgElement = tempDiv.firstChild;

//       if (svgElement) {
//         // Convert the SVG element to a string
//         const svgString = new XMLSerializer().serializeToString(svgElement);

//         // Create a Fabric.js path from the SVG string
//         const svgIcon = new fabric.Path(svgString, {
//           left: 100,
//           top: 100,
//           fill: "white", // Set the fill color as needed
//           selectable: true,
//         });

//         fabricCanvasRef.current.add(svgIcon);
//         fabricCanvasRef.current.setActiveObject(svgIcon);
//         fabricCanvasRef.current.renderAll();

//         // Create ObjectType with a random ID
//         const objectType = {
//           id: generateRandomId(),
//           type: "svg",
//           properties: svgIcon,
//         }; // Create ObjectType
//         console.log(objectType);
//         addObject(objectType); // Add the new SVG to the context
//       } else {
//         console.error("SVG element not rendered correctly.");
//       }
//     }
//   };

//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button variant={"outline"} size={"icon"}>
//           <Shapes /> {/* You can replace this with an appropriate icon */}
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent side="bottom" sideOffset={10} className="p-2 w-min">
//         <div className="flex flex-col justify-center space-y-2">
//           {svgs.map((svg) => (
//             <Button
//               key={svg.name}
//               variant={"default"}
//               size={"icon"}
//               onClick={() => addSvgIcon(svg.component)}
//             >
//               <svg.component /> {/* Render the SVG icon */}
//             </Button>
//           ))}
//         </div>
//       </PopoverContent>
//     </Popover>
//   );
// };

// export default SvgPopover;
