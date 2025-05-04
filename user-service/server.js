const express = require("express");
const initDb = require("./db");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());
initDb();
const userRoutes = require("./src/route/user");
app.use("/api/user", userRoutes);

const authRoutes = require("./src/route/auth");
app.use("/api", authRoutes);

app.listen(process.env.PORT || 3001, () => {
    console.log(`User Service running on port ${process.env.PORT}`);
});
