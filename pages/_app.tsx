import { AppProps, AppContext } from "next/app";
import Head from "next/head";
import "@atlaskit/css-reset";

import { InitData, getInitData } from "pages/api/init";
import { PageContext } from "utils/client/hooks";
import Header from "components/Header";
import Footer from "components/Footer";

import "./app.scss";

type ExpandedAppProps = AppProps & { initData: InitData };

const Main = ({ Component, pageProps, initData }: ExpandedAppProps) => {
	return (
		<PageContext.Provider value={initData}>
			<div className="app">
				<Head>
					<link rel="shortcut icon" href="/favicon.png" />
				</Head>
				<Header />
				<div id="main-content" tabIndex={-1}>
					<Component {...pageProps} />
				</div>
				<Footer />
			</div>
		</PageContext.Provider>
	);
};

Main.getInitialProps = async (appContext: AppContext) => {
	const initData = await getInitData(appContext.ctx.req);
	return { initData: initData };
};

export default Main;
