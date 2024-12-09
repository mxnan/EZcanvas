import { 
  Open_Sans,
  Inter,
  Roboto_Flex,
  Montserrat,
  Oswald,
  Source_Sans_3,
  Raleway,
  Nunito,
  Quicksand,
  Work_Sans,
  Urbanist,
  Plus_Jakarta_Sans,
  Outfit, 
  Source_Code_Pro
} from 'next/font/google'

// font for root layout
export const fontsans = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Initialize fonts with variable support
export const openSans = Open_Sans({ subsets: ["latin"], display: "swap" });
export const inter = Inter({ subsets: ["latin"], display: "swap" });
export const robotoFlex = Roboto_Flex({ subsets: ["latin"], display: "swap" });
export const montserrat = Montserrat({ subsets: ["latin"], display: "swap" });
export const oswald = Oswald({ subsets: ["latin"], display: "swap" });
export const sourceSans3 = Source_Sans_3({ subsets: ["latin"], display: "swap" });
export const raleway = Raleway({ subsets: ["latin"], display: "swap" });
export const nunito = Nunito({ subsets: ["latin"], display: "swap" });
export const quicksand = Quicksand({ subsets: ["latin"], display: "swap" });
export const workSans = Work_Sans({ subsets: ["latin"], display: "swap" });
export const urbanist = Urbanist({ subsets: ["latin"], display: "swap" });
export const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });
export const outfit = Outfit({ subsets: ["latin"], display: "swap" });

export const FONT_FAMILIES = [
  {
    name: "Sans Serif",
    fonts: [
      "Open Sans",
      "Inter",
      "Roboto Flex",
      "Montserrat",
      "Source Sans 3",
      "Raleway",
      "Nunito",
      "Quicksand",
      "Work Sans",
      "Urbanist",
      "Plus Jakarta Sans",
      "Outfit"
    ],
  },
  {
    name: "Display",
    fonts: [
      "Oswald"
    ],
  }
];

export const ALL_FONTS = FONT_FAMILIES.reduce<string[]>(
  (acc, category) => [...acc, ...category.fonts],
  []
);
