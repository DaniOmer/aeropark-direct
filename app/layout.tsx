import { ThemeSwitcher } from "@/components/theme-switcher";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import Header from "@/components/header";
import { ToastProvider } from "@/components/providers/toast-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { GoogleAnalytics } from "@next/third-parties/google";
import Image from "next/image";
import Logo from "@/public/park-aero.jpg";
import JsonLd from "@/components/json-ld";
import Breadcrumbs from "@/components/breadcrumbs";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "ParkAero Direct | Parking aéroport Orly avec navette gratuite",
    template: "%s | ParkAero Direct",
  },
  description:
    "Parking sécurisé à moins de 10 minutes de l'aéroport d'Orly avec navette gratuite 24h/24 – 7j/7. Tarifs compétitifs, vidéosurveillance, réservation en ligne.",
  keywords: [
    "parking aéroport Orly",
    "parking Orly pas cher",
    "parking navette Orly",
    "parking sécurisé Orly",
    "parking longue durée Orly",
    "navette gratuite aéroport",
    "parking Viry-Châtillon",
    "stationnement aéroport Orly",
    "parking aéroport pas cher",
    "ParkAero Direct",
  ],
  authors: [{ name: "ParkAero Direct" }],
  creator: "ParkAero Direct",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "ParkAero Direct",
    title: "ParkAero Direct | Parking aéroport Orly avec navette gratuite",
    description:
      "Parking sécurisé à 10 min d'Orly. Navette gratuite 24h/24, vidéosurveillance, tarifs imbattables. Réservez en ligne en 30 secondes.",
    url: defaultUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "ParkAero Direct | Parking aéroport Orly",
    description:
      "Parking sécurisé à 10 min d'Orly. Navette gratuite 24h/24. Réservez en ligne.",
  },
  alternates: {
    canonical: defaultUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={geistSans.className} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://js.stripe.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="bg-background text-foreground">
        <JsonLd />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ToastProvider>
              <main className="min-h-screen flex flex-col items-center">
                <div className="flex-1 w-full flex flex-col items-center">
                  <Header />
                  <Breadcrumbs />
                  <div className="w-full">
                    {children}
                  </div>

                  <footer className="w-full bg-[#0c1821] text-white pt-14 pb-6">
                    <div className="container max-w-screen-xl mx-auto px-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-10">
                        <div className="sm:col-span-2 lg:col-span-1">
                          <div className="mb-3">
                            <Image
                              src={Logo}
                              width={60}
                              height={60}
                              alt="ParkAero Direct"
                            />
                          </div>
                          <p className="text-white/40 text-sm leading-relaxed">
                            Parking sécurisé à proximité de l&apos;aéroport
                            d&apos;Orly, avec navette gratuite disponible
                            24h/24.
                          </p>
                        </div>

                        <div>
                          <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-400/60 mb-4">
                            Navigation
                          </h4>
                          <ul className="space-y-2.5 text-sm">
                            <li>
                              <Link
                                href="/"
                                className="text-white/40 hover:text-white transition-colors"
                              >
                                Accueil
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/services"
                                className="text-white/40 hover:text-white transition-colors"
                              >
                                Services
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/tarifs"
                                className="text-white/40 hover:text-white transition-colors"
                              >
                                Tarifs
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/contact"
                                className="text-white/40 hover:text-white transition-colors"
                              >
                                Contact
                              </Link>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-400/60 mb-4">
                            Contact
                          </h4>
                          <ul className="space-y-2.5 text-sm text-white/40">
                            <li>3 avenue germaine</li>
                            <li>91170 Viry-Châtillon</li>
                            <li>07 83 82 92 60</li>
                            <li>aeroparkdirect@hotmail.com</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-400/60 mb-4">
                            Horaires
                          </h4>
                          <p className="text-white/40 text-sm leading-relaxed mb-4">
                            Accueil et navette disponibles 24h/24 et 7j/7.
                          </p>
                          <ThemeSwitcher />
                        </div>

                        <div>
                          <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-400/60 mb-4">
                            Légal
                          </h4>
                          <ul className="space-y-2.5 text-sm">
                            <li>
                              <Link
                                href="/mentions-legales"
                                className="text-white/40 hover:text-white transition-colors"
                              >
                                Mentions légales
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/cgu"
                                className="text-white/40 hover:text-white transition-colors"
                              >
                                CGU
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/cgv"
                                className="text-white/40 hover:text-white transition-colors"
                              >
                                CGV
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/politique-confidentialite"
                                className="text-white/40 hover:text-white transition-colors"
                              >
                                Confidentialité
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="border-t border-white/[0.06] pt-5 text-center text-xs text-white/25">
                        <p>
                          © {new Date().getFullYear()} ParkAero Direct. Tous
                          droits réservés.
                        </p>
                      </div>
                    </div>
                  </footer>
                </div>
                <WhatsAppButton phoneNumber="+33783829260" />
              </main>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="AW-17111679485" />
    </html>
  );
}
