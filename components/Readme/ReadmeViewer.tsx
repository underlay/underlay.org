import React from "react";
import { Pane, PaneOwnProps } from "evergreen-ui";
import Markdown from "react-markdown";

import styles from "./ReadmeViewer.module.scss";

export interface ReadmeViewerProps extends PaneOwnProps {
	source: string;
}

const ReadmeViewer: React.FC<ReadmeViewerProps> = ({ source, ...rest }) => {
	return (
		<Pane {...rest} className={styles.content}>
			<Markdown>{source}</Markdown>
		</Pane>
	);
};

export default ReadmeViewer;
