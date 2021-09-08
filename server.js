const { createServer } = require("http");
const { parse } = require("url");
const fs = require("fs");
const path = require("path");
const next = require("next");
const { PrismaClient } = require("@prisma/client");

const { setEnvironment, setAppCommit } = require("./utils/shared/environment");

/* ACHTUNG: These calls must appear before we import any more of our own code to ensure that */
/* the environment, and in particular the choice of dev vs. prod, is configured correctly! */
/* ------------------------------------------- */
setEnvironment(process.env.R1_PRODUCTION);
setAppCommit(process.env.HEROKU_SLUG_COMMIT);
/* ------------------------------------------- */

const isLocalhost = process.env.NODE_ENV !== "production";
const app = next({ dev: isLocalhost });
const handle = app.getRequestHandler();
const prisma = new PrismaClient();
const port = parseInt(process.env.PORT) || 3000;

/* Generate a set of all top-level page routes *other* than the resource pages */
const topLevelRoutes = new Set(["_next"]);
const pageFilePattern = /^([a-zA-Z0-9]+)\.tsx$/;
for (const name of fs.readdirSync(path.resolve(__dirname, "pages"))) {
	const stat = fs.lstatSync(path.resolve(__dirname, "pages", name));
	if (stat.isDirectory()) {
		topLevelRoutes.add(name);
	} else if (stat.isFile() && pageFilePattern.test(name)) {
		const [_, fileName] = pageFilePattern.exec(name);
		topLevelRoutes.add(fileName);
	}
}
for (const name of fs.readdirSync(path.resolve(__dirname, "public"))) {
	topLevelRoutes.add(name);
}
topLevelRoutes.delete("resource");
topLevelRoutes.delete("index");

app.prepare().then(() => {
	createServer(async (req, res) => {
		/* Be sure to pass `true` as the second argument to `url.parse`. */
		/* This tells it to parse the query portion of the URL. */
		const parsedUrl = parse(req.url, true);
		const { pathname, query } = parsedUrl;

		/* Split out components and filter empty strings which */
		/* will be present due to leading and trailing slashes */
		const components = pathname.split("/").filter((x) => x);

		if (components.length === 0 || topLevelRoutes.has(components[0])) {
			handle(req, res, parsedUrl);
		} else {
			/* If we're here, the path is either a profile, collection, or 404 */
			/* So first, check if profile is valid. If not found, it's 404 */
			const profile = await prisma.profile.findFirst({
				where: { slug: components[0] },
				include: {
					user: true,
					community: true,
				},
			});
			if (!profile) {
				return app.render(req, res, "/404", query);
			}

			/* If we have a profile, first check if we also have a valid collectionSlug  */
			/* We need to check that we have a collection with valid slug that matches the profile slug */
			const profileType = profile.user ? "user" : "community";
			const profileId = profile[profileType].id;
			const collection = components[1]
				? await prisma.collection.findFirst({
						where: {
							slug: components[1],
							[profileType]: { some: { id: profileId } },
						},
				  })
				: undefined;
			/* If we have a valid collection, route to that resource otherwise, */
			/* route to the correct profile resource (e.g. user or community). */
			/* For cases such as /valid-profile/neither-collection-nor-mode,  */
			/* allow normal routing or getServersideProps to generate 404. */
			const route = collection
				? `/resource/collection/${collection.id}/${components.slice(2).join("/")}`
				: `/resource/${profileType}/${profileId}/${components.slice(1).join("/")}`;
			app.render(req, res, route, {
				...query,
				profileSlug: profile.slug,
				collectionSlug: collection?.slug,
			});
		}
	}).listen(port, (err) => {
		if (err) throw err;
		console.log(`Running server on 0.0.0.0:${port}, url: http://localhost:${port}`);
	});
});
