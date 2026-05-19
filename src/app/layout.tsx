import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sky-music-site-sigma.vercel.app"),
  title: {
    default: "SKY MUSIC BG | Музикални инструменти и студио оборудване в Бургас",
    template: "%s | SKY MUSIC BG",
  },
  description:
    "Каталог на SKY MUSIC BG – музикални инструменти, студио оборудване, микрофони и аксесоари в Бургас. Запитване по WhatsApp, Messenger, телефон или имейл.",
  keywords: [
    "SKY MUSIC BG",
    "музикален магазин Бургас",
    "музикални инструменти",
    "студио оборудване",
    "микрофони",
    "китари",
    "клавири",
    "аксесоари",
    "музикален магазин",
  ],
  authors: [{ name: "SKY MUSIC BG" }],
  creator: "SKY MUSIC BG",
  publisher: "SKY MUSIC BG",
  openGraph: {
    type: "website",
    locale: "bg_BG",
    url: "https://sky-music-site-sigma.vercel.app",
    siteName: "SKY MUSIC BG",
    title: "SKY MUSIC BG | Музикални инструменти и студио оборудване",
    description:
      "Разгледай каталога на SKY MUSIC BG – музикални инструменти, студио оборудване, микрофони и аксесоари. Запитване по WhatsApp, Messenger, телефон или имейл.",
    images: [
      {
        url: "/sky-music-logo-dark-header.png",
        width: 1200,
        height: 630,
        alt: "SKY MUSIC BG",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SKY MUSIC BG | Музикални инструменти и студио оборудване",
    description:
      "Каталог на SKY MUSIC BG – музикални инструменти, студио оборудване, микрофони и аксесоари в Бургас.",
    images: ["/sky-music-logo-dark-header.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/sky-music-logo-dark-header.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}