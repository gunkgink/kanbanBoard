const { DataTypes, Model } = require("sequelize");

class BoardUser extends Model {
    static initModel(sequelize) {
        BoardUser.init(
            {
                boardId: {
                    type: DataTypes.UUID,
                    references: {
                        model: "Board",
                        key: "id",
                    },
                    allowNull: false,
                },
                userId: {
                    type: DataTypes.UUID,
                    references: {
                        model: "User", // เชื่อมโยงกับโมเดล User
                        key: "id",
                    },
                    allowNull: false,
                },
            },
            {
                sequelize,
                modelName: "BoardUser",
                timestamps: true,
            }
        );
    }

    static associate(models) {}
}

module.exports = BoardUser;
