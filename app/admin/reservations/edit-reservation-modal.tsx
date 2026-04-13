"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReservationWithUserData } from "@/app/actions";

type EditReservationModalProps = {
  reservation: ReservationWithUserData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    id: string,
    data: Record<string, unknown>
  ) => Promise<void>;
};

export default function EditReservationModal({
  reservation,
  isOpen,
  onClose,
  onSave,
}: EditReservationModalProps) {
  if (!isOpen || !reservation) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Modifier la réservation
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
          <EditForm reservation={reservation} onClose={onClose} onSave={onSave} />
        </div>
      </div>
    </div>
  );
}

function EditForm({
  reservation,
  onClose,
  onSave,
}: {
  reservation: ReservationWithUserData;
  onClose: () => void;
  onSave: (id: string, data: Record<string, unknown>) => Promise<void>;
}) {
  const start = reservation.start_date.split("T");
  const end = reservation.end_date.split("T");

  const [isSaving, setIsSaving] = useState(false);
  const [startDate, setStartDate] = useState(start[0] || "");
  const [startTime, setStartTime] = useState(start[1]?.substring(0, 5) || "");
  const [endDate, setEndDate] = useState(end[0] || "");
  const [endTime, setEndTime] = useState(end[1]?.substring(0, 5) || "");
  const [vehicleType, setVehicleType] = useState(reservation.vehicle_type);
  const [vehicleBrand, setVehicleBrand] = useState(reservation.vehicle_brand || "");
  const [vehicleModel, setVehicleModel] = useState(reservation.vehicle_model || "");
  const [vehicleColor, setVehicleColor] = useState(reservation.vehicle_color || "");
  const [vehiclePlate, setVehiclePlate] = useState(reservation.vehicle_plate || "");
  const [status, setStatus] = useState(reservation.status);
  const [departureFlightNumber, setDepartureFlightNumber] = useState(reservation.departure_flight_number || "");
  const [returnFlightNumber, setReturnFlightNumber] = useState(reservation.return_flight_number || "");
  const [numberOfPeople, setNumberOfPeople] = useState(reservation.number_of_people || 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(reservation.id, {
        start_date: `${startDate}T${startTime}:00`,
        end_date: `${endDate}T${endTime}:00`,
        vehicle_type: vehicleType,
        vehicle_brand: vehicleBrand,
        vehicle_model: vehicleModel,
        vehicle_color: vehicleColor,
        vehicle_plate: vehiclePlate,
        status,
        departure_flight_number: departureFlightNumber || null,
        return_flight_number: returnFlightNumber || null,
        number_of_people: numberOfPeople,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Date d&apos;arrivée</Label>
          <div className="flex gap-2 mt-1">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-28"
            />
          </div>
        </div>
        <div>
          <Label>Date de départ</Label>
          <div className="flex gap-2 mt-1">
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="w-28"
            />
          </div>
        </div>
      </div>

      {/* Status */}
      <div>
        <Label>Statut</Label>
        <Select defaultValue={status} onValueChange={setStatus}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-[70]">
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="confirmed">Confirmée</SelectItem>
            <SelectItem value="completed">Terminée</SelectItem>
            <SelectItem value="cancelled">Annulée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Vehicle */}
      <div>
        <Label>Type de véhicule</Label>
        <Select defaultValue={vehicleType} onValueChange={setVehicleType}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-[70]">
            <SelectItem value="small_car">Voiture</SelectItem>
            <SelectItem value="large_car">Grand véhicule</SelectItem>
            <SelectItem value="small_motorcycle">Moto</SelectItem>
            <SelectItem value="large_motorcycle">Grosse moto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Marque</Label>
          <Input
            className="mt-1"
            value={vehicleBrand}
            onChange={(e) => setVehicleBrand(e.target.value)}
          />
        </div>
        <div>
          <Label>Modèle</Label>
          <Input
            className="mt-1"
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Couleur</Label>
          <Input
            className="mt-1"
            value={vehicleColor}
            onChange={(e) => setVehicleColor(e.target.value)}
          />
        </div>
        <div>
          <Label>Immatriculation</Label>
          <Input
            className="mt-1"
            value={vehiclePlate}
            onChange={(e) => setVehiclePlate(e.target.value)}
          />
        </div>
      </div>

      {/* Flight numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>N° vol aller</Label>
          <Input
            className="mt-1"
            value={departureFlightNumber}
            onChange={(e) => setDepartureFlightNumber(e.target.value)}
            placeholder="Ex: AF1234"
          />
        </div>
        <div>
          <Label>N° vol retour</Label>
          <Input
            className="mt-1"
            value={returnFlightNumber}
            onChange={(e) => setReturnFlightNumber(e.target.value)}
            placeholder="Ex: AF5678"
          />
        </div>
      </div>

      {/* People & Current Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Nombre de personnes</Label>
          <Input
            className="mt-1"
            type="number"
            min={1}
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(parseInt(e.target.value) || 1)}
          />
        </div>
        <div>
          <Label>Prix actuel</Label>
          <p className="mt-1 px-3 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 rounded-md">
            {reservation.total_price.toFixed(2)} €
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Le prix sera recalculé automatiquement si les dates changent.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onClose}
          disabled={isSaving}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={isSaving}
        >
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
