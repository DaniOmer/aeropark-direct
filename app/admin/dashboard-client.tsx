"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { DayReservation } from "./actions";
import { getDayReservations } from "./actions";

type Reservation = DayReservation;

type MonthlyData = {
  month: string;
  revenue: number;
  reservations: number;
};

type DashboardData = {
  totalReservations: number;
  confirmedReservations: number;
  pendingReservations: number;
  todayArrivals: Reservation[];
  todayDepartures: Reservation[];
  monthRevenue: number;
  currentlyParked: number;
  totalCapacity: number;
  monthlyRevenue: MonthlyData[];
};

function formatTime(dateStr: string) {
  // Extract time directly from the ISO string to avoid timezone conversion
  const match = dateStr.match(/T(\d{2}):(\d{2})/);
  if (match) return `${match[1]}:${match[2]}`;
  return new Date(dateStr).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatVehicle(type: string) {
  return type === "small_car" ? "Voiture" : "Moto";
}

function downloadPDF(
  reservations: Reservation[],
  kind: "arrivals" | "departures",
  date: Date
) {
  const doc = new jsPDF();
  const isArrival = kind === "arrivals";
  const longDate = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const title = isArrival ? `Arrivées du ${longDate}` : `Départs du ${longDate}`;

  doc.setFontSize(16);
  doc.text(`ParkAero Direct — ${title}`, 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(longDate, 14, 28);

  if (reservations.length === 0) {
    doc.setFontSize(12);
    doc.setTextColor(150);
    doc.text("Aucune réservation", 14, 45);
  } else {
    autoTable(doc, {
      startY: 35,
      head: [
        isArrival
          ? ["Heure", "Client", "Téléphone", "Véhicule", "Plaque", "Vol retour", "Pers.", "Statut"]
          : ["Heure", "Client", "Téléphone", "Véhicule", "Plaque", "Pers.", "Statut"],
      ],
      body: reservations.map((r) => {
        const row = [
          formatTime(isArrival ? r.end_date : r.start_date),
          `${r.users?.first_name || ""} ${r.users?.last_name || ""}`,
          r.users?.phone || "—",
          `${formatVehicle(r.vehicle_type)} ${r.vehicle_brand || ""} ${r.vehicle_model || ""}`.trim(),
          r.vehicle_plate || "—",
        ];
        if (isArrival) {
          row.push(r.return_flight_number || "—");
        }
        row.push(String(r.number_of_people || "1"));
        row.push(
          r.status === "confirmed"
            ? "Confirmé"
            : r.status === "pending"
              ? "En attente"
              : r.status
        );
        return row;
      }),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [14, 165, 233] },
    });
  }

  const filePrefix = isArrival ? "arrivees" : "departs";
  doc.save(`${filePrefix}-${toDateStr(date)}.pdf`);
}

function toDateStr(date: Date): string {
  // Local YYYY-MM-DD (avoids UTC shift around midnight).
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return toDateStr(a) === toDateStr(b);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatLongDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatMediumDate(date: Date): string {
  // e.g. "Ven. 2 mai 2026" — used on small screens.
  return date.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatShortDate(date: Date): string {
  // e.g. "5 mai"
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  });
}

function DayNavigator({
  date,
  onPrev,
  onNext,
  onToday,
  isToday,
  isLoading,
}: {
  date: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  isToday: boolean;
  isLoading: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 bg-card rounded-2xl border border-border px-3 sm:px-4 py-3">
      <button
        onClick={onPrev}
        disabled={isLoading}
        className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Jour précédent"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <p className="text-xs sm:text-sm font-bold text-foreground capitalize text-center sm:min-w-[14rem] flex-1 sm:flex-initial">
        <span className="sm:hidden">{formatMediumDate(date)}</span>
        <span className="hidden sm:inline">{formatLongDate(date)}</span>
      </p>

      <button
        onClick={onNext}
        disabled={isLoading}
        className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Jour suivant"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {!isToday && (
        <button
          onClick={onToday}
          disabled={isLoading}
          className="shrink-0 sm:ml-2 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition-opacity"
        >
          <span className="sm:hidden" aria-label="Aujourd'hui">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M5 6h14a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2zm3-4v4m8-4v4" />
            </svg>
          </span>
          <span className="hidden sm:inline">Aujourd&apos;hui</span>
        </button>
      )}
    </div>
  );
}

export default function DashboardClient({ data }: { data: DashboardData }) {
  const occupancyPercent =
    data.totalCapacity > 0
      ? Math.round((data.currentlyParked / data.totalCapacity) * 100)
      : 0;

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [arrivals, setArrivals] = useState<Reservation[]>(data.todayArrivals);
  const [departures, setDepartures] = useState<Reservation[]>(
    data.todayDepartures
  );
  const [isLoading, setIsLoading] = useState(false);

  const isToday = isSameDay(selectedDate, today);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    getDayReservations(toDateStr(selectedDate))
      .then(({ arrivals: a, departures: d }) => {
        if (cancelled) return;
        setArrivals(a);
        setDepartures(d);
      })
      .catch((err) => {
        console.error("Failed to load day reservations", err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  const goPrev = () => setSelectedDate((d) => addDays(d, -1));
  const goNext = () => setSelectedDate((d) => addDays(d, 1));
  const goToday = () => setSelectedDate(new Date());

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">
          Tableau de bord
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Stats row 1 — key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Occupancy */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Occupation parking
            </p>
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground">
            {data.currentlyParked}
            <span className="text-lg text-muted-foreground font-normal">
              /{data.totalCapacity}
            </span>
          </p>
          <div className="mt-3 w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                occupancyPercent > 85
                  ? "bg-red-500"
                  : occupancyPercent > 60
                    ? "bg-amber-500"
                    : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min(occupancyPercent, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {occupancyPercent}% occupé
          </p>
        </div>

        {/* Revenue */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              CA du mois
            </p>
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground">
            {data.monthRevenue.toFixed(0)}
            <span className="text-lg"> €</span>
          </p>
        </div>

        {/* Pending */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              En attente
            </p>
            <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground">
            {data.pendingReservations}
          </p>
          {data.pendingReservations > 0 && (
            <Link
              href="/admin/reservations"
              className="text-xs text-primary hover:underline mt-1 inline-block"
            >
              Voir les réservations →
            </Link>
          )}
        </div>

        {/* Total */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total réservations
            </p>
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground">
            {data.totalReservations}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {data.confirmedReservations} confirmées
          </p>
        </div>
      </div>

      {/* Arrivals & Departures */}
      {/* Revenue chart */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Évolution sur 12 mois
            </p>
            <h2 className="text-lg font-bold text-foreground">
              Chiffre d&apos;affaires & Réservations
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-cyan-500 rounded-sm" />
              CA (€)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-amber-500 rounded-sm" />
              Réservations
            </span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.monthlyRevenue}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                stroke="var(--muted-foreground)"
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11 }}
                stroke="var(--muted-foreground)"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11 }}
                stroke="var(--muted-foreground)"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  fontSize: "13px",
                  color: "#f8fafc",
                  padding: "10px 14px",
                }}
                itemStyle={{ color: "#f8fafc" }}
                labelStyle={{
                  color: "#94a3b8",
                  fontSize: "11px",
                  marginBottom: "4px",
                }}
                formatter={(value, name) => [
                  name === "revenue"
                    ? `${value} €`
                    : `${value} réservation${Number(value) > 1 ? "s" : ""}`,
                  name === "revenue" ? "Chiffre d'affaires" : "Réservations",
                ]}
                cursor={{ fill: "rgba(14, 165, 233, 0.08)" }}
              />
              <Bar
                yAxisId="left"
                dataKey="revenue"
                fill="#0ea5e9"
                radius={[4, 4, 0, 0]}
                name="revenue"
              />
              <Bar
                yAxisId="right"
                dataKey="reservations"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                name="reservations"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <DayNavigator
        date={selectedDate}
        onPrev={goPrev}
        onNext={goNext}
        onToday={goToday}
        isToday={isToday}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Departures */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <h2 className="text-sm font-bold text-foreground capitalize">
                {isToday ? "Arrivées aujourd'hui" : `Arrivées du ${formatShortDate(selectedDate)}`}
              </h2>
              <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold px-2 py-0.5 rounded-full">
                {departures.length}
              </span>
            </div>
            <button
              onClick={() => downloadPDF(departures, "arrivals", selectedDate)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-secondary"
              title="Télécharger PDF"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              PDF
            </button>
          </div>

          {departures.length === 0 ? (
            <div className="p-10 text-center">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">
                Aucune arrivée prévue
              </p>
            </div>
          ) : (
            <div
              className={`divide-y divide-border max-h-80 overflow-y-auto transition-opacity ${
                isLoading ? "opacity-50" : "opacity-100"
              }`}
            >
              {departures.map((res) => (
                <Link
                  key={res.id}
                  href={`/admin/reservations?search=${res.number || res.id.substring(0, 8)}`}
                  className="px-5 py-3 flex items-center justify-between hover:bg-secondary/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                        {formatTime(res.end_date)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {res.users?.first_name} {res.users?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {res.vehicle_plate || "—"} ·{" "}
                        {formatVehicle(res.vehicle_type)}
                        {res.users?.phone && ` · ${res.users.phone}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {res.return_flight_number && `Vol retour: ${res.return_flight_number}`}
                        {res.return_flight_number && res.number_of_people ? " · " : ""}
                        {res.number_of_people && `${res.number_of_people} pers.`}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                      res.status === "confirmed"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    {res.status === "confirmed" ? "Confirmé" : "Terminé"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Arrivals */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <h2 className="text-sm font-bold text-foreground capitalize">
                {isToday ? "Départs aujourd'hui" : `Départs du ${formatShortDate(selectedDate)}`}
              </h2>
              <span className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold px-2 py-0.5 rounded-full">
                {arrivals.length}
              </span>
            </div>
            <button
              onClick={() => downloadPDF(arrivals, "departures", selectedDate)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-secondary"
              title="Télécharger PDF"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              PDF
            </button>
          </div>

          {arrivals.length === 0 ? (
            <div className="p-10 text-center">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">
                Aucun départ prévu
              </p>
            </div>
          ) : (
            <div
              className={`divide-y divide-border max-h-80 overflow-y-auto transition-opacity ${
                isLoading ? "opacity-50" : "opacity-100"
              }`}
            >
              {arrivals.map((res) => (
                <Link
                  key={res.id}
                  href={`/admin/reservations?search=${res.number || res.id.substring(0, 8)}`}
                  className="px-5 py-3 flex items-center justify-between hover:bg-secondary/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        {formatTime(res.start_date)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {res.users?.first_name} {res.users?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {res.vehicle_plate || "—"} ·{" "}
                        {formatVehicle(res.vehicle_type)}
                        {res.users?.phone && ` · ${res.users.phone}`}
                      </p>
                      {res.number_of_people && (
                        <p className="text-xs text-muted-foreground">
                          {res.number_of_people} pers.
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                      res.status === "confirmed"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                    }`}
                  >
                    {res.status === "confirmed" ? "Confirmé" : "En attente"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
