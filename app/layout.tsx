export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LogoSymbol from "@/components/LogoSymbol";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

const BASE = "https://grani-production.up.railway.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "Грани Страха — Хоррор квесты в Чите",
    template: "%s | Грани Страха — Квесты в Чите",
  },
  description:
    "Хоррор квесты с живыми актёрами в Чите. Бункер 404, Тайна отеля, Проклятие монахини. Забронировать квест — звоните +7 (914) 516-31-88. Экстремальные квесты для взрослых.",
  keywords: [
    "квесты Чита", "хоррор квест Чита", "страшные квесты Чита",
    "квест комната Чита", "квест с актёрами Чита", "Грани страха Чита",
    "экстрим квест Чита", "квест для взрослых Чита", "забронировать квест Чита",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: BASE,
    siteName: "Грани Страха",
    title: "Грани Страха — Хоррор квесты в Чите",
    description: "Хоррор квесты с живыми актёрами в Чите. Экстремальные впечатления с 2017 года.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  alternates: { canonical: BASE },
  robots: { index: true, follow: true },
  verification: { google: "7lzEyh3jf6U0eU0pnwxqT39jy4S-wgQ24qvDcNHae-M" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&family=DM+Mono:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SessionProviderWrapper>
          <LogoSymbol />
          <Nav />
          {children}
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
