"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { createReservation } from "@/app/actions";
import { Button } from "@/components/ui/button";

export default function CompleteBookingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get booking data from session storage
        const storedData = sessionStorage.getItem("pendingBooking");
        if (!storedData) {
          setError("Aucune réservation en attente trouvée");
          setIsLoading(false);
          return;
        }

        const parsedData = JSON.parse(storedData);
        setBookingData(parsedData);

        // Get current user
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("Vous devez être connecté pour finaliser votre réservation");
          setIsLoading(false);
          return;
        }

        // Get user details from the database
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("email", user.email)
          .single();

        if (userError || !userData) {
          setError("Erreur lors de la récupération des données utilisateur");
          setIsLoading(false);
          return;
        }

        setUser(userData);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Une erreur est survenue lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCompleteBooking = async () => {
    if (!bookingData || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Create reservation data
      const reservationData = {
        user_id: user.id,
        parking_lot_id: bookingData.parkingLotId,
        start_date: bookingData.startDate,
        end_date: bookingData.endDate,
        vehicle_type: bookingData.vehicleType,
        vehicle_brand: bookingData.vehicleBrand,
        vehicle_model: bookingData.vehicleModel,
        vehicle_color: bookingData.vehicleColor,
        vehicle_plate: bookingData.vehiclePlate,
        options: bookingData.selectedOptions,
      };

      // Create reservation
      const result = await createReservation(reservationData);

      if (result.success) {
        // Clear session storage
        sessionStorage.removeItem("pendingBooking");

        // Redirect to payment page
        router.replace(`/booking/payment?id=${result.id}`);
      } else {
        setError(
          result.error ||
            "Une erreur est survenue lors de la création de la réservation"
        );
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error completing booking:", err);
      setError(
        "Une erreur est survenue lors de la finalisation de la réservation"
      );
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-8">
          Finalisation de votre réservation
        </h1>
        <p>Chargement en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Finalisation de votre réservation
        </h1>
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
        <div className="flex justify-center">
          <Button
            onClick={() => router.push("/")}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  if (!bookingData || !user) {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Finalisation de votre réservation
        </h1>
        <p className="text-center mb-6">
          Aucune réservation en attente trouvée
        </p>
        <div className="flex justify-center">
          <Button
            onClick={() => router.push("/")}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Finalisation de votre réservation
      </h1>

      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Récapitulatif de votre réservation
        </h2>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Dates</p>
            <p className="font-medium">
              Du {new Date(bookingData.startDate).toLocaleDateString("fr-FR")}{" "}
              au {new Date(bookingData.endDate).toLocaleDateString("fr-FR")}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Véhicule</p>
            <p className="font-medium">
              {bookingData.vehicleBrand} {bookingData.vehicleModel} (
              {bookingData.vehicleColor}) - {bookingData.vehiclePlate}
            </p>
          </div>

          {bookingData.selectedOptions &&
            bookingData.selectedOptions.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Options
                </p>
                <p className="font-medium">
                  {bookingData.selectedOptions.length} option(s) sélectionnée(s)
                </p>
              </div>
            )}

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Prix total
            </p>
            <p className="font-medium text-lg">{bookingData.totalPrice} €</p>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <p className="mb-6">
            Vous êtes connecté en tant que{" "}
            <strong>
              {user.first_name} {user.last_name}
            </strong>{" "}
            ({user.email}).
          </p>

          <div className="flex justify-center">
            <Button
              onClick={handleCompleteBooking}
              className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-6 text-lg rounded-md w-full md:w-auto"
              disabled={isLoading}
            >
              {isLoading
                ? "Traitement en cours..."
                : "Finaliser la réservation"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
