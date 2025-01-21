import { auth } from "@clerk/nextjs/server";

export default async function AppPage() {
  const { userId } = await auth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>
      <p>User ID: {userId}</p>
      {/* Add your protected content here */}
    </div>
  );
}
