import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GTA Watch | Toronto Emergency Awareness",
  description:
    "Anonymous community-driven emergency awareness and guidance tool for the Greater Toronto Area. Report incidents, view real-time alerts, and receive AI-powered safety guidance.",
  keywords: [
    "Toronto",
    "GTA",
    "emergency",
    "safety",
    "incident reporting",
    "community awareness",
  ],
  authors: [{ name: "GTA Watch" }],
  robots: "noindex, nofollow", // Portfolio project - not for public indexing
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
