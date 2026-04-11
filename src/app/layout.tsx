import type { Metadata } from "next";
import { JetBrains_Mono, Caveat, IBM_Plex_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next';
import NavBar from "@/components/NavBar";
import "./globals.css";

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: '600',
  variable: '--font-caveat',
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans',
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
    <html lang="en" className={`${jetBrainsMono.variable} ${caveat.variable} ${ibmPlexSans.variable} antialiased`}>
      <head>
        {/* Favicons */}
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
      </head>
      <body>
        <NavBar></NavBar>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
