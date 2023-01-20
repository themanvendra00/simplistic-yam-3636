const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT;
const { connection } = require("./config/db");
const { userRoute } = require("./routes/user.route");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.use("/users", userRoute);

app.listen(port, async () => {
  try {
    await connection;
    console.log("Connected to database");
  } catch (error) {
    console.log("Error occurred while connecting to db");
    console.log(error);
  }
  console.log(`Live at localhost: ${port}`);
});
