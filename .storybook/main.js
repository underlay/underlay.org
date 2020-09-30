const { resolve } = require("path");

module.exports = {
	stories: ["../components/**/*.stories.tsx", "../pages/**/*.stories.tsx"],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		{
			name: "@storybook/preset-scss",
			options: {
				cssLoaderOptions: {
					modules: { auto: true },
				},
			},
		},
	],
	webpackFinal: (config) => {
		config.resolve.alias["components"] = resolve(__dirname, "../components");
		config.resolve.alias["pages"] = resolve(__dirname, "../pages");
		config.resolve.alias["utils"] = resolve(__dirname, "../utils");
		return config;
	},
};
