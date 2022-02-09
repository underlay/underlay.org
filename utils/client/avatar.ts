import { supabase } from "utils/client/supabase";
import { Area } from "react-easy-crop/types";

export const uploadAvatar = async (file: File | Blob) => {
	const fileExt = "jpg";
	const fileName = `${Math.random().toString(16).substr(2, 8)}.${fileExt}`;
	const filePath = `${fileName}`;

	let { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);
	if (uploadError) {
		throw uploadError;
	}
	const { publicURL, error: urlError } = supabase.storage.from("avatars").getPublicUrl(filePath);
	if (urlError) {
		throw urlError;
	}
	return publicURL;
};

export const createImage = (url: string): Promise<HTMLImageElement> => {
	return new Promise((resolve, reject) => {
		const image = new Image(500, 500);
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", (error) => reject(error));
		image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
		image.src = url;
	});
};
export const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob | null> => {
	const imageSize = 500;
	const image: HTMLImageElement = await createImage(imageSrc);
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		return null;
	}

	// set canvas size to match the bounding box
	canvas.width = image.width;
	canvas.height = image.height;

	ctx.drawImage(
		image,
		pixelCrop.x,
		pixelCrop.y,
		pixelCrop.width,
		pixelCrop.height,
		0,
		0,
		imageSize,
		imageSize
	);
	return new Promise((resolve) => {
		canvas.toBlob((file) => {
			resolve(file);
		}, "image/jpeg");
	});
};

/* 
Supabase policy
(bucket_id = 'avatars'::text)
*/
