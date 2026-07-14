import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-instrument",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Glass - a reading of the sky",
  description: "Live atmospheric conditions, read like an instrument.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${instrument.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-background text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}