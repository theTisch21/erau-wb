import { Db, MongoClient } from 'mongodb'

const client: MongoClient = new MongoClient('mongodb://localhost')
client.connect()

const db = client.db('ERAU_WB')
export function getDb(): Db {
	return db
}
