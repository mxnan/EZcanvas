export const siteConfig = {
  name: "Image Text Gif",
  description:
    "Create beautiful animated GIFs with custom text overlays and background removal",
  url: "https://image-text-gif.vercel.app", // Replace with your actual domain
  ogImage: "/og-image.png",
  creator: "Your Name",

  // Social links
  links: {
    twitter: "https://twitter.com/yourusername",
    github: "https://github.com/mxnan/image-text-gif",
  },
} as const;

export const imageConfig = {
  preview: {
    maxWidth: 450,
    maxHeight: 300,
  },
  output: {
    scaleFactor: 2,
    quality: 0.8,
  },
  formats: {
    accepted: ["image/jpeg", "image/png", "image/webp"],
    maxSize: 5 * 1024 * 1024, // 5MB
  },
} as const;

export const gifConfig = {
  output: {
    maxWidth: 900, // 450 * 2
    maxHeight: 600, // 300 * 2
    quality: 10,
    delay: 0,
  },
} as const;

export const textConfig = {
  fonts: {
    default: "Inter",
    available: [
      "Inter",
      "Roboto",
      "Arial",
      "Times New Roman",
      "Courier New",
      "Georgia",
      "Verdana",
    ],
  },
  sizes: {
    min: 12,
    max: 120,
    default: 48,
  },
  weights: {
    available: [300, 400, 500, 600, 700],
    default: 400,
  },
} as const;

export const authConfig = {
  freeGenerations: 3,
  subscriptionPlans: {
    lifetime: {
      name: "Lifetime",
      price: 29,
      features: [
        "Unlimited generations",
        "Priority support",
        "Early access to new features",
      ],
    },
    // Add more plans if needed
  },
} as const;

// Type definitions for the config
export type SiteConfig = typeof siteConfig;
export type ImageConfig = typeof imageConfig;
export type GifConfig = typeof gifConfig;
export type TextConfig = typeof textConfig;
export type AuthConfig = typeof authConfig;

// Metadata configuration for Next.js
export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "gif creator",
    "text animation",
    "image editor",
    "background removal",
    "gif generator",
    "text overlay",
  ],
  authors: [
    {
      name: siteConfig.creator,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.creator,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.links.twitter,
  },
  icons: {
    icon: "/favicon.ico",
  },
} as const;

// Environment variables type checking
export const env = {
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL!,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
} as const;

// Validate environment variables
Object.entries(env).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});
