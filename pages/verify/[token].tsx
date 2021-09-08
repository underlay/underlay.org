import React from "react";
import { GetServerSideProps } from "next";
import prisma from "prisma/db";
// import { Button, Intent, FormGroup, InputGroup } from "@blueprintjs/core";

import { getLoginData } from "utils/server/auth/user";

type Props = {
	completed: boolean;
	slug: string;
};

const VerifyToken: React.FC<Props> = ({ completed, slug }) => {
	return (
		<div>
			{completed ? "True" : "false"}
			{completed ? <a href={`/${slug}`}>Go to Profile</a> : ""}
		</div>
	);
};

export default VerifyToken;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const loginData = await getLoginData(context.req);
	// @ts-ignore
	const { token } = context.params;
	const signupData = await prisma.user.findUnique({
		where: { signupToken: token },
		include: { profile: true },
	});
	const completedIsValid = !!signupData && signupData.id === loginData?.id;
	if (completedIsValid) {
		await prisma.user.updateMany({
			where: {
				signupToken: token,
				signupCompletedAt: null,
			},
			data: {
				signupCompletedAt: new Date(),
			},
		});
	}
	return {
		props: {
			completed: completedIsValid,
			slug: signupData?.profile.slug || null,
		},
	};
};

/* 
Enter details (give option for avatar, slug)
Hit signup
Takes you to profile page, where we show you validation link has been sent shrowded over hints at cool features that make validation worth while
Asks you to verify
Stick a banner if you haven't verified
Stick a button to resend verification

signupToken

User has temp email, token, button to renew
*/
