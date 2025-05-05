const { isUserExists } = require("../service/boardservice");
const axios = require("axios");
const Board = require("../model/Board");
const BoardUser = require("../model/BoardUser");
exports.addMember = async (req, res) => {
    console.log(req.body);

    const boardId = req.params.id;
    const { userId } = req.body;
    // console.log(boardId, userId);

    try {
        const board = await Board.findByPk(boardId);
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        const userExists = await isUserExists(userId, req.cookies.token);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        const exists = await BoardUser.findOne({ where: { boardId, userId } });
        if (exists) {
            return res.status(400).json({ message: "User already added" });
        }

        await BoardUser.create({ boardId, userId });
        return res.status(201).json({ message: "User added to board" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.removeMember = async (req, res) => {
    const { boardId } = req.params;
    const { userId } = req.body;

    try {
        const board = await Board.findByPk(boardId);
        if (!board) {
            return res.status(404).json({ message: "Board not found." });
        }
        if (board.ownerId === userId) {
            return res.status(403).json({
                message: "Cannot remove the board owner.",
            });
        }
        const boardUser = await BoardUser.findOne({
            where: {
                boardId: boardId,
                userId: userId,
            },
        });

        if (!boardUser) {
            return res
                .status(404)
                .json({ message: "Member not found in this board." });
        }

        await boardUser.destroy();

        return res
            .status(200)
            .json({ message: "Member removed successfully." });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Error removing member from board.", error: err });
    }
};
exports.getUserInBoard = async (req, res) => {
    const boardId = req.params.id;
    // console.log(req.params);

    try {
        const boardUsers = await BoardUser.findAll({
            where: { boardId },
            attributes: ["userId"],
        });

        const userIds = boardUsers.map((bu) => bu.userId);

        if (userIds.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }
        console.log(userIds);

        const api = `${process.env.USER_API}/api/user/group`;
        // const api = "http://localhost:3003/api/user/group";
        console.log(api);
        const response = await axios.post(
            api,
            { userIds },
            {
                headers: {
                    Authorization: `Bearer ${req.cookies.token}`,
                },
            }
        );

        return res.status(200).json({
            success: true,
            data: response.data.data,
        });
    } catch (error) {
        console.error("Error in getUserInBoard:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to get users in board",
        });
    }
};
