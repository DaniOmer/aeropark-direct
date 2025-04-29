import { getAllReservations } from "@/app/actions";
import ReservationsClientPage from "./client-page";

export default async function ReservationsPage() {
  // Fetch all reservations
  const reservations = await getAllReservations();

  return <ReservationsClientPage initialReservations={reservations} />;
}
