import { getOptionById } from "@/app/actions";
import { notFound } from "next/navigation";
import DeleteOptionPage from "./client-page";

// This is a workaround for the TypeScript error related to PageProps
async function DeleteOptionPageContent(id: string) {
  const option = await getOptionById(id);

  if (!option) {
    notFound();
  }

  return <DeleteOptionPage option={option} id={id} />;
}

export default async function DeleteOptionPageWrapper({ params }: any) {
  const { id } = await params;
  return DeleteOptionPageContent(id);
}
