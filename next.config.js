const { withSuperjson } = require("next-superjson");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer(
	withSuperjson()({
		reactStrictMode: process.env.ANALYZE === "true",
	})
);
