"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { checkAvailability } from "@/app/actions";

export default function ReservationForm() {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [vehicleType, setVehicleType] = useState("small_car");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Générer les options d'heures valides (de 3:30 à 00:30 par intervalles de 5 minutes)
  const generateTimeOptions = () => {
    const options = [];

    // Heures de 3 à 23
    for (let hour = 3; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 5) {
        // Sauter 3:00, 3:10, 3:20 car on commence à 3:30
        if (hour === 3 && minute < 30) continue;

        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        const timeValue = `${formattedHour}:${formattedMinute}`;
        const timeLabel = `${formattedHour}:${formattedMinute}`;

        options.push({ value: timeValue, label: timeLabel });
      }
    }

    // Ajouter 00:00, 00:05, 00:10, 00:15, 00:20, 00:25, 00:30
    for (let minute = 0; minute <= 30; minute += 5) {
      const timeValue = `00:${minute.toString().padStart(2, "0")}`;
      const timeLabel = `00:${minute.toString().padStart(2, "0")}`;

      options.push({ value: timeValue, label: timeLabel });
    }

    return options;
  };

  const timeOptions = generateTimeOptions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Combine date and time
      const startDateTime = `${startDate}T${startTime}:00`;
      const endDateTime = `${endDate}T${endTime}:00`;

      // Validate dates
      const startDateObj = new Date(startDateTime);
      const endDateObj = new Date(endDateTime);
      const now = new Date();

      // Check if start date is in the past
      if (startDateObj < now) {
        setError("La date d'arrivée ne peut pas être dans le passé");
        setIsSubmitting(false);
        return;
      }

      // Check if end date is before start date
      if (endDateObj <= startDateObj) {
        setError("La date de départ doit être postérieure à la date d'arrivée");
        setIsSubmitting(false);
        return;
      }

      // Check availability
      const result = await checkAvailability(
        startDateTime,
        endDateTime,
        vehicleType
      );

      if (result.available) {
        // Redirect to the booking page with query parameters
        router.push(
          `/booking?start=${encodeURIComponent(startDateTime)}&end=${encodeURIComponent(
            endDateTime
          )}&vehicle=${encodeURIComponent(vehicleType)}`
        );
      } else {
        setError(result.message || "Aucune disponibilité pour ces dates");
      }
    } catch (err) {
      setError(
        "Une erreur est survenue lors de la vérification des disponibilités"
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="reservation"
      className="w-full max-w-4xl mx-auto bg-card rounded-xl shadow-lg overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Réservez votre place de parking
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Type */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-primary"
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
                <Label htmlFor="vehicleType" className="font-medium">
                  Type de véhicule
                </Label>
              </div>
              <select
                id="vehicleType"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-3"
                required
              >
                <option value="small_car">Voiture</option>
                <option value="small_motorcycle">Moto</option>
              </select>
            </div>
            {/* Start Date and Time */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <Label htmlFor="startDate" className="font-medium">
                    Date début
                  </Label>
                </div>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-primary"
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
                  <Label htmlFor="startTime" className="font-medium">
                    Heure
                  </Label>
                </div>
                <select
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-3"
                  required
                >
                  <option value="">Sélectionnez une heure</option>
                  {timeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* End Date and Time */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <Label htmlFor="endDate" className="font-medium">
                    Date fin
                  </Label>
                </div>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split("T")[0]}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-primary"
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
                  <Label htmlFor="endTime" className="font-medium">
                    Heure
                  </Label>
                </div>
                <select
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-3"
                  required
                >
                  <option value="">Sélectionnez une heure</option>
                  {timeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
          )}

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-6 text-lg rounded-md w-full md:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Vérification..." : "Rechercher"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
