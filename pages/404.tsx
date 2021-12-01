import { NonIdealState } from "@blueprintjs/core";

const NotFound: React.FC<{}> = ({}) => {
	const style = {
		marginTop: "50px",
	};
	return (
		<div style={style}>
			<NonIdealState title="Page Not Found" icon="warning-sign" />
		</div>
	);
};

export default NotFound;
