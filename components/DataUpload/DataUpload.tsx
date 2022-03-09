import { Button } from "@blueprintjs/core";
import React, { useState, useRef } from "react";
import { uploadData } from "utils/client/data";
import { getNextVersion } from "utils/shared/version";

import styles from "./DataUpload.module.scss";

type Props = {
	onComplete: (url: string) => any;
	fullSlug: string;
	buttonText?: string;
	version: string;
};

const DataUpload: React.FC<Props> = function ({
	onComplete,
	fullSlug,
	buttonText = "Select File",
	version,
}) {
	const [saving, setSaving] = useState(false);
	const [fileName, setFilename] = useState("No file selected");
	const [uploadStatus, setUplodStatus] = useState("");

	const hiddenFileInput = useRef(null);

	/* Programatically click the hidden file input element */
	/* when the Button component is clicked */
	const handleClick = () => {
		// @ts-ignore
		hiddenFileInput.current.click();
	};

	const handleChange = async (evt: any) => {
		const uploadedFile = evt.target.files[0];

		setFilename(uploadedFile.name);
	};
	const handleSave = async () => {
		setSaving(true);
		setUplodStatus("Uploading");

		// @ts-ignore
		const file = hiddenFileInput.current.files[0];

		const url = await uploadData(file, fullSlug + ".csv", getNextVersion(version));

		setSaving(false);
		setUplodStatus("Uploaded");

		onComplete(url!);
		onComplete("test");
	};

	return (
		<div>
			<div className={styles.uploadRow}>
				<Button onClick={handleClick} outlined text={buttonText} />
				<span className={styles.message}>{fileName}</span>
				<input
					id="dataInput"
					type="file"
					ref={hiddenFileInput}
					onChange={handleChange}
					style={{ display: "none" }}
				/>
			</div>
			<div className={styles.uploadRow}>
				<Button text="Upload" onClick={handleSave} loading={saving} />
				<span className={styles.message}>{uploadStatus}</span>
			</div>
		</div>
	);
};

export default DataUpload;
