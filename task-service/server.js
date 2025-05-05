const express = require("express");
const initDb = require("./db");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());

initDb();

app.listen(process.env.PORT || 3002, () => {
    console.log(`User Service running on port ${process.env.PORT}`);
});
