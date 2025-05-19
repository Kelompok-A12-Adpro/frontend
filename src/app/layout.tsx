import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/libs/tanstack-query/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gatherlove.vercel.app"),
  title: "Gatherlove - Spreading Love to the World",
  description: "A fundraising platform for gathering love and support for those in need.",
  keywords: ["fundraising", "charity", "support", "community", "love"],
  openGraph: {
    title: "Gatherlove - Spreading Love to the World",
    description: "A fundraising platform for gathering love and support for those in need.",
    url: "https://gatherlove.vercel.app",
    siteName: "Gatherlove",
    type: "website",
    locale: "en-US",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>❤️</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Providers>
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
