import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getReservationById } from "@/app/actions";
import PaymentForm from "./payment-form";

// This is a workaround for the TypeScript error related to PageProps
async function PaymentPageContent(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  // Get reservation ID from query parameters
  const { id } = await searchParams;

  if (!id) {
    console.log("No reservation ID provided");
    return <div>No reservation ID provided</div>;
  }

  // Get reservation details
  const reservation = await getReservationById(id as string);

  if (!reservation) {
    console.log("No reservation found");
    return <div>No reservation found</div>;
  }

  // Get the user associated with the reservation
  const supabase = await createClient();
  const { data: reservationUser } = await supabase
    .from("users")
    .select("*")
    .eq("id", reservation.user_id)
    .single();

  if (!reservationUser) {
    console.log("No user found for this reservation");
    return <div>No user found for this reservation</div>;
  }

  // If the user is not a guest, check if they are logged in
  if (reservationUser.role !== "guest") {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("email", user?.email)
      .single();

    // If not logged in or not the reservation owner, redirect to login
    if (!user || reservation.user_id !== userData?.id) {
      console.log("User not authorized to view this reservation");
      return <div>Vous n'êtes pas autorisé à accéder à cette réservation</div>;
    }
  }

  // Calculate the number of days
  const start = new Date(reservation.start_date);
  const end = new Date(reservation.end_date);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  // Calculate options total
  const optionsTotal = reservation.reservation_options.reduce(
    (total, opt) => total + opt.option.price * opt.quantity,
    0
  );

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Paiement de votre réservation
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Reservation Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Récapitulatif de la réservation
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Numéro de réservation
              </p>
              <p className="font-medium">
                {reservation.number || reservation.id.substring(0, 8)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Date d'arrivée
                </p>
                <p className="font-medium">
                  {new Date(reservation.start_date).toLocaleDateString(
                    "fr-FR",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Date de départ
                </p>
                <p className="font-medium">
                  {new Date(reservation.end_date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Durée</p>
              <p className="font-medium">
                {days} jour{days > 1 ? "s" : ""}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Parking
              </p>
              <p className="font-medium">{reservation.parking_lot.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Véhicule
              </p>
              <p className="font-medium">
                {reservation.vehicle_brand} {reservation.vehicle_model} (
                {reservation.vehicle_color}) - {reservation.vehicle_plate}
              </p>
            </div>

            {reservation.reservation_options.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Options
                </p>
                <ul className="space-y-1">
                  {reservation.reservation_options.map((option) => (
                    <li key={option.option_id} className="flex justify-between">
                      <span>
                        {option.option.name} x{option.quantity}
                      </span>
                      <span>{option.option.price * option.quantity} €</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <div className="flex justify-between">
                <span className="font-medium">Prix de base</span>
                <span>{reservation.total_price - optionsTotal} €</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-medium">Options</span>
                <span>{optionsTotal} €</span>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">
                  {reservation.total_price} €
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Paiement sécurisé</h2>

          <PaymentForm
            reservationId={reservation.id}
            amount={reservation.total_price}
          />
        </div>
      </div>
    </div>
  );
}

// Export the page component with the workaround
export default async function PaymentPage({ searchParams }: any) {
  return PaymentPageContent(searchParams);
}
