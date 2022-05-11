module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	verbose: true,
	modulePaths: ["."],
	globals: {
		"ts-jest": {
			isolatedModules: true,
		},
	},
};
