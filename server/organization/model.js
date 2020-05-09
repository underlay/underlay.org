export default (sequelize, dataTypes) => {
	return sequelize.define(
		'Organization',
		{
			id: sequelize.idType,
			slug: { ...sequelize.slugType },
			title: { type: dataTypes.TEXT, allowNull: false },
			avatar: { type: dataTypes.TEXT },
		},
		{
			classMethods: {
				associate: (models) => {
					const { Discussion, Organization, Member, Package } = models;
					Organization.hasMany(Member, {
						as: 'members',
						foreignKey: 'organizationId',
					});
					Organization.hasMany(Discussion, {
						as: 'discussions',
						foreignKey: 'organizationId',
					});
					Organization.hasMany(Package, {
						as: 'packages',
						foreignKey: 'organizationId',
					});
				},
			},
		},
	);
};
