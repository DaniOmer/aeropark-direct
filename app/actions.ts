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
  console.log("signUpAction", formData);
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const firstName = formData.get("first_name")?.toString();
  const lastName = formData.get("last_name")?.toString();
  const phone = formData.get("phone")?.toString();
  const cgu = formData.get("cgu");
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password || !firstName || !lastName || !phone || !cgu) {
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
  // const { data: authData, error: authError } = await supabase.auth.signUp({
  //   email,
  //   password,
  //   options: {
  //     emailRedirectTo: `${origin}/auth/callback`,
  //     data: {
  //       first_name: firstName,
  //       last_name: lastName,
  //       phone: phone,
  //       role: "user",
  //     },
  //   },
  // });

  // if (authError) {
  //   console.error(authError.code + " " + authError.message);
  //   // Return a general error object
  //   return { error: authError.message };
  //   // return encodedRedirect("error", "/sign-up", authError.message);
  // }

  // Créer l'utilisateur dans la table users
  const { data: userData, error: userError } = await supabase
    .from("users")
    .insert({
      email,
      password: "**********", // Ne pas stocker le mot de passe en clair
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      role: "user",
      cgu: true,
      cgu_acceptance_date: new Date().toISOString(),
    });

  if (userError) {
    console.error("Database error: ", userError.message);
    // Return a general error object
    return {
      error: "Erreur lors de la création du compte: " + userError.message,
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
  const returnUrl = formData.get("returnUrl") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  // Send login notification email to admin users
  try {
    // Import email service functions
    const { sendEmail, generateLoginNotificationEmail } = await import(
      "@/utils/email-service"
    );

    // Get all admin users
    const { data: adminUsers, error: adminUsersError } = await supabase
      .from("users")
      .select("email, first_name, last_name")
      .eq("role", "admin");

    if (adminUsersError) {
      console.error("Error fetching admin users:", adminUsersError);
      // Continue even if we can't fetch admin users, as the login was successful
    } else if (adminUsers && adminUsers.length > 0) {
      // Generate login notification email content
      const htmlContent = generateLoginNotificationEmail(email);

      // Send notification to all admin users
      const adminEmailResult = await sendEmail({
        to: adminUsers.map((admin) => ({
          email: admin.email,
          name: `${admin.first_name} ${admin.last_name}`,
        })),
        subject: `Notification de connexion - ${email}`,
        htmlContent: htmlContent,
      });

      if (!adminEmailResult.success) {
        console.error(
          "Error sending login notification to admin users:",
          adminEmailResult.error
        );
        // Continue even if admin emails fail, as the login was successful
      } else {
        console.log("Login notification emails sent successfully to admins");
      }
    } else {
      console.log("No admin users found to notify about login");
    }
  } catch (emailError) {
    console.error("Error sending login notification emails:", emailError);
    // Continue even if there's an error with the email notification, as the login was successful
  }

  // Redirect to returnUrl if provided, otherwise to protected page
  if (returnUrl) {
    return redirect(returnUrl);
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
  people_threshold?: number;
  additional_people_fee?: number;
  created_at?: string;
  updated_at?: string;
  duration_prices?: DurationPriceData[];
};

// Types for duration pricing data
export type DurationPriceData = {
  id: string;
  price_id: string;
  duration_days: number;
  price: number;
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

// Fetch duration pricing data for a specific price
export const getDurationPrices = async (
  priceId: string
): Promise<DurationPriceData[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("duration_prices")
    .select("*")
    .eq("price_id", priceId)
    .order("duration_days", { ascending: true });

  if (error) {
    console.error("Error fetching duration prices:", error);
    return [];
  }

  return data || [];
};

// Fetch all duration pricing data
export const getAllDurationPrices = async (): Promise<DurationPriceData[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("duration_prices")
    .select("*")
    .order("duration_days", { ascending: true });

  if (error) {
    console.error("Error fetching all duration prices:", error);
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

// Create a new duration price
export const createDurationPrice = async (
  durationPrice: Omit<DurationPriceData, "id" | "created_at" | "updated_at">
): Promise<{ success: boolean; error?: string; id?: string }> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("duration_prices")
    .insert([durationPrice])
    .select();

  if (error) {
    console.error("Error creating duration price:", error);
    return { success: false, error: error.message };
  }

  return { success: true, id: data[0].id };
};

// Create multiple duration prices
export const createDurationPrices = async (
  durationPrices: Omit<DurationPriceData, "id" | "created_at" | "updated_at">[]
): Promise<{ success: boolean; error?: string }> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("duration_prices")
    .insert(durationPrices);

  if (error) {
    console.error("Error creating duration prices:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
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

// Update an existing duration price
export const updateDurationPrice = async (
  id: string,
  durationPrice: Partial<
    Omit<DurationPriceData, "id" | "created_at" | "updated_at">
  >
): Promise<{ success: boolean; error?: string }> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("duration_prices")
    .update(durationPrice)
    .eq("id", id);

  if (error) {
    console.error("Error updating duration price:", error);
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

// Delete a duration price
export const deleteDurationPrice = async (
  id: string
): Promise<{ success: boolean; error?: string }> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("duration_prices")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting duration price:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
};

// Delete all duration prices for a specific price
export const deleteDurationPricesForPrice = async (
  priceId: string
): Promise<{ success: boolean; error?: string }> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("duration_prices")
    .delete()
    .eq("price_id", priceId);

  if (error) {
    console.error("Error deleting duration prices for price:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
};

// Calculate price based on duration
export const calculatePriceByDuration = async (
  days: number,
  priceId: string
): Promise<{ price: number; error?: string }> => {
  const supabase = await createClient();

  // Get all duration prices for this price
  const { data, error } = await supabase
    .from("duration_prices")
    .select("*")
    .eq("price_id", priceId)
    .order("duration_days", { ascending: true });

  if (error) {
    console.error("Error fetching duration prices:", error);
    return { price: 0, error: error.message };
  }

  if (!data || data.length === 0) {
    // Fallback to the old pricing model if no duration prices are found
    const { data: priceData, error: priceError } = await supabase
      .from("prices")
      .select("*")
      .eq("id", priceId)
      .single();

    if (priceError) {
      console.error("Error fetching price data:", priceError);
      return { price: 0, error: priceError.message };
    }

    // Calculate price using the old model
    let totalPrice = priceData.base_price;
    if (days > priceData.base_duration_days) {
      const additionalDays = days - priceData.base_duration_days;
      totalPrice += additionalDays * priceData.additional_day_price;
    }

    return { price: totalPrice };
  }

  // Find the price for the exact duration
  const exactMatch = data.find((dp) => dp.duration_days === days);
  if (exactMatch) {
    return { price: exactMatch.price };
  }

  // If no exact match, find the price for the closest higher duration
  const higherDuration = data
    .filter((dp) => dp.duration_days > days)
    .sort((a, b) => a.duration_days - b.duration_days)[0];

  if (higherDuration) {
    return { price: higherDuration.price };
  }

  // If no higher duration, use the highest available duration
  const highestDuration = data.sort(
    (a, b) => b.duration_days - a.duration_days
  )[0];
  return { price: highestDuration.price };
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

// Fetch active options data for public use
export const getActiveOptionsData = async (): Promise<OptionData[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("options")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching active options data:", error);
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
  capacity_small_cars?: number | null;
  capacity_large_cars?: number | null;
  capacity_small_motorcycles?: number | null;
  capacity_large_motorcycles?: number | null;
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

// Types for reservation data
export type ReservationData = {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  parking_lot_id: string;
  vehicle_type: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_color: string;
  vehicle_plate: string;
  total_price: number;
  status: string;
  number?: string;
  flight_number?: string;
  departure_flight_number?: string;
  return_flight_number?: string;
  number_of_people?: number;
  additional_people_fee?: number;
  late_fee?: number;
  created_at?: string;
  updated_at?: string;
};

// Types for user data
export type UserData = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
};

// Types for reservation with user data
export type ReservationWithUserData = ReservationData & {
  user: UserData;
  parking_lot: {
    name: string;
  };
  reservation_options: {
    option_id: string;
    quantity: number;
    option: {
      name: string;
      price: number;
    };
  }[];
  payments: {
    id: string;
    amount: number;
    method: string;
    status: string;
  }[];
};

// Fetch all reservations for admin with search and pagination
export const getAllReservations = async (
  page: number = 1,
  pageSize: number = 10,
  searchQuery?: string
): Promise<{
  data: ReservationWithUserData[];
  count: number;
}> => {
  const supabase = await createClient();

  // Calculate range for pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // If we have a search query, first try to find matching users
  if (searchQuery && searchQuery.trim() !== "") {
    const trimmedSearch = searchQuery.trim();

    // First approach: Try to find reservations directly by number
    const { data: reservationsByNumber, error: numberError } = await supabase
      .from("reservations")
      .select(
        `
        *,
        user:user_id (id, email, first_name, last_name, phone, role),
        parking_lot:parking_lot_id (name),
        reservation_options (
          option_id,
          quantity,
          option:option_id (name, price)
        ),
        payments (id, amount, method, status)
        `,
        { count: "exact" }
      )
      .ilike("number", `%${trimmedSearch}%`)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (numberError) {
      console.error("Error searching reservations by number:", numberError);
    } else if (reservationsByNumber && reservationsByNumber.length > 0) {
      // Found reservations by number
      return {
        data: reservationsByNumber,
        count: reservationsByNumber.length,
      };
    }

    // Second approach: Find users by email, then find their reservations
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("id")
      .ilike("email", `%${trimmedSearch}%`);

    if (userError) {
      console.error("Error searching users by email:", userError);
    } else if (users && users.length > 0) {
      // Get the user IDs
      const userIds = users.map((user) => user.id);

      // Find reservations for these users
      const {
        data: reservationsByUser,
        error: reservationError,
        count,
      } = await supabase
        .from("reservations")
        .select(
          `
          *,
          user:user_id (id, email, first_name, last_name, phone, role),
          parking_lot:parking_lot_id (name),
          reservation_options (
            option_id,
            quantity,
            option:option_id (name, price)
          ),
          payments (id, amount, method, status)
          `,
          { count: "exact" }
        )
        .in("user_id", userIds)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (reservationError) {
        console.error("Error fetching reservations by user:", reservationError);
      } else {
        return {
          data: reservationsByUser || [],
          count: count || 0,
        };
      }
    }
  }

  // Default case: no search or search didn't yield results
  const { data, error, count } = await supabase
    .from("reservations")
    .select(
      `
      *,
      user:user_id (id, email, first_name, last_name, phone, role),
      parking_lot:parking_lot_id (name),
      reservation_options (
        option_id,
        quantity,
        option:option_id (name, price)
      ),
      payments (id, amount, method, status)
      `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching reservations:", error);
    return { data: [], count: 0 };
  }

  return { data: data || [], count: count || 0 };
};

// Fetch a single reservation by ID
export const getReservationById = async (
  id: string
): Promise<ReservationWithUserData | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reservations")
    .select(
      `
      *,
      user:user_id (id, email, first_name, last_name, phone, role),
      parking_lot:parking_lot_id (name),
      reservation_options (
        option_id,
        quantity,
        option:option_id (name, price)
      ),
      payments (id, amount, method, status)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching reservation by ID:", error);
    return null;
  }

  return data;
};

// Update a reservation status
export const updateReservationStatus = async (
  id: string,
  status: string
): Promise<{ success: boolean; error?: string }> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Error updating reservation status:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
};

// Record a payment for a reservation
export const recordPayment = async (
  reservationId: string,
  amount: number,
  paymentMethod: string,
  paymentStatus: string,
  paymentIntentId?: string
): Promise<{ success: boolean; error?: string }> => {
  const supabase = await createClient();

  // Insert payment record
  const { error: paymentError } = await supabase.from("payments").insert([
    {
      reservation_id: reservationId,
      amount,
      method: paymentMethod,
      status: paymentStatus,
      stripe_id: paymentIntentId,
    },
  ]);

  if (paymentError) {
    console.error("Error recording payment:", paymentError);
    return { success: false, error: paymentError.message };
  }

  // If payment is successful, update reservation status to confirmed
  if (paymentStatus === "succeeded") {
    const { error: statusError } = await supabase
      .from("reservations")
      .update({ status: "confirmed" })
      .eq("id", reservationId);

    if (statusError) {
      console.error("Error updating reservation status:", statusError);
      return { success: false, error: statusError.message };
    }

    // Trigger the webhook to send confirmation email
    try {
      // Use absolute URL for the webhook
      // In server actions, we need to use a hardcoded base URL since we can't access the request object
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const webhookUrl = `${baseUrl}/api/payment-webhook`;

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationId,
          paymentStatus,
          paymentId: paymentIntentId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error triggering payment webhook:", errorData);
        // We don't return an error here as the payment was successful
        // The email can be sent manually if needed
      } else {
        console.log("Webhook called successfully");
      }
    } catch (webhookError) {
      console.error("Error calling payment webhook:", webhookError);
      // We don't return an error here as the payment was successful
    }
  }

  return { success: true };
};

// Delete a reservation
export const deleteReservation = async (
  id: string
): Promise<{ success: boolean; error?: string }> => {
  const supabase = await createClient();

  const { error } = await supabase.from("reservations").delete().eq("id", id);

  if (error) {
    console.error("Error deleting reservation:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
};

// Create a new user or get existing user by email
export const createOrGetUserByEmail = async (userData: {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}): Promise<{
  success: boolean;
  error?: string;
  userId?: string;
  userExists?: boolean; // Added to indicate if the user already exists
}> => {
  const supabase = await createClient();

  // Check if user with this email already exists
  const { data: existingUser, error: userCheckError } = await supabase
    .from("users")
    .select("id, email")
    .eq("email", userData.email)
    .single();

  if (userCheckError && userCheckError.code !== "PGRST116") {
    // PGRST116 is the error code for "no rows returned"
    console.error("Error checking existing user:", userCheckError);
    return { success: false, error: userCheckError.message };
  }

  if (existingUser) {
    // User exists, return their ID and indicate that the user already exists
    return {
      success: true,
      userId: existingUser.id,
      userExists: true,
    };
  }

  // Create a new user in the users table (not in auth)
  const { data: newUser, error: createUserError } = await supabase
    .from("users")
    .insert({
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone: userData.phone || "",
      role: "guest", // Mark as guest user
      password: "********", // No password for guest users
    })
    .select("id")
    .single();

  if (createUserError) {
    console.error("Error creating guest user:", createUserError);
    return { success: false, error: createUserError.message };
  }

  return { success: true, userId: newUser.id };
};

// Get all users for admin
export const getAllUsers = async (): Promise<UserData[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("id, email, first_name, last_name, phone, role")
    .order("last_name", { ascending: true });

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return data || [];
};

// Check availability for a given date range and vehicle type
export const checkAvailability = async (
  startDate: string,
  endDate: string,
  vehicleType: string
): Promise<{ available: boolean; message?: string; parkingLotId?: string }> => {
  const supabase = await createClient();

  // Get the first parking lot (since there's only one for now)
  const { data: parkingLot, error: parkingLotError } = await supabase
    .from("parking_lots")
    .select("*")
    .eq("is_active", true)
    .limit(1)
    .single();

  if (parkingLotError || !parkingLot) {
    console.error("Error fetching parking lot:", parkingLotError);
    return {
      available: false,
      message: "Aucun parking disponible",
    };
  }

  // Check capacity
  const capacityCheck = await checkCapacity(
    parkingLot.id,
    vehicleType,
    startDate,
    endDate
  );

  if (!capacityCheck.available) {
    return {
      available: false,
      message: capacityCheck.message || "Pas de disponibilité pour ces dates",
    };
  }

  return {
    available: true,
    parkingLotId: parkingLot.id,
  };
};

// Check if there's enough capacity for a reservation
export const checkCapacity = async (
  parkingLotId: string,
  vehicleType: string,
  startDate: string,
  endDate: string,
  excludeReservationId?: string
): Promise<{ available: boolean; message?: string }> => {
  const supabase = await createClient();

  // Get the parking lot to check its capacity
  const { data: parkingLot, error: parkingLotError } = await supabase
    .from("parking_lots")
    .select("*")
    .eq("id", parkingLotId)
    .single();

  if (parkingLotError || !parkingLot) {
    console.error("Error fetching parking lot:", parkingLotError);
    return {
      available: false,
      message: "Parking introuvable",
    };
  }

  // Determine which capacity field to check based on vehicle type
  let capacityField: string;
  let vehicleTypeLabel: string;

  switch (vehicleType) {
    case "small_car":
      capacityField = "capacity_small_cars";
      vehicleTypeLabel = "voitures petites";
      break;
    case "large_car":
      capacityField = "capacity_large_cars";
      vehicleTypeLabel = "voitures grandes";
      break;
    case "small_motorcycle":
      capacityField = "capacity_small_motorcycles";
      vehicleTypeLabel = "motos petites";
      break;
    case "large_motorcycle":
      capacityField = "capacity_large_motorcycles";
      vehicleTypeLabel = "motos grandes";
      break;
    default:
      return {
        available: false,
        message: "Type de véhicule non valide",
      };
  }

  // Get the total capacity for this vehicle type
  const totalCapacity = parkingLot[capacityField] || 0;

  if (totalCapacity === 0) {
    return {
      available: false,
      message: `Aucune place disponible pour les ${vehicleTypeLabel} dans ce parking`,
    };
  }

  // Find overlapping reservations
  let query = supabase
    .from("reservations")
    .select("id")
    .eq("parking_lot_id", parkingLotId)
    .eq("vehicle_type", vehicleType)
    .in("status", ["confirmed", "pending"]) // Consider both confirmed and pending reservations
    .or(`start_date.lte.${endDate},end_date.gte.${startDate}`);

  // Exclude the current reservation if updating
  if (excludeReservationId) {
    query = query.neq("id", excludeReservationId);
  }

  const { data: overlappingReservations, error: reservationsError } =
    await query;

  if (reservationsError) {
    console.error(
      "Error checking overlapping reservations:",
      reservationsError
    );
    return {
      available: false,
      message: "Erreur lors de la vérification des réservations existantes",
    };
  }

  // Check if there's enough capacity
  const reservedCount = overlappingReservations?.length || 0;

  if (reservedCount >= totalCapacity) {
    return {
      available: false,
      message: `Pas de capacité disponible pour les ${vehicleTypeLabel} pendant cette période. Capacité totale: ${totalCapacity}, Réservations existantes: ${reservedCount}`,
    };
  }

  return { available: true };
};

// Type for reservation data with options
export type ReservationWithOptions = {
  user_id: string;
  parking_lot_id: string;
  start_date: string;
  end_date: string;
  vehicle_type: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_color: string;
  vehicle_plate: string;
  departure_flight_number?: string;
  return_flight_number?: string;
  number_of_people?: number;
  cgv: boolean;
  cgu: boolean;
  options?: { option_id: string; quantity: number }[];
};

// Calculate the number of days between two dates based on calendar days
const calculateDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Reset hours to midnight to count full calendar days
  const startDay = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  // Calculate the difference in days
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const diffTime = endDay.getTime() - startDay.getTime();

  // Add 1 because we count both the start and end days
  return Math.floor(diffTime / millisecondsPerDay) + 1 || 1; // Ensure at least 1 day
};

// Create a new reservation with overbooking prevention
export const createReservation = async (
  reservationData: ReservationWithOptions
): Promise<{
  success: boolean;
  error?: string;
  id?: string;
  totalPrice?: number;
}> => {
  const supabase = await createClient();

  // Check capacity first
  const capacityCheck = await checkCapacity(
    reservationData.parking_lot_id,
    reservationData.vehicle_type,
    reservationData.start_date,
    reservationData.end_date
  );

  if (!capacityCheck.available) {
    return {
      success: false,
      error:
        capacityCheck.message ||
        "Pas de capacité disponible pour cette réservation",
    };
  }

  // Calculate the number of days
  const days = calculateDays(
    reservationData.start_date,
    reservationData.end_date
  );
  console.log("days", reservationData.parking_lot_id);

  // Get the active price for this parking lot
  const { data: priceData, error: priceError } = await supabase
    .from("prices")
    .select("*")
    .eq("parking_lot_id", reservationData.parking_lot_id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (priceError || !priceData) {
    console.error("Error fetching price data:", priceError);
    return {
      success: false,
      error: "Impossible de trouver un tarif actif pour ce parking",
    };
  }

  // Calculate price based on duration
  const { price: durationPrice, error: durationPriceError } =
    await calculatePriceByDuration(days, priceData.id);

  if (durationPriceError) {
    console.error("Error calculating duration price:", durationPriceError);
    return {
      success: false,
      error: "Erreur lors du calcul du prix: " + durationPriceError,
    };
  }

  // Use the duration price as the base price
  let totalPrice = durationPrice;

  // Calculate options price if options are provided
  let optionsPrice = 0;
  const optionsToInsert = [];

  if (reservationData.options && reservationData.options.length > 0) {
    // Get all option IDs
    const optionIds = reservationData.options.map((opt) => opt.option_id);

    // Fetch option details
    const { data: optionsData, error: optionsError } = await supabase
      .from("options")
      .select("id, price")
      .in("id", optionIds)
      .eq("is_active", true);

    if (optionsError) {
      console.error("Error fetching options data:", optionsError);
      return {
        success: false,
        error: "Erreur lors de la récupération des options",
      };
    }

    // Calculate options price
    for (const option of reservationData.options) {
      const optionData = optionsData.find((o) => o.id === option.option_id);
      if (optionData) {
        optionsPrice += optionData.price * option.quantity;
        optionsToInsert.push({
          option_id: option.option_id,
          quantity: option.quantity,
        });
      }
    }
  }

  // Add options price to total
  totalPrice += optionsPrice;

  // Add additional fee for number of people if applicable
  if (
    reservationData.number_of_people &&
    reservationData.number_of_people > (priceData.people_threshold || 4)
  ) {
    totalPrice += priceData.additional_people_fee || 8.0;
  }

  // Create a copy of reservationData without the options field
  const { options, cgu, ...reservationDataWithoutOptions } = reservationData;

  // Insert the reservation without the options field
  const { data, error } = await supabase
    .from("reservations")
    .insert([
      {
        ...reservationDataWithoutOptions,
        total_price: totalPrice,
        additional_people_fee: priceData.additional_people_fee,
        status: "pending", // Set status to pending until payment is confirmed
      },
    ])
    .select();

  if (error) {
    console.error("Error creating reservation:", error);
    return { success: false, error: error.message };
  }

  const reservationId = data[0].id;

  // Insert options if any
  if (optionsToInsert.length > 0) {
    const optionsWithReservationId = optionsToInsert.map((opt) => ({
      reservation_id: reservationId,
      option_id: opt.option_id,
      quantity: opt.quantity,
    }));

    const { error: optionsInsertError } = await supabase
      .from("reservation_options")
      .insert(optionsWithReservationId);

    if (optionsInsertError) {
      console.error("Error inserting reservation options:", optionsInsertError);
      // We don't return an error here as the reservation was created successfully
      // In a production app, you might want to handle this more gracefully
    }
  }

  return { success: true, id: reservationId, totalPrice };
};
