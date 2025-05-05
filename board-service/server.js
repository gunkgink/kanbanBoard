const express = require("express");
const initDb = require("./db");
const cookieParser = require("cookie-parser");
console.log(process.env.PORT);
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());
initDb();

const boardRouter = require("./src/route/board");
app.use("/api/board", boardRouter);

const columnRouter = require("./src/route/column");
app.use("/api/board/column", columnRouter);

const boardUserRouter = require("./src/route/boarduser");
app.use("/api/board/user", boardUserRouter);

const taskRouter = require("./src/route/task");
app.use("/api/board/task", taskRouter);

app.listen(process.env.PORT || 3001, () => {
    console.log(`Board Service running on port ${process.env.PORT}`);
});
