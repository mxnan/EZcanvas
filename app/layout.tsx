import "./globals.css";
import { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/nav/navbar";
import { StoreProvider } from "@/providers/store-provider";
import { siteConfig } from "@/lib/config";
import { Jura } from "next/font/google";
import Footer from "@/components/nav/footer";
import { Head } from "next/document";
// import { CSPostHogProvider } from "@/providers/post-hog-provider"; posthog off due to hydration error in dev mode

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
// font for root layout
export const fontsans = Jura({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NEXT_PUBLIC_NODE_ENV === "dev";
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Paste React Scan Script tag in your Nextjs App*/}
        {isDev && (
          <script
            key="react-scan"
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            async={false}
            // strategy="beforeInteractive"
          />
        )}
      </head>
      {/* <CSPostHogProvider> */}
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
            <Footer />
            <Toaster position="top-right" />
          </StoreProvider>
        </ThemeProvider>
      </body>
      {/* </CSPostHogProvider> */}
    </html>
  );
}
