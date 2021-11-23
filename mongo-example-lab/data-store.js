const { MongoClient, ObjectId } = require("mongodb");

class DataStore {
  constructor(dbUrl, dbName, collName) {
    this.dbUrl = dbUrl;
    this.dbName = dbName;
    this.collName = collName;
    this.dbClient = null;
  }
  //client method
  async client() {
    // console.log(`Connecting to ${this.dbUrl}...`);
    //opening connection to the MongoDB server
    //saves connection inside instance variable dbClient
    //reuses saved connection if possible
    this.dbClient = await MongoClient.connect(this.dbUrl, {
      useNewUrlParser: true,
    });
    // console.log("Connected to database.");
    return this.dbClient;
  }

  //collection method
  //async because database connection may not be currently opened
  async collection() {
    //acquires connection to MongoDB server using client method that returns an instanced dbClient
    const client = await this.client();
    //asks for database named dbName
    const db = client.db(this.dbName);
    //asks for collection named collName inside of dbName
    const collection = db.collection(this.collName);
    return collection;
  }

  //all method
  async all() {
    //connects to the collection using collection returned from collection method
    let collection = await this.collection();
    //asks for a cursor using empty find to return all
    return collection.find({});
  }

  //find method
  async find(query) {
    //connects to the collection using collection returned from collection method
    let collection = await this.collection();
    //asks for a cursor using the query from mongo-client
    return collection.find(query);
  }

  //addEntry method
  async addEntry(docObj) {
    //connects to the collection using collection returned from collection method
    let collection = await this.collection();
    let addNewEntry = await collection.insertOne(docObj);
    return addNewEntry;
  }

  //findOne method
  //find a single item based on it's id field
  async findOne(id) {
    //connects to the collection using collection returned from collection method
    let collection = await this.collection();
    //turns string id into Mongo ObjectId
    let objId = new ObjectId(id);
    //returns single document matching id
    return collection.findOne({ _id: objId });
  }

  //updateOne method
  async updateOne(id, updateObj) {
    //connects to the collection using collection returned from collection method
    let collection = await this.collection();
    //turns string id into Mongo ObjectId
    let objId = new ObjectId(id);
    //using atomic operator updateOne to update the document that matches the objId and puts in the updateObj values
    let updatedDoc = await collection.updateOne(
      { _id: objId },
      { $set: updateObj }
    );

    return updatedDoc;
  }

  //delete method
  async deleteOne(id) {
    //connects to the collection using collection returned from collection method
    let collection = await this.collection();
    //turns string id into Mongo ObjectId
    let objId = new ObjectId(id);
    //using atomic operator deleteOne to delete the document that matches the objId
    let deleteDoc = await collection.deleteOne({_id: objId})

    return deleteDoc
  }
  
  //   client.close()
}

//export class DataStore
module.exports = DataStore;
