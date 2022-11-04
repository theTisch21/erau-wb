<script lang="ts">
	import { writable } from "svelte/store"
	import { lookup, type Aircraft } from "../lib/aircraft"	
	import { empty } from "svelte/internal"
    let a: string = ""
    let aircraftName = writable("")
    let inputFail = false
    let aircraftData: Aircraft = {name: "", weight: 0, arm: 0, moment: 0}
    aircraftName.subscribe(async a => {
        console.log(a)
        let newPlane = await lookup(a)
        if(newPlane != null) {
            inputFail = false
            aircraftData = newPlane
        } else {
            inputFail = true
        }
    })
</script>

<main>
    <head>
        <title>Weight and Balance</title>
    </head>
    <body>
        <div id="header">
            <h1>Welcome to Sam's ERAU Cessna 172 Weight and Balance Calculator!</h1>
            <p>Fill out the info below to calculate weight and balance for your aircraft!</p>    
        </div>
        <div id="calc">
            <h2>Aircraft:</h2>
            <input type="text" placeholder="Copy from ETA" title="Aircraft" bind:value={$aircraftName} style="font-size: large;" class={inputFail ? ($aircraftName != "" ? "fail" : "empty") : "empty"}/>
            <table>
                <thead>
                    <th>Item</th>
                    <th>Weight</th>
                    <th>Arm</th>
                    <th>Moment</th>
                </thead>
                <tbody>
                    <tr>
                        <td>Empty</td>
                        <td>{aircraftData.weight}</td>
                        <td>{aircraftData.arm}</td>
                        <td>{aircraftData.moment}</td>
                    </tr>
                    <tr>
                        <td>Front seats</td>
                        <td><input type="text" bind:value={a}></td>
                        <td>{a}</td>
                        <td>{a}</td>
                    </tr>
                    <tr>
                        <td>Rear seat</td>
                        <td><input type="text" bind:value={a}></td>
                        <td>{a}</td>
                        <td>{a}</td>
                    </tr>
                    <tr>
                        <td>Forward bag</td>
                        <td><input type="text" bind:value={a} class={a == "" ? "empty" : "success"}></td>
                        <td>{a}</td>
                        <td>{a}</td>
                    </tr>
                    <tr>
                        <td>Aft bag</td>
                        <td><input type="text" bind:value={a}></td>
                        <td>{a}</td>
                        <td>{a}</td>
                    </tr>
                    <tr class="output">
                        <td>Empty weight</td>
                        <td></td>
                        <td>{a}</td>
                        <td>{a}</td>
                    </tr>
                    <tr>
                        <td>Ramp fuel</td>
                        <td><input type="text" bind:value={a}></td>
                        <td>{a}</td>
                        <td>{a}</td>
                    </tr>
                    <tr class="output">
                        <td>Ramp weight</td>
                        <td></td>
                        <td>{a}</td>
                        <td>{a}</td>
                    </tr>
                    <tr>
                        <td>Burn in taxi</td>
                        <td><input type="text" bind:value={a}></td>
                        <td>{a}</td>
                        <td>{a}</td>
                    </tr>
                    <tr class="output">
                        <td>Takeoff weight</td>
                        <td></td>
                        <td>{a}</td>
                        <td>{a}</td>
                    </tr>
                    <tr>
                        <td>Burn in flight</td>
                        <td><input type="text" bind:value={a}></td>
                        <td>{a}</td>
                        <td>{a}</td>
                    </tr>
                    <tr class="output">
                        <td>Landing weight</td>
                        <td></td>
                        <td>{a}</td>
                        <td>{a}</td>
                    </tr>
                </tbody>
            </table>
            
        </div>
    </body>
</main>

<style>
    table, th, td {
        border: 2px solid;
        border-collapse: collapse;
    }
    input {
        transition: all .5s;
    }
    .empty {
        background-color: lime;
    }
    .success {
        background-color: white;
    }
    .fail {
        background-color: red;
    }
    table input {
        box-sizing: content-box;
        width: 70px;
        margin: 5px;
    }
    td {
        width: 100px;
        height: 30px
    }
    table .output {
        background-color: #ccccff;
    }
</style>

