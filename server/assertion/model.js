export default (sequelize, dataTypes) => {
	return sequelize.define(
		'Assertion',
		{
			id: sequelize.idType,
			hash: sequelize.slugType,
			numGraphs: { type: dataTypes.INTEGER, allowNull: false },
			/* Set by Associations */
			userId: { type: dataTypes.UUID, allowNull: false },
			packageId: { type: dataTypes.UUID, allowNull: false },
		},
		{
			classMethods: {
				associate: (models) => {
					const { Assertion, User } = models;
					Assertion.belongsTo(User, {
						as: 'user',
						foreignKey: 'userId',
					});
				},
			},
		},
	);
};
