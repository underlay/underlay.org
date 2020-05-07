export default (sequelize, dataTypes) => {
	return sequelize.define(
		'Member',
		{
			id: sequelize.idType,

			/* Set by Associations */
			userId: { type: dataTypes.UUID, allowNull: false },
			organizationId: { type: dataTypes.UUID, allowNull: false },
		},
		{
			classMethods: {
				associate: (models) => {
					const { Member, User } = models;
					Member.belongsTo(User, {
						as: 'user',
						foreignKey: 'userId',
					});
				},
			},
		},
	);
};
