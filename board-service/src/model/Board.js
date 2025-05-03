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
}

Board.hasMany(Column, { foreignKey: "boardId" });

module.exports = Board;
