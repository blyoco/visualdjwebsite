import type { Metadata } from "next";
import { mono, sans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "VisualDJ – Automatic visuals that move with the music",
  description:
    "VisualDJ listens to your mixer, finds the beat and plays a full night of visuals, with your DJs' photos, videos and texts mixed in. Automatically.",
  metadataBase: new URL("https://www.visualdj.music"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
