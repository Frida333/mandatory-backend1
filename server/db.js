const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const ObjectId = mongo.ObjectId;

const url = 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'chat';
const client = new MongoClient(url, { useUnifiedTopology: true });

client.connect();

module.exports = {
  getClient: function() {
    return client;
  },

  getDB: function() {
    let client = module.exports.getClient();
    let db = client.db(dbName);
    return db;
  },

  createObjectId(id) {
    return new ObjectId(id);
  }
};
