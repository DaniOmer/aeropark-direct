"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { checkAvailability } from "@/app/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { cn } from "@/lib/utils";

export default function ReservationForm() {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [endTime, setEndTime] = useState("");
  const [vehicleType, setVehicleType] = useState("small_car");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const generateTimeOptions = (intervalMinutes: number) => {
    const options = [];
    for (let hour = 3; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        if (hour === 3 && minute < 30) continue;
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        const timeValue = `${formattedHour}:${formattedMinute}`;
        options.push({ value: timeValue, label: timeValue });
      }
    }
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const timeValue = `00:${minute.toString().padStart(2, "0")}`;
      options.push({ value: timeValue, label: timeValue });
    }
    return options;
  };

  const arrivalTimeOptions = generateTimeOptions(5);
  const departureTimeOptions = generateTimeOptions(30);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!startDate || !endDate || !startTime || !endTime) {
        setError("Veuillez remplir tous les champs");
        setIsSubmitting(false);
        return;
      }

      const startDateStr = format(startDate, "yyyy-MM-dd");
      const endDateStr = format(endDate, "yyyy-MM-dd");
      const startDateTime = `${startDateStr}T${startTime}:00`;
      const endDateTime = `${endDateStr}T${endTime}:00`;
      const startDateObj = new Date(startDateTime);
      const endDateObj = new Date(endDateTime);
      const now = new Date();

      if (startDateObj < now) {
        setError("La date d'arrivée ne peut pas être dans le passé");
        setIsSubmitting(false);
        return;
      }

      if (endDateObj <= startDateObj) {
        setError("La date de départ doit être postérieure à la date d'arrivée");
        setIsSubmitting(false);
        return;
      }

      const result = await checkAvailability(
        startDateTime,
        endDateTime,
        vehicleType
      );

      if (result.available) {
        router.push(
          `/booking?start=${encodeURIComponent(startDateTime)}&end=${encodeURIComponent(
            endDateTime
          )}&vehicle=${encodeURIComponent(vehicleType)}`
        );
      } else {
        setError(result.message || "Aucune disponibilité pour ces dates");
      }
    } catch (err) {
      setError(
        "Une erreur est survenue lors de la vérification des disponibilités"
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerClass =
    "bg-[#f8fafc] dark:bg-white/5 border-[#e2e8f0] dark:border-white/10 rounded-lg h-10 text-sm focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500";

  const dateButtonClass =
    "w-full bg-[#f8fafc] dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 rounded-lg px-3 h-10 text-sm flex items-center justify-between hover:bg-[#f1f5f9] dark:hover:bg-white/10 transition-colors";

  return (
    <div
      id="reservation"
      className="bg-white dark:bg-[#122336] rounded-2xl p-6 md:p-7 shadow-[0_25px_50px_rgba(0,0,0,0.25)] border border-white/5"
    >
      <h2 className="text-lg font-bold text-[#0c1821] dark:text-white mb-5">
        Réservez votre place
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8] mb-1.5">
            Véhicule
          </label>
          <Select value={vehicleType} onValueChange={setVehicleType}>
            <SelectTrigger className={triggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small_car">Voiture</SelectItem>
              <SelectItem value="small_motorcycle">Moto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8] mb-1.5">
              Arrivée
            </label>
            <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
              <PopoverTrigger asChild>
                <button type="button" className={cn(dateButtonClass, !startDate && "text-muted-foreground")}>
                  <span className="truncate">
                    {startDate
                      ? format(startDate, "d MMM yyyy", { locale: fr })
                      : "jj/mm/aaaa"}
                  </span>
                  <CalendarIcon className="h-4 w-4 text-[#94a3b8] shrink-0" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    setStartDate(date);
                    setStartDateOpen(false);
                  }}
                  locale={fr}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8] mb-1.5">
              Heure
            </label>
            <Select value={startTime} onValueChange={setStartTime}>
              <SelectTrigger className={triggerClass}>
                <SelectValue placeholder="--:--" />
              </SelectTrigger>
              <SelectContent>
                {arrivalTimeOptions.map((option) => (
                  <SelectItem key={`start-${option.value}`} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8] mb-1.5">
              Départ
            </label>
            <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
              <PopoverTrigger asChild>
                <button type="button" className={cn(dateButtonClass, !endDate && "text-muted-foreground")}>
                  <span className="truncate">
                    {endDate
                      ? format(endDate, "d MMM yyyy", { locale: fr })
                      : "jj/mm/aaaa"}
                  </span>
                  <CalendarIcon className="h-4 w-4 text-[#94a3b8] shrink-0" />
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
                    date < (startDate || new Date(new Date().setHours(0, 0, 0, 0)))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8] mb-1.5">
              Heure
            </label>
            <Select value={endTime} onValueChange={setEndTime}>
              <SelectTrigger className={triggerClass}>
                <SelectValue placeholder="--:--" />
              </SelectTrigger>
              <SelectContent>
                {departureTimeOptions.map((option) => (
                  <SelectItem key={`end-${option.value}`} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold py-3 rounded-xl shadow-[0_4px_14px_rgba(14,165,233,0.35)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Vérification..." : "Vérifier la disponibilité"}
        </button>
      </form>
    </div>
  );
}
