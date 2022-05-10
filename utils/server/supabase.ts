import { createClient } from "@supabase/supabase-js";

export const getServerSupabase = () => {
	const url = process.env.SUPABASE_URL;
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!url || !key) {
		throw new Error("Missing Supabase parameters");
	}
	return createClient(url, key);
};
