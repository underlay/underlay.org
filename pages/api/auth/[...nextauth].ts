import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions, Session, User as NextAuthUser } from "next-auth";

import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import nodemailer from "nodemailer";
import stripIndent from "strip-indent";

import { prisma } from "utils/server/prisma";

declare module "next-auth" {
	interface User {
		id: string;
		slug: string | null;
		avatar: string | null;
	}
	interface Session {
		user: User;
	}
}

const options: NextAuthOptions = {
	// Configure one or more authentication providers
	providers: [
		Providers.Email({
			server: process.env.EMAIL_SERVER,
			from: process.env.EMAIL_FROM,
			sendVerificationRequest: ({ identifier: email, url, provider }) =>
				new Promise((resolve, reject) => {
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
				}),
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
		async session(session: Session, userOrToken) {
			if (userOrToken) {
				const { id, slug, name, email, avatar } = userOrToken as NextAuthUser;
				return { ...session, user: { id, slug, name, email, avatar } };
			} else {
				return { ...session };
			}
		},
	},
	events: {
		async createUser({ id }: NextAuthUser) {
			await prisma.agent.create({ data: { user: { connect: { id } } } });
		},
	},
};

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);
