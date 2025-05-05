const BoardUser = require("../model/BoardUser");
const Board = require("../model/Board");
const axios = require("axios");
require("dotenv").config();

exports.isUserExists = async (userId, token) => {
    try {
        const checkUrl = `${process.env.USER_API}/api/user/${userId}`;
        const response = await axios.get(checkUrl, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token
            },
        });
        return response.status === 200;
    } catch (err) {
        console.error("User check failed:", err.response?.data || err.message);
        return false;
    }
};

exports.isUserInBoard = async (boardId, userId) => {
    if (!boardId || !userId) {
        throw new Error("Board ID and User ID are required");
    }

    const board = await Board.findByPk(boardId);
    if (!board) {
        throw new Error("Board not found");
    }

    const boardUser = await BoardUser.findOne({
        where: { boardId, userId },
    });

    return !!boardUser;
};
