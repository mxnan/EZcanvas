import { Chakra_Petch, Open_Sans } from "next/font/google";

// font for root layout
export const fontsans = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
  display: "swap",
});

// Font for text editor
export const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const FONT_FAMILIES = [
  {
    name: "Sans Serif",
    fonts: ["Open Sans"],
  },
];

export const ALL_FONTS = FONT_FAMILIES.reduce<string[]>(
  (acc, category) => [...acc, ...category.fonts],
  []
);
