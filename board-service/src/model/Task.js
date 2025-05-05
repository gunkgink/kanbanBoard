const { DataTypes, Model } = require("sequelize");

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
                        model: sequelize.models.Column,
                        key: "id",
                    },
                },
                UserId: {
                    type: DataTypes.UUID,
                    allowNull: false,
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
                },
                assignee: {
                    type: DataTypes.UUID,
                    allowNull: true,
                },
            },
            {
                sequelize,
                modelName: "Task",
                tableName: "Tasks",
                timestamps: true,
                paranoid: true,
            }
        );
    }
    static associate(models) {
        Task.belongsTo(models.Column, {
            foreignKey: "columnId",
        });
    }
}

module.exports = Task;
