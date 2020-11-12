import React from "react";
import { Pane, PaneOwnProps } from "evergreen-ui";
import Markdown from "react-markdown";

export interface ReadmeViewerProps extends PaneOwnProps {
	source: string;
}

const ReadmeViewer: React.FC<ReadmeViewerProps> = ({ source, ...rest }) => {
	return (
		<Pane {...rest}>
			<Markdown source={source} escapeHtml={true} />
		</Pane>
	);
};

export default ReadmeViewer;
