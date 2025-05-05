const express = require("express");
const router = express.Router();
const { protect } = require("../../../middleware/middleware");

const {
    getTaskById,
    getTasksByColumn,
    createTask,
    updateTask,
    getTasksByUser,
    removeTask,
} = require("../controller/task");

router.use(protect);

router.post("/", createTask);

router.get("/:taskId", getTaskById);

router.get("/column/:columnId", getTasksByColumn);

router.get("/:userId/user", getTasksByUser);

router.put("/:taskId", updateTask);

router.delete("/:taskId", removeTask);

module.exports = router;
