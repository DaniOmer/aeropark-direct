"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import type { UIPricingPlan } from "@/app/tarifs/types";
import type { OptionData } from "@/app/actions";

// Function to calculate the number of days between two dates
const calculateDays = (startDate: string, endDate: string): number => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate the time difference in milliseconds
  const timeDiff = end.getTime() - start.getTime();

  // Convert to days and round up (partial days count as full days)
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

// Function to calculate the price based on the pricing plan and number of days
const calculatePrice = (
  pricingPlans: UIPricingPlan[],
  days: number
): { price: number; plan: UIPricingPlan | null } => {
  if (!pricingPlans || pricingPlans.length === 0 || days <= 0) {
    return { price: 0, plan: null };
  }

  // Find the most appropriate plan based on the number of days
  let selectedPlan = pricingPlans[0];

  for (const plan of pricingPlans) {
    if (days <= plan.base_duration_days) {
      selectedPlan = plan;
      break;
    }

    // If we've gone through all plans and none match, use the last one (longest duration)
    selectedPlan = plan;
  }

  // Calculate the price
  let totalPrice = selectedPlan.price;

  // Add additional day price if exceeding base duration
  if (days > selectedPlan.base_duration_days) {
    const additionalDays = days - selectedPlan.base_duration_days;
    totalPrice += additionalDays * selectedPlan.additional_day_price;
  }

  return { price: totalPrice, plan: selectedPlan };
};

type PricingCalculatorProps = {
  pricingPlans: UIPricingPlan[];
  options: OptionData[];
};

export default function PricingCalculator({
  pricingPlans,
  options,
}: PricingCalculatorProps) {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<UIPricingPlan | null>(null);
  const [days, setDays] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<
    { option_id: string; quantity: number }[]
  >([]);

  // Générer les options d'heures valides (de 3:30 à 00:30 par dizaine de minutes)
  const generateTimeOptions = () => {
    const options = [];

    // Heures de 3 à 23
    for (let hour = 3; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        // Sauter 3:00, 3:10, 3:20 car on commence à 3:30
        if (hour === 3 && minute < 30) continue;

        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        const timeValue = `${formattedHour}:${formattedMinute}`;
        const timeLabel = `${formattedHour}:${formattedMinute}`;

        options.push({ value: timeValue, label: timeLabel });
      }
    }

    // Ajouter 00:00, 00:10, 00:20, 00:30
    for (let minute = 0; minute <= 30; minute += 10) {
      const timeValue = `00:${minute.toString().padStart(2, "0")}`;
      const timeLabel = `00:${minute.toString().padStart(2, "0")}`;

      options.push({ value: timeValue, label: timeLabel });
    }

    return options;
  };

  const timeOptions = generateTimeOptions();

  // Reset the calculated price when inputs change
  useEffect(() => {
    setCalculatedPrice(null);
  }, [startDate, startTime, endDate, endTime, selectedOptions]);

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

  const handleCalculate = () => {
    if (!startDate || !endDate) {
      alert("Veuillez sélectionner les dates de début et de fin");
      return;
    }

    if (!startTime || !endTime) {
      alert("Veuillez sélectionner les heures de début et de fin");
      return;
    }

    // Extra validation to ensure end date is not before start date
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (endDateTime <= startDateTime) {
      alert(
        "La date/heure de fin doit être postérieure à la date/heure de début"
      );
      return;
    }

    const calculatedDays = calculateDays(startDate, endDate);
    setDays(calculatedDays);

    if (calculatedDays <= 0) {
      alert("La date de fin ne doit pas être antérieure à la date de début");
      return;
    }

    const { price, plan } = calculatePrice(pricingPlans, calculatedDays);

    // Calculate options price
    const optionsPrice = selectedOptions.reduce((total, opt) => {
      const option = options.find((o) => o.id === opt.option_id);
      return total + (option ? option.price * opt.quantity : 0);
    }, 0);

    // Add options price to total
    const totalPrice = price + optionsPrice;

    setCalculatedPrice(totalPrice);
    setSelectedPlan(plan);
  };

  return (
    <div className="bg-card p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Calculateur de tarif</h2>
      <p className="text-muted-foreground mb-8">
        Pour obtenir un devis précis, veuillez utiliser notre calculateur de
        tarif en ligne. Entrez simplement vos dates de début et de fin pour
        connaître le prix exact de votre stationnement.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            <Label
              htmlFor="arrival-date"
              className="block text-sm font-medium mb-1"
            >
              Date de début
            </Label>
            <Input
              type="date"
              id="arrival-date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                // If end date is before new start date, update end date
                if (endDate && new Date(e.target.value) > new Date(endDate)) {
                  setEndDate(e.target.value);
                }
              }}
              min={new Date().toISOString().split("T")[0]} // Set minimum date to today
              className="w-full"
              required
            />
          </div>
          <div className="mb-4">
            <Label
              htmlFor="arrival-time"
              className="block text-sm font-medium mb-1"
            >
              Heure de début
            </Label>
            <select
              id="arrival-time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background"
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

        <div>
          <div className="mb-4">
            <Label
              htmlFor="departure-date"
              className="block text-sm font-medium mb-1"
            >
              Date de fin
            </Label>
            <Input
              type="date"
              id="departure-date"
              value={endDate}
              onChange={(e) => {
                // Only set the end date if it's not before the start date
                const newEndDate = e.target.value;
                if (!startDate || new Date(newEndDate) >= new Date(startDate)) {
                  setEndDate(newEndDate);
                } else {
                  // If invalid date is selected, alert the user
                  alert(
                    "La date de fin ne peut pas être antérieure à la date de début"
                  );
                  // Reset to start date
                  setEndDate(startDate);
                }
              }}
              min={startDate || new Date().toISOString().split("T")[0]} // Set minimum date to start date or today
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <Label
              htmlFor="departure-time"
              className="block text-sm font-medium mb-1"
            >
              Heure de fin
            </Label>
            <select
              id="departure-time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background"
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

      {/* Options Section */}
      {options.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-4">Services additionnels</h3>
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
                      <input
                        type="checkbox"
                        id={`option-${option.id}`}
                        checked={isSelected}
                        onChange={(e) =>
                          handleOptionChange(option.id, e.target.checked)
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

      <div className="mt-6 flex flex-col items-center">
        <Button
          onClick={(e) => {
            e.preventDefault(); // Prevent form submission
            handleCalculate();
          }}
          type="button"
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-base font-medium shadow-sm hover:bg-primary/90 transition-colors mb-6"
        >
          Calculer le tarif
        </Button>

        {calculatedPrice !== null && selectedPlan && (
          <div className="bg-secondary p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-2 text-center">
              Devis estimatif
            </h3>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Durée:</span>
                <span>
                  {days} jour{days > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Forfait:</span>
                <span>{selectedPlan.name}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
              <div className="flex justify-between">
                <span className="text-base font-medium">Prix de base</span>
                <span className="text-base">
                  {selectedPlan.price}€
                  {days > selectedPlan.base_duration_days && (
                    <>
                      +{" "}
                      {(days - selectedPlan.base_duration_days) *
                        selectedPlan.additional_day_price}
                      €
                    </>
                  )}
                </span>
              </div>

              {/* Show selected options */}
              {selectedOptions.length > 0 && (
                <>
                  <div className="flex justify-between mt-2">
                    <span className="text-base font-medium">Options</span>
                    <span className="text-base">
                      {selectedOptions.reduce((total, opt) => {
                        const option = options.find(
                          (o) => o.id === opt.option_id
                        );
                        return (
                          total + (option ? option.price * opt.quantity : 0)
                        );
                      }, 0)}
                      €
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {selectedOptions.map((opt) => {
                      const option = options.find(
                        (o) => o.id === opt.option_id
                      );
                      return option ? (
                        <div
                          key={opt.option_id}
                          className="flex justify-between"
                        >
                          <span>
                            {option.name} x{opt.quantity}
                          </span>
                          <span>
                            {(option.price * opt.quantity).toFixed(2)}€
                          </span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </>
              )}

              <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">
                  {calculatedPrice.toFixed(2)}€
                </span>
              </div>
            </div>

            <div className="text-center">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Réserver maintenant
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
