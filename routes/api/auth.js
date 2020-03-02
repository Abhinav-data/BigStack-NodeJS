const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jsonwt = require("jsonwebtoken");
const passport = require("passport");
const key = require("../../setup/myurl");

//Import Schema
const Person = require("../../models/Person");
router.get("/", (req, res) => res.json({ test: "Authentication is working" }));

router.post("/register", (req, res) => {
  Person.findOne({ email: req.body.email })
    .then()
    .catch(err => console.log(err));
});

module.exports = router;
