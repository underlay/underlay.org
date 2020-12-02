import { Heading, majorScale, Pane } from "evergreen-ui";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { usePageContext } from "utils/client/hooks";

const ImportCsv: React.FC<{}> = ({}) => {
	const { session } = usePageContext();
	const router = useRouter();

	useEffect(() => {
		if (session === null) {
			router.push("/login", {});
		}
	}, []);

	if (session === null) {
		return null;
	}

	return (
		<Pane marginY={majorScale(8)} marginX="auto" maxWidth={majorScale(128)}>
			<Heading>Import CSV</Heading>
		</Pane>
	);
};

export default ImportCsv;
