const express = require("express");
const { protect } = require("../../../middleware/middleware");
const router = express.Router();
const {
    getBoardById,
    getAllBoard,
    updateBoard,
    createBoard,
    deleteBoard,
} = require("../controller/board");
router.use(protect);

router.get("/:boardId", getBoardById);

router.get("/", protect, getAllBoard);

router.post("/", protect, createBoard);

router.delete("/:boardId", deleteBoard);

router.put("/:boardId", updateBoard);

module.exports = router;
