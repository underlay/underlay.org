import { Button } from "@blueprintjs/core";
import React, { useState, useRef, useEffect } from "react";
import { humanFileSize } from "utils/shared/filesize";

import styles from "./DataUpload.module.scss";

type Props = {
	initFile?: File;
	onFileChange: (file: File) => any;
	fullSlug: string;
	buttonText?: string;
	// version: string;
};

const DataUpload: React.FC<Props> = function ({
	initFile,
	onFileChange,
	buttonText = "Select File",
}) {
	const [fileInfo, setFileInfo] = useState("No file selected");
	useEffect(() => {
		if (initFile) {
			const readableFileSize = humanFileSize(initFile.size);
			setFileInfo(`${initFile.name} ${readableFileSize}`);
		}
	}, []);
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
		onFileChange(uploadedFile);
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
		</div>
	);
};

export default DataUpload;
