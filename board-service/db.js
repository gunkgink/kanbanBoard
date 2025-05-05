const { Sequelize } = require("sequelize");
const Board = require("./src/model/Board");
const BoardUser = require("./src/model/BoardUser");
const Column = require("./src/model/Column");
const Task = require("./src/model/Task");
require("dotenv").config();

const boardDb = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
});

Board.initModel(boardDb);
BoardUser.initModel(boardDb);
Column.initModel(boardDb);
Task.initModel(boardDb);

Board.associate(boardDb.models);
BoardUser.associate(boardDb.models);
Column.associate(boardDb.models);
Task.associate(boardDb.models);

const initDb = async () => {
    try {
        await boardDb.authenticate();
        console.log("Board DB connected.");
        await boardDb.sync();
        console.log("Board Models synced.");
    } catch (err) {
        console.error("Database error:", err);
    }
};

module.exports = initDb;
