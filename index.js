require("dotenv").config();

const express = require("express");
const errorRouter = require("./routes/error");
const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ msg: "process.env" });
});
app.use("*", errorRouter);
app.listen(process.env.HHTP_PORT || 5000, () => {
  console.log("HTTP SERVER STARTED");
});
