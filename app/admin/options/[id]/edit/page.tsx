import { getOptionById } from "@/app/actions";
import { notFound } from "next/navigation";
import EditOptionPage from "./client-page";

export default async function EditOptionPageWrapper({
  params,
}: {
  params: { id: string };
}) {
  const option = await getOptionById(params.id);

  if (!option) {
    notFound();
  }

  return <EditOptionPage option={option} id={params.id} />;
}
