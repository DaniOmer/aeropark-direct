import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import BookingForm from "./booking-form";

// This is a workaround for the TypeScript error related to PageProps
async function BookingPageContent(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  // Get query parameters
  const start = searchParams.start as string;
  const end = searchParams.end as string;
  const vehicle = searchParams.vehicle as string;

  // Check if all required parameters are present
  if (!start || !end || !vehicle) {
    redirect("/");
  }

  // Check if user is logged in
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not logged in, redirect to sign in page with return URL
  if (!user) {
    const returnUrl = `/booking?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&vehicle=${encodeURIComponent(vehicle)}`;
    redirect(`/sign-in?returnUrl=${encodeURIComponent(returnUrl)}`);
  }

  // Get user details from the database
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("email", user.email)
    .single();

  if (userError || !userData) {
    console.error("Error fetching user data:", userError);
    redirect("/sign-in");
  }

  // Get parking lot
  const { data: parkingLot, error: parkingLotError } = await supabase
    .from("parking_lots")
    .select("*")
    .eq("is_active", true)
    .limit(1)
    .single();

  if (parkingLotError || !parkingLot) {
    console.error("Error fetching parking lot:", parkingLotError);
    redirect("/");
  }

  // Get active options
  const { data: options, error: optionsError } = await supabase
    .from("options")
    .select("*")
    .eq("is_active", true);

  if (optionsError) {
    console.error("Error fetching options:", optionsError);
  }

  // Get active price for this parking lot
  const { data: priceData, error: priceError } = await supabase
    .from("prices")
    .select("*")
    .eq("parking_lot_id", parkingLot.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (priceError || !priceData) {
    console.error("Error fetching price data:", priceError);
    redirect("/");
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Finaliser votre réservation
      </h1>

      <BookingForm
        startDate={start}
        endDate={end}
        vehicleType={vehicle}
        user={userData}
        parkingLot={parkingLot}
        options={options || []}
        priceData={priceData}
      />
    </div>
  );
}

// Export the page component with the workaround
export default async function BookingPage({ searchParams }: any) {
  return BookingPageContent(searchParams);
}
