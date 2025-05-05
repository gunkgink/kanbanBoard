const express = require("express");
const initDb = require("./db");
const cookieParser = require("cookie-parser");
const boardRouter = require("./src/route/board");
const columnRouter = require("./src/route/column");
const boardUserRouter = require("./src/route/boarduser");
const taskRouter = require("./src/route/task");
console.log(process.env.PORT);
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());
initDb();
app.use("/api/board", boardRouter);
app.use("/api/board/user", boardUserRouter);
app.use("/api/board/column", columnRouter);
app.use("/api/board/task", taskRouter);
app.listen(process.env.PORT || 3001, () => {
    console.log(`Board Service running on port ${process.env.PORT}`);
});
