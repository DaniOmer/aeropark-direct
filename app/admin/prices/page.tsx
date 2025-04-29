import { getAllPricingData, getParkingLots } from "@/app/actions";
import PricesPage from "./client-page";

export default async function PricesPageWrapper() {
  const initialPrices = await getAllPricingData();
  const parkingLots = await getParkingLots();

  return <PricesPage initialPrices={initialPrices} parkingLots={parkingLots} />;
}
