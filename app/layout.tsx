import "./globals.css";
import { Chakra_Petch } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/nav/navbar";
import { StoreProvider } from "@/providers/store-provider";
import { metadata } from "@/lib/config";

export { metadata };

export const fontsans = Chakra_Petch({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});
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
