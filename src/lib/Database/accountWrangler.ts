import { getDb } from "./db"
import type { Collection } from "mongodb"
const db = getDb()
import crypto from 'crypto';
import type { data } from "cypress/types/jquery";

//Types
export type User = {
    username: string,
    salt: string,
    passwordHash: string,
    name: string,
    etaName: string,
    optionalData?: {
        weight: number,
        instructorWeight: number,
        gearWeight: number
    }
}

export type Session = {
    username: string,
    token: string,
    createdAt: Date,
}

export type newUserData = {
    email: string,
    password: string,
    name: string,
    etaName: string
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

async function changePassword(username: string, oldPassword: string, newPassword: string): Promise<{newSession: Session}> {
    if(!(await checkPassword(username, oldPassword))) throw new Error("Old password not correct")
    deleteAllSessions(username)
    const user = await getUser(username)
    const newSalt = crypto.randomBytes(64).toString('hex')
    accountColl.updateOne({username: username}, {passwordHash: hash(newPassword + newSalt), salt: newSalt})
    return {newSession: await generateSession(username)}
}

export async function createUser(data : newUserData) {
    const newSalt = crypto.randomBytes(64).toString('hex')
    const passwordHash = hash(data.password + newSalt)
    const newUser = {
        username: data.email,
        salt: newSalt,
        passwordHash: passwordHash,
        name: data.name,
        etaName: data.etaName
    }
    accountColl.insertOne(newUser)
}

//Session management

//Check for expiration index
{
    //Creates the session namespace, TODO get rid of
    await sessionColl.insertOne({username: "TESTING", token: "abcd", createdAt: new Date()})
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
    } while (await sessionColl.countDocuments({token: newToken, username: username}) > 0) //Check that there are no duplicate tokens for a user
    const newSession: Session = {
        username: username,
        token: newToken,
        createdAt: new Date()
    }
    sessionColl.insertOne(newSession)
    return newSession
}

async function getSession(token: string, username: string): Promise<Session | null> {
    return await sessionColl.findOne({token: token, username: username})
}

async function deleteAllSessions(username: string) {
    await sessionColl.deleteMany({username: username})
}

//Aggregations and bulk management
async function getTrackedUsersEtaNames(): string[] {
    return accountColl.aggregate("HECC") //TODO Pipeline
}