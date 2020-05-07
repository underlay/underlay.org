/* eslint-disable global-require */
import Sequelize from 'sequelize';

if (process.env.NODE_ENV !== 'production') {
	require('./config.js');
}

const useSSL = process.env.DATABASE_URL.indexOf('localhost') === -1;
export const sequelize = new Sequelize(process.env.DATABASE_URL, {
	logging: false,
	dialectOptions: { ssl: useSSL ? { rejectUnauthorized: false } : false },
	pool: {
		max: process.env.SEQUELIZE_MAX_CONNECTIONS
			? parseInt(process.env.SEQUELIZE_MAX_CONNECTIONS, 10)
			: 5, // Some migrations require this number to be 150
		// idle: 20000,
		// acquire: 20000,
	},
});

/* Change to true to update the model in the database. */
/* NOTE: This being set to true will erase your data. */
if (process.env.NODE_ENV !== 'test') {
	sequelize.sync({ force: false });
}

/* Create standard id type for our database */
sequelize.idType = {
	primaryKey: true,
	type: Sequelize.UUID,
	defaultValue: Sequelize.UUIDV4,
};
sequelize.slugType = {
	type: Sequelize.TEXT,
	unique: true,
	allowNull: false,
	validate: {
		isLowercase: true,
		len: [1, 280],
		is: /^[a-zA-Z0-9-]+$/, // Must contain at least one letter. Can have alphanumeric and hyphens
	},
};

/* Import and create all models. */
/* Also export them to make them available to other modules */
export const Discussion = sequelize.import('./discussion/model.js');
export const Organization = sequelize.import('./organization/model.js');
export const User = sequelize.import('./user/model.js');
export const Package = sequelize.import('./package/model.js');
export const Member = sequelize.import('./member/model.js');
export const Assertion = sequelize.import('./assertion/model.js');

/* Create associations for models that have associate function */
Object.values(sequelize.models).forEach((model) => {
	const classMethods = model.options.classMethods || {};
	if (classMethods.associate) {
		classMethods.associate(sequelize.models);
	}
});
