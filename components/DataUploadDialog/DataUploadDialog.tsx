import React from "react";
import { Button, Intent } from "@blueprintjs/core";
import classNames from "classnames";

// import { getNextVersion } from "utils/shared/version";

import styles from "./DataUploadDialog.module.scss";
import { DataUpload } from "components";
import { CollectionProps } from "utils/server/collections";
import { getNextVersion } from "utils/shared/version";
import { useLocationContext } from "utils/client/hooks";

type Props = {
	newUpload: any;
	setNewUpload: any;
	schema: any;
	uploadData: any;
	isUploading: boolean;
};

const DataUploadDialog: React.FC<Props & CollectionProps> = function ({
	// newUpload,
	// setNewUpload,
	// schema,
	uploadData,
	isUploading,
	collection,
}) {
	const { namespaceSlug = "", collectionSlug = "" } = useLocationContext().query;

	return (
		<div className={styles.create}>
			<div className={styles.sectionHeader}>
				<div className={styles.number}>1</div>
				<div className={styles.title}>Select File to Upload</div>
			</div>
			<div className={classNames(styles.sectionContent, styles.sectionOne)}>
				<DataUpload
					onComplete={({ url: _url, bytes }) => {
						fetch("/api/collection", {
							method: "PATCH",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								...collection,
								version: getNextVersion(collection.version || ""),
								publishedAt: new Date(),
								publishedDataSize: bytes,
							}),
						});
					}}
					fullSlug={`${namespaceSlug}/${collectionSlug}`}
					version={collection.version || ""}
				/>
			</div>
			<div className={styles.sectionHeader}>
				<div className={styles.number}>2</div>
				<div className={styles.title}>Align Data to Schema</div>
			</div>
			<div className={classNames(styles.sectionContent)}>
				We'll do some alignment UI here.
			</div>

			<div className={styles.sectionHeader}>
				<div className={styles.number}>3</div>
				<div className={styles.title}>Publish New Version</div>
			</div>
			<div className={classNames(styles.sectionContent)}>
				<p>Publish the next version of the dataset.</p>
				<Button
					style={{ marginTop: "10px" }}
					intent={Intent.SUCCESS}
					text={"Publishing version " + getNextVersion(collection.version!)}
					onClick={uploadData}
					loading={isUploading}
				/>
			</div>
		</div>
	);
};

export default DataUploadDialog;
