"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToastContext } from "@/components/providers/toast-provider";
import {
  ParkingLotData,
  UserData,
  OptionData,
  ReservationWithOptions,
  getAllOptionsData,
} from "@/app/actions";
import { format } from "date-fns";

type CreateReservationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReservationFormData) => Promise<void>;
  parkingLots: ParkingLotData[];
  users: UserData[];
};

export type ReservationFormData = ReservationWithOptions;

export default function CreateReservationModal({
  isOpen,
  onClose,
  onSubmit,
  parkingLots,
  users,
}: CreateReservationModalProps) {
  const { addToast } = useToastContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capacityError, setCapacityError] = useState<string | null>(null);
  const [options, setOptions] = useState<OptionData[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<
    { option_id: string; quantity: number }[]
  >([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  const [formData, setFormData] = useState<ReservationFormData>({
    user_id: "",
    parking_lot_id: parkingLots.length > 0 ? parkingLots[0].id : "",
    start_date: "",
    end_date: "",
    vehicle_type: "small_car", // Default to small car
    vehicle_brand: "",
    vehicle_model: "",
    vehicle_color: "",
    vehicle_plate: "",
    options: [],
  });

  // Fetch options when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setCapacityError(null);
      setFormData({
        user_id: "",
        parking_lot_id: parkingLots.length > 0 ? parkingLots[0].id : "",
        start_date: "",
        end_date: "",
        vehicle_type: "small_car",
        vehicle_brand: "",
        vehicle_model: "",
        vehicle_color: "",
        vehicle_plate: "",
        options: [],
      });
      setSelectedOptions([]);

      // Fetch available options
      const fetchOptions = async () => {
        setIsLoadingOptions(true);
        try {
          const optionsData = await getAllOptionsData();
          // Filter only active options
          setOptions(optionsData.filter((opt) => opt.is_active));
        } catch (error) {
          console.error("Error fetching options:", error);
          addToast("Erreur lors du chargement des options", "error");
        } finally {
          setIsLoadingOptions(false);
        }
      };

      fetchOptions();
    }
  }, [isOpen, parkingLots, addToast]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear capacity error when vehicle type or dates change
    if (
      name === "vehicle_type" ||
      name === "start_date" ||
      name === "end_date" ||
      name === "parking_lot_id"
    ) {
      setCapacityError(null);
    }
  };

  // Handle option selection
  const handleOptionChange = (optionId: string, checked: boolean) => {
    if (checked) {
      // Add option with quantity 1
      setSelectedOptions([
        ...selectedOptions,
        { option_id: optionId, quantity: 1 },
      ]);
    } else {
      // Remove option
      setSelectedOptions(
        selectedOptions.filter((opt) => opt.option_id !== optionId)
      );
    }
  };

  // Handle option quantity change
  const handleQuantityChange = (optionId: string, quantity: number) => {
    setSelectedOptions(
      selectedOptions.map((opt) =>
        opt.option_id === optionId ? { ...opt, quantity } : opt
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setCapacityError(null);

    // Validate dates
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const now = new Date();

    // Check if start date is in the past
    if (startDate < now) {
      setError("La date d'arrivée ne peut pas être dans le passé");
      setIsSubmitting(false);
      addToast("La date d'arrivée ne peut pas être dans le passé", "error");
      return;
    }

    // Check if end date is before start date
    if (endDate <= startDate) {
      setError("La date de départ doit être postérieure à la date d'arrivée");
      setIsSubmitting(false);
      addToast(
        "La date de départ doit être postérieure à la date d'arrivée",
        "error"
      );
      return;
    }

    try {
      // Add selected options to form data
      const dataWithOptions = {
        ...formData,
        options: selectedOptions.length > 0 ? selectedOptions : undefined,
      };

      await onSubmit(dataWithOptions);
      onClose();
      addToast("Réservation créée avec succès", "success");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";

      // Check if it's a capacity error
      if (errorMessage.includes("capacité")) {
        setCapacityError(errorMessage);
      } else {
        setError(errorMessage);
      }

      addToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Créer une réservation
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

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Client selection */}
            <div>
              <Label
                htmlFor="user_id"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Client
              </Label>
              <select
                id="user_id"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Sélectionnez un client</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Parking lot selection */}
            <div>
              <Label
                htmlFor="parking_lot_id"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Parking
              </Label>
              <select
                id="parking_lot_id"
                name="parking_lot_id"
                value={formData.parking_lot_id}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                {parkingLots.map((parkingLot) => (
                  <option key={parkingLot.id} value={parkingLot.id}>
                    {parkingLot.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="start_date"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Date d'arrivée
                </Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={handleChange}
                  min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="end_date"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Date de départ
                </Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={handleChange}
                  min={
                    formData.start_date ||
                    format(new Date(), "yyyy-MM-dd'T'HH:mm")
                  }
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Vehicle type */}
            <div>
              <Label
                htmlFor="vehicle_type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Type de véhicule
              </Label>
              <select
                id="vehicle_type"
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="small_car">Voiture petite</option>
                <option value="large_car">Voiture grande</option>
                <option value="small_motorcycle">Moto petite</option>
                <option value="large_motorcycle">Moto grande</option>
              </select>
            </div>

            {/* Vehicle details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="vehicle_brand"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Marque
                </Label>
                <Input
                  id="vehicle_brand"
                  name="vehicle_brand"
                  value={formData.vehicle_brand}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="vehicle_model"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Modèle
                </Label>
                <Input
                  id="vehicle_model"
                  name="vehicle_model"
                  value={formData.vehicle_model}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="vehicle_color"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Couleur
                </Label>
                <Input
                  id="vehicle_color"
                  name="vehicle_color"
                  value={formData.vehicle_color}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="vehicle_plate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Immatriculation
                </Label>
                <Input
                  id="vehicle_plate"
                  name="vehicle_plate"
                  value={formData.vehicle_plate}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Options */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Options supplémentaires
              </h3>

              {isLoadingOptions ? (
                <div className="flex justify-center items-center py-4">
                  <svg
                    className="animate-spin h-5 w-5 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    Chargement des options...
                  </span>
                </div>
              ) : options.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Aucune option disponible
                </p>
              ) : (
                <div className="space-y-4">
                  {options.map((option) => {
                    const isSelected = selectedOptions.some(
                      (opt) => opt.option_id === option.id
                    );
                    const selectedOption = selectedOptions.find(
                      (opt) => opt.option_id === option.id
                    );

                    return (
                      <div
                        key={option.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-md p-4"
                      >
                        <div className="flex items-start">
                          <div className="flex h-5 items-center">
                            <Checkbox
                              id={`option-${option.id}`}
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                handleOptionChange(
                                  option.id,
                                  checked as boolean
                                )
                              }
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <Label
                              htmlFor={`option-${option.id}`}
                              className="font-medium text-gray-700 dark:text-gray-300"
                            >
                              {option.name} - {option.price} €
                            </Label>
                            {option.description && (
                              <p className="text-gray-500 dark:text-gray-400 mt-1">
                                {option.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <div className="mt-3 ml-7">
                            <Label
                              htmlFor={`quantity-${option.id}`}
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                              Quantité
                            </Label>
                            <Input
                              id={`quantity-${option.id}`}
                              type="number"
                              min="1"
                              value={selectedOption?.quantity || 1}
                              onChange={(e) =>
                                handleQuantityChange(
                                  option.id,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Capacity error message */}
            {capacityError && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md">
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-400 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{capacityError}</span>
                </div>
              </div>
            )}

            {/* General error message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? "Création..." : "Créer la réservation"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
