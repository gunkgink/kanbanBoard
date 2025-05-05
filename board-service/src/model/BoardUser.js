const { DataTypes, Model } = require("sequelize");
class BoardUser extends Model {
    static initModel(sequelize) {
        BoardUser.init(
            {
                boardId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    references: {
                        model: sequelize.models.Board, // Actual model class instead of string
                        key: "id",
                    },
                },
                userId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
            },
            {
                sequelize,
                modelName: "BoardUser",
                tableName: "BoardUsers",
                timestamps: true,
            }
        );
    }

    static associate(models) {
        BoardUser.belongsTo(models.Board, { foreignKey: "boardId" });
    }
}

module.exports = BoardUser;
