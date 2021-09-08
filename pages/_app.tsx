import App, { AppContext, AppProps } from "next/app";
import Head from "next/head";

import initClient from "utils/client/initClient";
import { LoginData } from "utils/shared/types";
import { LoginContext, LocationContext } from "utils/client/hooks";
import { Header, Footer } from "components";

import "./app.scss";

type ExpandedAppProps = AppProps & { loginData: LoginData };

function MyApp({ Component, router, pageProps, loginData }: ExpandedAppProps) {
	return (
		<LocationContext.Provider value={router.query}>
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
	const appProps = await App.getInitialProps(appContext);
	/* 
		This funky require function exists for a couple reasons.
		1. getInitialProps does not do tree shaking, and so even though
		it is only run on the server-side for _app.tsx, it is still bundled
		with the client, causing server-side code to make it's way
		to the client and cause 'Prisma cannot be run on the client' style
		errors.
		2. The Layout component approach (where every page uses a Layout
		component and uses getServerSideProps to fetch init data) could work
		but feels verbose and like a lot of overhead to do the exact same thing
		
		Webpack doesn't statically analyze eval, so it will be ignored when bundling.
		Tips from here: https://arunoda.me/blog/ssr-and-server-only-modules
		https://nextjs.org/docs/advanced-features/custom-app
		https://github.com/vercel/next.js/issues/22505
	*/
	const loginData: LoginData = await require("../utils/server/initServerData.ts")(
		appContext.ctx.req
	);
	return { ...appProps, loginData: loginData };
};

export default MyApp;
initClient();
