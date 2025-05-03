"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToastContext } from "@/components/providers/toast-provider";
import {
  ReservationWithUserData,
  updateReservationStatus,
  deleteReservation,
  createReservation,
  getAllUsers,
  UserData,
  ParkingLotData,
  getParkingLots,
  getFirstParkingLot,
  getReservationById,
  createOrGetUserByEmail,
} from "@/app/actions";
import CreateReservationModal, {
  ReservationFormData,
} from "./create-reservation-modal";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReservationDetailsModal, {
  formatDate,
  getStatusBadgeColor,
  getStatusLabel,
} from "./reservation-details-modal";
import { generateReservationsListPDF } from "@/utils/pdf-generator";

export default function ReservationsClientPage({
  initialReservations,
  totalCount = 0,
  currentPage = 1,
  searchQuery = "",
}: {
  initialReservations: ReservationWithUserData[];
  totalCount?: number;
  currentPage?: number;
  searchQuery?: string;
}) {
  const [reservations, setReservations] = useState(initialReservations);
  const [search, setSearch] = useState(searchQuery);
  const [page, setPage] = useState(currentPage);
  const [totalReservations, setTotalReservations] = useState(totalCount);
  const pageSize = 10;
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationWithUserData | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sortField, setSortField] =
    useState<keyof ReservationWithUserData>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [parkingLots, setParkingLots] = useState<ParkingLotData[]>([]);
  const router = useRouter();
  const { addToast } = useToastContext();

  // Update reservations when initialReservations changes
  useEffect(() => {
    setReservations(initialReservations);
  }, [initialReservations]);

  // Update search value when searchQuery prop changes
  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);

  // Fetch users and parking lots for the create reservation modal
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get users
        const usersData = await getAllUsers();
        setUsers(usersData);

        // Get parking lot
        const parkingLot = await getFirstParkingLot();
        if (parkingLot) {
          setParkingLots([parkingLot]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        addToast("Erreur lors du chargement des données", "error");
      }
    };

    fetchData();
  }, [addToast]);

  // Sort reservations
  const sortedReservations = [...reservations].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle nested fields
    if (sortField === "user") {
      aValue = a.user.last_name;
      bValue = b.user.last_name;
    } else if (sortField === "parking_lot") {
      aValue = a.parking_lot.name;
      bValue = b.parking_lot.name;
    }

    // Convert to comparable values
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // Handle dates
    if (
      sortField === "start_date" ||
      sortField === "end_date" ||
      sortField === "created_at" ||
      sortField === "updated_at"
    ) {
      const aDate = new Date(aValue as string).getTime();
      const bDate = new Date(bValue as string).getTime();
      return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
    }

    // Handle numbers
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  // Filter reservations by status
  const filteredReservations = statusFilter
    ? sortedReservations.filter((r) => r.status === statusFilter)
    : sortedReservations;

  // Handle sort change
  const handleSort = (field: keyof ReservationWithUserData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle status change
  const handleStatusChange = async (id: string, status: string) => {
    try {
      const result = await updateReservationStatus(id, status);
      if (result.success) {
        // Update the reservation in the local state
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );

        // Update the selected reservation if it's open
        if (selectedReservation && selectedReservation.id === id) {
          setSelectedReservation({ ...selectedReservation, status });
        }

        addToast("Statut mis à jour avec succès", "success");
      } else {
        throw new Error(
          result.error || "Erreur lors de la mise à jour du statut"
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur est survenue";
      addToast(errorMessage, "error");
    }
  };

  // Handle reservation deletion
  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
      return;
    }

    try {
      const result = await deleteReservation(id);
      if (result.success) {
        // Remove the reservation from the local state
        setReservations((prev) => prev.filter((r) => r.id !== id));
        addToast("Réservation supprimée avec succès", "success");

        // Close the modal if the deleted reservation was selected
        if (selectedReservation && selectedReservation.id === id) {
          setIsDetailsModalOpen(false);
          setSelectedReservation(null);
        }
      } else {
        throw new Error(
          result.error || "Erreur lors de la suppression de la réservation"
        );
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur est survenue";
      addToast(errorMessage, "error");
    }
  };

  // Open reservation details modal
  const openDetailsModal = (reservation: ReservationWithUserData) => {
    setSelectedReservation(reservation);
    setIsDetailsModalOpen(true);
  };

  // Handle create reservation
  const handleCreateReservation = async (data: ReservationFormData) => {
    try {
      // Check if this is a new user
      if ("new_user" in data) {
        const newUserData = (data as any).new_user;

        // Create or get user using the server action
        const result = await createOrGetUserByEmail({
          email: newUserData.email,
          first_name: newUserData.first_name,
          last_name: newUserData.last_name,
          phone: newUserData.phone || "",
        });

        if (!result.success) {
          throw new Error(
            result.error || "Erreur lors de la création de l'utilisateur"
          );
        }

        // Notify admin if user already exists
        if (result.userExists) {
          addToast(
            `Un utilisateur avec l'email ${newUserData.email} existe déjà. La réservation sera associée à cet utilisateur.`,
            "info"
          );
        }

        // Update the data with the new user ID
        data = {
          ...data,
          user_id: result.userId!, // Using non-null assertion as we know userId exists if success is true
        };

        // Remove the new_user field
        delete (data as any).new_user;
      }

      // Create the reservation
      const result = await createReservation(data);

      if (result.success && result.id) {
        // Get the newly created reservation
        const newReservation = await getReservationById(result.id);

        if (newReservation) {
          // Add the new reservation to the local state
          setReservations([newReservation, ...reservations]);

          // Also refresh the page to ensure all data is up to date
          router.refresh();
        } else {
          // If we couldn't get the new reservation, just refresh the page
          router.refresh();
        }
      } else {
        throw new Error(
          result.error || "Erreur lors de la création de la réservation"
        );
      }
    } catch (error) {
      console.error("Error creating reservation:", error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des réservations
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gérez les réservations de vos clients
          </p>
        </div>

        {/* Search input */}
        <div className="w-full sm:w-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push(
                `/admin/reservations?search=${encodeURIComponent(search)}`
              );
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Rechercher par numéro ou email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Button
              type="submit"
              onClick={() => {
                // Force a server refresh when clicking search
                router.refresh();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Button>
          </form>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Create reservation button */}
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
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
              Créer une réservation
            </Button>

            {/* Download PDF button */}
            <Button
              onClick={() => {
                const doc = generateReservationsListPDF(filteredReservations);
                doc.save("liste-reservations.pdf");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Télécharger PDF
            </Button>
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
                statusFilter === "cancelled"
                  ? "bg-red-600 hover:bg-red-700"
                  : ""
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
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center">
                    Date
                    {sortField === "created_at" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ml-1 ${
                          sortDirection === "asc" ? "transform rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("number")}
                >
                  <div className="flex items-center">
                    Numéro
                    {sortField === "number" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ml-1 ${
                          sortDirection === "asc" ? "transform rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("user_id")}
                >
                  <div className="flex items-center">
                    Client
                    {sortField === "user_id" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ml-1 ${
                          sortDirection === "asc" ? "transform rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                  onClick={() => handleSort("start_date")}
                >
                  <div className="flex items-center">
                    Arrivée
                    {sortField === "start_date" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ml-1 ${
                          sortDirection === "asc" ? "transform rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                  onClick={() => handleSort("end_date")}
                >
                  <div className="flex items-center">
                    Départ
                    {sortField === "end_date" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ml-1 ${
                          sortDirection === "asc" ? "transform rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </div>
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
                    colSpan={6}
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {reservation.user.first_name}{" "}
                            {reservation.user.last_name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {reservation.user.email}
                          </div>
                        </div>
                      </div>
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
                          variant="destructive"
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleDelete(reservation.id)}
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
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalReservations > pageSize && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (page > 1) {
                  const newPage = page - 1;
                  setPage(newPage);
                  router.push(
                    `/admin/reservations?page=${newPage}${
                      search ? `&search=${encodeURIComponent(search)}` : ""
                    }`
                  );
                }
              }}
              disabled={page <= 1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {page} sur {Math.ceil(totalReservations / pageSize)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (page < Math.ceil(totalReservations / pageSize)) {
                  const newPage = page + 1;
                  setPage(newPage);
                  router.push(
                    `/admin/reservations?page=${newPage}${
                      search ? `&search=${encodeURIComponent(search)}` : ""
                    }`
                  );
                }
              }}
              disabled={page >= Math.ceil(totalReservations / pageSize)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
        </div>
      )}

      {/* Reservation Details Modal */}
      <ReservationDetailsModal
        reservation={selectedReservation}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onStatusChange={handleStatusChange}
      />

      {/* Create Reservation Modal */}
      <CreateReservationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateReservation}
        parkingLots={parkingLots}
        users={users}
      />
    </div>
  );
}
