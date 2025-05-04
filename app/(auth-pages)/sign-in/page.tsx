"use client";

import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense } from "react";

// Composant qui utilise useSearchParams
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
      await signIn(email, password);
      router.push(returnUrl || "/");
    } catch (error: any) {
      setErrorMessage(
        error.message || "Une erreur s'est produite lors de la connexion."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex-1 flex flex-col w-full max-w-md mx-auto"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-medium">Se connecter</h1>
      <p className="text-sm text-foreground">
        Vous n'avez pas de compte ?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          S'inscrire
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="vous@exemple.com" required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Mot de passe</Label>
          <Link
            className="text-xs text-foreground underline"
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
        />
        {returnUrl && (
          <input type="hidden" name="returnUrl" value={returnUrl} />
        )}
        <SubmitButton pendingText="Connexion en cours..." disabled={isLoading}>
          Se connecter
        </SubmitButton>
        {errorMessage && (
          <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
        )}
        {success && (
          <div className="text-green-500 text-sm mt-2">{success}</div>
        )}
      </div>
    </form>
  );
}

// Composant principal avec Suspense
export default function Login() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <SignInForm />
    </Suspense>
  );
}
