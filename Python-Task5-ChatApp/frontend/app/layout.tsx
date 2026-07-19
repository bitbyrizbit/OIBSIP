import type { Metadata } from "next";
import { Newsreader, Work_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-work-sans",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "Party Line",
  description: "A chat app that feels like passing notes, not sending pings.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${newsreader.variable} ${workSans.variable} ${spaceMono.variable}`}>
      <body className="bg-[#14110F] text-[#F2EAD8] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}