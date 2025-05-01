"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { OptionData, ParkingLotData, PriceData } from "@/app/actions";

// Calculate the number of days between two dates
const calculateDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1; // Ensure at least 1 day
};

type GuestBookingFormProps = {
  startDate: string;
  endDate: string;
  vehicleType: string;
  parkingLot: ParkingLotData;
  options: OptionData[];
  priceData: PriceData;
};

export default function GuestBookingForm({
  startDate,
  endDate,
  vehicleType,
  parkingLot,
  options,
  priceData,
}: GuestBookingFormProps) {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<
    { option_id: string; quantity: number }[]
  >([]);
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");

  // User information states
  const [step, setStep] = useState(1); // 1: Vehicle info, 2: User info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate price
  const days = calculateDays(startDate, endDate);
  let basePrice = priceData.base_price;

  // Add price for additional days if applicable
  if (days > priceData.base_duration_days) {
    const additionalDays = days - priceData.base_duration_days;
    basePrice += additionalDays * priceData.additional_day_price;
  }

  // Calculate options price
  const optionsPrice = selectedOptions.reduce((total, opt) => {
    const option = options.find((o) => o.id === opt.option_id);
    return total + (option ? option.price * opt.quantity : 0);
  }, 0);

  // Total price
  const totalPrice = basePrice + optionsPrice;

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

  // Handle vehicle form submission - proceed to user info or login
  const handleVehicleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  // Handle login option - redirect to login with booking data
  const handleLoginOption = () => {
    // Save booking data to sessionStorage
    const bookingData = {
      startDate,
      endDate,
      vehicleType,
      parkingLotId: parkingLot.id,
      vehicleBrand,
      vehicleModel,
      vehicleColor,
      vehiclePlate,
      selectedOptions,
      totalPrice,
    };

    sessionStorage.setItem("pendingBooking", JSON.stringify(bookingData));

    // Redirect to login page with return URL to complete booking
    const returnUrl = `/booking/complete-booking`;
    router.push(`/sign-in?returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  // Handle guest booking submission
  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create a temporary user and reservation
      const response = await fetch("/api/guest-reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            email,
            first_name: firstName,
            last_name: lastName,
            phone,
          },
          reservation: {
            start_date: startDate,
            end_date: endDate,
            vehicle_type: vehicleType,
            vehicle_brand: vehicleBrand,
            vehicle_model: vehicleModel,
            vehicle_color: vehicleColor,
            vehicle_plate: vehiclePlate,
            parking_lot_id: parkingLot.id,
            options: selectedOptions,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la création de la réservation"
        );
      }

      const result = await response.json();

      // Redirect to payment page
      router.push(`/booking/payment?id=${result.reservationId}`);
    } catch (err: any) {
      console.error("Error creating guest reservation:", err);
      setError(
        err.message ||
          "Une erreur est survenue lors de la création de la réservation"
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Date d'arrivée
            </p>
            <p className="font-medium">
              {new Date(startDate).toLocaleDateString("fr-FR", {
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
              {new Date(endDate).toLocaleDateString("fr-FR", {
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
              {vehicleType === "small_car" ? "Voiture" : "Moto"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Durée</p>
            <p className="font-medium">
              {days} jour{days > 1 ? "s" : ""}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Parking</p>
            <p className="font-medium">{parkingLot.name}</p>
          </div>
        </div>
      </div>

      {step === 1 ? (
        <form onSubmit={handleVehicleFormSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Informations du véhicule
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="vehicleBrand"
                  className="block text-sm font-medium mb-1"
                >
                  Marque
                </Label>
                <Input
                  id="vehicleBrand"
                  value={vehicleBrand}
                  onChange={(e) => setVehicleBrand(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="vehicleModel"
                  className="block text-sm font-medium mb-1"
                >
                  Modèle
                </Label>
                <Input
                  id="vehicleModel"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="vehicleColor"
                  className="block text-sm font-medium mb-1"
                >
                  Couleur
                </Label>
                <Input
                  id="vehicleColor"
                  value={vehicleColor}
                  onChange={(e) => setVehicleColor(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="vehiclePlate"
                  className="block text-sm font-medium mb-1"
                >
                  Immatriculation
                </Label>
                <Input
                  id="vehiclePlate"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
            </div>
          </div>

          {options.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Options supplémentaires
              </h2>
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
                              handleOptionChange(option.id, checked as boolean)
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
                            className="block text-sm font-medium mb-1"
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
                            className="w-24"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex justify-between">
              <span className="text-base font-medium">Prix de base</span>
              <span className="text-base">{basePrice} €</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-base font-medium">Options</span>
              <span className="text-base">{optionsPrice} €</span>
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold">{totalPrice} €</span>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-6 text-lg rounded-md w-full md:w-auto"
            >
              Continuer
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-xl font-semibold mb-6">
              Finaliser votre réservation
            </h2>

            <div className="flex flex-col space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">
                  Vous avez déjà un compte ?
                </h3>
                <Button
                  onClick={handleLoginOption}
                  className="bg-primary hover:bg-primary/90 text-white w-full"
                >
                  Se connecter ou créer un compte
                </Button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Connectez-vous pour accéder à votre historique de réservations
                  et bénéficier de nos offres.
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    OU
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">
                  Continuer sans compte
                </h3>
                <form onSubmit={handleGuestSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="firstName"
                        className="block text-sm font-medium mb-1"
                      >
                        Prénom
                      </Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="lastName"
                        className="block text-sm font-medium mb-1"
                      >
                        Nom
                      </Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="email"
                        className="block text-sm font-medium mb-1"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="phone"
                        className="block text-sm font-medium mb-1"
                      >
                        Téléphone
                      </Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-md">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      onClick={() => setStep(1)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                    >
                      Retour
                    </Button>
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Traitement en cours..."
                        : "Réserver maintenant"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
