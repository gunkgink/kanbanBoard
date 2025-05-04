const { Sequelize } = require("sequelize");
const User = require("../user-service/src/model/User");
const Board = require("./src/model/Board");
const BoardUser = require("./src/model/Boarduser");
const Column = require("./src/model/Column");
require("dotenv").config();

// Create Sequelize instances for different databases
const userDb = new Sequelize(process.env.USER_DATABASE_URL, {
    dialect: "postgres",
    logging: false,
});

const boardDb = new Sequelize(process.env.BOARD_DATABASE_URL, {
    dialect: "postgres",
    logging: false,
});

// Initialize models with their respective databases
User.initModel(userDb); // Using userDb for User model
Board.initModel(boardDb); // Using boardDb for Board model
BoardUser.initModel(boardDb); // Using boardDb for BoardUser model
Column.initModel(boardDb); // Using boardDb for Column model

// Define associations
User.associate({ Board, BoardUser });
Board.associate({ User, Column, BoardUser });
BoardUser.associate({ Board, User });
Column.associate({ Board });

const initDb = async () => {
    try {
        // Authenticate the connections for both databases
        await userDb.authenticate(); // Authenticate user database
        console.log("User DB connected.");

        await boardDb.authenticate(); // Authenticate board database
        console.log("Board DB connected.");

        // Sync models (sync tables) for the board-related models
        await boardDb.sync({ force: false });
        console.log("Board Models synced.");

        // Optionally, you can sync the user database as well, if needed
        await userDb.sync({ force: false });
        console.log("User Models synced.");
    } catch (err) {
        console.error("Database error:", err);
    }
};

module.exports = initDb;
