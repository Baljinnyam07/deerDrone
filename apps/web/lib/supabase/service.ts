import { createClient } from "@supabase/supabase-js";
import {
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
} from "../server-env";

// Service role client for server-side operations (API routes)
// This bypasses RLS — use only in trusted server contexts
export function createServiceClient() {
  const url = getSupabaseUrl();
  const serviceKey = getSupabaseServiceRoleKey();

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
