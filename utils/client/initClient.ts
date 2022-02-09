import { useEffect } from "react";
import { NextRouter } from "next/router";
import * as Fathom from "fathom-client";
import { FocusStyleManager } from "@blueprintjs/core";

import { setEnv } from "utils/client/environment";
import { createBrowserSupabase, supabase } from "utils/client/supabase";

type Query = { signupCompleted?: string };

export const initClient = (
	vercelEnv: string,
	supabaseUrl: string,
	supabaseKey: string,
	router: NextRouter
) => {
	return useEffect(() => {
		FocusStyleManager.onlyShowFocusOnTabs();
		setEnv(vercelEnv);
		createBrowserSupabase(supabaseUrl, supabaseKey);

		initFathom(router);
		initSession(router.query);
	}, []);
};

const initFathom = (router: NextRouter) => {
	// Initialize Fathom when the app loads
	// Example: yourdomain.com
	//  - Do not include https://
	//  - This must be an exact match of your domain.
	//  - If you're using www. for your domain, make sure you include that here.
	Fathom.load("RUDUJXLT", {
		includedDomains: ["www.underlay.org"],
		url: "https://paul-attractive.underlay.org/script.js",
	});

	function onRouteChangeComplete() {
		Fathom.trackPageview();
	}
	// Record a pageview when route changes
	router.events.on("routeChangeComplete", onRouteChangeComplete);

	// Unassign event listener
	return () => {
		router.events.off("routeChangeComplete", onRouteChangeComplete);
	};
};

const initSession = (query: Query) => {
	const initSession = supabase.auth.session();
	if (initSession) {
		supabase.auth.signIn({
			refreshToken: initSession.refresh_token,
		});
	}

	supabase.auth.onAuthStateChange(async (event, session) => {
		if (event === "SIGNED_IN" && query.signupCompleted) {
			await fetch("/api/token", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token: session?.access_token }),
			});
			window.location.href = "/";
		}

		if (event === "TOKEN_REFRESHED") {
			/* Sync the underlay token when a supabase token is refreshed */
			/* If it's restoring an expired token (i.e. initSession is null) */
			/* Refresh page to show logged in state */
			await fetch("/api/token", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token: session?.access_token }),
			});
			if (!initSession) {
				window.location.href = "/";
			}
		}
	});
};
