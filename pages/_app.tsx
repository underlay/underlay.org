import { AppProps, AppContext } from "next/app";
import { ThemeProvider } from "evergreen-ui";

import { Header, Footer } from "components";
import { InitData, getInitData } from "utils/server/initData";
import { PageContext } from "utils/client/hooks";
import { theme } from "utils/shared/theme";

import "./app.scss";

type ExpandedAppProps = AppProps & { initData: InitData };

const App = ({ Component, pageProps, initData }: ExpandedAppProps) => {
	const contentComponent =
		pageProps && pageProps.serverSideNotFound ? (
			<h1>404 Not Found</h1>
		) : (
			<Component {...pageProps} />
		);

	return (
		<ThemeProvider value={theme}>
			<PageContext.Provider value={initData}>
				<div className="app">
					<Header />
					<div id="main-content" tabIndex={-1}>
						{contentComponent}
					</div>
					<Footer />
				</div>
			</PageContext.Provider>
		</ThemeProvider>
	);
};

App.getInitialProps = async (appContext: AppContext) => {
	const initData = await getInitData(appContext.ctx);
	return { initData: initData };
};

export default App;
