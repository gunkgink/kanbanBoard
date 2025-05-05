const Board = require("../model/Board");
const BoardUser = require("../model/BoardUser");
const Column = require("../model/Column");
exports.createBoard = async (req, res) => {
    try {
        const { ownerId, name, description } = req.body;

        if (!ownerId || !name) {
            return res.status(400).json({
                success: false,
                msg: "Please provide name and ownerId",
            });
        }

        const existingBoard = await Board.findOne({
            where: {
                ownerId,
                name,
            },
        });

        if (existingBoard) {
            return res.status(409).json({
                success: false,
                msg: "Board with the same name already exists for this owner",
            });
        }
        const newBoard = await Board.create({
            ownerId,
            name,
            description,
        });

        // Create BoardUser entry
        await BoardUser.create({
            boardId: newBoard.id,
            userId: ownerId,
        });

        return res.status(201).json({
            success: true,
            msg: "Board created successfully",
            data: newBoard,
        });
    } catch (error) {
        console.error("Create board error:", error);
        return res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
};

exports.getBoardById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                msg: "Board ID is required",
            });
        }

        const board = await Board.findByPk(id, {
            include: [
                {
                    model: Column,
                    as: "Columns", // adjust if you gave alias
                },
                {
                    model: BoardUser,
                    as: "Members", // if associated, or remove if unnecessary
                },
            ],
        });

        if (!board) {
            return res.status(404).json({
                success: false,
                msg: "Board not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: board,
        });
    } catch (error) {
        console.error("Get board by ID error:", error);
        return res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
};

// exports.getAllBoard = async (req, res) => {
//     return res.status(200).json({
//         success: true,
//         msg: "getAll",
//     });
// };
exports.getAllBoard = async (req, res) => {
    try {
        // console.log(req.user);
        const userId = req.user.id; // adjust depending on where you store auth info
        const role = req.user.role;
        if (!userId) {
            return res.status(400).json({
                success: false,
                msg: "Missing userId",
            });
        }

        let boards;

        if (role === "admin") {
            boards = await Board.findAll();
        } else {
            const boardLinks = await BoardUser.findAll({
                where: { userId },
                attributes: ["boardId"],
            });

            const boardIds = boardLinks.map((b) => b.boardId);

            boards = await Board.findAll({
                where: { id: boardIds },
            });
        }

        return res.status(200).json({
            success: true,
            data: boards,
        });
    } catch (error) {
        console.error("Get all boards error:", error);
        return res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
};

exports.updateBoard = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description, ownerId } = req.body;

        const board = await Board.findByPk(id);

        if (!board) {
            return res.status(404).json({
                success: false,
                msg: "Board not found",
            });
        }

        if (name) board.name = name;
        if (description !== undefined) board.description = description;
        if (ownerId) board.userId = ownerId;
        await board.save();

        return res.status(200).json({
            success: true,
            data: board,
        });
    } catch (err) {
        console.error("Update board error:", err);
        return res.status(500).json({
            success: false,
            msg: "Server error",
            error: err.message,
        });
    }
};

exports.deleteBoard = async (req, res) => {
    try {
        const { id } = req.params;

        const board = await Board.findByPk(id);

        if (!board) {
            return res.status(404).json({
                success: false,
                msg: "Board not found",
            });
        }

        await board.destroy();

        return res.status(200).json({
            success: true,
            msg: "Board deleted successfully",
        });
    } catch (err) {
        console.error("Delete board error:", err);
        return res.status(500).json({
            success: false,
            msg: "Server error",
            error: err.message,
        });
    }
};
