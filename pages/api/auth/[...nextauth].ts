import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { InitOptions } from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import { PrismaClient, User } from "@prisma/client";
import nodemailer from "nodemailer";
import stripIndent from "strip-indent";
import { SessionUser } from "utils/shared/session";

const prisma = new PrismaClient();
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
		session: async (session, user: User) => {
			if (user !== null) {
				const { id, name, email } = user;
				const agent = await prisma.agent.findFirst({ where: { userId: user.id } });
				// If there's no agent we act like there's no user --
				// there's probably a better way to handle this specific scenario
				if (agent !== null) {
					const sessionUser: SessionUser = {
						id,
						name,
						email,
						slug: user.slug,
						avatar: user.avatar,
						agentId: agent.id,
					};
					return { ...session, user: sessionUser };
				}
			}
			return { ...session, user: null };
		},
	},
	events: {
		createUser: async (user: User) => {
			// Create the user agent
			await prisma.agent.create({
				data: { user: { connect: { id: user.id } } },
			});
		},
	},
};

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);
