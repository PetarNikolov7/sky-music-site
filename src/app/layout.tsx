import type { Metadata } from "next";
import { Exo_2, Manrope } from "next/font/google";
import "./globals.css";

const headingFont = Exo_2({
  variable: "--font-heading",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
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
    icon: [
      {
        url: "/icon.svg?v=3",
        type: "image/svg+xml",
      },
      {
        url: "/sky-music-favicon.svg?v=3",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/icon.svg?v=3",
    apple: "/sky-music-favicon.svg?v=3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg">
      <head>
        <link rel="icon" href="/icon.svg?v=3" type="image/svg+xml" />
        <link rel="shortcut icon" href="/icon.svg?v=3" type="image/svg+xml" />
      </head>
      <body
        className={`${headingFont.variable} ${bodyFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}