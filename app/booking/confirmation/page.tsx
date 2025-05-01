import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getReservationById } from "@/app/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// This is a workaround for the TypeScript error related to PageProps
async function ConfirmationPageContent(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  // Get reservation ID from query parameters
  const { id } = await searchParams;

  if (!id) {
    redirect("/");
  }

  // Check if user is logged in
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("email", user?.email)
    .single();

  if (!user) {
    redirect("/sign-in");
  }

  // Get reservation details
  const reservation = await getReservationById(id as string);

  if (!reservation) {
    console.error("Reservation not found");
    // redirect("/");
    return <div>Reservation not found</div>;
  }

  // Check if the reservation belongs to the logged-in user
  if (reservation.user_id !== userData?.id) {
    console.error("Reservation does not belong to the logged-in user");
    // redirect("/");
    return <div>Reservation does not belong to the logged-in user</div>;
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
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          {reservation.status === "confirmed" ? (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-2">
                Réservation confirmée !
              </h1>
            </>
          ) : reservation.status === "pending" ? (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-2">
                Réservation en attente
              </h1>
              <p className="text-yellow-600 dark:text-yellow-400 mb-2">
                Votre paiement est en cours de traitement. La réservation sera
                confirmée dès que le paiement sera validé.
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-2">
                Réservation {reservation.status}
              </h1>
            </>
          )}
          <p className="text-gray-600 dark:text-gray-400">
            Merci pour votre réservation. Votre numéro de réservation est{" "}
            <span className="font-bold">
              {reservation.number || reservation.id.substring(0, 8)}
            </span>
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Détails de la réservation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Date d'arrivée
              </p>
              <p className="font-medium">
                {new Date(reservation.start_date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
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
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Type de véhicule
              </p>
              <p className="font-medium">
                {reservation.vehicle_type === "small_car"
                  ? "Voiture"
                  : reservation.vehicle_type === "small_motorcycle"
                    ? "Moto"
                    : reservation.vehicle_type}
              </p>
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Statut</p>
              <p className="font-medium">
                {reservation.status === "confirmed"
                  ? "Confirmée"
                  : reservation.status === "pending"
                    ? "En attente"
                    : reservation.status === "cancelled"
                      ? "Annulée"
                      : reservation.status === "completed"
                        ? "Terminée"
                        : reservation.status}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Informations du véhicule
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Marque</p>
              <p className="font-medium">{reservation.vehicle_brand}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Modèle</p>
              <p className="font-medium">{reservation.vehicle_model}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Couleur
              </p>
              <p className="font-medium">{reservation.vehicle_color}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Immatriculation
              </p>
              <p className="font-medium">{reservation.vehicle_plate}</p>
            </div>
          </div>
        </div>

        {reservation.reservation_options.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Options</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Option
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Quantité
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Prix unitaire
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {reservation.reservation_options.map((option) => (
                    <tr key={option.option_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {option.option.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {option.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {option.option.price} €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {option.option.price * option.quantity} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex justify-between">
            <span className="text-base font-medium">Prix de base</span>
            <span className="text-base">
              {reservation.total_price - optionsTotal} €
            </span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-base font-medium">Options</span>
            <span className="text-base">{optionsTotal} €</span>
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold">
              {reservation.total_price} €
            </span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Un email de confirmation a été envoyé à votre adresse email.
          </p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-md">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Export the page component with the workaround
export default async function ConfirmationPage({ searchParams }: any) {
  return ConfirmationPageContent(searchParams);
}
