"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Define a return type for the action
export type SignUpActionResult = {
  error?: string;
  field?: string; // Optional field to associate the error with
} | void; // Return void on success redirect

export const signUpAction = async (
  formData: FormData
): Promise<SignUpActionResult> => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const firstName = formData.get("first_name")?.toString();
  const lastName = formData.get("last_name")?.toString();
  const phone = formData.get("phone")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password || !firstName || !lastName || !phone) {
    // Return an error object instead of redirecting
    return { error: "Tous les champs sont requis" };
    // return encodedRedirect("error", "/sign-up", "Tous les champs sont requis");
  }

  // Vérifier si l'email existe déjà dans la table users
  const { data: existingUser } = await supabase
    .from("users")
    .select("email")
    .eq("email", email)
    .single();

  if (existingUser) {
    console.log("Cet email est déjà utilisé");
    // Return an error object with the specific field
    return { error: "Cet email est déjà utilisé", field: "email" };
    // return encodedRedirect("error", "/sign-up", "Cet email est déjà utilisé");
  }

  // Créer l'utilisateur dans Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        role: "user",
      },
    },
  });

  if (authError) {
    console.error(authError.code + " " + authError.message);
    // Return a general error object
    return { error: authError.message };
    // return encodedRedirect("error", "/sign-up", authError.message);
  }

  // Créer l'utilisateur dans la table users
  const { error: dbError } = await supabase.from("users").insert({
    email,
    password: "**********", // Ne pas stocker le mot de passe en clair
    first_name: firstName,
    last_name: lastName,
    phone: phone,
    role: "user",
  });

  if (dbError) {
    console.error("Database error: ", dbError.message);
    // Si l'insertion échoue, on essaie de supprimer l'utilisateur créé dans Auth
    if (authData.user?.id) {
      await supabase.auth.admin.deleteUser(authData.user.id);
    }
    // Return a general error object
    return {
      error: "Erreur lors de la création du compte: " + dbError.message,
    };
  }

  // Only redirect on successful creation and insertion
  return encodedRedirect(
    "success",
    "/sign-up", // Redirect to sign-up page to show success message
    "Merci pour votre inscription ! Veuillez vérifier votre email pour confirmer votre compte."
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
