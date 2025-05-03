const { Sequelize } = require("sequelize");
const User = require("./models/User");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
});

User.initModel(sequelize);

const initDb = async () => {
    try {
        await sequelize.authenticate();
        console.log("User DB connected.");
        await sequelize.sync();
        console.log("User Models synced.");
    } catch (err) {
        console.error("User DB error:", err);
    }
};

module.exports = initDb;
