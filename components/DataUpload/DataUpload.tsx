import { Button } from "@blueprintjs/core";
import React, { useState, useRef } from "react";
import { uploadData } from "utils/client/data";
import { humanFileSize } from "utils/shared/filesize";
import { getNextVersion } from "utils/shared/version";

import styles from "./DataUpload.module.scss";

type Props = {
	onComplete: ({ url, bytes }: { url: string; bytes: number }) => any;
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
	const [fileInfo, setFileInfo] = useState("No file selected");
	const [uploadStatus, setUplodStatus] = useState("");

	const hiddenFileInput = useRef<HTMLInputElement>(null);

	/* Programatically click the hidden file input element */
	/* when the Button component is clicked */
	const handleClick = () => {
		hiddenFileInput.current!.click();
	};

	const handleChange = async (evt: any) => {
		const uploadedFile: File = evt.target.files[0];
		const readableFileSize = humanFileSize(uploadedFile.size);

		setFileInfo(`${uploadedFile.name} ${readableFileSize}`);
	};
	const handleSave = async () => {
		setSaving(true);
		setUplodStatus("Uploading");

		if (!hiddenFileInput.current!.files) {
			/**
			 * TODO: Handle error case here
			 */
			return;
		}
		const file = hiddenFileInput.current!.files[0];

		const url = await uploadData(file, fullSlug + ".csv", getNextVersion(version));

		setSaving(false);
		setUplodStatus("Uploaded");

		onComplete({
			url: url!,
			bytes: file.size,
		});
	};

	return (
		<div>
			<div className={styles.uploadRow}>
				<Button onClick={handleClick} outlined text={buttonText} />
				<span className={styles.message}>{fileInfo}</span>
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
