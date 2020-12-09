import { AppContext, AppProps } from "next/app";
import { ThemeProvider } from "evergreen-ui";
import { getSession } from "next-auth/client";

import { Header, Footer } from "components";

import { PageContext } from "utils/client/hooks";
import { theme } from "utils/shared/theme";
import { setCachedSession } from "utils/server/session";
import { PageData } from "utils/shared/session";

import "./app.scss";
import { IncomingMessage } from "http";

type ExpandedAppProps = AppProps & PageData;

const App = ({ Component, pageProps, session, isStatic }: ExpandedAppProps) => {
	return (
		<ThemeProvider value={theme}>
			<PageContext.Provider value={{ session, isStatic }}>
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
	// App.getInitialProps actually gets invoked in two different contexts:
	// 1. at build time for any pages that opt into static generation by using getStaticProps, and
	// 2. for every new request at runtime.
	// In the first case (build time), `ctx.req` exists but is a mock request object
	// (just .path and a few other known properties); at runtime, ctx.req is an IncomingMessage
	if (ctx.req instanceof IncomingMessage) {
		// This happens at runtime.
		const session = await getSession(ctx);
		setCachedSession(ctx, session);
		return { session, isStatic: false };
	} else {
		// This happens at build time.
		return { session: null, isStatic: true };
	}
};

export default App;
