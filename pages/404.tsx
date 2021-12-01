import { NonIdealState } from "@blueprintjs/core";
// import { WarningSign } from "@blueprintjs/icons";

const NotFound: React.FC<{}> = ({}) => {
	const style = {
		marginTop: "50px",
	};
	return (
		<div style={style}>
			{/* <NonIdealState title="Page Not Found" icon={<WarningSign size={64} />} /> */}
			<NonIdealState title="Page Not Found" />
		</div>
	);
};

export default NotFound;
