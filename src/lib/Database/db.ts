import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb://localhost');
client.connect();

const db = client.db("ERAU_WB")
export function getDb() {return db}