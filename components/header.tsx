"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "@/public/park-aero.jpg";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "./theme-switcher";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
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
            {user ? (
              <div className="flex items-center gap-4 justify-end">
                Hey, {user.email}!
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

            <div className="flex gap-2 my-8">
              <Button asChild size="sm" variant={"outline"}>
                <Link href="/sign-in">Se connecter</Link>
              </Button>
              <Button asChild size="sm" variant={"default"}>
                <Link href="/sign-up">S&apos;inscrire</Link>
              </Button>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
