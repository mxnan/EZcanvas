import {
  Inter,
  Roboto_Flex,
  Montserrat,
  Oswald,
  Plus_Jakarta_Sans,
  Outfit,
  Poppins,
  Space_Grotesk,
  Sora,
  Unbounded,
  Dela_Gothic_One,
  Righteous,
  Archivo_Black,
  Bebas_Neue,
} from "next/font/google";

// Initialize fonts at module level
export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"], 
  display: "swap" 
});

export const sora = Sora({ 
  subsets: ["latin"], 
  display: "swap" 
});

export const unbounded = Unbounded({ 
  subsets: ["latin"], 
  display: "swap" 
});

export const outfit = Outfit({ 
  subsets: ["latin"], 
  display: "swap" 
});

export const delaGothicOne = Dela_Gothic_One({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export const righteous = Righteous({ 
  subsets: ["latin"], 
  display: "swap", 
  weight: "400" 
});

export const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export const inter = Inter({ 
  subsets: ["latin"], 
  display: "swap" 
});

export const robotoFlex = Roboto_Flex({ 
  subsets: ["latin"], 
  display: "swap" 
});

export const montserrat = Montserrat({ 
  subsets: ["latin"], 
  display: "swap" 
});

export const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const oswald = Oswald({ 
  subsets: ["latin"], 
  display: "swap" 
});

// Map font names to their instances
export const fontInstances = {
  "Plus Jakarta Sans": plusJakartaSans,
  "Space Grotesk": spaceGrotesk,
  "Sora": sora,
  "Unbounded": unbounded,
  "Outfit": outfit,
  "Dela Gothic One": delaGothicOne,
  "Righteous": righteous,
  "Archivo Black": archivoBlack,
  "Bebas Neue": bebasNeue,
  "Inter": inter,
  "Roboto Flex": robotoFlex,
  "Montserrat": montserrat,
  "Poppins": poppins,
  "Oswald": oswald,
} as const;

// Keep your existing FONT_FAMILIES structure
export const FONT_FAMILIES = [
  {
    name: "Modern Headlines",
    fonts: [
      "Plus Jakarta Sans",
      "Space Grotesk",
      "Sora",
      "Unbounded",
      "Outfit",
    ],
  },
  {
    name: "Bold Display",
    fonts: [
      "Dela Gothic One",
      "Righteous",
      "Archivo Black",
      "Bebas Neue",
    ],
  },
  {
    name: "Professional",
    fonts: [
      "Inter",
      "Roboto Flex",
      "Montserrat",
      "Poppins",
      "Oswald",
    ],
  },
];

export const ALL_FONTS = FONT_FAMILIES.reduce<string[]>(
  (acc, category) => [...acc, ...category.fonts],
  []
);

export const getFontClassName = (fontName: keyof typeof fontInstances) => {
  return fontInstances[fontName]?.className || "";
};