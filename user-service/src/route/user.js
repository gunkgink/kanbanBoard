const express = require("express");
const router = express.Router();
const {
    createUser,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser,
    getUsersByIds,
} = require("../controller/user");
const { protect } = require("../../../middleware/middleware");
router.use(protect);
router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/group", getUsersByIds);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
