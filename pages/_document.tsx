import React from "react";
import Document, { DocumentContext, Head, Main, NextScript } from "next/document";
import { extractStyles } from "evergreen-ui";

type ExtractedProps = {
	css: string;
	hydrationScript: React.ReactNode;
};

export default class MyDocument extends Document<ExtractedProps> {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
		const { css, hydrationScript } = extractStyles();
		return { ...initialProps, css, hydrationScript };
	}
	render() {
		const { css, hydrationScript } = this.props;

		return (
			<html>
				<Head>
					<link rel="shortcut icon" href="/favicon.png" />
					<style dangerouslySetInnerHTML={{ __html: css }} />
				</Head>

				<body>
					<Main />
					{hydrationScript}
					<NextScript />
				</body>
			</html>
		);
	}
}
