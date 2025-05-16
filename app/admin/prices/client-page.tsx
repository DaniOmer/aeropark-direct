"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToastContext } from "@/components/providers/toast-provider";
import {
  getAllPricingData,
  getParkingLots,
  createPrice,
  createDurationPrices,
} from "@/app/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PriceModal from "@/components/admin/price-modal";

export default function PricesPage({
  initialPrices,
  parkingLots,
}: {
  initialPrices: Awaited<ReturnType<typeof getAllPricingData>>;
  parkingLots: Awaited<ReturnType<typeof getParkingLots>>;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prices, setPrices] = useState(initialPrices);
  const router = useRouter();
  const { addToast } = useToastContext();

  // Create a map of parking lot IDs to names for display
  const parkingLotMap = parkingLots.reduce(
    (acc, lot) => {
      acc[lot.id] = lot.name;
      return acc;
    },
    {} as Record<string, string>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des tarifs
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gérez les tarifs de stationnement pour votre parking
          </p>
        </div>
        <Button
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setIsModalOpen(true)}
          disabled={parkingLots.length === 0}
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Ajouter un tarif
        </Button>

        {parkingLots.length === 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 mt-4 w-full">
            <p className="flex items-center">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Vous devez créer au moins un parking avant de pouvoir ajouter des
              tarifs.
            </p>
          </div>
        )}

        <PriceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          parkingLots={parkingLots}
          onSubmit={async (data, durationPrices) => {
            try {
              const result = await createPrice(data);
              if (
                result.success &&
                result.id &&
                durationPrices &&
                durationPrices.length > 0
              ) {
                // Create duration prices
                const durationPricesData = durationPrices.map((dp) => ({
                  price_id: result.id!,
                  duration_days: dp.duration_days,
                  price: dp.price,
                }));

                await createDurationPrices(durationPricesData);
              }

              if (result.success) {
                // Refresh the page to get the updated data
                router.refresh();
                return { success: true, id: result.id };
              } else {
                throw new Error(
                  result.error || "Erreur lors de la création du tarif"
                );
              }
            } catch (error) {
              console.error("Error creating price:", error);
              const errorMessage =
                error instanceof Error
                  ? error.message
                  : "Une erreur est survenue";
              addToast(errorMessage, "error");
              throw error;
            }
          }}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Prix de base
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Durée (jours)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell"
                >
                  Prix jour supp.
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell"
                >
                  Frais retard
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Statut
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {prices.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Aucun tarif trouvé
                  </td>
                </tr>
              ) : (
                prices.map((price) => (
                  <tr
                    key={price.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Tarifs par durée
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      1-31 jours
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      Voir détails
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      {price.late_fee} {price.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          price.is_active
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        }`}
                      >
                        {price.is_active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/prices/${price.id}/edit`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            <span className="hidden sm:inline">Modifier</span>
                          </Button>
                        </Link>
                        <Link href={`/admin/prices/${price.id}/delete`}>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
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
                            <span className="hidden sm:inline">Supprimer</span>
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
