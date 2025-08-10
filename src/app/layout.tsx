import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "3D Studio - Professional Three.js Development Platform",
  description: "Professional Three.js development platform with custom GLSL shaders, GSAP animations, and optimized performance for stunning web experiences",
  keywords: "Three.js, WebGL, 3D, React Three Fiber, GSAP, Web Development",
  authors: [{ name: "3D Studio" }],
  openGraph: {
    title: "3D Studio - Professional Three.js Development",
    description: "Build stunning 3D web experiences with our professional development platform",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "3D Studio",
    description: "Professional Three.js development platform",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
