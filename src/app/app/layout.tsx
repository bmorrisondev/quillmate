import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SupabaseProvider from "@/lib/supabase-provider";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto p-4">
      <SupabaseProvider>
        {children}
      </SupabaseProvider>
    </div>
  );
}
