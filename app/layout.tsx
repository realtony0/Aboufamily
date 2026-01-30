import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aboufamily.com'),
  title: {
    default: "Abou Family | Excellence Gourmande - Chocolats Premium à Dakar",
    template: "%s | Abou Family"
  },
  description: "Découvrez notre sélection exclusive de chocolats Dubai, Nutella, Kinder et produits premium au Sénégal. Livraison express 20-45 min à Dakar. Commandez en ligne vos confiseries de luxe.",
  keywords: ["chocolat", "chocolats Dubai", "Nutella", "Kinder", "confiseries", "Dakar", "Sénégal", "livraison express", "produits premium", "chocolaterie", "e-commerce Sénégal"],
  authors: [{ name: "Abou Family" }],
  creator: "Abou Family",
  publisher: "Abou Family",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_SN",
    url: "https://aboufamily.com",
    siteName: "Abou Family",
    title: "Abou Family | Excellence Gourmande - Chocolats Premium à Dakar",
    description: "Découvrez notre sélection exclusive de chocolats Dubai, Nutella, Kinder et produits premium au Sénégal. Livraison express 20-45 min à Dakar.",
    images: [
      {
        url: "/logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Abou Family - Excellence Gourmande",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abou Family | Excellence Gourmande",
    description: "Chocolats premium et confiseries de luxe livrés à Dakar en 20-45 minutes",
    images: ["/logo.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: "https://aboufamily.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">
        <StructuredData type="Organization" />
        <StructuredData type="LocalBusiness" />
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
