import {createUser, type newUserData } from "$lib/Database/accountWrangler.js"

export async function POST({request}) {
    const data: newUserData = await request.json()
    console.log("A new account is being registered!")
    console.log(`Name: ${data.name}, email: ${data.email}, password: ${data.password}`)
    createUser(data)
    return new Response("OK")
}