<script lang="ts">
	import { writable } from "svelte/store"
	import { goto } from "$app/navigation"
	import type { newUserData } from "$lib/Database/accountWrangler"
    let email = ""
    let password = ""
    let confirmPassword = ""
    let name = ""
    let etaName = ""
    let error = ""
    async function register() {
        error = ""
        if(email.length == 0 || password.length == 0 || name.length == 0 || etaName.length == 0) {
            error = "Please fill out all fields"
        }
        if(password !== confirmPassword) {
            error = "Passwords do not match"
        }
        if(!email.includes("@my.erau.edu") && !email.includes("@erau.edu")) {
            error = "Email must be an ERAU email address"
        }
        if(error == "") { //No errors, proceed with creation
            const accountData: newUserData = {
                email: email,
                password: password,
                name: name,
                etaName: etaName,
            }
            const response = await fetch("/account/register", {
                method: "POST",
                body: JSON.stringify(accountData),
                headers: new Headers({"content-type": "application/json"})
            })
            let t = await response.text()
            if(t == "OK") {
                await goto("/")
            } else {
                error = t
            }
        }
    }
</script>

<main>
    <h1>Register a new account</h1>
    <label for="email">ERAU email</label>
    <input type="text" id="email" bind:value={email} />
    <label for="password">Password:</label>
    <input type="password" id="password" bind:value={password}/>
    <label for="confirmPassword">Confirm Password:</label>
    <input type="password" id="confirmPassword" bind:value={confirmPassword}/>
    <label for="name">Preferred name:</label>
    <input type="text" id="name" bind:value={name}/>
    <label for="etaName">ETA name <a href="/about/etaname">(how to find)</a>:</label> <!--TODO make this link open a new tab-->
    <input type="text" id="etaName" bind:value={etaName}/>
    {#if error != ""}
        <h2>ERROR: {error}</h2> <!--TODO Use same error style as main page-->
    {/if}
    <button on:click={register}>REGISTER</button>
</main>