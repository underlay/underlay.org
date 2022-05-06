// @ts-nocheck
import nextConnect from "next-connect";
// import auth from "utils/server/auth/middleware";
import prisma from "prisma/db";
import crypto from "crypto";

export default nextConnect()
	// .use(auth)
	.get(async (req, res) => {
		// const namespace = await prisma.namespace.create({
		// 	data: {
		// 		slug: "test",
		// 	},
		// });
		// const user = await prisma.user.create({
		// 	data: {
		// 		namespaceId: namespace.id,
		// 		email: "test@test.com",
		// 		name: "Alex Test",
		// 	},
		// });

		// const salt = crypto.randomBytes(16).toString("hex");
		// const hash = crypto.pbkdf2Sync("password", salt, 1000, 64, "sha512").toString("hex");
		// const user = await prisma.user.create({
		// 	data: {
		// 		slug: `funky${Math.random()}`,
		// 		email: `funky@funk.com${Math.random()}`,
		// 		name: `Funky McFlash${Math.random()}`,
		// 		hash: hash,
		// 		salt: salt,
		// 		signupToken: crypto.randomBytes(16).toString("hex"),
		// 		signupEmailCount: 1,
		// 	},
		// });
		// const community = await prisma.community.create({
		// 	data: {
		// 		slug: `emerson${Math.random()}`,
		// 		name: `Emerson${Math.random()}`,
		// 	},
		// });
		// const communityMember = await prisma.communityMember.create({
		// 	data: {
		// 		communityId: community.id,
		// 		userId: user.id,
		// 		permission: "owner",
		// 	},
		// });

		// const user = await prisma.user.findUnique({
		// 	where: {
		// 		id: "ccf6e56b-0fe4-49d6-8ae4-8f8aab3d7545",
		// 	},
		// 	include: {
		// 		communities: { include: { community: true } },
		// 	},
		// });

		// const userData = [
		// 	{
		// 		slug: "beverley",
		// 		name: "Beverley Anderson",
		// 		email: "a@email.com",
		// 		avatar: "https://randomuser.me/api/portraits/women/24.jpg",
		// 		collections: [
		// 			{
		// 				slug: "blog-data",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: ["blogging", "personal-graph"],
		// 			},
		// 			{
		// 				slug: "rootstock",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: ["reactjs"],
		// 			},
		// 		],
		// 	},
		// 	{
		// 		slug: "carmen",
		// 		name: "Carmen Peterson",
		// 		email: "c@email.com",
		// 		avatar: "https://randomuser.me/api/portraits/women/44.jpg",
		// 		collections: [
		// 			{
		// 				slug: "prisma",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "swr-site",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 		],
		// 	},
		// 	{
		// 		slug: "eva",
		// 		name: "Eva Duncan",
		// 		email: "eva@email.com",
		// 		avatar: "https://randomuser.me/api/portraits/women/52.jpg",
		// 		collections: [
		// 			{
		// 				slug: "next-iron-corpus",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "previous-iron-corpus",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "family-encyclopedia",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "family-geo",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 		],
		// 	},
		// 	{
		// 		slug: "jerry",
		// 		name: "Jerry Austin",
		// 		email: "jerry@email.com",
		// 		avatar: "https://randomuser.me/api/portraits/men/12.jpg",
		// 		collections: [
		// 			{
		// 				slug: "covid-19-indea",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "rsna-miccai",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 		],
		// 	},
		// 	{
		// 		slug: "alice",
		// 		name: "Alice Owens",
		// 		email: "alice@email.com",
		// 		avatar: "https://randomuser.me/api/portraits/women/39.jpg",
		// 		collections: [
		// 			{
		// 				slug: "spotify-top-charts",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "spotify-personal-charts",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "spotify-play-dynamics",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "music-genres",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 		],
		// 	},
		// 	{
		// 		slug: "erik",
		// 		name: "Erik Spencer",
		// 		email: "erik@email.com",
		// 		avatar: "https://randomuser.me/api/portraits/men/4.jpg",
		// 		collections: [
		// 			{
		// 				slug: "university-archives",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "phd-data-sourcing",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 		],
		// 	},
		// 	{
		// 		slug: "rafael",
		// 		name: "Rafael Hunter",
		// 		email: "rag@email.com",
		// 		avatar: "https://randomuser.me/api/portraits/men/50.jpg",
		// 		collections: [
		// 			{
		// 				slug: "nfl-helmet-assignment",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "pytorch-cuda-toolkit",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "nfl-helmet-testing",
		// 				permission: "private",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "open-pytorch-cuda-toolkit",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 		],
		// 	},
		// 	{
		// 		slug: "zoey",
		// 		name: "Zoey Lawson",
		// 		email: "zoey@email.com",
		// 		avatar: "https://randomuser.me/api/portraits/women/30.jpg",
		// 		collections: [
		// 			{
		// 				slug: "twitter-sentiment-analysis",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "mba-admissions",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "college-tracking",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 		],
		// 	},
		// 	{
		// 		slug: "louis",
		// 		name: "Louis Smith",
		// 		email: "louis@email.com",
		// 		avatar: "https://randomuser.me/api/portraits/men/39.jpg",
		// 		collections: [
		// 			{
		// 				slug: "bc200c-lego-classification",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 		],
		// 	},
		// 	{
		// 		slug: "eli",
		// 		name: "Eli Grant",
		// 		email: "eli@email.com",
		// 		avatar: "https://randomuser.me/api/portraits/men/95.jpg",
		// 		collections: [
		// 			{
		// 				slug: "prediction-markets",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "olympics-training",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "toky-2021-results",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 		],
		// 	},
		// ];
		// const madeUsers = await Promise.all(
		// 	userData.map((item) => {
		// 		return prisma.user.create({
		// 			data: {
		// 				name: item.name,
		// 				email: item.email,
		// 				avatar: item.avatar,
		// 				hash: "a",
		// 				salt: "a",
		// 				signupToken: item.slug,
		// 				signupEmailCount: 1,
		// 				profile: {
		// 					create: {
		// 						slug: item.slug,
		// 					},
		// 				},
		// 				collections: {
		// 					create: item.collections,
		// 				},
		// 			},
		// 		});
		// 	})
		// );

		// const users = await prisma.user.findMany({ select: { id: true } });

		// const communityData = [
		// 	{
		// 		name: "Wikimedia",
		// 		slug: "wikimedia",
		// 		members: [0, 1, 2, 3, 4, 5],
		// 		avatar: "https://s3.amazonaws.com/assets.underlay.org/dev-user-uploads/e01bd4861a76abb3eb9099d628271810.png",
		// 		description:
		// 			"The Wikimedia movement, or simply Wikimedia, is the global community of contributors to Wikimedia Foundation projects.",
		// 		verifiedUrl: "wikimedia.org",
		// 		location: "",
		// 		collections: [
		// 			{
		// 				slug: "citation-graph",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "wikipedia-article-list",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "wikimedia-contribution-graph",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "wikimania-geo",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 		],
		// 	},
		// 	{
		// 		name: "Consumer Reports",
		// 		slug: "consumer-reports",
		// 		members: [0, 2, 4, 5, 8],
		// 		avatar: "https://s3.amazonaws.com/assets.underlay.org/dev-user-uploads/b2f5e0799116706246d40c0cee2a202d.png",
		// 		description:
		// 			"Consumer Reports is an independent, nonprofit member organization that works side by side with consumers for truth, transparency, and fairness in the marketplace.",
		// 		verifiedUrl: "consumerreports.org",
		// 		location: "",
		// 		collections: [
		// 			{
		// 				slug: "smart-tv-digital-standard-testing",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "p2p-payments",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "connected-cameras",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "medical-bills",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 		],
		// 	},
		// 	{
		// 		name: "The MIT Press",
		// 		slug: "mitp",
		// 		members: [1, 3, 5, 7, 9],
		// 		avatar: "https://s3.amazonaws.com/assets.underlay.org/dev-user-uploads/963f3bd840954f63f2257dea0446286e.png",
		// 		description:
		// 			"Established in 1962, the MIT Press is one of the largest and most distinguished university presses in the world and a leading publisher of books and journals at the intersection of science, technology, art, social science, and design. ",
		// 		verifiedUrl: "mitpress.mit.edu",
		// 		location: "Cambridge, MA",
		// 		collections: [
		// 			{
		// 				slug: "academic-publications",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "mitp-open-access",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "oa-policy-map",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "reviewer-networks",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 		],
		// 	},
		// 	{
		// 		name: "Emerson Collective",
		// 		slug: "emerson",
		// 		members: [5, 6, 7, 8, 9],
		// 		avatar: "https://s3.amazonaws.com/assets.underlay.org/dev-user-uploads/080f09beb5e214b30a5d39d719b12189.png",
		// 		description:
		// 			"Emerson Collective deploys a wide range of tools—from impact investing to philanthropy to advocacy—in pursuit of a more equal and just America. We focus on creating systemic change in education, immigration, climate, and cancer research and treatment.",
		// 		verifiedUrl: "emersoncollective.com",
		// 		location: "",
		// 		collections: [
		// 			{
		// 				slug: "us-food-pantry-registry",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "immigration-bill-statuses",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "daca-decisions",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 		],
		// 	},
		// 	{
		// 		name: "Siri Team",
		// 		slug: "siri",
		// 		members: [2, 5, 7, 6, 8],
		// 		avatar: "https://s3.amazonaws.com/assets.underlay.org/dev-user-uploads/7d369fe92107e377e5b0ca68264faf11.png",
		// 		description: "The data team behind Siri, Apples virutal assistant.",
		// 		verifiedUrl: "apple.com",
		// 		location: "Cupertino, CA",
		// 		collections: [
		// 			{
		// 				slug: "food-substitutions",
		// 				permission: "public",
		// 				readme: "# Food Substitutions \n A catalog of various substitutions for various dietary constraints.",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "vegetarian-replacements",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 			{
		// 				slug: "pescetarian-mapping",
		// 				permission: "public",
		// 				readme: "",
		// 				labels: [],
		// 			},
		// 		],
		// 	},
		// ];
		// const communities = await Promise.all(
		// 	communityData.map((item) => {
		// 		return prisma.community.create({
		// 			data: {
		// 				name: item.name,
		// 				description: item.description,
		// 				avatar: item.avatar,
		// 				location: item.location,
		// 				verifiedUrl: item.verifiedUrl,
		// 				profile: {
		// 					create: {
		// 						slug: item.slug,
		// 					},
		// 				},
		// 				members: {
		// 					createMany: {
		// 						data: item.members.map((mem) => {
		// 							return { userId: users[mem].id, permission: "admin" };
		// 						}),
		// 					},
		// 				},
		// 				collections: {
		// 					create: item.collections,
		// 				},
		// 			},
		// 		});
		// 	})
		// );

		//@ts-ignore
		return res.status(200).json({ ok: true });
	});
