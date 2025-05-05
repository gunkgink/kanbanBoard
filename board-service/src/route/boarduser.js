const express = require("express");
const router = express.Router();
const {
    addMember,
    removeMember,
    getUserInBoard,
} = require("../controller/boarduser");
const { protect } = require("../../../middleware/middleware");

// router.get("/:id", getBoardById);
// router.get("/", getAllBoard);
router.use(protect);
router.post("/:boardId", addMember);
router.get("/:boardId", getUserInBoard);
router.delete("/:boardId", removeMember);
// router.put("/:", updateBoard);

module.exports = router;
