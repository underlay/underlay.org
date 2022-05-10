import { createClient, SupabaseClient } from "@supabase/supabase-js";

export let supabase: SupabaseClient;

export const createBrowserSupabase = (url: string, publicKey: string) => {
	supabase = createClient(url, publicKey, {
		autoRefreshToken: true,
		persistSession: true /* Persisting session is necessary for autoRefresh to function */,
	});
};

export const getServerSupabase = () => {
	const url = process.env.SUPABASE_URL;
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!url || !key) {
		throw new Error("Missing Supabase parameters");
	}
	return createClient(url, key);
};
