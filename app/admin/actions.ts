"use server";

import { createClient } from "@/utils/supabase/server";

export type DayReservation = {
  id: string;
  start_date: string;
  end_date: string;
  vehicle_type: string;
  vehicle_plate: string;
  vehicle_brand: string;
  vehicle_model: string;
  status: string;
  number: string;
  return_flight_number: string | null;
  number_of_people: number | null;
  users: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
};

export async function getDayReservations(dateStr: string): Promise<{
  arrivals: DayReservation[];
  departures: DayReservation[];
}> {
  const supabase = await createClient();

  const { data: arrivals, error: arrivalsError } = await supabase
    .from("reservations")
    .select("*, users!inner(first_name, last_name, email, phone)")
    .gte("start_date", `${dateStr}T00:00:00`)
    .lt("start_date", `${dateStr}T23:59:59`)
    .in("status", ["confirmed", "pending"])
    .order("start_date", { ascending: true });
  if (arrivalsError) console.error("getDayReservations arrivals error:", arrivalsError);

  const { data: departures, error: departuresError } = await supabase
    .from("reservations")
    .select("*, users!inner(first_name, last_name, email, phone)")
    .gte("end_date", `${dateStr}T00:00:00`)
    .lt("end_date", `${dateStr}T23:59:59`)
    .in("status", ["confirmed", "completed"])
    .order("end_date", { ascending: true });
  if (departuresError) console.error("getDayReservations departures error:", departuresError);

  return {
    arrivals: (arrivals || []) as DayReservation[],
    departures: (departures || []) as DayReservation[],
  };
}
