import { getDb } from "./db"
import type { Collection } from "mongodb"
const db = getDb()
import crypto from 'crypto';

//Types
export type User = {
    username: string,
    salt: string,
    passwordHash: string,
    name: string,
}

const accountColl: Collection<User> = db.collection("Accounts")

function hash(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex');
}

async function getUser(username: string): Promise<User> {
    const user = await accountColl.findOne({username: username})
    if (user == null) {
        throw new Error("Hecc") //TODO
    }
    return user
}

async function checkPassword(username: string, inputPassword: string): Promise<boolean> {
    const user = getUser(username)
    const inputHash = hash(inputPassword)
    return (await user).passwordHash == inputHash
}