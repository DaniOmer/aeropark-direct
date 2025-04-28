import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Aéropark Direct | Parking aéroport avec navette gratuite",
  description:
    "Réservez votre parking situé à moins de 10 minutes de l'aéroport avec navette gratuite 24h/24 – 7j/7.",
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
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-screen-xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center">
                    <Link href={"/"} className="font-bold text-lg text-primary">
                      ParkAero Direct
                    </Link>
                    <div className="hidden md:flex gap-6 ml-8">
                      <Link
                        href={"/"}
                        className="hover:text-primary transition-colors"
                      >
                        Accueil
                      </Link>
                      <Link
                        href={"#"}
                        className="hover:text-primary transition-colors"
                      >
                        Nos services
                      </Link>
                      <Link
                        href={"#"}
                        className="hover:text-primary transition-colors"
                      >
                        Tarifs
                      </Link>
                      <Link
                        href={"#"}
                        className="hover:text-primary transition-colors"
                      >
                        Contact
                      </Link>
                    </div>
                  </div>
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                </div>
              </nav>
              <div className="flex max-w-screen-xl flex-col gap-20 container p-5">
                {children}
              </div>

              <footer className="w-full bg-secondary text-secondary-foreground py-16">
                <div className="container max-w-screen-xl mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                      <h3 className="text-lg font-bold mb-4">
                        Aéropark Direct
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Parking sécurisé à proximité de l&apos;aéroport, 10
                        minutes de Orly 4, avec navette gratuite 24h/24 et 7j/7.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-4">Liens rapides</h3>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <Link
                            href="/"
                            className="text-muted-foreground hover:text-secondary-foreground transition-colors"
                          >
                            Accueil
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="#"
                            className="text-muted-foreground hover:text-secondary-foreground transition-colors"
                          >
                            Réservation
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="#"
                            className="text-muted-foreground hover:text-secondary-foreground transition-colors"
                          >
                            Nos services
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="#"
                            className="text-muted-foreground hover:text-secondary-foreground transition-colors"
                          >
                            Tarifs
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-4">Contact</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>3 avenue germaine</li>
                        <li>91170 Vitry-Châtillon</li>
                        <li>Tél: 06 24 72 48 11</li>
                        <li>Email: contact@parkaero-direct.fr</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-4">Horaires</h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        Accueil et navette disponibles 24h/24 et 7j/7.
                      </p>
                      <div className="flex items-center mt-4">
                        <ThemeSwitcher />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-muted mt-12 pt-8 text-center text-xs text-muted-foreground">
                    <p>
                      © {new Date().getFullYear()} ParkAero Direct. Tous droits
                      réservés.
                    </p>
                  </div>
                </div>
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
