import { FormMessage, Message } from "@/components/form-message";
import { RegisterForm } from "@/components/register-form";
import Link from "next/link";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full max-w-md flex items-center justify-center p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-extrabold text-foreground">
          ParkAero <span className="text-primary">Direct</span>
        </Link>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
        <h1 className="text-2xl font-bold mb-1">Créer un compte</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Vous avez déjà un compte ?{" "}
          <Link
            className="text-primary font-medium hover:underline"
            href="/sign-in"
          >
            Se connecter
          </Link>
        </p>
        <RegisterForm message={searchParams} />
      </div>
    </div>
  );
}
