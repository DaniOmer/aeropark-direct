import { getPriceById, getParkingLots } from "@/app/actions";
import { notFound } from "next/navigation";
import DeletePricePage from "./client-page";

// This is a workaround for the TypeScript error related to PageProps
async function DeletePricePageContent(id: string) {
  const price = await getPriceById(id);
  const parkingLots = await getParkingLots();

  if (!price) {
    notFound();
  }

  // Find the parking lot name
  const parkingLot = parkingLots.find((lot) => lot.id === price.parking_lot_id);
  const parkingLotName = parkingLot ? parkingLot.name : "Inconnu";

  return (
    <DeletePricePage price={price} id={id} parkingLotName={parkingLotName} />
  );
}

export default async function DeletePricePageWrapper({ params }: any) {
  const { id } = await params;
  return DeletePricePageContent(id);
}
