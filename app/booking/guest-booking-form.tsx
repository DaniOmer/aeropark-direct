"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OptionData, ParkingLotData, PriceData } from "@/app/actions";

// Calculate the number of days between two dates based on calendar days
const calculateDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Reset hours to midnight to count full calendar days
  const startDay = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  // Calculate the difference in days
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const diffTime = endDay.getTime() - startDay.getTime();

  // Add 1 because we count both the start and end days
  return Math.floor(diffTime / millisecondsPerDay) + 1 || 1; // Ensure at least 1 day
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
  const [departureFlightNumber, setDepartureFlightNumber] = useState("");
  const [returnFlightNumber, setReturnFlightNumber] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  // User information states
  const [step, setStep] = useState(1); // 1: Vehicle info, 2: User info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cgvAccepted, setCgvAccepted] = useState(false);
  const [cguAccepted, setCguAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // State to hold the string value of quantity inputs
  const [optionQuantities, setOptionQuantities] = useState<{
    [key: string]: string;
  }>({});

  // Calculate price
  const days = calculateDays(startDate, endDate);

  // Get price based on duration from the priceData.duration_prices array if available
  let basePrice = 0;
  if (priceData.duration_prices && priceData.duration_prices.length > 0) {
    // Find the exact match for the number of days
    const exactMatch = priceData.duration_prices.find(
      (dp) => dp.duration_days === days
    );
    if (exactMatch) {
      basePrice = exactMatch.price;
    } else {
      // If no exact match, find the price for the closest higher duration
      const higherDuration = priceData.duration_prices
        .filter((dp) => dp.duration_days > days)
        .sort((a, b) => a.duration_days - b.duration_days)[0];

      if (higherDuration) {
        basePrice = higherDuration.price;
      } else {
        // If no higher duration, use the highest available duration
        const highestDuration = priceData.duration_prices.sort(
          (a, b) => b.duration_days - a.duration_days
        )[0];
        basePrice = highestDuration.price;
      }
    }
  } else {
    // Fallback to old pricing model if duration_prices is not available
    basePrice = priceData.base_price;
    if (days > priceData.base_duration_days) {
      const additionalDays = days - priceData.base_duration_days;
      basePrice += additionalDays * priceData.additional_day_price;
    }
  }

  // Calculate options price
  const optionsPrice = selectedOptions.reduce((total, opt) => {
    const option = options.find((o) => o.id === opt.option_id);
    return total + (option ? option.price * opt.quantity : 0);
  }, 0);

  // Calculate additional fee for number of people
  let peopleAdditionalFee = 0;
  if (numberOfPeople > (priceData.people_threshold || 4)) {
    peopleAdditionalFee =
      (priceData.additional_people_fee || 8.0) *
      (numberOfPeople - (priceData.people_threshold || 4));
  }

  // Total price
  const totalPrice = basePrice + optionsPrice + peopleAdditionalFee;

  // Handle option selection
  const handleOptionChange = (optionId: string, checked: boolean) => {
    if (checked) {
      const newOption = { option_id: optionId, quantity: 1 };
      setSelectedOptions([...selectedOptions, newOption]);
      setOptionQuantities((prev) => ({ ...prev, [optionId]: "1" }));
    } else {
      setSelectedOptions(
        selectedOptions.filter((opt) => opt.option_id !== optionId)
      );
      setOptionQuantities((prev) => {
        const newState = { ...prev };
        delete newState[optionId];
        return newState;
      });
    }
  };

  // Handle option quantity change
  const handleQuantityChange = (optionId: string, rawValue: string) => {
    setOptionQuantities((prev) => ({ ...prev, [optionId]: rawValue }));
    const quantity = parseInt(rawValue);
    if (!isNaN(quantity) && quantity >= 1) {
      setSelectedOptions(
        selectedOptions.map((opt) =>
          opt.option_id === optionId ? { ...opt, quantity: quantity } : opt
        )
      );
    } else {
      setSelectedOptions(
        selectedOptions.map((opt) =>
          opt.option_id === optionId ? { ...opt, quantity: 1 } : opt
        )
      );
    }
  };

  // Handle vehicle form submission - proceed to user info or login
  const handleVehicleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  // Handle login option - redirect to login with booking data
  const handleLoginOption = () => {
    const bookingData = {
      startDate,
      endDate,
      vehicleType,
      parkingLotId: parkingLot.id,
      vehicleBrand,
      vehicleModel,
      vehicleColor,
      vehiclePlate,
      departureFlightNumber,
      returnFlightNumber,
      selectedOptions,
      totalPrice,
    };
    sessionStorage.setItem("pendingBooking", JSON.stringify(bookingData));
    const returnUrl = `/booking/complete-booking`;
    router.push(`/sign-in?returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  // Handle guest booking submission
  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
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
            departure_flight_number: departureFlightNumber,
            return_flight_number: returnFlightNumber,
            number_of_people: numberOfPeople,
            parking_lot_id: parkingLot.id,
            options: selectedOptions,
            cgv: cgvAccepted,
            cgu: cguAccepted,
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

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-colors";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Steps indicator */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${step >= 1 ? "bg-gradient-to-br from-cyan-500 to-teal-500 text-white" : "bg-secondary text-muted-foreground"}`}>
            1
          </div>
          <span className={`text-sm font-medium ${step >= 1 ? "text-foreground" : "text-muted-foreground"}`}>Véhicule</span>
        </div>
        <div className="w-12 h-px bg-border" />
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${step >= 2 ? "bg-gradient-to-br from-cyan-500 to-teal-500 text-white" : "bg-secondary text-muted-foreground"}`}>
            2
          </div>
          <span className={`text-sm font-medium ${step >= 2 ? "text-foreground" : "text-muted-foreground"}`}>Coordonnées</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form area */}
        <div className="lg:col-span-2">
          {step === 1 ? (
            <form onSubmit={handleVehicleFormSubmit} className="space-y-6">
              {/* Vehicle info */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-1">
                  Étape 1
                </p>
                <h2 className="text-xl font-bold mb-4">
                  Informations du véhicule
                </h2>

                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 mb-6">
                  <div className="flex gap-3">
                    <svg
                      className="h-5 w-5 text-amber-500 shrink-0 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      Attention : Pour des raisons d&apos;organisation et de sécurité,
                      seuls les véhicules de type voiture particulière
                      (citadines, berlines, SUV compacts) et les van sont acceptés. Les véhicules de type
                      utilitaire, camionnette, fourgon et camping-car ne
                      pourront pas être pris en charge. Merci pour votre
                      compréhension.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vehicleBrand" className="text-sm font-medium mb-1.5 block">
                      Marque
                    </Label>
                    <Input
                      id="vehicleBrand"
                      value={vehicleBrand}
                      onChange={(e) => setVehicleBrand(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicleModel" className="text-sm font-medium mb-1.5 block">
                      Modèle
                    </Label>
                    <Input
                      id="vehicleModel"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicleColor" className="text-sm font-medium mb-1.5 block">
                      Couleur
                    </Label>
                    <Input
                      id="vehicleColor"
                      value={vehicleColor}
                      onChange={(e) => setVehicleColor(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehiclePlate" className="text-sm font-medium mb-1.5 block">
                      Immatriculation
                    </Label>
                    <Input
                      id="vehiclePlate"
                      value={vehiclePlate}
                      onChange={(e) => setVehiclePlate(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="departureFlightNumber" className="text-sm font-medium mb-1.5 block">
                      Numéro de vol aller
                    </Label>
                    <Input
                      id="departureFlightNumber"
                      value={departureFlightNumber}
                      onChange={(e) => setDepartureFlightNumber(e.target.value)}
                      className={inputClass}
                      placeholder="Ex: AF1234"
                    />
                  </div>
                  <div>
                    <Label htmlFor="returnFlightNumber" className="text-sm font-medium mb-1.5 block">
                      Numéro de vol retour
                    </Label>
                    <Input
                      id="returnFlightNumber"
                      value={returnFlightNumber}
                      onChange={(e) => setReturnFlightNumber(e.target.value)}
                      className={inputClass}
                      placeholder="Ex: AF1234"
                    />
                  </div>
                  <div>
                    <Label htmlFor="numberOfPeople" className="text-sm font-medium mb-1.5 block">
                      Nombre de personnes
                    </Label>
                    <Select
                      value={numberOfPeople.toString()}
                      onValueChange={(val) => setNumberOfPeople(parseInt(val))}
                    >
                      <SelectTrigger className="rounded-lg focus:ring-2 focus:ring-cyan-500/40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "personne" : "personnes"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {numberOfPeople > (priceData.people_threshold || 4) && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5">
                        Supplément de{" "}
                        {(priceData.additional_people_fee || 8) *
                          (numberOfPeople - (priceData.people_threshold || 4))}
                        € pour {numberOfPeople} personnes
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Options */}
              {options.length > 0 && (
                <div className="bg-card rounded-2xl border border-border p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-1">
                    Optionnel
                  </p>
                  <h2 className="text-xl font-bold mb-4">
                    Options supplémentaires
                  </h2>
                  <div className="space-y-3">
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
                          className={`border rounded-xl p-4 transition-colors ${isSelected ? "border-primary/30 bg-primary/5" : "border-border"}`}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox
                              id={`option-${option.id}`}
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                handleOptionChange(option.id, checked as boolean)
                              }
                              className="mt-0.5"
                            />
                            <div className="flex-1">
                              <Label
                                htmlFor={`option-${option.id}`}
                                className="font-medium text-foreground cursor-pointer"
                              >
                                {option.name} — {option.price} €
                              </Label>
                              {option.description && (
                                <p className="text-sm text-muted-foreground mt-0.5">
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
                                value={optionQuantities[option.id] ?? ""}
                                onChange={(e) =>
                                  handleQuantityChange(option.id, e.target.value)
                                }
                                onBlur={(e) => {
                                  const rawValue = e.target.value;
                                  const quantity = parseInt(rawValue);
                                  if (
                                    rawValue === "" ||
                                    isNaN(quantity) ||
                                    quantity < 1
                                  ) {
                                    setOptionQuantities((prev) => ({
                                      ...prev,
                                      [option.id]: "1",
                                    }));
                                    setSelectedOptions(
                                      selectedOptions.map((opt) =>
                                        opt.option_id === option.id
                                          ? { ...opt, quantity: 1 }
                                          : opt
                                      )
                                    );
                                  }
                                }}
                                className="w-24 rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold py-3 rounded-xl shadow-[0_4px_14px_rgba(14,165,233,0.35)] transition-all"
              >
                Continuer
              </button>
            </form>
          ) : (
            <div className="bg-card rounded-2xl border border-border p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-1">
                Étape 2
              </p>
              <h2 className="text-xl font-bold mb-4">
                Informations personnelles
              </h2>

              <form onSubmit={handleGuestSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium mb-1.5 block">
                      Prénom
                    </Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium mb-1.5 block">
                      Nom
                    </Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium mb-1.5 block">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium mb-1.5 block">
                      Téléphone
                    </Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="cgv"
                      checked={cgvAccepted}
                      onCheckedChange={(checked) =>
                        setCgvAccepted(checked as boolean)
                      }
                      className="mt-0.5"
                    />
                    <Label htmlFor="cgv" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                      J&apos;accepte les{" "}
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
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="cgu"
                      checked={cguAccepted}
                      onCheckedChange={(checked) =>
                        setCguAccepted(checked as boolean)
                      }
                      className="mt-0.5"
                    />
                    <Label htmlFor="cgu" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                      J&apos;accepte les{" "}
                      <a
                        href="/cgu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        conditions générales d&apos;utilisation
                      </a>
                    </Label>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 p-4 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 rounded-xl border border-border text-foreground font-medium hover:bg-secondary transition-colors"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !cgvAccepted || !cguAccepted}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold py-3 rounded-xl shadow-[0_4px_14px_rgba(14,165,233,0.35)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting
                      ? "Traitement en cours..."
                      : "Réserver maintenant"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar - Price summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border p-6 sticky top-20">
            <h3 className="text-lg font-bold mb-4">Récapitulatif</h3>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Date d&apos;arrivée</p>
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
                <p className="text-muted-foreground">Date de départ</p>
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
              <div className="flex justify-between">
                <span className="text-muted-foreground">Véhicule</span>
                <span className="font-medium">
                  {vehicleType === "small_car" ? "Voiture" : "Moto"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Durée</span>
                <span className="font-medium">
                  {days} jour{days > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Parking</span>
                <span className="font-medium">{parkingLot.name}</span>
              </div>
            </div>

            <div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prix de base</span>
                <span>{basePrice.toFixed(2)} €</span>
              </div>
              {selectedOptions.map((opt) => {
                const option = options.find((o) => o.id === opt.option_id);
                if (!option) return null;
                return (
                  <div key={opt.option_id} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {option.name} {opt.quantity > 1 ? `×${opt.quantity}` : ""}
                    </span>
                    <span>{(option.price * opt.quantity).toFixed(2)} €</span>
                  </div>
                );
              })}
              {peopleAdditionalFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Suppl. personnes</span>
                  <span>{peopleAdditionalFee.toFixed(2)} €</span>
                </div>
              )}
            </div>

            <div className="border-t border-border mt-4 pt-4">
              <div className="flex justify-between items-baseline">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-extrabold text-primary">
                  {totalPrice.toFixed(2)} €
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
