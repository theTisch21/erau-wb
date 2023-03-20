import { getDb } from "./db"
import type { Collection } from "mongodb"
const db = getDb()

//Types
export type User = {
    username: string,
    salt: string,
    passwordHash: string,
    name: string,
}

const accountColl: Collection<User> = db.collection("Accounts")

async function getUser(username: string): User {
    const user = await accountColl.findOne({username: username})
    if (typeof user == "") { //TODO
        throw new Error("Hecc")
    }
    return user
}