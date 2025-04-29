"use client";

import { useState } from "react";
import { useToastContext } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PriceData } from "@/app/actions";

type ParkingLot = {
  id: string;
  name: string;
};

type PriceFormProps = {
  initialData?: PriceData | null;
  parkingLots: ParkingLot[];
  onSubmit: (
    data: Omit<PriceData, "id" | "created_at" | "updated_at">
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
    base_price: initialData?.base_price || 0,
    base_duration_days: initialData?.base_duration_days || 1,
    additional_day_price: initialData?.additional_day_price || 0,
    late_fee: initialData?.late_fee || 0,
    currency: initialData?.currency || "EUR",
    is_active: initialData?.is_active ?? true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(formData);
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
            htmlFor="base_price"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Prix de base (€)
          </Label>
          <Input
            id="base_price"
            name="base_price"
            type="number"
            step="0.01"
            min="0"
            value={formData.base_price}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <Label
            htmlFor="base_duration_days"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Durée de base (jours)
          </Label>
          <Input
            id="base_duration_days"
            name="base_duration_days"
            type="number"
            min="1"
            value={formData.base_duration_days}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <Label
            htmlFor="additional_day_price"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Prix par jour supplémentaire (€)
          </Label>
          <Input
            id="additional_day_price"
            name="additional_day_price"
            type="number"
            step="0.01"
            min="0"
            value={formData.additional_day_price}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

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
