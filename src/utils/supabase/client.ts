import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "./info";

// Create a single Supabase client instance to be reused throughout the app
let supabaseClient: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey
    );
  }
  return supabaseClient;
};
