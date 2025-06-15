import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stability AI Image Editor",
  description: "Generate, inpaint, and erase images using Stability AI",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo200.png', sizes: '200x200', type: 'image/png' }
    ],
    apple: '/logo200.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo200.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo200.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
