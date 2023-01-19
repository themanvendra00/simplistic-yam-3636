const express = require("express");
const { UserModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const key=process.env.key;

const userRoute = express.Router();

userRoute.get("/", async (req, res) => {
  const users = await UserModel.find();
  res.json(users);
});

userRoute.post("/register", async (req, res) => {
  const { fullname, email, pass} = req.body;
  try {
    bcrypt.hash(pass, 5, async (err, hash) => {
      if (err) {
        console.log(err);
      } else {
        const user = new UserModel({ fullname, email, pass: hash});
        await user.save();
        res.send("Registration Successfull");
      }
    });
  } catch (error) {
    console.log("Error occurred while registering");
    console.log(error);
  }
});

userRoute.post("/login", async (req, res) => {
  const { email, pass } = req.body;

  try {
    const user = await UserModel.find({ email });
    const hashed_pass = user[0].pass;
    if (user.length > 0) {
      bcrypt.compare(pass, hashed_pass, (err, result) => {
        if (result) {
          const token = jwt.sign(
            {
              exp: Math.floor(Date.now() / 1000) + 60 * 60,
              userID: user[0]._id,
            },
            key
          );
          res.send({ msg: "Login Successful", token: token });
        } else {
          res.send("Invalid Credentials");
        }
      });
    } else {
      res.send("User not find");
    }
  } catch (error) {
    console.log("Error occurred while login");
    console.log(error);
  }
});

module.exports = { userRoute };
