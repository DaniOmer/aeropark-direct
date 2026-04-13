"use client";

import { useState } from "react";
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

type Reservation = {
  id: string;
  start_date: string;
  end_date: string;
  vehicle_type: string;
  vehicle_plate: string;
  vehicle_brand: string;
  vehicle_model: string;
  status: string;
  number: string;
  users: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
};

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

function downloadPDF(reservations: Reservation[], title: string) {
  const doc = new jsPDF();
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  doc.setFontSize(16);
  doc.text(`ParkAero Direct — ${title}`, 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(today, 14, 28);

  if (reservations.length === 0) {
    doc.setFontSize(12);
    doc.setTextColor(150);
    doc.text("Aucune réservation", 14, 45);
  } else {
    autoTable(doc, {
      startY: 35,
      head: [["Heure", "Client", "Téléphone", "Véhicule", "Plaque", "Statut"]],
      body: reservations.map((r) => [
        formatTime(title.includes("Arrivée") ? r.start_date : r.end_date),
        `${r.users?.first_name || ""} ${r.users?.last_name || ""}`,
        r.users?.phone || "—",
        `${formatVehicle(r.vehicle_type)} ${r.vehicle_brand || ""} ${r.vehicle_model || ""}`.trim(),
        r.vehicle_plate || "—",
        r.status === "confirmed"
          ? "Confirmé"
          : r.status === "pending"
            ? "En attente"
            : r.status,
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [14, 165, 233] },
    });
  }

  doc.save(
    `${title.toLowerCase().replace(/\s/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`
  );
}

export default function DashboardClient({ data }: { data: DashboardData }) {
  const occupancyPercent =
    data.totalCapacity > 0
      ? Math.round((data.currentlyParked / data.totalCapacity) * 100)
      : 0;

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Departures */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <h2 className="text-sm font-bold text-foreground">
                Arrivées aujourd&apos;hui
              </h2>
              <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold px-2 py-0.5 rounded-full">
                {data.todayDepartures.length}
              </span>
            </div>
            <button
              onClick={() =>
                downloadPDF(data.todayDepartures, "Arrivées du jour")
              }
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

          {data.todayDepartures.length === 0 ? (
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
            <div className="divide-y divide-border max-h-80 overflow-y-auto">
              {data.todayDepartures.map((res) => (
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
              <h2 className="text-sm font-bold text-foreground">
                Départs aujourd&apos;hui
              </h2>
              <span className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold px-2 py-0.5 rounded-full">
                {data.todayArrivals.length}
              </span>
            </div>
            <button
              onClick={() => downloadPDF(data.todayArrivals, "Départs du jour")}
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

          {data.todayArrivals.length === 0 ? (
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
            <div className="divide-y divide-border max-h-80 overflow-y-auto">
              {data.todayArrivals.map((res) => (
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
