import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { InitOptions } from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import { User } from "@prisma/client";
import nodemailer from "nodemailer";
import stripIndent from "strip-indent";
import { SessionBase } from "next-auth/_utils";

import { prisma } from "utils/server/prisma";

import { ClientUser } from "utils/shared/session";

const options: InitOptions = {
	// Configure one or more authentication providers
	providers: [
		// Providers.GitHub({
		//   clientId: process.env.GITHUB_ID,
		//   clientSecret: process.env.GITHUB_SECRET
		// }),
		Providers.Email({
			server: process.env.EMAIL_SERVER,
			from: process.env.EMAIL_FROM,
			sendVerificationRequest: ({ identifier: email, url, provider }) => {
				return new Promise((resolve, reject) => {
					const { server, from } = provider;

					nodemailer.createTransport(server).sendMail(
						{
							to: email,
							from,
							subject: "Sign in to R1",
							text: stripIndent(`
								To sign in to R1 (r1.underlay.org) as ${email}, click the following link:
					
								${url}
					
								If you did not request this email you can safely ignore it.

								Sincerely,
								R1 Team
							`),
						},
						(error) => {
							if (error === null) {
								resolve();
							} else {
								// TODO: what's the right way to log errors?
								console.error(error);
								reject(new Error("SEND_VERIFICATION_EMAIL_ERROR"));
							}
						}
					);
				});
			},
		}),
	],
	secret: process.env.PRISMA_SECRET,
	database: process.env.DATABASE_URL,
	adapter: Adapters.Prisma.Adapter({
		prisma,
		modelMapping: {
			User: "user",
			Account: "account",
			Session: "session",
			VerificationRequest: "verificationRequest",
		},
	}),
	pages: {
		signIn: "/login",
		newUser: "/login",
		verifyRequest: "/login?requested=true",
	},
	callbacks: {
		session: async (session: SessionBase, user) => {
			if (user) {
				const { id, slug, name, email, avatar } = user as User;
				const clientUser: ClientUser = { id, slug, name, email, avatar };
				return { ...session, user: clientUser };
			} else {
				return session;
			}
		},
	},
	events: {
		createUser: async ({ id }: User) => {
			// Create the user agent
			await prisma.agent.create({ data: { user: { connect: { id } } } });
		},
	},
};

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);
