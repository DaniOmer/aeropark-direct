import { getAllReservations } from "@/app/actions";
import ReservationsClientPage from "./client-page";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface SearchParams {
  page?: string;
  search?: string;
}

export default async function ReservationsPage({ searchParams }: any) {
  // Extract and process search parameters
  const { search: searchQuery, page } = searchParams;

  const pageNumber = page ? parseInt(page) : 1;

  // Fetch reservations with search and pagination
  const { data: reservations, count } = await getAllReservations(
    pageNumber,
    10,
    searchQuery || undefined
  );

  return (
    <ReservationsClientPage
      initialReservations={reservations}
      totalCount={count}
      currentPage={pageNumber}
      searchQuery={searchQuery}
    />
  );
}
