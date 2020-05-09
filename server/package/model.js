export default (sequelize, dataTypes) => {
	return sequelize.define(
		'Package',
		{
			id: sequelize.idType,
			slug: { ...sequelize.slugType },
			description: { type: dataTypes.TEXT },
			/* Set by Associations */
			userId: { type: dataTypes.UUID },
			organizationId: { type: dataTypes.UUID },
		},
		{
			classMethods: {
				associate: (models) => {
					const { Assertion, Discussion, Package, User, Organization } = models;
					Package.hasMany(Assertion, {
						as: 'assertions',
						foreignKey: 'packageId',
					});
					Package.hasMany(Discussion, {
						as: 'discussions',
						foreignKey: 'packageId',
					});
					Package.belongsTo(User, {
						as: 'user',
						foreignKey: 'userId',
					});
					Package.belongsTo(Organization, {
						as: 'organization',
						foreignKey: 'organizationId',
					});
				},
			},
		},
	);
};
