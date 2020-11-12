import { Button, majorScale, Pane } from "evergreen-ui";

const New: React.FC<{}> = ({}) => {
	return (
		<Pane marginY={majorScale(20)} marginX="auto" width="max-content">
			<Button marginX={majorScale(2)} is="a" href="/new/schema">
				New schema
			</Button>
			<Button marginX={majorScale(2)} is="a" href="/new/collection" disabled={true}>
				New collection
			</Button>
		</Pane>
	);
};

export default New;
