import "server-only";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

let cachedClient: ReturnType<typeof createClient> | null = null;

export const getSupabaseAdmin = () => {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase URL and API keys are missing. Please configure NEXT_PUBLIC_SUPABASE_URL in your .env file.");
  }

  if (!cachedClient) {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn("⚠️ Warning: SUPABASE_SERVICE_ROLE_KEY is missing in your .env file. Falling back to publishable key. Uploads may fail if bucket policies are restrictive.");
    }
    cachedClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return cachedClient;
};
