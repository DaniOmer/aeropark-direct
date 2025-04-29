import { getOptionById, updateOption } from "@/app/actions";
import OptionForm from "@/components/admin/option-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

export default async function EditOptionPage({
  params,
}: {
  params: { id: string };
}) {
  const option = await getOptionById(params.id);

  if (!option) {
    notFound();
  }

  async function handleUpdateOption(
    data: Omit<
      Parameters<typeof updateOption>[1],
      "id" | "created_at" | "updated_at"
    >
  ) {
    "use server";

    const result = await updateOption(params.id, data);

    if (!result.success) {
      throw new Error(
        result.error || "Erreur lors de la mise à jour de l'option"
      );
    }

    redirect("/admin/options");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Modifier une option
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Modifiez les informations de l'option
          </p>
        </div>
        <Link href="/admin/options">
          <Button
            variant="outline"
            className="w-full sm:w-auto border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Retour à la liste
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <OptionForm
          initialData={option}
          onSubmit={handleUpdateOption}
          onCancel={() => redirect("/admin/options")}
        />
      </div>
    </div>
  );
}
