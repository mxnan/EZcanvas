// src/types/fabricObject.ts
import { fabric } from "fabric";

export interface CustomFabricObject extends fabric.Object {
  id: string; // Add the id property
}

// Extend the IText type to include the id property
export interface CustomIText extends fabric.IText {
  id: string; // Add the id property
}
export interface CustomFabricImage extends fabric.Image {
  id: string; // Add the id property
}