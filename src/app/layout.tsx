import LenisProvider from "@/components/ui/LenisProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Dramatic modern display font for main title
const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

// Modern geometric font for headings
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Steve",
  description: "Le Poisson Steve",
  keywords: "Steve, 3D Experience, Music Visualization, WebGL, Three.js, Interactive Design",
  authors: [{ name: "Steve", url: "https://looksgoodlabs.com" }],
  openGraph: {
    title: "Steve",
    description: "Le Poisson Steve",
    type: "website",
    images: [
      {
        url: '/steve-social.png',
        width: 1200,
        height: 630,
        alt: 'Steve - Interactive 3D Experience',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Steve's 3D Experience",
    description: "Le Poisson Steve",
    images: ['/steve-social.png'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
