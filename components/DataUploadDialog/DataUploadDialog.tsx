import React from "react";
import { Button, Intent } from "@blueprintjs/core";
import classNames from "classnames";

// import { getNextVersion } from "utils/shared/version";

import styles from "./DataUploadDialog.module.scss";

type Props = {
	newUpload: any;
	setNewUpload: any;
	schema: any;
	uploadData: any;
	isUploading: boolean;
};

const DataUploadDialog: React.FC<Props> = function ({
	// newUpload,
	// setNewUpload,
	// schema,
	uploadData,
	isUploading,
}) {
	return (
		<div className={styles.create}>
			<div className={styles.sectionHeader}>
				<div className={styles.number}>1</div>
				<div className={styles.title}>Select File to Upload</div>
			</div>
			<div className={classNames(styles.sectionContent, styles.sectionOne)}>
				<div>Put upload components here.</div>
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
				<p>
					Description about publishing goes here. We can explain versions, how data is
					overwritten, etc.
				</p>
				<Button
					style={{ marginTop: "10px" }}
					intent={Intent.SUCCESS}
					text="Publish Version getNextVersion"
					onClick={uploadData}
					loading={isUploading}
				/>
			</div>
		</div>
	);
};

export default DataUploadDialog;
