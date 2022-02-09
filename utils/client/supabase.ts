import { createClient, SupabaseClient } from "@supabase/supabase-js";

export let supabase: SupabaseClient;

export const createBrowserSupabase = (url: string, publicKey: string) => {
	supabase = createClient(url, publicKey, {
		autoRefreshToken: true,
		persistSession: true /* Persisting session is necessary for autoRefresh to function */,
	});
};
