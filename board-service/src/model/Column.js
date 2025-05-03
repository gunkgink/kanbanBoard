const { DataTypes, Model } = require("sequelize");

class Column extends Model {
    static initModel(sequelize) {
        Column.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                boardId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    references: {
                        model: "Boards",
                        key: "id",
                    },
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                position: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                },
            },
            {
                sequelize,
                modelName: "Column",
                timestamps: true,
                paranoid: true,
            }
        );
    }
}

Column.belongsTo(Board, { foreignKey: "boardId" });

module.exports = Column;
