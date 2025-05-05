const express = require("express");
const { protect } = require("../../../middleware/middleware");
const router = express.Router();
const {
    createColumn,
    getColumnById,
    getColumnsByBoard,
    deleteColumn,
    reorderColumns,
    updateColumn,
} = require("../controller/column");

router.use(protect);
router.post("/:boardId", createColumn);
router.get("/:id", getColumnById);
router.get("/byboard/:boardId", getColumnsByBoard);
router.put("/:id", updateColumn);
router.delete("/:id", deleteColumn);
router.put("/reorder/:boardId", reorderColumns);
module.exports = router;
