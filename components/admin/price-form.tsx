"use client";

import { useState, useEffect } from "react";
import { useToastContext } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  PriceData,
  DurationPriceData,
  getDurationPrices,
  createDurationPrices,
  deleteDurationPricesForPrice,
} from "@/app/actions";

type ParkingLot = {
  id: string;
  name: string;
};

type DurationPrice = {
  id?: string;
  duration_days: number;
  price: number;
};

type PriceFormProps = {
  initialData?: PriceData | null;
  parkingLots: ParkingLot[];
  onSubmit: (
    data: Omit<PriceData, "id" | "created_at" | "updated_at">,
    durationPrices?: DurationPrice[]
  ) => Promise<any>;
  onCancel: () => void;
};

export default function PriceForm({
  initialData,
  parkingLots,
  onSubmit,
  onCancel,
}: PriceFormProps) {
  const { addToast } = useToastContext();
  // Use the first parking lot ID by default if available
  const defaultParkingLotId = parkingLots.length > 0 ? parkingLots[0].id : "";

  const [formData, setFormData] = useState<
    Omit<PriceData, "id" | "created_at" | "updated_at">
  >({
    parking_lot_id: initialData?.parking_lot_id || defaultParkingLotId,
    base_price: 0, // Kept for database compatibility but not shown in UI
    base_duration_days: 1, // Kept for database compatibility but not shown in UI
    additional_day_price: 0, // Kept for database compatibility but not shown in UI
    late_fee: initialData?.late_fee || 0,
    currency: initialData?.currency || "EUR",
    is_active: initialData?.is_active ?? true,
    people_threshold: initialData?.people_threshold || 4,
    additional_people_fee: initialData?.additional_people_fee || 8.0,
  });

  const [durationPrices, setDurationPrices] = useState<DurationPrice[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingDurationPrices, setIsLoadingDurationPrices] = useState(false);

  // Load duration prices if initialData exists
  useEffect(() => {
    const loadDurationPrices = async () => {
      if (initialData?.id) {
        setIsLoadingDurationPrices(true);
        try {
          const prices = await getDurationPrices(initialData.id);
          if (prices && prices.length > 0) {
            setDurationPrices(
              prices.map((p) => ({
                id: p.id,
                duration_days: p.duration_days,
                price: p.price,
              }))
            );
          } else {
            // If no duration prices exist, initialize with default values from the image
            initializeDefaultDurationPrices();
          }
        } catch (err) {
          console.error("Error loading duration prices:", err);
          addToast("Erreur lors du chargement des tarifs par durée", "error");
        } finally {
          setIsLoadingDurationPrices(false);
        }
      } else {
        // For new prices, initialize with default values
        initializeDefaultDurationPrices();
      }
    };

    loadDurationPrices();
  }, [initialData?.id]);

  // Initialize default duration prices based on the image
  const initializeDefaultDurationPrices = () => {
    const defaultPrices: DurationPrice[] = [
      { duration_days: 1, price: 39 },
      { duration_days: 2, price: 39 },
      { duration_days: 3, price: 39 },
      { duration_days: 4, price: 39 },
      { duration_days: 5, price: 47 },
      { duration_days: 6, price: 55 },
      { duration_days: 7, price: 63 },
      { duration_days: 8, price: 71 },
      { duration_days: 9, price: 79 },
      { duration_days: 10, price: 87 },
      { duration_days: 11, price: 94 },
      { duration_days: 12, price: 101 },
      { duration_days: 13, price: 107 },
      { duration_days: 14, price: 113 },
      { duration_days: 15, price: 118 },
      { duration_days: 16, price: 123 },
      { duration_days: 17, price: 128 },
      { duration_days: 18, price: 133 },
      { duration_days: 19, price: 138 },
      { duration_days: 20, price: 143 },
      { duration_days: 21, price: 148 },
      { duration_days: 22, price: 153 },
      { duration_days: 23, price: 158 },
      { duration_days: 24, price: 163 },
      { duration_days: 25, price: 168 },
      { duration_days: 26, price: 173 },
      { duration_days: 27, price: 178 },
      { duration_days: 28, price: 183 },
      { duration_days: 29, price: 188 },
      { duration_days: 30, price: 193 },
      { duration_days: 31, price: 198 },
    ];
    setDurationPrices(defaultPrices);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "number") {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      is_active: checked,
    });
  };

  // Handle duration price change
  const handleDurationPriceChange = (
    index: number,
    field: "duration_days" | "price",
    value: number
  ) => {
    const updatedPrices = [...durationPrices];
    updatedPrices[index] = {
      ...updatedPrices[index],
      [field]: value,
    };
    setDurationPrices(updatedPrices);
  };

  // Add a new duration price
  const addDurationPrice = () => {
    // Find the highest duration day
    const highestDay =
      durationPrices.length > 0
        ? Math.max(...durationPrices.map((dp) => dp.duration_days))
        : 0;

    setDurationPrices([
      ...durationPrices,
      { duration_days: highestDay + 1, price: 0 },
    ]);
  };

  // Remove a duration price
  const removeDurationPrice = (index: number) => {
    const updatedPrices = [...durationPrices];
    updatedPrices.splice(index, 1);
    setDurationPrices(updatedPrices);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Submit the main price data
      const result = await onSubmit(formData, durationPrices);

      // If we have a price ID, save the duration prices
      if (result && result.id) {
        const priceId = result.id;

        // First delete any existing duration prices
        await deleteDurationPricesForPrice(priceId);

        // Then create the new ones
        if (durationPrices.length > 0) {
          const durationPricesData = durationPrices.map((dp) => ({
            price_id: priceId,
            duration_days: dp.duration_days,
            price: dp.price,
          }));

          await createDurationPrices(durationPricesData);
        }
      }

      addToast(
        initialData
          ? "Le tarif a été mis à jour avec succès"
          : "Le tarif a été créé avec succès",
        "success"
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      addToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label
            htmlFor="late_fee"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Frais de retard (€)
          </Label>
          <Input
            id="late_fee"
            name="late_fee"
            type="number"
            step="0.01"
            min="0"
            value={formData.late_fee}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <Label
            htmlFor="currency"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Devise
          </Label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            required
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <div>
          <Label
            htmlFor="people_threshold"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Seuil de personnes
          </Label>
          <Input
            id="people_threshold"
            name="people_threshold"
            type="number"
            min="1"
            max="6"
            value={formData.people_threshold}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Nombre de personnes à partir duquel un supplément est appliqué
          </p>
        </div>

        <div>
          <Label
            htmlFor="additional_people_fee"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Supplément personnes (€)
          </Label>
          <Input
            id="additional_people_fee"
            name="additional_people_fee"
            type="number"
            step="0.01"
            min="0"
            value={formData.additional_people_fee}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Frais supplémentaires appliqués lorsque le nombre de personnes
            dépasse le seuil
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={handleCheckboxChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <Label
            htmlFor="is_active"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Actif
          </Label>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md mt-4">
          {error}
        </div>
      )}

      {/* Duration Prices Section */}
      <div className="mt-8">
        <div className="border rounded-md p-4 mt-2">
          <h3 className="text-lg font-medium mb-4">
            Tarifs par durée (jours 1-31)
          </h3>

          {isLoadingDurationPrices ? (
            <div className="text-center py-4">Chargement des tarifs...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Jours 1-16</h4>
                  <div className="space-y-2">
                    {durationPrices
                      .filter((dp) => dp.duration_days <= 16)
                      .sort((a, b) => a.duration_days - b.duration_days)
                      .map((dp, index) => {
                        const actualIndex = durationPrices.findIndex(
                          (p) => p.duration_days === dp.duration_days
                        );
                        return (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-16">
                              <Label className="text-sm">
                                Jour {dp.duration_days}
                              </Label>
                            </div>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={dp.price}
                              onChange={(e) =>
                                handleDurationPriceChange(
                                  actualIndex,
                                  "price",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-24"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeDurationPrice(actualIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Supprimer
                            </Button>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Jours 17-31</h4>
                  <div className="space-y-2">
                    {durationPrices
                      .filter((dp) => dp.duration_days > 16)
                      .sort((a, b) => a.duration_days - b.duration_days)
                      .map((dp, index) => {
                        const actualIndex = durationPrices.findIndex(
                          (p) => p.duration_days === dp.duration_days
                        );
                        return (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-16">
                              <Label className="text-sm">
                                Jour {dp.duration_days}
                              </Label>
                            </div>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={dp.price}
                              onChange={(e) =>
                                handleDurationPriceChange(
                                  actualIndex,
                                  "price",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-24"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeDurationPrice(actualIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Supprimer
                            </Button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addDurationPrice}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Ajouter un tarif
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
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
          {isSubmitting
            ? "Enregistrement..."
            : initialData
              ? "Mettre à jour"
              : "Créer"}
        </Button>
      </div>
    </form>
  );
}
