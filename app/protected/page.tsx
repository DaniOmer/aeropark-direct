import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ReservationWithUserData } from "@/app/actions";
import UserReservationsClientPage from "./client-page";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("email", user.email)
    .single();

  // Fetch user's reservations
  const { data: reservations, error } = await supabase
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
    .eq("user_id", userData?.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user reservations:", error);
  }

  return (
    <UserReservationsClientPage
      initialReservations={(reservations as ReservationWithUserData[]) || []}
      user={user}
    />
  );
}
