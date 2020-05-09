/* This folder sets up the tools infrastructure */
/* Commands below can be run with: `npm run tools <command_name> */
/* This is additionally helpful because it allows heroku one-off */
/* dynos to be run: `heroku run --size=performance-l "npm run tools <command>"` */

/* eslint-disable global-require */
if (process.env.NODE_ENV !== 'production') {
	require('server/config.js');
}

require('@babel/register');
require('server/utils/serverModuleOverwrite');

const command = process.argv[2];
const commandFiles = {
	fillDemo: './fillDemo.js',
};

const activeCommandFile = commandFiles[command];
if (activeCommandFile) {
	/* eslint-disable-next-line import/no-dynamic-require */
	require(activeCommandFile);
} else {
	console.warn(`Invalid command: "${command}"`);
}
