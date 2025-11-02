import type { Metadata } from "next";
import { JetBrains_Mono } from 'next/font/google'
import "./globals.css";

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Ethan Zhang",
  description: "Ethan Zhang's personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetBrainsMono.className + " antialiased"}>
      <head>
        {/* Favicons */}
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
