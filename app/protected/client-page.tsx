"use client";

import { useState } from "react";
import { ReservationWithUserData } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { generateReservationPDF } from "@/utils/pdf-generator";

// Helper function to format dates
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
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
function ReservationDetailsModal({
  reservation,
  isOpen,
  onClose,
}: {
  reservation: ReservationWithUserData;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !reservation) return null;

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
        <div className="p-6">
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

          <div className="mt-6 space-y-6">
            {/* Status and Actions */}
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
              <div className="mt-2">
                <Badge className={getStatusBadgeColor(reservation.status)}>
                  {getStatusLabel(reservation.status)}
                </Badge>
              </div>
            </div>

            {/* Reservation Details */}
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
              </div>
            </div>

            {/* Vehicle Information */}
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

            {/* Summary */}
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

export default function UserReservationsClientPage({
  initialReservations,
  user,
}: {
  initialReservations: ReservationWithUserData[];
  user: User;
}) {
  const [reservations] = useState(initialReservations);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationWithUserData | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Filter reservations by status
  const filteredReservations = statusFilter
    ? reservations.filter((r) => r.status === statusFilter)
    : reservations;

  // Open reservation details modal
  const openDetailsModal = (reservation: ReservationWithUserData) => {
    setSelectedReservation(reservation);
    setIsDetailsModalOpen(true);
  };

  // Handle PDF download
  const handleDownloadPDF = async (reservation: ReservationWithUserData) => {
    const doc = await generateReservationPDF(reservation);
    const reservationNumber =
      reservation.number || reservation.id.substring(0, 8);
    doc.save(`reservation-${reservationNumber}.pdf`);
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mes réservations
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Consultez l'historique de vos réservations
          </p>
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(null)}
          >
            Toutes
          </Button>
          <Button
            variant={statusFilter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("pending")}
            className={
              statusFilter === "pending"
                ? "bg-yellow-600 hover:bg-yellow-700"
                : ""
            }
          >
            En attente
          </Button>
          <Button
            variant={statusFilter === "confirmed" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("confirmed")}
            className={
              statusFilter === "confirmed"
                ? "bg-green-600 hover:bg-green-700"
                : ""
            }
          >
            Confirmées
          </Button>
          <Button
            variant={statusFilter === "cancelled" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("cancelled")}
            className={
              statusFilter === "cancelled" ? "bg-red-600 hover:bg-red-700" : ""
            }
          >
            Annulées
          </Button>
          <Button
            variant={statusFilter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("completed")}
            className={
              statusFilter === "completed"
                ? "bg-blue-600 hover:bg-blue-700"
                : ""
            }
          >
            Terminées
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Numéro
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Parking
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell"
                >
                  Arrivée
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell"
                >
                  Départ
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
              {filteredReservations.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Aucune réservation trouvée
                  </td>
                </tr>
              ) : (
                filteredReservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(reservation.created_at || "")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {reservation.number || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {reservation.parking_lot.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      {formatDate(reservation.start_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      {formatDate(reservation.end_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        className={getStatusBadgeColor(reservation.status)}
                      >
                        {getStatusLabel(reservation.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900"
                          onClick={() => openDetailsModal(reservation)}
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          <span className="hidden sm:inline">Détails</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-600 hover:bg-green-50 dark:text-green-400 dark:border-green-400 dark:hover:bg-green-900"
                          onClick={() => handleDownloadPDF(reservation)}
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
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="hidden sm:inline">PDF</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reservation Details Modal */}
      {isDetailsModalOpen && selectedReservation && (
        <ReservationDetailsModal
          reservation={selectedReservation}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </div>
  );
}
