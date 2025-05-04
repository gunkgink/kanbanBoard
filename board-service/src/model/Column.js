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
                boardId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    references: {
                        model: "Board",
                        key: "id",
                    },
                },
            },
            {
                sequelize,
                modelName: "Column",
                timestamps: true,
                paranoid: true, // รองรับการลบแบบนุ่มนวล (soft delete)
            }
        );
    }

    static associate(models) {
        // ความสัมพันธ์ระหว่าง Column และ Board (Many-to-One)
        Column.belongsTo(models.Board, { foreignKey: "boardId" });
    }
}

module.exports = Column;
