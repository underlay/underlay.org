module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	verbose: true,
	automock: true,
	globals: {
		"ts-jest": {
			isolatedModules: true,
		},
	},
};
