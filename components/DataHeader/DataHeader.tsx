// import { Button } from "@blueprintjs/core";
import { CollectionProps } from "utils/server/collections";
// import { convertToLocaleDateString } from "utils/shared/dates";

// import styles from "./DataHeader.module.scss";

type Props = {};

const DataHeader: React.FC<Props & CollectionProps> = function ({}) {
	return null;
	// const infoString = collection.publishedAt
	// 	? `Version: ${collection.version} · Last Published: ${convertToLocaleDateString(
	// 			collection.publishedAt
	// 	  )}`
	// 	: `Version: ${collection.version}`;

	// return (
	// 	<div className={styles.collectionHeader}>
	// 		<div className="collectionInfo">{infoString}</div>
	// 		<div className="collectionActions">
	// 			<Button>Upload Data</Button>
	// 			<Button>Export Data</Button>
	// 		</div>
	// 	</div>
	// );
};

export default DataHeader;
