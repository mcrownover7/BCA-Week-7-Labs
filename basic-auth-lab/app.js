require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const path = require("path");
const mongoose = require("mongoose");

const port = 5000;
const app = express();
const staticDir = "./public";

//middleware functions
app.use(express.static(staticDir));
app.use(express.urlencoded({ extended: true }));

//------------------------------MONGOOSE SETUP------------------------------
//creating mongoose Schema for messages
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

//creating the initial connection to the database using url and .env secured password
mongoose.connect("mongodb://localhost:27017/Basic-Auth-Lab", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//init the database using connection constructor and storing in variable db
const db = mongoose.connection;

//setting up Messages model using the Message schema and the main collection (for the main chat room)
const Users = mongoose.model("users", UserSchema);

//binds error message to the connection variable to print if an error occurs with db connection
db.on("error", console.error.bind(console, "connection error"));

//------------------------------ROUTES---------------------------------------
app.post("/signup", async (req, res) => {
  //   let newUsername = req.body.username;
  //   let newPassword = req.body.password;

  let saltRounds = process.env.saltRounds;
  bcrypt.hash(req.body.password, parseInt(saltRounds), async (err, hash) => {
    if (err) {
      console.error(err.message);
    } else {
      let userDoc = {
        username: req.body.username,
        password: hash,
      };
      let newUser = new Users(userDoc);
      await newUser.save();
      res.redirect("/");
    }
  });
});

app.post("/login", async (req, res) => {
  let userObj = await Users.findOne({ username: req.body.username });

  bcrypt.compare(req.body.password, userObj.password, (err, result) => {
    if (err) {
      res.status(403).send("Access denied");
    } else {
      res.redirect(`/dashboard/${userObj.username}`);
    }
  });
});

app.get("/dashboard/:username", async (req, res) => {
  let username = req.params.username;
//   res.render(__dirname + "/public/dashboard.html");
res.send(`<h1>Welcome to your dashboard, ${username}</h1>`)
});

//routing * to handle any non-set routes to a 404 page
app.get("*", (req, res) => {
  res.send(`<h3>404: Whoops, something went wrong...</h3>`);
});

//listening on port 5000 and console logging a message to ensure it is listening
app.listen(port, () => console.log(`Basic Auth Lab listening port ${port}!`));
