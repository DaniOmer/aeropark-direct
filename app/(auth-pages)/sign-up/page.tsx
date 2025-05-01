import { FormMessage, Message } from "@/components/form-message";
import { RegisterForm } from "@/components/register-form";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col space-y-4 w-full max-w-md mx-auto">
        <p className="text-sm text text-foreground mb-4">
          Vous avez déjà un compte ?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Se connecter
          </Link>
        </p>
        <RegisterForm message={searchParams} />
        {/* <SmtpMessage /> */}
      </div>
    </>
  );
}
