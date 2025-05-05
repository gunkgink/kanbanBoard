const express = require("express");
const router = express.Router();
const { login, register, getMe, logout } = require("../controller/auth");
const { protect } = require("../../middleware");

router.post("/login", login);
router.post("/register", register);
router.get("/me", protect, getMe);
router.get("/logout", protect, logout);
module.exports = router;
