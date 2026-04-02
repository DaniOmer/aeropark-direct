import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-extrabold text-foreground">
          ParkAero <span className="text-primary">Direct</span>
        </Link>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
        <h1 className="text-2xl font-bold mb-1">
          Réinitialiser le mot de passe
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Vous avez déjà un compte ?{" "}
          <Link
            className="text-primary font-medium hover:underline"
            href="/sign-in"
          >
            Se connecter
          </Link>
        </p>

        <form className="space-y-4">
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

          <SubmitButton
            formAction={forgotPasswordAction}
            className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold py-2.5 rounded-xl shadow-[0_4px_14px_rgba(14,165,233,0.35)] transition-all"
          >
            Réinitialiser le mot de passe
          </SubmitButton>

          <FormMessage message={searchParams} />
        </form>
      </div>
    </div>
  );
}
