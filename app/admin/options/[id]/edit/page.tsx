import { getOptionById } from "@/app/actions";
import { notFound } from "next/navigation";
import EditOptionPage from "./client-page";

// This is a workaround for the TypeScript error related to PageProps
async function EditOptionPageContent(id: string) {
  const option = await getOptionById(id);

  if (!option) {
    notFound();
  }

  return <EditOptionPage option={option} id={id} />;
}

export default async function EditOptionPageWrapper({ params }: any) {
  const { id } = await params;
  return EditOptionPageContent(id);
}
