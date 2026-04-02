import {
  getFirstParkingLot,
  createParkingLot,
  updateParkingLot,
  ParkingLotData,
} from "@/app/actions";
import ParkingLotForm from "@/components/admin/parking-lot-form";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

export default async function ParkingPage() {
  // Try to get the first parking lot (since there's only one for now)
  const parkingLot = await getFirstParkingLot();

  // Function to handle form submission
  async function handleSubmit(
    data: Omit<ParkingLotData, "id" | "created_at" | "updated_at">
  ) {
    "use server";

    if (parkingLot) {
      // Update existing parking lot
      console.log(parkingLot);
      const result = await updateParkingLot(
        parkingLot.id,
        data as Partial<
          Omit<ParkingLotData, "id" | "created_at" | "updated_at">
        >
      );

      if (!result.success) {
        throw new Error(
          result.error || "Erreur lors de la mise à jour du parking"
        );
      }
    } else {
      // Create new parking lot
      const result = await createParkingLot(data);
      console.log(result);

      if (!result.success) {
        throw new Error(
          result.error || "Erreur lors de la création du parking"
        );
      }
    }

    // Revalidate the path to refresh the data
    revalidatePath("/admin/parking");
    return { success: true };
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">
            {parkingLot
              ? "Modifier les informations du parking"
              : "Configurer votre parking"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {parkingLot
              ? "Mettez à jour les informations de votre parking"
              : "Configurez les informations de base de votre parking"}
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <ParkingLotForm initialData={parkingLot} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
