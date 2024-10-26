const { MongoClient } = require('mongodb');
const config = require("../config/db");

const url = config.uri;
const dbName = config.dbName;

let db;

const connectToDb = async () => {
    const client = new MongoClient(url);
    try {
        await client.connect();
        db = client.db(dbName);
        console.log('Connected to MongoDB');
    } catch {
        console.error('Failed to connect to database:', error);
        throw error;
    }
};

const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
};

module.exports = { connectToDb, getDb };
