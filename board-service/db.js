const { Sequelize } = require("sequelize");
const Board = require("./src/model/Board");
const BoardUser = require("./src/model/BoardUser");
const Column = require("./src/model/Column");
require("dotenv").config();

const boardDb = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
});

Board.initModel(boardDb); // Using boardDb for Board model
BoardUser.initModel(boardDb); // Using boardDb for BoardUser model
Column.initModel(boardDb); // Using boardDb for Column model

Board.associate(boardDb.models);
BoardUser.associate(boardDb.models);
Column.associate(boardDb.models);

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
