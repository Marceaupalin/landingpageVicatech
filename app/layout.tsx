import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elio - Robots de service en RaaS",
  description:
    "Elio déploie des robots de service en RaaS multi-marques pour les métiers de la propreté, la logistique et l'hôtellerie. Nos robots augmentent vos équipes, ils ne les remplacent jamais.",
  openGraph: {
    title: "Elio - Robots de service",
    description: "Nos robots augmentent vos équipes, ils ne les remplacent jamais.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
