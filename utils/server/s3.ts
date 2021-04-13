import { S3Client } from "@aws-sdk/client-s3";

export const bucket = process.env.AWS_S3_BUCKET!;
export const region = process.env.AWS_S3_REGION!;
export const service = "s3";
export const request = "aws4_request";

if (bucket === undefined || region === undefined) {
	throw new Error("Missing AWS S3 Bucket environment variables");
}

export const S3 = new S3Client({ region });
