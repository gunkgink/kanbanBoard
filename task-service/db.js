const { Sequelize } = require("sequelize");
const Task = require("./src/model/Task");
require("dotenv").config();

const taskDb = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
});

Task.initModel(taskDb);

const initDb = async () => {
    try {
        await taskDb.authenticate();
        console.log("Task DB connected.");
        await taskDb.sync();
        console.log("Task Models synced.");
    } catch (err) {
        console.error("Task DB error:", err);
    }
};

module.exports = initDb;
