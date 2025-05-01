"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { signUpAction, SignUpActionResult } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";

const schema = yup.object().shape({
  email: yup.string().email("Email invalide").required("Email requis"),
  password: yup
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .required("Mot de passe requis"),
  first_name: yup.string().required("Prénom requis"),
  last_name: yup.string().required("Nom requis"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Numéro de téléphone invalide")
    .required("Numéro de téléphone requis"),
});

type FormData = yup.InferType<typeof schema>;

interface RegisterFormProps {
  message?: Message;
}

export function RegisterForm({ message }: RegisterFormProps) {
  const searchParams = useSearchParams();
  const emailFromParams = searchParams?.get("email") || "";

  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: emailFromParams,
    },
  });

  // Pre-fill email from URL parameter
  useEffect(() => {
    if (emailFromParams) {
      setValue("email", emailFromParams);
    }
  }, [emailFromParams, setValue]);

  // Gestion des erreurs serveur
  useEffect(() => {
    if (message) {
      let errorMessage = "";

      if ("error" in message) {
        errorMessage = message.error;
      } else if ("message" in message) {
        errorMessage = message.message;
      }

      if (
        errorMessage &&
        (errorMessage.includes("email") ||
          errorMessage.includes("déjà utilisé"))
      ) {
        setError("email", {
          type: "server",
          message: "Cet email est déjà utilisé",
        });
        setFormError(errorMessage);
      }
    }
  }, [message, setError]);

  // Reintroduce onSubmit to handle the action call and error display
  const onSubmit = async (data: FormData) => {
    setFormError(null); // Clear previous errors
    startTransition(async () => {
      // Wrap action call in transition
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      const result: SignUpActionResult = await signUpAction(formData);

      if (result?.error) {
        if (result.field && result.field === "email") {
          setError("email", {
            type: "server",
            message: result.error,
          });
        } else {
          // Set general form error for other cases
          setFormError(result.error);
          // Or use setError("root", { type: "server", message: result.error });
        }
      }
      // Success case is handled by the redirect in signUpAction
    });
  };

  return (
    <form
      id="signup-form"
      className="flex flex-col w-full max-w-md mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-2xl font-medium">S'inscrire</h1>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <div>
          <Label htmlFor="first_name">Prénom</Label>
          <Input
            {...register("first_name")}
            name="first_name"
            placeholder="Votre prénom"
            required
          />
          {errors.first_name && (
            <p className="text-red-500 text-sm">{errors.first_name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="last_name">Nom</Label>
          <Input
            {...register("last_name")}
            name="last_name"
            placeholder="Votre nom"
            required
          />
          {errors.last_name && (
            <p className="text-red-500 text-sm">{errors.last_name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            {...register("email")}
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            {...register("phone")}
            name="phone"
            placeholder="0612345678"
            required
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            {...register("password")}
            name="password"
            type="password"
            placeholder="Votre mot de passe"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <SubmitButton pending={isPending} pendingText="Inscription...">
          S'inscrire
        </SubmitButton>
        {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}
        {message && "success" in message && <FormMessage message={message} />}
      </div>
    </form>
  );
}
