import { createBrowserClient } from "@supabase/ssr"

export const createClient = () =>
  createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// Note: We're not using Supabase Auth anymore, so we don't need to pass the auth token.
// If you need to make authenticated requests to Supabase, you'll need to implement a custom solution
// to get the user's ID token from Clerk and pass it to Supabase.

