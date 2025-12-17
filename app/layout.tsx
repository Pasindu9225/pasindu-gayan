import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AntigravityBackground from "../components/AntigravityBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // 1. This tells Next.js your actual domain name so social cards work correctly
  metadataBase: new URL('https://www.pasindukawshalya.tech'),

  title: "Pasindu Gayan | Portfolio",
  description: "Full Stack Developer engineering Scalable SaaS & E-Commerce solutions.",

  // 2. Extra SEO keywords
  keywords: ["Pasindu Gayan", "Portfolio", "Full Stack Developer", "Software Engineer", "Sri Lanka", "Next.js"],

  // 3. Explicit OpenGraph settings (The image is auto-detected from opengraph-image.png, but this text helps)
  openGraph: {
    title: "Pasindu Gayan | Portfolio",
    description: "Full Stack Developer engineering Scalable SaaS & E-Commerce solutions.",
    url: 'https://www.pasindukawshalya.tech',
    siteName: 'Pasindu Gayan',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // FIX: Added suppressHydrationWarning to ignore browser extension injections
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased text-brand-dark bg-brand-cream`}
      >
        {/* The Physics Canvas Grid */}
        <AntigravityBackground />

        {/* Main Content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}