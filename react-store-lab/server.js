const DataStore = require("./data-store");

//-----------------------EXPRESS CODE-----------------------------
const express = require("express");
const app = express();
const path = require("path");
//setting up port or defaults to 5000
let port = process.env.PORT || 5000;

//static makes express server more secure
app.use(express.static("./client/public"));
app.use(express.urlencoded({ extended: true }));
const publicDir = path.resolve("./client/public");

let collection = new DataStore("mongodb://localhost:27017", "library", "books");

//creating json formatted list of all books in database
let allBooksArray = []
app.get("/all", async (req, res) => {
  let allBooksArray = await collection.all();
  res.send(allBooksArray);
});

//--------------------Find & Find by ID-----------------------

//--------------------Add One || Many Entries-----------------

//--------------------Updating & Deleting---------------------

//routing * to handle any non-set routes to a 404 page
app.get("*", (req, res) => {
  res.send(`<h3>404: Whoops, something went wrong...</h3>`);
});

//listening on port 5000 and console logging a message to ensure it is listening
app.listen(port, () => console.log(`React Store app listening port ${port}!`));
