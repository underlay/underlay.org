export default (sequelize, dataTypes) => {
	return sequelize.define(
		'User',
		{
			id: sequelize.idType,
			slug: { ...sequelize.slugType },
			fullName: { type: dataTypes.TEXT, allowNull: false },
			avatar: { type: dataTypes.TEXT },
		},
		{
			classMethods: {
				associate: (models) => {
					const { Discussion, User, Package } = models;
					User.hasMany(Discussion, {
						as: 'discussions',
						foreignKey: 'userId',
					});
					User.hasMany(Package, {
						as: 'packages',
						foreignKey: 'userId',
					});
				},
			},
		},
	);
};
