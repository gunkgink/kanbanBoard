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

// Create a task
router.post("/", createTask);

// Get task by ID
router.get("/:taskId", getTaskById);

// Get tasks by column ID
router.get("/column/:columnId", getTasksByColumn);

// Get tasks by user ID
router.get("/:userId/user", getTasksByUser);

// Update a task
router.put("/:taskId", updateTask);

// Delete a task
router.delete("/:taskId", removeTask);

module.exports = router;
