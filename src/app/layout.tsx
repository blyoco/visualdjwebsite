import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VisualDJ",
  description: "Automatic VJ visuals that move live with the music.",
  metadataBase: new URL("https://visualdj.com"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
