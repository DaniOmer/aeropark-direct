"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import type { UIPricingPlan } from "@/app/tarifs/types";

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
};

export default function PricingCalculator({
  pricingPlans,
}: PricingCalculatorProps) {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<UIPricingPlan | null>(null);
  const [days, setDays] = useState<number>(0);

  // Reset the calculated price when inputs change
  useEffect(() => {
    setCalculatedPrice(null);
  }, [startDate, startTime, endDate, endTime]);

  const handleCalculate = () => {
    if (!startDate || !endDate) {
      alert("Veuillez sélectionner les dates d'arrivée et de départ");
      return;
    }

    const calculatedDays = calculateDays(startDate, endDate);
    setDays(calculatedDays);

    if (calculatedDays <= 0) {
      alert("La date de départ doit être postérieure à la date d'arrivée");
      return;
    }

    const { price, plan } = calculatePrice(pricingPlans, calculatedDays);
    setCalculatedPrice(price);
    setSelectedPlan(plan);
  };

  return (
    <div className="bg-card p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Calculateur de tarif</h2>
      <p className="text-muted-foreground mb-8">
        Pour obtenir un devis précis, veuillez utiliser notre calculateur de
        tarif en ligne. Entrez simplement vos dates d'arrivée et de départ pour
        connaître le prix exact de votre stationnement.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            <Label
              htmlFor="arrival-date"
              className="block text-sm font-medium mb-1"
            >
              Date d'arrivée
            </Label>
            <Input
              type="date"
              id="arrival-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <Label
              htmlFor="arrival-time"
              className="block text-sm font-medium mb-1"
            >
              Heure d'arrivée
            </Label>
            <select
              id="arrival-time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="">Sélectionnez une heure</option>
              <option value="08:00">08:00</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
              <option value="18:00">18:00</option>
              <option value="19:00">19:00</option>
              <option value="20:00">20:00</option>
            </select>
          </div>
        </div>

        <div>
          <div className="mb-4">
            <Label
              htmlFor="departure-date"
              className="block text-sm font-medium mb-1"
            >
              Date de départ
            </Label>
            <Input
              type="date"
              id="departure-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <Label
              htmlFor="departure-time"
              className="block text-sm font-medium mb-1"
            >
              Heure de départ
            </Label>
            <select
              id="departure-time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="">Sélectionnez une heure</option>
              <option value="08:00">08:00</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
              <option value="18:00">18:00</option>
              <option value="19:00">19:00</option>
              <option value="20:00">20:00</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center">
        <Button
          onClick={handleCalculate}
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-base font-medium shadow-sm hover:bg-primary/90 transition-colors mb-6"
        >
          Calculer le tarif
        </Button>

        {calculatedPrice !== null && selectedPlan && (
          <div className="bg-secondary p-6 rounded-lg w-full max-w-md text-center">
            <h3 className="text-xl font-bold mb-2">Devis estimatif</h3>
            <p className="mb-2">
              Durée: {days} jour{days > 1 ? "s" : ""}
            </p>
            <p className="mb-2">Forfait: {selectedPlan.name}</p>
            <p className="text-2xl font-bold text-primary">
              {calculatedPrice.toFixed(2)}€
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Prix de base: {selectedPlan.price}€ pour{" "}
              {selectedPlan.base_duration_days} jours
              {days > selectedPlan.base_duration_days && (
                <>
                  <br />+ {days - selectedPlan.base_duration_days} jour(s)
                  supplémentaire(s) à {selectedPlan.additional_day_price}€/jour
                </>
              )}
            </p>
            <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
              Réserver maintenant
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
