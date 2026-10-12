import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VisualDJ",
  description: "Automatische VJ-visuals die live meebewegen op de muziek.",
  metadataBase: new URL("https://visualdj.com"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
