import { Button, majorScale, Pane } from "evergreen-ui";

const New: React.FC<{}> = ({}) => {
	return (
		<Pane marginY={majorScale(20)} marginX="auto" width="max-content">
			<Button margin={majorScale(2)} is="a" href="/new/schema">
				New schema
			</Button>
			<Button margin={majorScale(2)} is="a" href="/new/collection">
				New collection
			</Button>
			<Button margin={majorScale(2)} is="a" href="/new/pipeline">
				New pipeline
			</Button>
		</Pane>
	);
};

export default New;
