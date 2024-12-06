import "./globals.css";
import { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/nav/navbar";
import { StoreProvider } from "@/providers/store-provider";
import { fontsans } from "@/constants/fonts";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
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
};
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff" },
    { media: "(prefers-color-scheme: dark)", color: "#000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "relative antialiased font-sans scrollbar-hide",
          fontsans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <Navbar />
            {children}
            <Toaster position="top-right" />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
