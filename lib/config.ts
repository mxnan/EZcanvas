export const siteConfig = {
  name: "Image Text Gif",
  description:
    "Create beautiful animated GIFs with custom text overlays and background removal",
  url: "https://image-text-gif.vercel.app", // Replace with your actual domain
  ogImage: "/opengraph-image.png",
  creator: "mxnan",

  // Social links
  links: {
    twitter: "https://twitter.com/yourusername",
    github: "https://github.com/mxnan/image-text-gif",
  },
} as const;

// Type definitions for the config
export type SiteConfig = typeof siteConfig;

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
