const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const db = require("./setup/myurl").mongoURL;
const auth = require("./routes/api/auth");
const profile = require("./routes/api/profile");
const questions = require("./routes/api/questions");
const passport = require("passport");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//Routes
app.use("/api/auth", auth);
app.use("/api/profile", profile);
app.use("/api/questions", questions);

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.log(err));

// Middleware for JWT stratergy
app.use(passport.initialize());
require("./stratergies/jsonwtStratergy")(passport);

app.get("/", (req, res) => {
  res.send("BigStack");
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Port is running at ${port}`));
