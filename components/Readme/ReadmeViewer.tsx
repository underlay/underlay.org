import React from "react";
import { Pane, PaneOwnProps } from "evergreen-ui";
import Markdown from "react-markdown";
import { SchemaViewer } from "components";

import styles from "./ReadmeViewer.module.scss";

export interface ReadmeViewerProps extends PaneOwnProps {
	source: string;
}

const renderers = {
	code: ({ language, value }: { language: string; value: string }) => {
		if (language === "tasl") {
			return <SchemaViewer value={value} />;
		} else {
			return (
				<pre>
					<code>{value}</code>
				</pre>
			);
		}
	},
};

const ReadmeViewer: React.FC<ReadmeViewerProps> = ({ source, ...rest }) => {
	return (
		<Pane {...rest} className={styles.content}>
			<Markdown source={source} escapeHtml={true} renderers={renderers} />
		</Pane>
	);
};

export default ReadmeViewer;
