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
  title: "Steve - Spectacular 3D Experience & Music Visualization",
  description: "Steve's cutting-edge 3D website featuring immersive music visualization, dynamic particle systems, and stunning scroll animations",
  keywords: "Steve, 3D Experience, Music Visualization, WebGL, Three.js, Interactive Design",
  authors: [{ name: "Steve" }],
  openGraph: {
    title: "Steve - Spectacular 3D Experience",
    description: "Experience Steve's revolutionary 3D website with music-reactive visuals and immersive animations",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Steve's 3D Experience",
    description: "Revolutionary 3D website with music visualization",
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
        {children}
      </body>
    </html>
  );
}
