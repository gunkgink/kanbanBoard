const Column = require("../model/Column"); // adjust path if needed
const { Op } = require("sequelize");

exports.createColumn = async (req, res) => {
    try {
        const { boardId } = req.params;
        // console.log(req.params);
        const { name, title, order } = req.body;

        if (order === undefined) order = 0;

        await Column.increment("order", {
            by: 1,
            where: {
                boardId,
                order: {
                    [Op.gte]: order,
                },
            },
        });

        const newColumn = await Column.create({
            title,
            order,
            boardId,
        });

        return res
            .status(201)
            .json({ message: "Column created", column: newColumn });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};
exports.getColumnsByBoard = async (req, res) => {
    const { boardId } = req.params;
    // console.log(req.params);
    try {
        const columns = await Column.findAll({
            where: { boardId },
            order: [["order", "ASC"]],
        });
        res.status(200).json({ success: true, data: columns });
    } catch (err) {
        console.error("Error fetching columns:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getColumnById = async (req, res) => {
    try {
        const column = await Column.findByPk(req.params.id);
        if (!column)
            return res
                .status(404)
                .json({ success: false, message: "Column not found" });
        res.status(200).json({ success: true, data: column });
    } catch (err) {
        console.error("Error fetching column:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.updateColumn = async (req, res) => {
    try {
        const column = await Column.findByPk(req.params.id);
        if (!column)
            return res
                .status(404)
                .json({ success: false, message: "Column not found" });

        const { name, position } = req.body;
        if (name) column.name = name;
        if (position !== undefined) column.position = position;

        await column.save();
        res.status(200).json({ success: true, data: column });
    } catch (err) {
        console.error("Error updating column:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.deleteColumn = async (req, res) => {
    try {
        const column = await Column.findByPk(req.params.id);
        if (!column)
            return res
                .status(404)
                .json({ success: false, message: "Column not found" });
        await column.destroy();
        res.status(200).json({ success: true, message: "Column deleted" });
    } catch (err) {
        console.error("Error deleting column:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.reorderColumns = async (req, res) => {
    const { boardId } = req.params;
    const { columnOrder } = req.body;
    try {
        for (let i = 0; i < columnOrder.length; i++) {
            await Column.update(
                { order: i },
                { where: { id: columnOrder[i], boardId } }
            );
        }
        res.status(200).json({ success: true, message: "Columns reordered" });
    } catch (err) {
        console.error("Error reordering columns:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
