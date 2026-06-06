import type { Metadata } from "next";
import { DarkModeSync } from "@/components/ui/DarkModeSync";
import "./globals.css";

export const metadata: Metadata = {
  title: "LuxeEstate — Find Your Sanctuary",
  description:
    "Discover premium real estate properties for sale and rent. Curated luxury homes, penthouses, villas, and apartments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <DarkModeSync />
        {children}
      </body>
    </html>
  );
}
