/* This file is a .js file that uses module.exports so that it can be called */
/* from the server.js file which is run without any babel or ts processing. */
let environment;
let appCommit;

const PRODUCTION = "using-prod-data";
const DEVELOPMENT = "using-dev-data";

const setEnvironment = (isProd) => {
	environment = isProd ? PRODUCTION : DEVELOPMENT;
};

const isProdData = () => {
	return environment === PRODUCTION;
};

const isDevData = () => {
	return environment === DEVELOPMENT;
};

const setAppCommit = (appCommitHash) => {
	appCommit = appCommitHash;
};
const getAppCommit = () => {
	return appCommit;
};

module.exports = {
	setEnvironment: setEnvironment,
	isProdData: isProdData,
	isDevData: isDevData,
	setAppCommit: setAppCommit,
	getAppCommit: getAppCommit,
};
