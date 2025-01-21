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
    <SupabaseProvider>
      {children}
    </SupabaseProvider>
  );
}
