import { getAllReservations } from "@/app/actions";
import ReservationsClientPage from "./client-page";

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Get search parameters
  const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
  const searchQuery = searchParams.search as string | undefined;

  // Fetch reservations with search and pagination
  const { data: reservations, count } = await getAllReservations(
    page,
    10,
    searchQuery
  );

  return (
    <ReservationsClientPage
      initialReservations={reservations}
      totalCount={count}
      currentPage={page}
      searchQuery={searchQuery || ""}
    />
  );
}
