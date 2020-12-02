const { createServer } = require("http");
const { parse } = require("url");
const fs = require("fs");
const path = require("path");

const semverValid = require("semver/functions/valid");

const next = require("next");

const { PrismaClient } = require("@prisma/client");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const prisma = new PrismaClient();

const port = parseInt(process.env.PORT) || 3000;

// This is a set of top-level page routes *other* than the resource pages
// (ie everything except schemas and collections and their versions)
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

const findResource = (profileSlug, contentSlug) => ({
	slug: contentSlug,
	agent: {
		OR: [{ user: { slug: profileSlug } }, { organization: { slug: profileSlug } }],
	},
});

// type: "user" | "organization" | "schema" | "schemaVersion" | "collection" | "collectionVersion"
// query: ParsedUrlQuery
function render(req, res, type, id, query) {
	if (typeof query.mode === "string") {
		if (typeof query.submode === "string") {
			const route = `/resource/${type}/${id}/${query.mode}/${query.submode}`;
			app.render(req, res, route, query);
		} else {
			const route = `/resource/${type}/${id}/${query.mode}`;
			app.render(req, res, route, query);
		}
	} else {
		const route = `/resource/${type}/${id}`;
		app.render(req, res, route, query);
	}
}

app.prepare().then(() => {
	createServer(async (req, res) => {
		// Be sure to pass `true` as the second argument to `url.parse`.
		// This tells it to parse the query portion of the URL.
		const parsedUrl = parse(req.url, true);
		const { pathname, query } = parsedUrl;

		// The leading slash is always present
		const components = pathname.split("/").slice(1);

		if (pathname === "/" || components.length === 0) {
			return handle(req, res, parsedUrl);
		} else if (topLevelRoutes.has(components[0])) {
			return handle(req, res, parsedUrl);
		} else if (components.length === 1) {
			const [profileSlug] = components;

			const profileQuery = {
				where: { slug: profileSlug },
				select: { id: true },
			};

			const [user, organization] = await Promise.all([
				prisma.user.findUnique(profileQuery),
				prisma.organization.findUnique(profileQuery),
			]);

			if (user !== null) {
				render(req, res, "user", user.id, query);
			} else if (organization !== null) {
				render(req, res, "organization", organization.id, query);
			} else {
				app.render(req, res, "/404", query);
			}
		} else if (components.length === 2) {
			const [profileSlug, contentSlug] = components;

			const contentQuery = {
				where: findResource(profileSlug, contentSlug),
				select: { id: true },
			};

			const [schema, collection] = await Promise.all([
				prisma.schema.findFirst(contentQuery),
				prisma.collection.findFirst(contentQuery),
			]);

			if (schema !== null) {
				render(req, res, "schema", schema.id, query);
			} else if (collection !== null) {
				render(req, res, "collection", collection.id, query);
			} else {
				app.render(req, res, "/404", query);
			}
		} else if (components.length === 3) {
			const [profileSlug, contentSlug, versionNumber] = components;
			if (semverValid(versionNumber) === null) {
				return app.render(req, res, "/404", query);
			}

			const [schemaVersion, collectionVersion] = await Promise.all([
				prisma.schemaVersion.findFirst({
					where: {
						versionNumber: versionNumber,
						schema: findResource(profileSlug, contentSlug),
					},
					select: { id: true },
				}),
				prisma.collectionVersion.findFirst({
					where: {
						versionNumber: versionNumber,
						collection: findResource(profileSlug, contentSlug),
					},
					select: { id: true },
				}),
			]);

			if (schemaVersion !== null) {
				render(req, res, "schemaVersion", schemaVersion.id, query);
			} else if (collectionVersion !== null) {
				render(req, res, "collectionVersion", collectionVersion.id, query);
			} else {
				app.render(req, res, "/404", query);
			}
		} else {
			app.render(req, res, "/404", query);
		}
	}).listen(port, (err) => {
		if (err) throw err;
		console.log(`> Ready on http://localhost:${port}`);
	});
});
