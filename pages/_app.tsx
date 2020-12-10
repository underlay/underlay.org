import { AppContext, AppProps } from "next/app";
import { ThemeProvider } from "evergreen-ui";
import { getSession } from "next-auth/client";

import { Header, Footer } from "components";

import { PageContext } from "utils/client/hooks";
import { theme } from "utils/shared/theme";
import { setCachedSession } from "utils/server/session";
import { PageData } from "utils/shared/session";

import "./app.scss";

type ExpandedAppProps = AppProps & PageData;

const App = ({ Component, pageProps, session }: ExpandedAppProps) => {
	return (
		<ThemeProvider value={theme}>
			<PageContext.Provider value={{ session }}>
				<div className="app">
					<Header />
					<div id="main-content" tabIndex={-1}>
						<Component {...pageProps} />
					</div>
					<Footer />
				</div>
			</PageContext.Provider>
		</ThemeProvider>
	);
};

App.getInitialProps = async ({ ctx }: AppContext): Promise<PageData> => {
	const session = await getSession(ctx);
	setCachedSession(ctx, session);
	return { session };
};

export default App;
