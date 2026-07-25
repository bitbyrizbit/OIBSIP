import type { Metadata } from "next";
import { Newsreader, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500"],
  variable: "--font-newsreader",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  title: "Relay",
  description: "A voice assistant that actually understands what you mean.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${newsreader.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className="bg-[#0D0A07] text-[#F0E8D5] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}