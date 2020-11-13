import { Heading, majorScale, Pane } from "evergreen-ui";

const NotFound: React.FC<{}> = ({}) => {
	return (
		<Pane maxWidth={majorScale(90)} marginX="auto" marginY={majorScale(4)}>
			<Heading>Page Not Found</Heading>
		</Pane>
	);
};

export default NotFound;
