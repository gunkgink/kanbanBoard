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
                title: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                order: {
                    type: DataTypes.INTEGER,
                    defaultValue: 0,
                },
                boardId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    references: {
                        model: sequelize.models.Board,
                        key: "id",
                    },
                },
            },
            {
                sequelize,
                modelName: "Column",
                tableName: "Columns",
                timestamps: true,
                paranoid: true,
            }
        );
    }

    static associate(models) {
        Column.belongsTo(models.Board, { foreignKey: "boardId" });
        Column.hasMany(models.Task, {
            foreignKey: "columnId",
        });
    }
}

module.exports = Column;
