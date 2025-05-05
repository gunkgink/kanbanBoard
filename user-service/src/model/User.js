const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class User extends Model {
    getSignedJwtToken() {
        return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });
    }

    async matchPassword(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
    }

    static initModel(sequelize) {
        User.init(
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
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                role: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    defaultValue: "user",
                },
            },
            {
                sequelize,
                modelName: "User",
                tableName: "Users",
                hooks: {
                    beforeSave: async (user) => {
                        if (user.changed("password")) {
                            const salt = await bcrypt.genSalt(10);
                            user.password = await bcrypt.hash(
                                user.password,
                                salt
                            );
                        }
                    },
                },
            }
        );
    }
}

module.exports = User;
