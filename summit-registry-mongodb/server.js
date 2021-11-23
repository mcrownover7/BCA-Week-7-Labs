//importing mongoose
const mongoose = require("mongoose");
//connect mongoose to the database

//bringing in express
const express = require("express");

//bringing in cors to resolve any CORS errors in-browser
const cors = require("cors");

//importing entry schema
const Entry = require("./Entry");

//creating the initial connection to the database
mongoose.connect("mongodb://localhost:27017/summit-registry", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//init the database through the connection constructor, stored in a variable
const db = mongoose.connection;

//setting up default port
const port = process.env.PORT || 5000;

//binding express to a variable
const app = express();

//binds error message to the connection variable to print if an error occurs
db.on("error", console.error.bind(console, "connection error"));

//middleware functions
app.use(express.static("./build"));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//creating the Entries model utilizing the Entry schema and the "findome-entries" collection
const Entries = mongoose.model("findome-entries", Entry);

//creating our API route for the front end to access the entries from the database
app.get("/allentries", async (req, res) => {
  //assigning the result of a find on our Model to a variable
  let allEntries = await Entries.find({});
  //sending the result as a json to the page
  res.json(allEntries);
});

//CREATE functionality for inserting a new entry into our collection
app.post("/write", async (req, res) => {
  //assigning the creation of a new entry to a variable
  const newEntry = new Entries({
    name: req.body.name,
    date: req.body.date,
    msg: req.body.msg,
  });
  //saving the new entry to the Model
  await newEntry.save();
  //redirecting to the home page
  res.redirect("/");
});

//DELETE functionality for removing an entry based on the id received in params
//grabbing the document id received in params
//using the retrieved document id to delete a matching document in our Entries model
//redirecting to the home page
app.post(`/scribble/:id`, async (req, res) => {
  await Entries.deleteOne({ _id: req.params.id });
  res.redirect("/");
});

//UPDATE functionality for editing an entry based on the id received in params
//first send user to a new page for editing the selected entry
app.post(`/pencil-in/:id`, async (req, res) => {
  //didn't set up this intermediate in the delete post
  //grabbing the document id received in params
  let entryId = req.params.id;
  //sending the user to a new page
  res.send(`<div><h2>What are you writing over?</h2>
  <form method = "POST" action="/pencil-in/${entryId}/update">
        <input type = "text" name="name" placeholder = "name"/>
        <input type = "text" name="date" placeholder = "date"/>
        <input type = "text" name="msg" placeholder = "message"/>
        <input type="submit" />
        </form>
        </div>`);
});

//then send over the edits, conditionally checking for fields being updated to prevent fields from being saved as blank
app.post("/pencil-in/:id/update", async (req, res) => {
  //grabbing the document id received in params
  let entryId = req.params.id;
  //creating empty object to hold any updated values
  let updatedEntry = {};
  //series of if statements checking if values were received in the body of the request; assigning them to our updated object if they do exist
  if (req.body.name) {
    updatedEntry.name = req.body.name;
  }
  if (req.body.date) {
    updatedEntry.date = req.body.date;
  }
  if (req.body.msg) {
    updatedEntry.msg = req.body.msg;
  }
  //finding a document by its ID and then updating its key:value pairs dependant on whether or not they exist in the updated object
  await Entries.updateOne({ _id: entryId }, { $set: updatedEntry });
  //redirecting to the home page
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
