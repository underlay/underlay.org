export default (sequelize, dataTypes) => {
	return sequelize.define(
		'Discussion',
		{
			id: sequelize.idType,
			number: { type: dataTypes.INTEGER, allowNull: false },
			title: { type: dataTypes.TEXT, allowNull: false },
			/* Set by Associations */
			authorId: { type: dataTypes.UUID },
			userId: { type: dataTypes.UUID },
			packageId: { type: dataTypes.UUID },
			organizationId: { type: dataTypes.UUID },
		},
		{
			classMethods: {
				associate: (models) => {
					const { Discussion, User } = models;
					Discussion.belongsTo(User, {
						as: 'author',
						foreignKey: 'authorId',
					});
				},
			},
		},
	);
};
