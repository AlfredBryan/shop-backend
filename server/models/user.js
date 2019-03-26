const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    companyName: {
      type: String,
      required: [true, "please enter name"]
    },
    email: {
      type: String,
      required: [true, "enter your email address"],
      unique: [true, "email already exist"]
    },
    password: {
      type: String,
      required: [true, "please enter password"]
    }
  },
  { timestamps: true }
);

userSchema.plugin(validator);

const User = mongoose.model("User", userSchema);

module.exports = User;
