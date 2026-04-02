import { createClient } from "@/utils/supabase/server";
import DashboardClient from "./dashboard-client";

async function getDashboardData() {
  const supabase = await createClient();
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // Total reservations
  const { count: totalReservations } = await supabase
    .from("reservations")
    .select("*", { count: "exact", head: true });

  // Confirmed reservations
  const { count: confirmedReservations } = await supabase
    .from("reservations")
    .select("*", { count: "exact", head: true })
    .eq("status", "confirmed");

  // Pending reservations
  const { count: pendingReservations } = await supabase
    .from("reservations")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  // Today's arrivals
  const { data: todayArrivals } = await supabase
    .from("reservations")
    .select("*, users!inner(first_name, last_name, email, phone)")
    .gte("start_date", `${todayStr}T00:00:00`)
    .lt("start_date", `${todayStr}T23:59:59`)
    .in("status", ["confirmed", "pending"])
    .order("start_date", { ascending: true });

  // Today's departures
  const { data: todayDepartures } = await supabase
    .from("reservations")
    .select("*, users!inner(first_name, last_name, email, phone)")
    .gte("end_date", `${todayStr}T00:00:00`)
    .lt("end_date", `${todayStr}T23:59:59`)
    .in("status", ["confirmed", "completed"])
    .order("end_date", { ascending: true });

  // Revenue this month
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const { data: monthPayments } = await supabase
    .from("payments")
    .select("amount")
    .eq("status", "succeeded")
    .gte("created_at", `${firstDayOfMonth}T00:00:00`);

  const monthRevenue =
    monthPayments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

  // Currently parked vehicles
  const { count: currentlyParked } = await supabase
    .from("reservations")
    .select("*", { count: "exact", head: true })
    .lte("start_date", today.toISOString())
    .gte("end_date", today.toISOString())
    .eq("status", "confirmed");

  // Parking lot capacity
  const { data: parkingLot } = await supabase
    .from("parking_lots")
    .select("capacity_small_cars")
    .eq("is_active", true)
    .limit(1)
    .single();

  // Monthly revenue for the last 12 months
  const monthlyRevenue: { month: string; revenue: number; reservations: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const startOfMonth = d.toISOString().split("T")[0];
    const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

    const { data: payments } = await supabase
      .from("payments")
      .select("amount")
      .eq("status", "succeeded")
      .gte("created_at", `${startOfMonth}T00:00:00`)
      .lte("created_at", `${endOfMonth}T23:59:59`);

    const { count: resCount } = await supabase
      .from("reservations")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${startOfMonth}T00:00:00`)
      .lte("created_at", `${endOfMonth}T23:59:59`);

    const monthLabel = d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });

    monthlyRevenue.push({
      month: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
      revenue: payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
      reservations: resCount || 0,
    });
  }

  return {
    totalReservations: totalReservations || 0,
    confirmedReservations: confirmedReservations || 0,
    pendingReservations: pendingReservations || 0,
    todayArrivals: todayArrivals || [],
    todayDepartures: todayDepartures || [],
    monthRevenue,
    currentlyParked: currentlyParked || 0,
    totalCapacity: parkingLot?.capacity_small_cars || 0,
    monthlyRevenue,
  };
}

export default async function AdminDashboard() {
  const data = await getDashboardData();
  return <DashboardClient data={data} />;
}
