"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReservationWithUserData } from "@/app/actions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { generateReservationPDF } from "@/utils/pdf-generator";

// Helper function to format dates
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "dd MMMM yyyy à HH:mm", { locale: fr });
};

// Helper function to get status badge color
export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
    case "confirmed":
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
    case "completed":
      return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  }
};

// Helper function to get status label in French
export const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "En attente";
    case "confirmed":
      return "Confirmée";
    case "cancelled":
      return "Annulée";
    case "completed":
      return "Terminée";
    default:
      return status;
  }
};

// Component for reservation details modal
export default function ReservationDetailsModal({
  reservation,
  isOpen,
  onClose,
  onStatusChange,
}: {
  reservation: ReservationWithUserData | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => Promise<void>;
}) {
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  if (!isOpen || !reservation) return null;

  const handleStatusChange = async (status: string) => {
    setIsChangingStatus(true);
    try {
      await onStatusChange(reservation.id, status);
    } finally {
      setIsChangingStatus(false);
    }
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    const doc = await generateReservationPDF(reservation);
    const reservationNumber =
      reservation.number || reservation.id.substring(0, 8);
    doc.save(`reservation-${reservationNumber}.pdf`);
  };

  // Calculate total options price
  const optionsTotal = reservation.reservation_options.reduce(
    (total, opt) => total + opt.option.price * opt.quantity,
    0
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Détails de la réservation
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Statut
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900"
                  onClick={handleDownloadPDF}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Télécharger PDF
                </Button>
              </div>
              <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Badge className={getStatusBadgeColor(reservation.status)}>
                  {getStatusLabel(reservation.status)}
                </Badge>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50 dark:text-green-400 dark:border-green-400 dark:hover:bg-green-900"
                    disabled={
                      isChangingStatus || reservation.status === "confirmed"
                    }
                    onClick={() => handleStatusChange("confirmed")}
                  >
                    Confirmer
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900"
                    disabled={
                      isChangingStatus || reservation.status === "cancelled"
                    }
                    onClick={() => handleStatusChange("cancelled")}
                  >
                    Annuler
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900"
                    disabled={
                      isChangingStatus || reservation.status === "completed"
                    }
                    onClick={() => handleStatusChange("completed")}
                  >
                    Terminer
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Informations client
              </h3>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Nom
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {reservation.user.first_name} {reservation.user.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {reservation.user.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Téléphone
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {reservation.user.phone}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Détails de la réservation
              </h3>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Numéro de réservation
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white font-medium">
                    {reservation.number || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Parking
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {reservation.parking_lot.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Date d'arrivée
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {formatDate(reservation.start_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Date de départ
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {formatDate(reservation.end_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Date de création
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {formatDate(reservation.created_at || "")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Nombre de personnes
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {reservation.number_of_people || 1}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Informations du véhicule
              </h3>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Type
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {reservation.vehicle_type}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Marque
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {reservation.vehicle_brand}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Modèle
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {reservation.vehicle_model}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Couleur
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {reservation.vehicle_color}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Immatriculation
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {reservation.vehicle_plate}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Options
              </h3>
              {reservation.reservation_options.length > 0 ? (
                <div className="mt-2 overflow-x-auto">
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
              ) : (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Aucune option sélectionnée
                </p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Paiement
              </h3>
              {reservation.payments.length > 0 ? (
                <div className="mt-2 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Méthode
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Montant
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {reservation.payments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {payment.method}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {payment.amount} €
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                payment.status === "succeeded"
                                  ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                  : payment.status === "failed"
                                    ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                              }`}
                            >
                              {payment.status === "succeeded"
                                ? "Réussi"
                                : payment.status === "failed"
                                  ? "Échoué"
                                  : "En attente"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Aucun paiement enregistré
                </p>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex justify-between">
                <span className="text-base font-medium text-gray-900 dark:text-white">
                  Prix de base
                </span>
                <span className="text-base text-gray-900 dark:text-white">
                  {reservation.total_price - optionsTotal} €
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-base font-medium text-gray-900 dark:text-white">
                  Options
                </span>
                <span className="text-base text-gray-900 dark:text-white">
                  {optionsTotal} €
                </span>
              </div>
              {reservation.number_of_people &&
                reservation.number_of_people > 4 && (
                  <div className="flex justify-between mt-2">
                    <span className="text-base font-medium text-gray-900 dark:text-white">
                      Supplément personnes
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      8 €
                    </span>
                  </div>
                )}
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  Total
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {reservation.total_price} €
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
