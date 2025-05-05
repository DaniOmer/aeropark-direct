"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import Logo from "@/public/park-aero.jpg";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "./theme-switcher";
import { useAuth } from "@/contexts/auth-context";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
    router.replace("/");
  };

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-screen-xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center">
          <Link href={"/"} className="font-bold text-lg text-primary">
            <Image src={Logo} width={60} height={60} alt="ParkAero Direct" />
          </Link>
          <div className="hidden md:flex gap-6 ml-8">
            <Link href={"/"} className="hover:text-primary transition-colors">
              Accueil
            </Link>
            <Link
              href={"/services"}
              className="hover:text-primary transition-colors"
            >
              Nos services
            </Link>
            <Link
              href={"/tarifs"}
              className="hover:text-primary transition-colors"
            >
              Tarifs
            </Link>
            <Link
              href={"/contact"}
              className="hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {!loading && user ? (
              <div className="flex items-center gap-4 justify-end">
                Hey, {user.email} !
                {user?.role === "admin" ? (
                  <Button
                    onClick={() => router.push("/admin")}
                    variant={"outline"}
                  >
                    Backoffice
                  </Button>
                ) : (
                  <Button
                    onClick={() => router.push("/protected")}
                    variant={"outline"}
                  >
                    Mes réservations
                  </Button>
                )}
                <Button onClick={handleSignOut} variant={"outline"}>
                  Se déconnecter
                </Button>
                <ThemeSwitcher />
              </div>
            ) : (
              <div className="flex gap-2">
                <Button asChild size="sm" variant={"outline"}>
                  <Link href="/sign-in">Se connecter</Link>
                </Button>
                <Button asChild size="sm" variant={"default"}>
                  <Link href="/sign-up">S&apos;inscrire</Link>
                </Button>
                <ThemeSwitcher />
              </div>
            )}
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b border-b-foreground/10 z-50">
          <div className="flex flex-col items-center gap-4 p-4">
            <Link
              href={"/"}
              className="hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              href={"/services"}
              className="hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Nos services
            </Link>
            <Link
              href={"/tarifs"}
              className="hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Tarifs
            </Link>
            <Link
              href={"/contact"}
              className="hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {!loading && user ? (
              <div className="flex flex-col items-center gap-4 justify-end mt-12">
                Hey, {user.email}!
                {user?.role === "admin" ? (
                  <Button
                    onClick={() => {
                      router.push("/admin");
                      setIsMenuOpen(false);
                    }}
                    variant={"outline"}
                  >
                    Backoffice
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      router.push("/protected");
                      setIsMenuOpen(false);
                    }}
                    variant={"outline"}
                  >
                    Mes réservations
                  </Button>
                )}
                <ThemeSwitcher />
              </div>
            ) : (
              <div className="flex gap-2 my-8">
                <Button
                  onClick={() => {
                    router.push("/sign-in");
                    setIsMenuOpen(false);
                  }}
                  size="sm"
                  variant={"outline"}
                >
                  Se connecter
                </Button>
                <Button
                  onClick={() => {
                    router.push("/sign-up");
                    setIsMenuOpen(false);
                  }}
                  size="sm"
                  variant={"default"}
                >
                  S&apos;inscrire
                </Button>
                <ThemeSwitcher />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
