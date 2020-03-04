const express = require("express");
const router = express.Router();
const passport = require("passport");

//Load Person Model
const Person = require("../../models/Person");

//Load Profile Model
const Profile = require("../../models/Profile");

//Load Question  Model
const Question = require("../../models/Question");

router.get("/", (req, res) => {
  Question.find()
    .sort({ date: "desc" })
    .then(questions => {
      res.send(questions);
    })
    .catch(err => console.log("error in finding questions " + err));
});

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newQuestion = new Question({
      textone: req.body.textone,
      texttwo: req.body.texttwo,
      user: req.user.id,
      name: req.body.name
    });
    newQuestion
      .save()
      .then(question => res.json(question))
      .catch(err => console.log("Unable to push question " + err));
  }
);

router.post(
  "/answer/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.findById(req.params.id)
      .then(question => {
        const newAnswer = {
          user: req.user.id,
          name: req.body.name,
          text: req.body.text
        };
        question.answer.unshift(newAnswer);
        question
          .save()
          .then(question => res.json(question))
          .catch(err => console.log("Errror while saving answer" + err));
      })
      .catch(err => console.log("Error while finding answer" + err));
  }
);

router.post(
  "/upvote/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Question.findById(req.params.id)
          .then(question => {
            if (
              question.upvotes.filter(
                upvote => upvote.user.toString() === req.user.id.toString()
              ).length > 0
            ) {
              question.upvotes.shift({ user: req.user.id });
              question
                .save()
                .then(question => res.json(question))
                .catch(err => console.log("Error while saving answer") + err);
            } else {
              question.upvotes.unshift({ user: req.user.id });
              question
                .save()
                .then(question => res.json(question))
                .catch(err => console.log("Error while saving answer") + err);
            }
          })
          .catch(err =>
            console.log("Unable to find anquetsion in upvote" + err)
          );
      })
      .catch(err => console.log("Error  while upvoting anser" + err));
  }
);
module.exports = router;
