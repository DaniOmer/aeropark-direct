import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "./admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user details from the database to check role
  const { data: userData, error } = await supabase
    .from("users")
    .select("role")
    .eq("email", user.email)
    .single();

  // if (error || !userData || userData.role !== "admin") {
  //   return redirect("/protected");
  // }

  return (
    <div className="fixed inset-0 z-[60] flex bg-[#f8fafc] dark:bg-[#0a0f1a]">
      <AdminSidebar />
      <main className="flex-1 min-w-0 md:ml-64 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
