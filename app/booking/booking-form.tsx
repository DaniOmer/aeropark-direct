"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createReservation } from "@/app/actions";
import { OptionData, ParkingLotData, PriceData, UserData } from "@/app/actions";

// Calculate the number of days between two dates
const calculateDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1; // Ensure at least 1 day
};

type BookingFormProps = {
  startDate: string;
  endDate: string;
  vehicleType: string;
  user: UserData;
  parkingLot: ParkingLotData;
  options: OptionData[];
  priceData: PriceData;
};

export default function BookingForm({
  startDate,
  endDate,
  vehicleType,
  user,
  parkingLot,
  options,
  priceData,
}: BookingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<
    { option_id: string; quantity: number }[]
  >([]);
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [departureFlightNumber, setDepartureFlightNumber] = useState("");
  const [returnFlightNumber, setReturnFlightNumber] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [cgvAccepted, setCgvAccepted] = useState(false);
  const [cguAccepted, setCguAccepted] = useState(false);

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

  // Calculate additional fee for number of people
  let peopleAdditionalFee = 0;
  if (numberOfPeople > (priceData.people_threshold || 4)) {
    peopleAdditionalFee = priceData.additional_people_fee || 8.0;
  }

  // Total price
  const totalPrice = basePrice + optionsPrice + peopleAdditionalFee;

  // State to hold the string value of quantity inputs
  const [optionQuantities, setOptionQuantities] = useState<{
    [key: string]: string;
  }>({});

  // Handle option selection
  const handleOptionChange = (optionId: string, checked: boolean) => {
    if (checked) {
      // Add option with quantity 1
      const newOption = { option_id: optionId, quantity: 1 };
      setSelectedOptions([...selectedOptions, newOption]);
      // Initialize quantity string state
      setOptionQuantities((prev) => ({ ...prev, [optionId]: "1" }));
    } else {
      // Remove option
      setSelectedOptions(
        selectedOptions.filter((opt) => opt.option_id !== optionId)
      );
      // Remove from quantity string state
      setOptionQuantities((prev) => {
        const newState = { ...prev };
        delete newState[optionId];
        return newState;
      });
    }
  };

  // Handle option quantity change
  const handleQuantityChange = (optionId: string, rawValue: string) => {
    // Update display state immediately
    setOptionQuantities((prev) => ({ ...prev, [optionId]: rawValue }));

    // Attempt to parse and update the actual quantity state
    const quantity = parseInt(rawValue);
    if (!isNaN(quantity) && quantity >= 1) {
      setSelectedOptions(
        selectedOptions.map((opt) =>
          opt.option_id === optionId ? { ...opt, quantity: quantity } : opt
        )
      );
    } else {
      // If input is empty or invalid, ensure the *background* state has quantity 1 (minimum)
      setSelectedOptions(
        selectedOptions.map((opt) =>
          opt.option_id === optionId ? { ...opt, quantity: 1 } : opt
        )
      );
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create reservation data
      const reservationData = {
        user_id: user.id,
        parking_lot_id: parkingLot.id,
        start_date: startDate,
        end_date: endDate,
        vehicle_type: vehicleType,
        vehicle_brand: vehicleBrand,
        vehicle_model: vehicleModel,
        vehicle_color: vehicleColor,
        vehicle_plate: vehiclePlate,
        departure_flight_number: departureFlightNumber,
        return_flight_number: returnFlightNumber,
        number_of_people: numberOfPeople,
        options: selectedOptions.length > 0 ? selectedOptions : undefined,
        cgv: cgvAccepted,
        cgu: user === null ? cguAccepted : true,
      };

      // Create reservation
      const result = await createReservation(reservationData);

      if (result.success) {
        // Redirect to payment page
        console.log(
          "Reservation created successfully, redirecting to payment page",
          result.id
        );

        router.replace(`/booking/payment?id=${result.id}`);

        // Prevent any further code execution
        return;
      } else {
        setError(
          result.error ||
            "Une erreur est survenue lors de la création de la réservation"
        );
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la création de la réservation");
      console.error(err);
    } finally {
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Informations du véhicule
          </h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Attention : Pour des raisons d'organisation et de sécurité,
                  seuls les véhicules de type voiture particulière sont acceptés
                  (citadines, berlines, SUV compacts). Les véhicules de type
                  utilitaire, van, camionnette, fourgon, camping-car, pickup ne
                  pourront pas être pris en charge. Merci pour votre
                  compréhension.
                </p>
              </div>
            </div>
          </div>
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
            <div>
              <Label
                htmlFor="departureFlightNumber"
                className="block text-sm font-medium mb-1"
              >
                Numéro de vol aller
              </Label>
              <Input
                id="departureFlightNumber"
                value={departureFlightNumber}
                onChange={(e) => setDepartureFlightNumber(e.target.value)}
                className="w-full"
                placeholder="Ex: AF1234"
              />
            </div>
            <div>
              <Label
                htmlFor="returnFlightNumber"
                className="block text-sm font-medium mb-1"
              >
                Numéro de vol retour
              </Label>
              <Input
                id="returnFlightNumber"
                value={returnFlightNumber}
                onChange={(e) => setReturnFlightNumber(e.target.value)}
                className="w-full"
                placeholder="Ex: AF1234"
              />
            </div>
            <div>
              <Label
                htmlFor="numberOfPeople"
                className="block text-sm font-medium mb-1"
              >
                Nombre de personnes
              </Label>
              <select
                id="numberOfPeople"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "personne" : "personnes"}
                  </option>
                ))}
              </select>
              {numberOfPeople > (priceData.people_threshold || 4) && (
                <p className="text-xs text-amber-600 mt-1">
                  Supplément de {priceData.additional_people_fee || 8}€ pour{" "}
                  {numberOfPeople} personnes
                </p>
              )}
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
                          // Use the string state for value
                          value={optionQuantities[option.id] ?? ""}
                          onChange={(e) =>
                            handleQuantityChange(
                              option.id,
                              e.target.value // Pass raw string value
                            )
                          }
                          onBlur={(e) => {
                            // Validate and clean up on blur
                            const rawValue = e.target.value;
                            const quantity = parseInt(rawValue);
                            if (
                              rawValue === "" ||
                              isNaN(quantity) ||
                              quantity < 1
                            ) {
                              // If empty or invalid, reset display to "1"
                              setOptionQuantities((prev) => ({
                                ...prev,
                                [option.id]: "1",
                              }));
                              // Ensure background state is also 1
                              setSelectedOptions(
                                selectedOptions.map((opt) =>
                                  opt.option_id === option.id
                                    ? { ...opt, quantity: 1 }
                                    : opt
                                )
                              );
                            }
                          }}
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
          {peopleAdditionalFee > 0 && (
            <div className="flex justify-between mt-2">
              <span className="text-base font-medium">
                Supplément personnes
              </span>
              <span className="text-base">{peopleAdditionalFee} €</span>
            </div>
          )}
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold">{totalPrice} €</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
        )}

        {/* CGV Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="cgv"
            checked={cgvAccepted}
            onCheckedChange={(checked) => setCgvAccepted(checked as boolean)}
            required
          />
          <Label htmlFor="cgv" className="text-sm text-gray-600">
            J'accepte les{" "}
            <a
              href="/cgv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              conditions générales de vente
            </a>
          </Label>
        </div>

        {/* CGU Checkbox for guest users */}
        {user.role === "guest" && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="cgu"
              checked={cguAccepted}
              onCheckedChange={(checked) => setCguAccepted(checked as boolean)}
              required
            />
            <Label htmlFor="cgu" className="text-sm text-gray-600">
              J'accepte les{" "}
              <a
                href="/cgu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                conditions générales d'utilisation
              </a>
            </Label>
          </div>
        )}

        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-6 text-lg rounded-md w-full md:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Création en cours..." : "Confirmer la réservation"}
          </Button>
        </div>
      </form>
    </div>
  );
}
