// next.config.js

// https://github.com/vercel/next.js/issues/706
const withTM = require("next-transpile-modules")([
	"react-dataflow-editor",
	"@underlay/apg",
	"@underlay/namespaces",
	"@underlay/pipeline",
	"@underlay/tasl-lezer",
]);

module.exports = withTM({
	future: {
		webpack5: true,
	},
});
