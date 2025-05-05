const Task = require("../model/Task");
const axios = require("axios");
const { Op } = require("sequelize");
const Column = require("../model/Column");
const { isUserInBoard } = require("../service/boardservice");

exports.createTask = async (req, res) => {
    try {
        const { columnId, title, description, dueDate, assignee } = req.body;
        const userId = req.user.id;

        // Validate required fields
        if (!columnId || !title) {
            return res
                .status(400)
                .json({ message: "Column ID and title are required." });
        }

        // Find the column and verify it exists
        const column = await Column.findByPk(columnId);
        if (!column) {
            return res.status(404).json({ message: "Column not found." });
        }

        const boardId = column.boardId;

        // Verify user is a member of the board
        try {
            const isUserBoardMember = await isUserInBoard(boardId, userId);
            if (!isUserBoardMember) {
                return res
                    .status(403)
                    .json({ message: "You are not a member of this board." });
            }
        } catch (error) {
            console.error("Error verifying user board membership:", error);
            return res
                .status(500)
                .json({ message: "Error verifying board membership." });
        }

        if (assignee) {
            try {
                const isAssigneeBoardMember = await isUserInBoard(
                    boardId,
                    assignee
                );
                if (!isAssigneeBoardMember) {
                    return res.status(403).json({
                        message: "Assignee is not a member of this board.",
                    });
                }
            } catch (error) {
                console.error(
                    "Error verifying assignee board membership:",
                    error
                );
                return res
                    .status(500)
                    .json({ message: "Error verifying assignee membership." });
            }
        }

        // Create the task
        const task = await Task.create({
            columnId,
            UserId: userId,
            title,
            description: description || null,
            dueDate: dueDate || null,
            assignee: assignee || null,
            status: column.title,
        });

        return res.status(201).json({
            message: "Task created successfully.",
            task,
        });
    } catch (error) {
        console.error("Error creating task:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.getTasksByUser = async (req, res) => {
    const { userId } = req.params;
    console.log(userId);

    try {
        const tasks = await Task.findAll({
            where: {
                [Op.or]: [
                    { UserId: userId }, // tasks created by the user
                    { assignee: userId }, // tasks assigned to the user
                ],
            },
            include: {
                model: Column,
                attributes: ["title"],
            },
            order: [["createdAt", "DESC"]],
        });

        const result = tasks.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            assignee: task.assignee,
            createdBy: task.UserId,
            columnId: task.columnId,
            status: task.Column?.title || "Unknown",
        }));

        res.status(200).json({ success: true, tasks: result });
    } catch (error) {
        console.error("Error fetching user tasks:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getTaskById = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findByPk(id, {
            include: {
                model: Column,
                attributes: ["title"],
            },
        });

        if (!task) {
            return res
                .status(404)
                .json({ success: false, message: "Task not found" });
        }

        const taskData = {
            id: task.id,
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            assignee: task.assignee,
            userId: task.UserId,
            columnId: task.columnId,
            status: task.Column?.title || "Unknown",
        };

        res.status(200).json({ success: true, task: taskData });
    } catch (err) {
        console.error("Error fetching task:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getTasksByColumn = async (req, res) => {
    const { columnId } = req.params;

    try {
        const tasks = await Task.findAll({
            where: { columnId },
            order: [["createdAt", "ASC"]], // Optional: order by creation
        });

        res.status(200).json({ success: true, data: tasks });
    } catch (err) {
        console.error("Error fetching tasks by column:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { title, description, dueDate, assignee, columnId } = req.body;
    const userId = req.user.id;
    const token = req.cookies.token;

    try {
        // Validate required parameters
        if (!taskId) {
            return res.status(400).json({ message: "Task ID is required." });
        }

        // Find the task
        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        // Find the current column
        const currentColumn = await Column.findByPk(task.columnId);
        if (!currentColumn) {
            return res
                .status(404)
                .json({ message: "Original column not found." });
        }

        const boardId = currentColumn.boardId;

        const isInBoard = await isUserInBoard(boardId, userId);
        if (!isInBoard) {
            return res
                .status(403)
                .json({ message: "Not a member of the board." });
        }

        // Handle column change if needed
        if (columnId && columnId !== task.columnId) {
            const newColumn = await Column.findByPk(columnId);
            if (!newColumn || newColumn.boardId !== boardId) {
                return res
                    .status(400)
                    .json({ message: "Invalid column for this board." });
            }
            task.columnId = columnId;
            task.status = newColumn.title; // Sync status with column title
        }

        // Handle assignee change if needed
        if (assignee !== undefined && assignee !== task.assignee) {
            // Check if assignee is being removed (null) or changed
            if (assignee) {
                const exists = await isUserExists(assignee, token);
                if (!exists) {
                    return res
                        .status(404)
                        .json({ message: "Assignee not found." });
                }

                const assigneeInBoard = await isUserInBoard(boardId, assignee);
                if (!assigneeInBoard) {
                    return res
                        .status(403)
                        .json({ message: "Assignee not in this board." });
                }
            }
            task.assignee = assignee;
        }

        // Update other fields
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (dueDate !== undefined) task.dueDate = dueDate;

        // Save changes
        await task.save();

        return res.status(200).json({
            message: "Task updated successfully.",
            task,
        });
    } catch (error) {
        console.error("Error updating task:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.removeTask = async (req, res) => {
    const { taskId } = req.params;
    const userId = req.user.id;

    try {
        const task = await Task.findByPk(taskId);
        if (!task) return res.status(404).json({ message: "Task not found." });

        const column = await Column.findByPk(task.columnId);
        if (!column)
            return res.status(404).json({ message: "Column not found." });

        const boardId = column.boardId;

        const isMember = await isUserInBoard(boardId, userId);
        if (!isMember)
            return res
                .status(403)
                .json({ message: "You are not a member of this board." });

        await task.destroy();

        res.status(200).json({ message: "Task deleted successfully." });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
