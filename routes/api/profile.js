const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Person Model
const Person = require("../../models/Person");

//Load Profile Model
const Profile = require("../../models/Profile");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          return res
            .status(404)
            .json({ profilenotfound: "User Profile Not Found" });
        }
        res.json(profile);
      })
      .catch(err => console.log(err));
  }
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profileValues = {};
    profileValues.user = req.user.id;
    if (req.body.username) profileValues.username = req.body.username;
    if (req.body.website) profileValues.website = req.body.website;
    if (req.body.country) profileValues.country = req.body.country;
    if (req.body.portfolio) profileValues.portfolio = req.body.portfolio;
    if (typeof req.body.languages !== undefined) {
      profileValues.languages = req.body.languages.split(",");
    }

    //Get Social Link
    profileValues.social = {};
    if (req.body.youtube) profileValues.social.youtube = req.body.youtube;
    if (req.body.facebook) profileValues.social.facebook = req.body.facebook;
    if (req.body.github) profileValues.social.github = req.body.github;

    //Do Database
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileValues },
            { new: true }
          )
            .then(profile => res.json(profile))
            .catch(err => console.log("Error in update " + err));
        } else {
          Profile.findOne({ username: profileValues.username })
            .then(profile => {
              //Username Exist
              if (profile) {
                res.status(400).json({ username: "username already exist" });
              }
              //No Username
              new Profile(profileValues)
                .save()
                .then(profile => res.json({ profile }))
                .catch(err => console.log("Error in saving profile" + err));
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log("Problem in finding profile" + err));
  }
);

module.exports = router;
