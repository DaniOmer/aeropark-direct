import { getPriceById, deletePrice, getParkingLots } from "@/app/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

export default async function DeletePricePage({
  params,
}: {
  params: { id: string };
}) {
  const price = await getPriceById(params.id);
  const parkingLots = await getParkingLots();

  if (!price) {
    notFound();
  }

  // Find the parking lot name
  const parkingLot = parkingLots.find((lot) => lot.id === price.parking_lot_id);
  const parkingLotName = parkingLot ? parkingLot.name : "Inconnu";

  async function handleDeletePrice() {
    "use server";

    const result = await deletePrice(params.id);

    if (!result.success) {
      throw new Error(result.error || "Erreur lors de la suppression du tarif");
    }

    redirect("/admin/prices");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Supprimer un tarif
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Confirmez la suppression du tarif
          </p>
        </div>
        <Link href="/admin/prices">
          <Button
            variant="outline"
            className="w-full sm:w-auto border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Retour à la liste
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="space-y-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-200 dark:border-red-800">
            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-600 dark:text-red-400 mr-3 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h2 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">
                  Attention
                </h2>
                <p className="text-red-700 dark:text-red-300">
                  Vous êtes sur le point de supprimer définitivement ce tarif.
                  Cette action ne peut pas être annulée.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
              Détails du tarif
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Prix de base
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {price.base_price} {price.currency}
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Durée de base
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {price.base_duration_days} jours
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Prix par jour supplémentaire
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {price.additional_day_price} {price.currency}
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Frais de retard
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {price.late_fee} {price.currency}
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Statut
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      price.is_active
                        ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                        : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                    }`}
                  >
                    {price.is_active ? "Actif" : "Inactif"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <form action={handleDeletePrice}>
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <Link href="/admin/prices" className="w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Annuler
                </Button>
              </Link>
              <Button
                type="submit"
                variant="destructive"
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Supprimer définitivement
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
