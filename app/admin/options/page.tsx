import { getAllOptionsData, getParkingLots } from "@/app/actions";
import OptionsPage from "./client-page";

export default async function OptionsPageWrapper() {
  const initialOptions = await getAllOptionsData();
  const parkingLots = await getParkingLots();

  return (
    <OptionsPage initialOptions={initialOptions} parkingLots={parkingLots} />
  );
}
