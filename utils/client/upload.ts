import { Buffer } from "buffer";

import type { Session } from "next-auth";

import api from "next-rest/client";

const S3URIPattern = /^s3:\/\/([a-z0-9\-\.]+)\/(.+)$/;
export function getProxyURL(uri: string) {
	const match = S3URIPattern.exec(uri);
	if (match !== null) {
		const [_, bucket, key] = match;
		return `/api/uploads?bucket=${bucket}&key=${key}`;
	}
	return uri;
}

export async function upload(session: Session, file: File) {
	const [{}, { key, bucket, policy, credential, signature, date }] = await api.get(
		"/api/user/[id]/upload/[filename]",
		{ id: session.user.id, filename: file.name },
		{},
		undefined
	);

	const formData = new FormData();

	formData.append("key", key);
	formData.append("acl", "private");
	formData.append("Content-Type", file.type);
	formData.append("success_action_status", "200");
	formData.append("X-Amz-Credential", credential);
	formData.append("X-Amz-Algorithm", "AWS4-HMAC-SHA256");
	formData.append("X-Amz-Date", `${date}T000000Z`);
	formData.append("Policy", Buffer.from(JSON.stringify(policy)).toString("base64"));
	formData.append("X-Amz-Signature", signature);
	formData.append("file", file);

	const res = await fetch(`https://${bucket}.s3.amazonaws.com/`, {
		method: "POST",
		body: formData,
	});

	if (res.status === 200) {
		return `s3://${bucket}/${key}`;
	} else {
		throw new Error(`Failed with status code ${res.status}`);
	}
}
