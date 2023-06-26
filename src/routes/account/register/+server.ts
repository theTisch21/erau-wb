export type newAccountData = {
    email: string,
    password: string,
    name: string,
    etaName: string
}

export async function POST({request}) {
    const data: newAccountData = await request.json()
    console.log("A new account is being registered!")
    console.log(`Name: ${data.name}, email: ${data.email}, password: ${data.password}`)
    return new Response("OK")
}