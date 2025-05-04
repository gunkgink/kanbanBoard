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
                UserId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    references: {
                        model: "User", // ผู้ใช้ที่เป็นเจ้าของบอร์ด
                        key: "id",
                    },
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
                paranoid: true, // รองรับการลบแบบนุ่มนวล (soft delete)
            }
        );
    }

    static associate(models) {
        // ความสัมพันธ์ระหว่าง Board และ Column (One-to-Many)
        Board.hasMany(models.Column, { foreignKey: "boardId" });

        // ความสัมพันธ์ระหว่าง Board และ User (Many-to-Many) ผ่าน BoardUser
        Board.belongsToMany(models.User, {
            through: models.BoardUser,
            foreignKey: "boardId",
        });

        // ความสัมพันธ์ระหว่าง Board และ User (One-to-Many) เพื่อระบุเจ้าของบอร์ด
        Board.belongsTo(models.User, {
            foreignKey: "UserId",
            as: "Owner",
        });
    }
}

module.exports = Board;
