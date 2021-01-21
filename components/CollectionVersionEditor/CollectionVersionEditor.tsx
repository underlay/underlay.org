import { Pane } from "evergreen-ui";

export interface CollectionVersionEditorProps {
	collection: { id: string };
	latestVersion: { versionNumber: string } | null;
}

const CollectionVersionEditor: React.FC<CollectionVersionEditorProps> = ({}) => {
	return <Pane></Pane>;
};

export default CollectionVersionEditor;
