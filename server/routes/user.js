const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("../models/user");

const router = express.Router();

// Fetch all users
router.get("/users", (req, res) => {
  User.find({}, (err, user) => {
    if (err) return res.status(404).send("no users found");
  });
});

// Create new User
router.post("/user/create", (req, res) => {
  //Check for field errors
  const companyName = req.body.companyName;
  const email = req.body.email;
  const password = req.body.password;

  // Return error if no companyName is provided
  if (!companyName) {
    return res.status(422).send({ error: "please enter company name" });
  }

  // Return error if no email is provided
  if (!email) {
    return res.status(422).send({ error: "please enter email" });
  }

  // Return error if no password is provided
  if (!password) {
    return res.status(422).send({ error: "please enter password" });
  }

  const hashPassword = bcrypt.hashSync(password, 10);

  User.findOne({ email }, (err, existingUser) => {
    if (err) return err;

    // If user is not unique, return error
    if (existingUser) {
      return res.status(422).send({ error: "That email is already in use" });
    }

    User.create(
      {
        companyName,
        email,
        password: hashPassword
      },
      (err, user) => {
        if (err) return res.status(409).send({ message: err.message });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: 86400 // expires in 24 hours
        });
        res.status(201).send({ user: user, token: token });
      }
    );
  });
});

// User login Route
router.post("/user/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(500).send({ message: "login error" });
    if (!user) return res.status(404).send({ message: "user not found" });

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid)
      return res.status(403).send({ message: "login invalid" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 86400
    });
    res.json({
      user: user,
      message: "Authenticated",
      token: token
    });
  });
});

module.exports = router;
