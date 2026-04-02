"use client";

import { useState, useEffect } from "react";
import { format as formatDate } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";
import type { UIPricingPlan } from "@/app/tarifs/types";
import type { OptionData } from "@/app/actions";

// Function to calculate the number of days between two dates based on calendar days
const calculateDays = (startDate: string, endDate: string): number => {
  if (!startDate || !endDate) return 0;

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
  return Math.floor(diffTime / millisecondsPerDay) + 1;
};

// Function to calculate the price based on the pricing plan and number of days
const calculatePrice = async (
  pricingPlans: UIPricingPlan[],
  days: number
): Promise<{ price: number; plan: UIPricingPlan | null }> => {
  if (!pricingPlans || pricingPlans.length === 0 || days <= 0) {
    return { price: 0, plan: null };
  }

  // Find the most appropriate plan based on the number of days
  let selectedPlan = pricingPlans[0];

  // Try to find a plan with duration_prices
  for (const plan of pricingPlans) {
    if (plan.duration_prices && plan.duration_prices.length > 0) {
      selectedPlan = plan;
      break;
    }
  }

  // If we have duration prices, use them
  if (selectedPlan.duration_prices && selectedPlan.duration_prices.length > 0) {
    // Find the exact match for the number of days
    const exactMatch = selectedPlan.duration_prices.find(
      (dp) => dp.duration_days === days
    );
    if (exactMatch) {
      return { price: exactMatch.price, plan: selectedPlan };
    }

    // If no exact match, find the closest higher duration
    const higherDurations = selectedPlan.duration_prices
      .filter((dp) => dp.duration_days > days)
      .sort((a, b) => a.duration_days - b.duration_days);

    if (higherDurations.length > 0) {
      return { price: higherDurations[0].price, plan: selectedPlan };
    }

    // If no higher duration, use the highest available duration
    const highestDuration = [...selectedPlan.duration_prices].sort(
      (a, b) => b.duration_days - a.duration_days
    )[0];

    return { price: highestDuration.price, plan: selectedPlan };
  }

  // Fallback to the old pricing model if no duration prices are available
  // Calculate the price using the base price and additional day price
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
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [endDateOpen, setEndDateOpen] = useState(false);
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
      for (let minute = 0; minute < 60; minute += 30) {
        // Sauter 3:00 car on commence à 3:30
        if (hour === 3 && minute < 30) continue;

        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        const timeValue = `${formattedHour}:${formattedMinute}`;
        const timeLabel = `${formattedHour}:${formattedMinute}`;

        options.push({ value: timeValue, label: timeLabel });
      }
    }

    // Ajouter 00:00, 00:30
    for (let minute = 0; minute <= 30; minute += 30) {
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

  const handleCalculate = async () => {
    if (!startDate || !endDate) {
      alert("Veuillez sélectionner les dates de début et de fin");
      return;
    }

    if (!startTime || !endTime) {
      alert("Veuillez sélectionner les heures de début et de fin");
      return;
    }

    const startDateStr = formatDate(startDate, "yyyy-MM-dd");
    const endDateStr = formatDate(endDate, "yyyy-MM-dd");

    // Extra validation to ensure end date is not before start date
    const startDateTime = new Date(`${startDateStr}T${startTime}`);
    const endDateTime = new Date(`${endDateStr}T${endTime}`);

    if (endDateTime <= startDateTime) {
      alert(
        "La date/heure de fin doit être postérieure à la date/heure de début"
      );
      return;
    }

    const calculatedDays = calculateDays(startDateStr, endDateStr);
    setDays(calculatedDays);

    if (calculatedDays <= 0) {
      alert("La date de fin ne doit pas être antérieure à la date de début");
      return;
    }

    const { price, plan } = await calculatePrice(pricingPlans, calculatedDays);

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
            <Label className="block text-sm font-medium mb-1">
              Date de début
            </Label>
            <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent transition-colors",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  {startDate
                    ? formatDate(startDate, "d MMMM yyyy", { locale: fr })
                    : "Sélectionnez une date"}
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    setStartDate(date);
                    if (endDate && date && date > endDate) {
                      setEndDate(date);
                    }
                    setStartDateOpen(false);
                  }}
                  locale={fr}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="mb-4">
            <Label className="block text-sm font-medium mb-1">
              Heure de début
            </Label>
            <Select value={startTime} onValueChange={setStartTime}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une heure" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((option) => (
                  <SelectItem key={`calc-start-${option.value}`} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <div className="mb-4">
            <Label className="block text-sm font-medium mb-1">
              Date de fin
            </Label>
            <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent transition-colors",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  {endDate
                    ? formatDate(endDate, "d MMMM yyyy", { locale: fr })
                    : "Sélectionnez une date"}
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => {
                    setEndDate(date);
                    setEndDateOpen(false);
                  }}
                  locale={fr}
                  disabled={(date) =>
                    date <
                    (startDate || new Date(new Date().setHours(0, 0, 0, 0)))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="mb-4">
            <Label className="block text-sm font-medium mb-1">
              Heure de fin
            </Label>
            <Select value={endTime} onValueChange={setEndTime}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une heure" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((option) => (
                  <SelectItem key={`calc-end-${option.value}`} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
