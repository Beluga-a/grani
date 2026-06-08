import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LogoSymbol from "@/components/LogoSymbol";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

export const metadata: Metadata = {
  title: "ГРАНИ СТРАХА — Horror Quest World",
  description:
    "Премиальные хоррор-квесты с живыми актёрами и кинематографическими декорациями. С 2017 года.",
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
