module.exports = {
	async rewrites() {
		/*
		The collectionSlug and profile/mode paths are ambiguous. For example, 
		in a url like 'underlay.org/myorg/updates' the router doesn't know whether 
		'updates' is a collectionSlug or a mode variable. To handle this, we
		explicitly rewrite the profile-level mode and submode paths to 
		hit a different page path. The parentheses after `:mode` hold regex
		containing all possible :mode values. 
		https://nextjs.org/docs/api-reference/next.config.js/rewrites
		*/
		const modes = [
			"overview",
			"assertions",
		];
		return [
			{
				source: `/:profileSlug/:mode(${modes.join('|')})`,
				destination: "/:profileSlug/modes/:mode",
			},
			{
				source: `/:profileSlug/:mode(${modes.join('|')})/:submode`,
				destination: "/:profileSlug/modes/:mode/:submode",
			},
		];
	},
};
