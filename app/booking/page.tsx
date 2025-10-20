import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import BookingForm from "./booking-form";
import GuestBookingForm from "./guest-booking-form";

// This is a workaround for the TypeScript error related to PageProps
async function BookingPageContent(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  // Get query parameters
  const { start, end, vehicle } = await searchParams;

  // Check if all required parameters are present
  if (!start || !end || !vehicle) {
    redirect("/");
  }

  // Check if user is logged in
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user details from the database if user is logged in
  let userData = null;
  if (user) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", user.email)
      .single();

    if (error || !data) {
      console.error("Error fetching user data:", error);
    } else {
      userData = data;
    }
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

  // Get duration prices for this price
  const { data: durationPrices, error: durationPricesError } = await supabase
    .from("duration_prices")
    .select("*")
    .eq("price_id", priceData.id)
    .order("duration_days", { ascending: true });

  if (durationPricesError) {
    console.error("Error fetching duration prices:", durationPricesError);
  } else {
    // Add duration prices to the price data
    priceData.duration_prices = durationPrices || [];
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Finaliser votre réservation
      </h1>

      {/* {userData ? (
        // User is logged in, show regular booking form
        <BookingForm
          startDate={start as string}
          endDate={end as string}
          vehicleType={vehicle as string}
          user={userData}
          parkingLot={parkingLot}
          options={options || []}
          priceData={priceData}
        />
      ) : (
        // User is not logged in, show guest booking form
        <GuestBookingForm
          startDate={start as string}
          endDate={end as string}
          vehicleType={vehicle as string}
          parkingLot={parkingLot}
          options={options || []}
          priceData={priceData}
        />
      )} */}

      <GuestBookingForm
        startDate={start as string}
        endDate={end as string}
        vehicleType={vehicle as string}
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
