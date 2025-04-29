import { redirect } from "next/navigation";

export default function AdminPage() {
  // Redirect to the prices management page by default
  redirect("/admin/prices");
}
