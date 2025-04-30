"use client";

import { useState, useEffect } from "react";
import { useToastContext } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ParkingLotData } from "@/app/actions";

type ParkingLotFormProps = {
  initialData?: ParkingLotData | null;
  onSubmit: (
    data: Omit<ParkingLotData, "id" | "created_at" | "updated_at">
  ) => Promise<any>;
  onCancel?: () => void;
};

export default function ParkingLotForm({
  initialData,
  onSubmit,
  onCancel,
}: ParkingLotFormProps) {
  const { addToast } = useToastContext();
  const [formData, setFormData] = useState<
    Omit<ParkingLotData, "id" | "created_at" | "updated_at">
  >({
    name: initialData?.name || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    postal_code: initialData?.postal_code || "",
    country: initialData?.country || "France",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    description: initialData?.description || "",
    is_active: initialData?.is_active ?? true,
    capacity_small_cars: initialData?.capacity_small_cars ?? 0,
    capacity_large_cars: initialData?.capacity_large_cars ?? 0,
    capacity_small_motorcycles: initialData?.capacity_small_motorcycles ?? 0,
    capacity_large_motorcycles: initialData?.capacity_large_motorcycles ?? 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Handle numeric inputs for capacity fields
    if (name.startsWith("capacity_")) {
      // If value is empty string, set to 0 instead of null
      if (value === "") {
        setFormData({
          ...formData,
          [name]: 0,
        });
      } else {
        const numValue = parseInt(value, 10);
        setFormData({
          ...formData,
          [name]: isNaN(numValue) ? 0 : numValue,
        });
      }
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
          ? "Les informations du parking ont été mises à jour avec succès"
          : "Le parking a été créé avec succès",
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
        <div className="md:col-span-2">
          <Label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Nom du parking
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Adresse
          </Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <Label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Ville
          </Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <Label
            htmlFor="postal_code"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Code postal
          </Label>
          <Input
            id="postal_code"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <Label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Pays
          </Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <Label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Téléphone
          </Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <Label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
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

        <div className="md:col-span-2">
          <Label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Capacités section */}
        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Capacités du parking
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="capacity_small_cars"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Capacité voitures petites
              </Label>
              <Input
                id="capacity_small_cars"
                name="capacity_small_cars"
                type="number"
                min="0"
                value={formData.capacity_small_cars ?? 0}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label
                htmlFor="capacity_large_cars"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Capacité voitures grandes
              </Label>
              <Input
                id="capacity_large_cars"
                name="capacity_large_cars"
                type="number"
                min="0"
                value={formData.capacity_large_cars ?? 0}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label
                htmlFor="capacity_small_motorcycles"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Capacité motos petites
              </Label>
              <Input
                id="capacity_small_motorcycles"
                name="capacity_small_motorcycles"
                type="number"
                min="0"
                value={formData.capacity_small_motorcycles ?? 0}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label
                htmlFor="capacity_large_motorcycles"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Capacité motos grandes
              </Label>
              <Input
                id="capacity_large_motorcycles"
                name="capacity_large_motorcycles"
                type="number"
                min="0"
                value={formData.capacity_large_motorcycles ?? 0}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md mt-4">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-3 mt-6">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Annuler
          </Button>
        )}
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
