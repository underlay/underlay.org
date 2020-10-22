import { AppProps, AppContext } from "next/app";
import Head from "next/head";
import "@atlaskit/css-reset";

import { Header, Footer } from "components";
import { InitData, getInitData } from "utils/server/initData";
import { PageContext } from "utils/client/hooks";

import "./app.scss";

type ExpandedAppProps = AppProps & { initData: InitData };

const Main = ({ Component, pageProps, initData }: ExpandedAppProps) => {
	const contentComponent =
		pageProps && pageProps.serverSideNotFound ? (
			<h1>404 Not Found</h1>
		) : (
			<Component {...pageProps} />
		);
	return (
		<PageContext.Provider value={initData}>
			<div className="app">
				<Head>
					<link rel="shortcut icon" href="/favicon.png" />
				</Head>
				<Header />
				<div id="main-content" tabIndex={-1}>
					{contentComponent}
				</div>
				<Footer />
			</div>
		</PageContext.Provider>
	);
};

Main.getInitialProps = async (appContext: AppContext) => {
	const initData = await getInitData(appContext.ctx);
	return { initData: initData };
};

export default Main;
