import { getPriceById, getParkingLots } from "@/app/actions";
import { notFound } from "next/navigation";
import EditPricePage from "./client-page";

// This is a workaround for the TypeScript error related to PageProps
async function EditPricePageContent(id: string) {
  const price = await getPriceById(id);
  const parkingLots = await getParkingLots();

  if (!price) {
    notFound();
  }

  return <EditPricePage price={price} parkingLots={parkingLots} id={id} />;
}

export default async function EditPricePageWrapper({ params }: any) {
  const { id } = await params;
  return EditPricePageContent(id);
}
