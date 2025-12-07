import { createBrowserClient } from "@supabase/ssr"

// Create a single supabase client for the browser
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabase() {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return supabaseClient
}
