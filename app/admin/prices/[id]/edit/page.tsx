import { getPriceById, getParkingLots } from "@/app/actions";
import { notFound } from "next/navigation";
import EditPricePage from "./client-page";

export default async function EditPricePageWrapper({
  params,
}: {
  params: { id: string };
}) {
  const price = await getPriceById(params.id);
  const parkingLots = await getParkingLots();

  if (!price) {
    notFound();
  }

  return (
    <EditPricePage price={price} parkingLots={parkingLots} id={params.id} />
  );
}
