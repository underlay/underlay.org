import crypto from "crypto";
import { APIRoute } from "next-s3-upload";

import { isProdData } from "utils/shared/environment";

export default APIRoute.configure({
	key(_req, filename) {
		const extension = filename.split(".").pop();
		const extensionDot = extension ? "." : "";
		const foldName = isProdData() ? "user-uploads" : "dev-user-uploads";
		return `${foldName}/${crypto.randomBytes(16).toString("hex")}${extensionDot}${extension}`;
	},
});
