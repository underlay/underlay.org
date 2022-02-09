import App, { AppContext, AppProps } from "next/app";
import Head from "next/head";

import { initClient } from "utils/client/initClient";
import { LoginContext, LocationContext } from "utils/client/hooks";
import { LocalUserData } from "utils/shared/types";
import { Header, Footer } from "components";

import "./app.scss";

type ExpandedAppProps = AppProps & {
	loginData: LocalUserData;
	tokenData: string;
	vercelEnv: string;
	supabaseUrl: string;
	supabaseKey: string;
};

function MyApp({
	Component,
	router,
	pageProps,
	loginData,
	vercelEnv,
	supabaseUrl,
	supabaseKey,
}: ExpandedAppProps) {
	initClient(vercelEnv, supabaseUrl, supabaseKey, router);
	return (
		<LocationContext.Provider value={router}>
			<LoginContext.Provider value={loginData}>
				<Head>
					<title>Underlay</title>
					<link rel="shortcut icon" href="/favicon.png" />
					<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				</Head>
				<div className="app">
					<Header />
					<div id="main-content" tabIndex={-1}>
						<Component {...pageProps} />
					</div>
					<Footer />
				</div>
			</LoginContext.Provider>
		</LocationContext.Provider>
	);
}

MyApp.getInitialProps = async (appContext: AppContext) => {
	/* 
		There is no current way to run server-only code for all pages without
		manually repeating that code on each page. MyApp.getInitialProps will run 
		on both server and client. To prevent the execution of this code, we wrap
		it in a typeof window statement. To prevent the bundling of the server code
		we require the necessary file in-line (rather than a top-level import)
		and update our package.json `browser` field to not bundle the 
		utils/server/auth/user.ts file.
		Discussions on the need for a cleaner solution:
		https://github.com/vercel/next.js/discussions/10874
		https://github.com/vercel/next.js/issues/22505
		https://arunoda.me/blog/ssr-and-server-only-modules
	*/
	if (typeof window === "undefined") {
		const { getLoginId, findUserById } = require("../utils/server/auth/user.ts");
		const appProps = await App.getInitialProps(appContext);

		const loginId = await getLoginId(appContext.ctx.req);
		const loginData = await findUserById(loginId);
		return {
			...appProps,
			loginData: loginData,
			vercelEnv: process.env.VERCEL_ENV,
			supabaseUrl: process.env.SUPABASE_URL,
			supabaseKey: process.env.SUPABASE_PUBLIC_KEY,
		};
	}
};

export default MyApp;
