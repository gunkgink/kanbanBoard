const { DataTypes, Model } = require("sequelize");

class Board extends Model {
    static initModel(sequelize) {
        Board.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                ownerId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
            },
            {
                sequelize,
                modelName: "Board",
                timestamps: true,
                paranoid: true,
            }
        );
    }

    static associate(models) {
        Board.hasMany(models.Column, { foreignKey: "boardId" });
        Board.hasMany(models.BoardUser, { foreignKey: "boardId" });
    }
}

module.exports = Board;
