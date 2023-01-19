const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fullname: String,
  email: String,
  pass: String,
});

const UserModel = mongoose.model("user", userSchema);

module.exports = {UserModel};
