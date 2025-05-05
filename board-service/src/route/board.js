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
router.get("/:id", getBoardById);
router.get("/", protect, getAllBoard);
router.post("/", protect, createBoard);
router.delete("/:id", deleteBoard);
router.put("/:id", updateBoard);

module.exports = router;
