// const { MongoClient } = require("mongodb");
// const uri = "mongodb://localhost:27017"; //mongodb connects to port 27017 by default
// const client = new MongoClient(uri);
const DataStore = require("./data-store");

//setting up readline
const readline = require("readline");
const rli = readline.createInterface(process.stdin, process.stdout);

//creating ask function
function ask(questionText) {
  return new Promise((res, rej) => {
    rli.question(questionText, res);
  });
}

//----------------------RUN USING THE DATASTORE----------------------------
async function newDataStoreRun() {
  //creating new interface for database and connects to books collection inside library db
  let collection = new DataStore(
    "mongodb://localhost:27017",
    "library",
    "books"
  );

  //-----------------BUILDING OUT CLIENT------------------------
  //asking which method the user wants to use
  let methodSelect = await ask(
    "Do you want to..\nprint-all, find, add-entry, add-many, find-one-id, update-one, or delete.\n"
  );

  //wrapping everything in while loop to re-ask if the user wants to do additional methods
  while (methodSelect.toLowerCase() != "exit") {
    //guard to ensure one of the approved methods is selected
    while (
      methodSelect.toLowerCase() != "print-all" &&
      methodSelect.toLowerCase() != "find" &&
      methodSelect.toLowerCase() != "add-entry" &&
      methodSelect.toLowerCase() != "find-one-id" &&
      methodSelect.toLowerCase() != "update-one" &&
      methodSelect.toLowerCase() != "delete" &&
      methodSelect.toLowerCase() != "add-many"
    ) {
      methodSelect = await ask(
        "Please select either print-all, find, add-entry, add-many, find-one-id, update-one, or delete.\n"
      );
    }

    //---------print-all is selected
    if (methodSelect.toLowerCase() === "print-all") {
      //prints to the terminal all books in collection books using forEach
      let allBooks = await collection.all();
      //NOTE: have to await the forEach so it appears above the follow-up
      await allBooks.forEach((book) => {
        console.log(book);
      });

      //----------find is selected
    } else if (methodSelect.toLowerCase() === "find") {
      //asking for search by author or title
      let findValues = await ask("Do you want to search by title or author?\n");
      //guard against non title or author search
      while (
        findValues.toLowerCase() != "title" &&
        findValues.toLowerCase() != "author"
      ) {
        findValues = await ask("Please select either title or author.\n");
      }
      //if asking for a title to search for
      if (findValues.toLowerCase() === "title") {
        let findTitle = await ask("Enter the Title.\n");
        //using find method from DataStore to search for the provided title
        let foundBook = await collection.find({ title: findTitle });
        //NOTE: have to await the forEach so it appears above the follow-up
        await foundBook.forEach((book) => {
          console.log(book);
        });
        //if asking for an author to search for
      } else {
        let findAuthor = await ask("Enter the Author.\n");
        //using find method from DataStore to search for the provided author
        let foundBook = await collection.find({ author: findAuthor });
        //NOTE: have to await the forEach so it appears above the follow-up
        await foundBook.forEach((book) => {
          console.log(book);
        });
      }

      //------------add-entry is selected
    } else if (methodSelect.toLowerCase() === "add-entry") {
      //asking for title, author, and number of copies
      let addEntryTitle = await ask("What is the Title?\n");
      let addEntryAuthor = await ask("Who is the Author?\n");
      let addEntryCopies = await ask("How many copies?\n");
      //using addEntry method from DataStore to create a document matching the provided elements
      let addBook = await collection.addEntry({
        title: addEntryTitle,
        author: addEntryAuthor,
        copies: parseInt(addEntryCopies),
      });
      //console log shows acknowledged: true and the new _id
      console.log(addBook.insertedId);

      //------------add-many is selected
    } else if (methodSelect.toLowerCase() === "add-many") {
      //asking how many to create
      let createHowMany = await ask("How many do you want to create?\n");
      let createHowManyNum = parseInt(createHowMany);
      //for loop to create the correct number of new entries
      for (let newInput = 0; newInput < createHowMany; newInput++) {
        //asking for title, author, and number of copies
        let addEntryTitle = await ask("What is the Title?\n");
        let addEntryAuthor = await ask("Who is the Author?\n");
        let addEntryCopies = await ask("How many copies?\n");
        //using addEntry method from DataStore to create a document matching the provided elements
        let addBook = await collection.addEntry({
          title: addEntryTitle,
          author: addEntryAuthor,
          copies: parseInt(addEntryCopies),
        });
        //console log shows acknowledged: true and the new _id
        console.log(addBook.insertedId);
      }

      //----------find-one-id is selected
    } else if (methodSelect.toLowerCase() === "find-one-id") {
      //asking for the _id string
      let findId = await ask("What is the books _id string?\n");
      //using findOne method from DataStore to search for provided id string
      let foundBookById = await collection.findOne(findId);
      console.log(foundBookById);

      //----------update-one is selected
    } else if (methodSelect.toLowerCase() === "update-one") {
      //asking for id to update and either the author, title, or copies
      let updateId = await ask("What is the books _id string?\n");
      //using findOne method from DataStore to search for provided id string
      let itemToUpdate = await ask(
        "Do you want to update the author, title, or copies?\n"
      );
      //guard against inputs outside author, title, or copies
      while (
        itemToUpdate.toLowerCase() != "author" &&
        itemToUpdate.toLowerCase() != "title" &&
        itemToUpdate.toLowerCase() != "copies"
      ) {
        itemToUpdate = await ask(
          "Please select either author, title, or copies.\n"
        );
      }
      //updating the title
      if (itemToUpdate === "title") {
        //getting the correct title
        let titleUpdate = await ask("What is the correct title?\n");
        let updatedBook = await collection.updateOne(updateId, {
          title: titleUpdate,
        });
        //returns acknowledge, modifiedCount, etc.
        console.log(updatedBook);
        //updating the author
      } else if (itemToUpdate === "author") {
        let authorUpdate = await ask("Who is the correct author?\n");
        let updatedBook = await collection.updateOne(updateId, {
          author: authorUpdate,
        });
        //returns acknowledge, modifiedCount, etc.
        console.log(updatedBook);
        //updating the number of copies
      } else {
        let copiesUpdate = await ask("What is the correct number of copies?\n");
        let updatedBook = await collection.updateOne(updateId, {
          copies: parseInt(copiesUpdate),
        });
        //returns acknowledge, modifiedCount, etc.
        console.log(updatedBook);
      }

      //--------------delete is selected
    } else {
      //asking for the _id string
      let deleteId = await ask("What is the books _id string?\n");
      //using deleteOne method from DataStore to delete the doc for provided id string
      let deletedBook = await collection.deleteOne(deleteId);
      //returns acknowledged and the count of items deleted (should be 1)
      console.log(deletedBook);
    }

    methodSelect = await ask("Any other methods? Or type exit.\n");
  }
  //exiting the process if exit is input when prompted
  process.exit();
}

newDataStoreRun();

//----------------------------------OLD PRE-USER INPUT-----------------------------
//prints to the terminal all books in collection books using forEach
//   let allBooks = await collection.all();
//   allBooks.forEach((book) => {
//     console.log(book);
//   });

//using find method from DataStore
//   let foundBook = await collection.find({ author: "Marijn Haverbeke" });
//   foundBook.forEach((book) => {
//     console.log(book);
//   });

//using addEntry method from DataStore
//   let addBook = await collection.addEntry({
//     title: "Testing New Entry ID",
//     author: "Grace",
//     copies: 3,
//   });
//console log shows acknowledged: true and the new _id
//   console.log(addBook.insertedId);

//using findOne method from DataStore
//   let foundBookById = await collection.findOne("618aaae2e4b25304dd81695c");
//   console.log(foundBookById);

//using updateOne method
//   let updatedBook = await collection.updateOne("618aaae2e4b25304dd81695c", {
//     copies: 25,
//   });
//returns acknowledge, modifiedCount, etc.
//   console.log(updatedBook);
