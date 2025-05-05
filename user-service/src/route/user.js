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

router.get("/:userId", getUserById);

router.post("/userids", getUsersByIds);

router.put("/:userId", updateUser);

router.delete("/:userId", deleteUser);

module.exports = router;
