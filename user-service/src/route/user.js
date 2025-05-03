const express = require("express");
const router = express.Router();
const {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
} = require("../controller/userController");

module.exports = router;
