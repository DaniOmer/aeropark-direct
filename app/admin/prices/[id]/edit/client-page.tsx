"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToastContext } from "@/components/providers/toast-provider";
import { PriceData, updatePrice } from "@/app/actions";
import PriceForm from "@/components/admin/price-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ParkingLot = {
  id: string;
  name: string;
};

type EditPricePageProps = {
  price: PriceData;
  parkingLots: ParkingLot[];
  id: string;
};

export default function EditPricePage({
  price,
  parkingLots,
  id,
}: EditPricePageProps) {
  const router = useRouter();
  const { addToast } = useToastContext();

  const handleCancel = () => {
    router.push("/admin/prices");
  };

  const handleSubmit = async (
    data: Omit<PriceData, "id" | "created_at" | "updated_at">
  ) => {
    try {
      // If no parking lot is selected but we have parking lots, use the first one
      if (!data.parking_lot_id && parkingLots.length > 0) {
        data.parking_lot_id = parkingLots[0].id;
      }

      const result = await updatePrice(id, data);

      if (!result.success) {
        throw new Error(
          result.error || "Erreur lors de la mise à jour du tarif"
        );
      }

      addToast("Le tarif a été mis à jour avec succès", "success");
      router.push("/admin/prices");
      router.refresh();
      return { success: true };
    } catch (error) {
      console.error("Error updating price:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur est survenue";
      addToast(errorMessage, "error");
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Modifier un tarif
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Modifiez les informations du tarif
          </p>
        </div>
        <Link href="/admin/prices">
          <Button
            variant="outline"
            className="w-full sm:w-auto border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Retour à la liste
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <PriceForm
          initialData={price}
          parkingLots={parkingLots}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
