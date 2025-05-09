import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import Providers from "@/libs/tanstack-query/providers";
import AdminNavbar from "@/components/templates/Layout/AdminNavbar";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gatherlove.vercel.app/admin"),
  title: "Gatherlove - Admin Dashboard",
  openGraph: {
    title: "Gatherlove - Admin Dashboard",
    url: "https://gatherlove.vercel.app/admin",
    siteName: "Gatherlove",
    type: "website",
    locale: "en-US",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🖥️</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} antialiased bg-gray-50`}>
        <Providers>
          <AdminNavbar />
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
