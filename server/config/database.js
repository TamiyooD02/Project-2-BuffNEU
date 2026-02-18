import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/buffneu';
let client = null;
let db = null;

/**
 * Connect to MongoDB and return the database instance.
 * Reuses existing connection if available.
 * @returns {Promise<import('mongodb').Db>}
 */
export async function connectToDatabase() {
  if (db) {
    return db;
  }
  client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  return db;
}

/**
 * Close the MongoDB connection.
 * @returns {Promise<void>}
 */
export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
