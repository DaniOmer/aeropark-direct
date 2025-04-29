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

// Types for pricing data
export type PriceData = {
  id: string;
  parking_lot_id: string;
  base_price: number;
  base_duration_days: number;
  additional_day_price: number;
  late_fee: number;
  currency: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

// Types for options data
export type OptionData = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

// Fetch pricing data from the database
export const getPricingData = async (): Promise<PriceData[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("prices")
    .select("*")
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching pricing data:", error);
    return [];
  }

  return data || [];
};

// Fetch all pricing data for admin (including inactive)
export const getAllPricingData = async (): Promise<PriceData[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("prices")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all pricing data:", error);
    return [];
  }

  return data || [];
};

// Fetch a single price by ID
export const getPriceById = async (id: string): Promise<PriceData | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("prices")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching price by ID:", error);
    return null;
  }

  return data;
};

// Create a new price
export const createPrice = async (
  price: Omit<PriceData, "id" | "created_at" | "updated_at">
): Promise<{ success: boolean; error?: string; id?: string }> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("prices")
    .insert([price])
    .select();

  if (error) {
    console.error("Error creating price:", error);
    return { success: false, error: error.message };
  }

  return { success: true, id: data[0].id };
};

// Update an existing price
export const updatePrice = async (
  id: string,
  price: Partial<Omit<PriceData, "id" | "created_at" | "updated_at">>
): Promise<{ success: boolean; error?: string }> => {
  const supabase = await createClient();

  const { error } = await supabase.from("prices").update(price).eq("id", id);

  if (error) {
    console.error("Error updating price:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
};

// Delete a price
export const deletePrice = async (
  id: string
): Promise<{ success: boolean; error?: string }> => {
  const supabase = await createClient();

  const { error } = await supabase.from("prices").delete().eq("id", id);

  if (error) {
    console.error("Error deleting price:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
};

// Fetch all options data for admin
export const getAllOptionsData = async (): Promise<OptionData[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("options")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all options data:", error);
    return [];
  }

  return data || [];
};

// Fetch a single option by ID
export const getOptionById = async (id: string): Promise<OptionData | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("options")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching option by ID:", error);
    return null;
  }

  return data;
};

// Create a new option
export const createOption = async (
  option: Omit<OptionData, "id" | "created_at" | "updated_at">
): Promise<{ success: boolean; error?: string; id?: string }> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("options")
    .insert([option])
    .select();

  if (error) {
    console.error("Error creating option:", error);
    return { success: false, error: error.message };
  }

  return { success: true, id: data[0].id };
};

// Update an existing option
export const updateOption = async (
  id: string,
  option: Partial<Omit<OptionData, "id" | "created_at" | "updated_at">>
): Promise<{ success: boolean; error?: string }> => {
  const supabase = await createClient();

  const { error } = await supabase.from("options").update(option).eq("id", id);

  if (error) {
    console.error("Error updating option:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
};

// Delete an option
export const deleteOption = async (
  id: string
): Promise<{ success: boolean; error?: string }> => {
  const supabase = await createClient();

  const { error } = await supabase.from("options").delete().eq("id", id);

  if (error) {
    console.error("Error deleting option:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
};

// Types for parking lot data
export type ParkingLotData = {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  phone: string;
  email: string;
  description: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

// Fetch all parking lots for dropdown selection
export const getParkingLots = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("parking_lots")
    .select("id, name");

  if (error) {
    console.error("Error fetching parking lots:", error);
    return [];
  }

  return data || [];
};

// Fetch a single parking lot by ID
export const getParkingLotById = async (
  id: string
): Promise<ParkingLotData | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("parking_lots")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching parking lot by ID:", error);
    return null;
  }

  return data;
};

// Get the first parking lot (since there's only one for now)
export const getFirstParkingLot = async (): Promise<ParkingLotData | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("parking_lots")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching first parking lot:", error);
    return null;
  }

  return data;
};

// Create a new parking lot
export const createParkingLot = async (
  parkingLot: Omit<ParkingLotData, "id" | "created_at" | "updated_at">
): Promise<{ success: boolean; error?: string; id?: string }> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("parking_lots")
    .insert([parkingLot])
    .select();

  if (error) {
    console.error("Error creating parking lot:", error);
    return { success: false, error: error.message };
  }

  return { success: true, id: data[0].id };
};

// Update an existing parking lot
export const updateParkingLot = async (
  id: string,
  parkingLot: Partial<Omit<ParkingLotData, "id" | "created_at" | "updated_at">>
): Promise<{ success: boolean; error?: string }> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("parking_lots")
    .update(parkingLot)
    .eq("id", id);

  if (error) {
    console.error("Error updating parking lot:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
};
