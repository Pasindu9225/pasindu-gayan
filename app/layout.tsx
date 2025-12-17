import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script"; // <--- Added this import for the SEO script
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
  // 1. Domain Base
  metadataBase: new URL('https://www.pasindukawshalya.tech'),

  title: "Pasindu Gayan | Portfolio",
  description: "Full Stack Developer engineering Scalable SaaS & E-Commerce solutions.",

  // 2. Keywords
  keywords: ["Pasindu Gayan", "Portfolio", "Full Stack Developer", "Software Engineer", "Sri Lanka", "Next.js"],

  // 3. Verification Code (Kept yours)
  verification: {
    google: 'yHNQLjsgrmRPfF3IFQ-n9sHZgnJ4HH6dOIMVDC17Mqs',
  },

  // 4. OpenGraph
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

  // Define Structured Data (JSON-LD) for Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Pasindu Gayan',
    url: 'https://www.pasindukawshalya.tech',
    image: 'https://www.pasindukawshalya.tech/opengraph-image.png',
    jobTitle: 'Full Stack Developer',
    description: 'Full Stack Developer engineering Scalable SaaS & E-Commerce solutions.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Sri Lanka'
    },
    sameAs: [
      'https://github.com/pasindugayan', // Make sure these match your real profiles
      'https://www.linkedin.com/in/pasindugayan'
    ]
  };

  return (
    // FIX: Added suppressHydrationWarning
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased text-brand-dark bg-brand-cream`}
      >
        {/* SEO Script Injection */}
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

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