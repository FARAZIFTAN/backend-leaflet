const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://appUser:faraziftan2005@webservice.o6kn9is.mongodb.net/?retryWrites=true&w=majority&appName=Webservice';
const client = new MongoClient(uri);

let db;

async function connectToDatabase() {
  if (!db) {
    await client.connect();
    db = client.db('leafletdb');
  }
  return db;
}

module.exports = connectToDatabase;
