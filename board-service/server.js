const express = require("express");
const initDb = require("./db");
require("dotenv").config();

const app = express();
app.use(express.json());

initDb();

app.listen(process.env.PORT || 3001, () => {
    console.log(`User Service running on port ${process.env.PORT}`);
});
