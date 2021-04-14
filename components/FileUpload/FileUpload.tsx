import { Button, DocumentIcon, FilePicker, majorScale, Pane, toaster } from "evergreen-ui";
import React, { memo, useCallback, useState } from "react";
import { usePageContext, useStateRef } from "utils/client/hooks";
import { getProxyURL, upload } from "utils/client/upload";

export interface FileUploadProps {
	uri: null | string;
	onUpload: (uri: string, file: File) => void;
	onReset: () => void;
}

const FileUpload: React.FC<FileUploadProps> = (props: FileUploadProps) => {
	const { session } = usePageContext();

	const [file, setFile, fileRef] = useStateRef<File | null>(null);

	const handleFileChange = useCallback(([file]) => {
		if (file instanceof File) {
			setFile(file);
		} else {
			setFile(null);
		}
	}, []);

	const [saving, setSaving] = useState(false);

	const handleClick = useCallback(() => {
		if (session !== null && fileRef.current !== null) {
			const file = fileRef.current;
			setSaving(true);
			upload(session, file)
				.then((uri) => {
					setSaving(false);
					props.onUpload(uri, file);
				})
				.catch((err) => {
					setSaving(false);
					console.error(err);
					toaster.danger("File upload failed");
				});
		}
	}, []);

	if (props.uri === null) {
		return (
			<Pane display="flex">
				<FilePicker
					width={320}
					onChange={handleFileChange}
					placeholder="Select a CSV..."
					required={true}
				/>
				<Button
					marginX={majorScale(2)}
					onClick={handleClick}
					disabled={file === null}
					isLoading={saving}
					appearance="primary"
				>
					Upload
				</Button>
			</Pane>
		);
	} else {
		const name = props.uri.slice(props.uri.lastIndexOf("/") + 1);
		const url = getProxyURL(props.uri);
		return (
			<Pane display="flex" alignItems="center">
				<Button width={320} is="a" href={url} iconBefore={<DocumentIcon />}>
					{name}
				</Button>
				<Button marginX={majorScale(1)} intent="danger" onClick={props.onReset}>
					Replace
				</Button>
			</Pane>
		);
	}
};

export default memo(FileUpload);
