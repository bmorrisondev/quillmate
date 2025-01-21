import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SupabaseProvider from "@/lib/supabase-provider";

export function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <SupabaseProvider>
        {children}
      </SupabaseProvider>
    </div>
  );
}

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
    <ProtectedLayout>
      {children}
    </ProtectedLayout>
  );
}
