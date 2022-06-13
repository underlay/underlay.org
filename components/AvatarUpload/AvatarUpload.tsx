import { Button, Dialog, Slider } from "@blueprintjs/core";
import React, { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";

import { getCroppedImg, uploadAvatar } from "utils/client/avatar";

import styles from "./AvatarUpload.module.scss";

const readFile = (file: File) => {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.addEventListener("load", () => resolve(reader.result), false);
		reader.readAsDataURL(file);
	});
};

type Props = {
	onComplete: any;
	buttonText?: string;
};

const AvatarUpload: React.FC<Props> = function ({ onComplete, buttonText = "Set Profile Photo" }) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [saving, setSaving] = useState(false);
	const [dialogFinishedOpen, setDialogFinishedOpen] = useState(false);
	const [imageSrc, setImageSrc] = React.useState("");
	const [zoom, setZoom] = useState(1.25);
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({
		width: 0,
		height: 0,
		x: 0,
		y: 0,
	});
	const onCropChange = useCallback((crop: any) => {
		setCrop(crop);
	}, []);
	const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
		setCroppedAreaPixels(croppedAreaPixels);
	}, []);
	const hiddenFileInput = useRef(null);

	/* Programatically click the hidden file input element */
	/* when the Button component is clicked */
	const handleClick = () => {
		// @ts-ignore
		hiddenFileInput.current.click();
	};

	const handleChange = async (evt: any) => {
		const uploadedFile = evt.target.files[0];
		const imageDataUrl = await readFile(uploadedFile);

		// @ts-ignore
		setImageSrc(imageDataUrl);
		setDialogOpen(true);
	};
	const handleSave = async () => {
		setSaving(true);
		const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
		if (croppedImageBlob) {
			const publicUrl = await uploadAvatar(croppedImageBlob);
			onComplete(publicUrl);
		}
		setSaving(false);
		setDialogOpen(false);
	};

	return (
		<div>
			<Button onClick={handleClick} outlined text={buttonText} />
			<input
				type="file"
				ref={hiddenFileInput}
				onChange={handleChange}
				style={{ display: "none" }}
			/>
			<Dialog
				className={styles.dialog}
				isOpen={dialogOpen}
				onClose={() => {
					setDialogOpen(false);
					setDialogFinishedOpen(false);
				}}
				onOpened={() => {
					setDialogFinishedOpen(true);
				}}
			>
				<div className={styles.cropContainer}>
					{dialogFinishedOpen && (
						<Cropper
							image={imageSrc}
							crop={crop}
							zoom={zoom}
							aspect={1}
							cropShape="rect"
							onCropChange={onCropChange}
							onZoomChange={setZoom}
							onCropComplete={onCropComplete}
						/>
					)}
				</div>
				<div className={styles.controls}>
					<div className={styles.slider}>
						<Slider
							value={zoom}
							min={1}
							max={5}
							stepSize={0.1}
							labelRenderer={false}
							aria-labelledby="Zoom"
							onChange={(value: number) => {
								setZoom(value);
							}}
						/>
					</div>
					<div className={styles.buttonWrapper}>
						<Button text="Save" onClick={handleSave} loading={saving} />
					</div>
				</div>
			</Dialog>
		</div>
	);
};

export default AvatarUpload;
