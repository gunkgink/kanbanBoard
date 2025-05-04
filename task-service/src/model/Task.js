const { DataTypes, Model } = require("sequelize");
const User = require("../../../user-service/src/model/User");
const Column = require("../../../board-service/src/model/Column");

class Task extends Model {
    static initModel(sequelize) {
        Task.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                columnId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    references: {
                        model: "Column",
                        key: "id",
                    },
                },
                UserId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    references: {
                        model: "User",
                        key: "id",
                    },
                },
                title: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                dueDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                status: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    defaultValue: "To Do",
                },
                assignee: {
                    type: DataTypes.UUID,
                    allowNull: true,
                    references: {
                        model: "User",
                        key: "id",
                    },
                },
            },
            {
                sequelize,
                modelName: "Task",
                timestamps: true,
                paranoid: true,
            }
        );
    }
}

Task.belongsTo(Column, { foreignKey: "columnId" });
Task.belongsTo(User, { foreignKey: "userId" });

module.exports = Task;
