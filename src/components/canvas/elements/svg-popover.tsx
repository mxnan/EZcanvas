import React from 'react';
import Popover from '@/components/ui/Popover';
import { LucideIcon, IconName1, IconName2 } from 'lucide-react'; // Import your desired icons

interface SvgPopoverProps {
  fabricCanvasRef: React.RefObject<fabric.Canvas | null>;
  onClose: () => void;
}

const SvgPopover: React.FC<SvgPopoverProps> = ({ fabricCanvasRef, onClose }) => {
  const addSvgIcon1 = () => {
    // Logic to add SVG Icon 1 to the canvas
    console.log('Add SVG Icon 1');
    onClose(); // Close the popover after adding
  };

  const addSvgIcon2 = () => {
    // Logic to add SVG Icon 2 to the canvas
    console.log('Add SVG Icon 2');
    onClose(); // Close the popover after adding
  };

  const svgsItems = [
    { label: 'SVG Icon 1', onClick: addSvgIcon1 },
    { label: 'SVG Icon 2', onClick: addSvgIcon2 },
  ];

  return (
    <>
    </>
  );
};

export default SvgPopover;
