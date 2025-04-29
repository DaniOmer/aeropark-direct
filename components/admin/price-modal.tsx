"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import PriceForm from "./price-form";
import { PriceData } from "@/app/actions";

type ParkingLot = {
  id: string;
  name: string;
};

type PriceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  parkingLots: ParkingLot[];
  onSubmit: (
    data: Omit<PriceData, "id" | "created_at" | "updated_at">
  ) => Promise<any>;
};

export default function PriceModal({
  isOpen,
  onClose,
  parkingLots,
  onSubmit,
}: PriceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Ajouter un tarif
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>

          <PriceForm
            parkingLots={parkingLots}
            onSubmit={async (data) => {
              await onSubmit(data);
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
