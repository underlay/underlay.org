import { Button, Heading, majorScale, Pane } from "evergreen-ui";

const New: React.FC<{}> = ({}) => {
	return (
		<Pane width={majorScale(80)} marginX="auto">
			<Heading size={800}>Create a new resource</Heading>
			<Pane marginY={majorScale(4)}>
				<Button is="a" href="/new/schema">
					New schema
				</Button>
				<Button marginX={majorScale(2)} is="a" href="/new/collection">
					New collection
				</Button>
				<Button is="a" href="/new/pipeline">
					New pipeline
				</Button>
			</Pane>
		</Pane>
	);
};

export default New;
