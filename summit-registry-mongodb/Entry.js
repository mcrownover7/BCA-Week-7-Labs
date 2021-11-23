//importing mongoose
const mongoose = require("mongoose");

//creating our mongoose Schema
//these key value pairs are the name of the key and what TYPE you want the value to be
const EntrySchema = new mongoose.Schema({
  name: String,
  date: Date,
  msg: String,
});

//exporting just the EntrySchema
module.exports = EntrySchema;
