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

export type Session = {
    username: string,
    token: string,
    createdAt: Date,
}

export type UserData = {
    weight: number,
    insructorWeight: number,
}

//Collections

const accountColl: Collection<User> = db.collection("Accounts")
const sessionColl: Collection<Session> = db.collection("Sessions")

//Utility

function hash(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex');
}

//User management

async function getUser(username: string): Promise<User> {
    const user = await accountColl.findOne({username: username})
    if (user == null) {
        throw new Error("Hecc") //TODO
    }
    return user
}

async function checkPassword(username: string, inputPassword: string): Promise<boolean> {
    const user = await getUser(username)
    const inputHash = hash(inputPassword + user.salt)
    return user.passwordHash == inputHash
}

async function createUser(username: string, password: string, name: string) {
    const newSalt = crypto.randomBytes(64).toString('hex')
    const passwordHash = hash(password + newSalt)
    const newUser = {
        username: username,
        salt: newSalt,
        passwordHash: passwordHash,
        name: name
    }
    accountColl.insertOne(newUser)
}

//Session management

//Check for expiration index
{
    const indexes = await sessionColl.listIndexes().toArray()
    let isThere = false
    for(const i in indexes) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if((i as any).name == "sessionExpiration") {
            isThere = true
        }
    }
    if(!isThere) {
        sessionColl.createIndex({"createdAt": 1}, {expireAfterSeconds: 10, name: "sessionExpiration"})
    }
}

async function generateSession(username: string): Promise<Session> {
    let newToken: string
    do {
        newToken = crypto.randomBytes(64).toString("hex")
    } while (await sessionColl.countDocuments({token: newToken}) > 0) //Check that there are no duplicate tokens
    const newSession: Session = {
        username: username,
        token: newToken,
        createdAt: new Date()
    }
    sessionColl.insertOne(newSession)
    return newSession
}

async function getSession(token: string): Promise<Session | null> {
    return await sessionColl.findOne({token: token})
}

async function deleteAllSessions(username: string) {
    await sessionColl.deleteMany({username: username})
}