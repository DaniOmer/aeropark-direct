"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense } from "react";

function SignInForm() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams?.get("returnUrl") || "";
  const error = searchParams?.get("error") || "";
  const success = searchParams?.get("success") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(error);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const signedInUser = await signIn(email, password);
      if (returnUrl) {
        router.push(returnUrl);
      } else {
        if (
          signedInUser?.role === "admin" ||
          signedInUser?.role === "super_admin"
        ) {
          router.push("/admin");
        } else {
          router.push("/protected");
        }
      }
    } catch (error: any) {
      setErrorMessage(
        error.message || "Une erreur s'est produite lors de la connexion."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-extrabold text-foreground">
          ParkAero <span className="text-primary">Direct</span>
        </Link>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
        <h1 className="text-2xl font-bold mb-1">Se connecter</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Vous n&apos;avez pas de compte ?{" "}
          <Link
            className="text-primary font-medium hover:underline"
            href="/sign-up"
          >
            S&apos;inscrire
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium mb-1.5 block">
              Email
            </Label>
            <Input
              name="email"
              placeholder="vous@exemple.com"
              required
              className="rounded-lg focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Mot de passe
              </Label>
              <Link
                className="text-xs text-primary hover:underline"
                href="/forgot-password"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <Input
              type="password"
              name="password"
              placeholder="Votre mot de passe"
              required
              className="rounded-lg focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500"
            />
          </div>

          {returnUrl && (
            <input type="hidden" name="returnUrl" value={returnUrl} />
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold py-2.5 rounded-xl shadow-[0_4px_14px_rgba(14,165,233,0.35)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>

          {errorMessage && (
            <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg">
              {errorMessage}
            </div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-sm p-3 rounded-lg">
              {success}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground">Chargement...</div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
