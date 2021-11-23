const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

//setup operation
mongoose.connect("mongodb://localhost:27017/CRUD-Lab", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//only needed for err handling
let connection = mongoose.connection;
//on err uses console.error.bind(to bind to the console) and display connection error in the console
connection.on("error", console.error.bind(console, "connection error"));

//setting up readline imports and ask function for user inputs
const readline = require("readline");
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);
function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

async function start() {
  //creating the droid schema
  const droidSchema = new mongoose.Schema({
    userName: String,
    droidName: String,
    color: String,
    astromech: Boolean,
    protocol: Boolean,
    affiliation: Number,
    date: Date,
  });

  //setting up the Droid model
  const Droid = mongoose.model("Droid", droidSchema);

  //starting ask to user
  let action = await ask(
    "Welcome to the droid maker! What do you want to do? (Create, Read, Update, Delete)\n"
  );

  //wrapping everything in while loop to re-ask if the user wants to do additional methods
  while (action.toLowerCase() != "exit") {
    //protection while loop to ensure user input create, read, update, or delete
    while (
      action.toLowerCase() != "create" &&
      action.toLowerCase() != "read" &&
      action.toLowerCase() != "update" &&
      action.toLowerCase() != "delete"
    ) {
      action = await ask(
        "Please select either Create, Read, Update, or Delete\n"
      );
    }
    //-----------------------------CREATE----------------------------------------
    if (action.toLowerCase() === "create") {
      //collecting string user responses
      let userName = await ask("What is your name?\n");
      let droidName = await ask(
        "What is the name of the droid you want to create?\n"
      );
      let droidColor = await ask("What is your droid's color(s)?\n");
      //asking for astromech yes or no
      let droidAstromech = await ask(
        "Is the droid an Astromech? (yes or no)\n"
      );

      //declaring remaining outside of if else loop
      let droidAffiliation;
      let droidProtocol;
      let droidDate;

      //guard on droidProtocol
      while (
        droidAstromech.toLowerCase() != "yes" &&
        droidAstromech.toLowerCase() != "no"
      ) {
        droidAstromech = await ask(
          "Please input either yes or no for if it is an Astromech.\n"
        );
      }

      //if astromech is no
      if (droidAstromech.toLowerCase() === "no") {
        //set boolean to false
        droidAstromech = false;
        //asking if protocol droid
        droidProtocol = await ask(
          "Is your droid a protocol droid? (yes or no)\n"
        );
        //guard on droidProtocol
        while (
          droidProtocol.toLowerCase() != "yes" &&
          droidProtocol.toLowerCase() != "no"
        ) {
          droidProtocol = await ask(
            "Please input either yes or no for if it is a protocol droid.\n"
          );
        }
        if (droidProtocol.toLowerCase() === "yes") {
          droidProtocol = true;
        } else {
          droidProtocol = false;
        }

        //asking for number for alliance or empire
        droidAffiliation = await ask(
          "What faction is your droid? 1 for Rebel Alliance, 2 for Empire.\n"
        );
        //while loop guarding against non 1 or 2 input
        while (
          parseInt(droidAffiliation) != 1 &&
          parseInt(droidAffiliation) != 2
        ) {
          droidAffiliation = await ask(
            "Please input 1 for Rebel Alliance or 2 for Empire.\n"
          );
        }
        //setting the date to the current date/time
        droidDate = new Date();
        //else if astromech is yes
      } else {
        //automatically setting booleans for astromech and protocol
        droidAstromech = true;
        droidProtocol = false;
        //asking for number for alliance or empire
        droidAffiliation = await ask(
          "What faction is your droid? 1 for Rebel Alliance, 2 for Empire.\n"
        );
        //while loop guarding against non 1 or 2 input
        while (
          parseInt(droidAffiliation) != 1 &&
          parseInt(droidAffiliation) != 2
        ) {
          droidAffiliation = await ask(
            "Please input 1 for Rebel Alliance or 2 for Empire.\n"
          );
        }
        //setting date to current date/time
        droidDate = new Date();
      }

      //creating a new droid using the droid model and the users inputs
      //NOTE: null is replacing false using it this way, could just have it be false by removing || null, but both are falsy values, so no impact to the operation of the database queries
      const response = new Droid({
        userName: userName,
        droidName: droidName,
        droidColor: droidColor,
        astromech: droidAstromech || null,
        protocol: droidProtocol || null,
        affiliation: droidAffiliation,
        date: droidDate,
      });

      await response.save();
      console.log("your droid has been created!");

      //----------------------------------------------READ--------------------------------------------
    } else if (action.toLowerCase() === "read") {
      //using find method to get all droids
      let allDroids = await Droid.find({});
      console.log(allDroids);

      //----------------------------------------------UPDATE--------------------------------------------
    } else if (action.toLowerCase() === "update") {
      //using find method to get all droids
      let allDroids = await Droid.find({});
      console.log(allDroids);

      //asking for the ID of the droid to update
      let updateTarget = await ask(
        "What is the ID of the droid do you want to update?\n"
      );
      //asking for the field the user wants to update
      let updateField = await ask("What field do you want to update?\n");
      //asking for the new value for the field the user wants to update
      let update = await ask("Enter a new value.\n");

      //using updateOne method and the user input to update the selected droid
      await Droid.updateOne(
        { _id: updateTarget },
        { $set: { [updateField]: update } }
      );
      console.log("Your entry has been updated!");

      //-------------------------------------------------DELETE-------------------------------------------
    } else if (action.toLowerCase() === "delete") {
      //using find to get all droids
      let allDroids = await Droid.find({});
      console.log(allDroids);

      //asking for the id of the target droid to delete
      let target = await ask(
        "What is the ID of the entry do you want to delete?\n"
      );

      //using deleteOne method and user input id to delete the target droid
      await Droid.deleteOne({ _id: target });
      console.log("Your entry has been deleted!");
    } else {
      console.log("invalid entry, try again");
    }

    //asking if the user wants to do any other operations
    action = await ask(
      "Do you want to create, read, update, or delete anything else?\nIf not enter exit!\n"
    );
  }

  process.exit();
}

start();
