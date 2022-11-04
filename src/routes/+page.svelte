<script lang="ts">
	import { writable, type Writable } from "svelte/store"
	import { lookup, type Aircraft } from "$lib/aircraft"
	import { calcMoment, type MomentInput, type MomentOutput } from "$lib/momentCalc"

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

    let input: Writable<MomentInput> = writable({
        frontSeats: "",
        rearSeats: "",
        frontBag: "17",
        rearBag: "",
        fuel: "",
        taxiBurn: "",
        flightBurn: ""
    })

    let calculatedMoment: MomentOutput = {
        frontSeats: 0,
        rearSeats: 0,
        frontBag: 0,
        rearBag: 0,
        fuel: 0,
        taxiBurn: 0,
        flightBurn: 0,
    }

    let totalMoments = {
        empty: 0,
        ramp: 0,
        takeoff: 0,
        land: 0
    }
    input.subscribe(i => {
        //Convert weight strings into numbers
        //TODO
        //Calculate total weights
        //TODO
        //Calculate total moments
        calculatedMoment = calcMoment(i)
        totalMoments.empty = aircraftData.moment + calculatedMoment.frontSeats + calculatedMoment.rearSeats + calculatedMoment.frontBag + calculatedMoment.rearBag
        totalMoments.ramp = totalMoments.empty + calculatedMoment.fuel
        totalMoments.takeoff = totalMoments.ramp - calculatedMoment.taxiBurn
        totalMoments.land = totalMoments.takeoff - calculatedMoment.flightBurn
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
                        <td><input type="text" bind:value={$input.frontSeats} class={$input.frontSeats == "" ? "empty" : "success"}></td>
                        <td>37</td>
                        <td>{calculatedMoment.frontSeats}</td>
                    </tr>
                    <tr>
                        <td>Rear seat</td>
                        <td><input type="text" bind:value={$input.rearSeats} class={$input.rearSeats == "" ? "empty" : "success"}></td>
                        <td>73</td>
                        <td>{calculatedMoment.rearSeats}</td>
                    </tr>
                    <tr>
                        <td>Forward bag</td>
                        <td><input type="text" bind:value={$input.frontBag} class={$input.frontBag == "" ? "empty" : "success"}></td>
                        <td>95</td>
                        <td>{calculatedMoment.frontBag}</td>
                    </tr>
                    <tr>
                        <td>Aft bag</td>
                        <td><input type="text" bind:value={$input.rearBag} class={$input.rearBag == "" ? "empty" : "success"}></td>
                        <td>123</td>
                        <td>{calculatedMoment.rearBag}</td>
                    </tr>
                    <tr class="output">
                        <td>Empty weight</td>
                        <td></td>
                        <td></td>
                        <td>{totalMoments.empty}</td>
                    </tr>
                    <tr>
                        <td>Ramp fuel</td>
                        <td><input type="text" bind:value={$input.fuel} class={$input.fuel == "" ? "empty" : "success"}></td>
                        <td>48</td>
                        <td>{calculatedMoment.fuel}</td>
                    </tr>
                    <tr class="output">
                        <td>Ramp weight</td>
                        <td></td>
                        <td></td>
                        <td>{totalMoments.ramp}</td>
                    </tr>
                    <tr>
                        <td>Burn in taxi</td>
                        <td><input type="text" bind:value={$input.taxiBurn} class={$input.taxiBurn == "" ? "empty" : "success"}></td>
                        <td>48</td>
                        <td>{calculatedMoment.taxiBurn}</td>
                    </tr>
                    <tr class="output">
                        <td>Takeoff weight</td>
                        <td></td>
                        <td></td>
                        <td>{totalMoments.takeoff}</td>
                    </tr>
                    <tr>
                        <td>Burn in flight</td>
                        <td><input type="text" bind:value={$input.flightBurn} class={$input.flightBurn == "" ? "empty" : "success"}></td>
                        <td>48</td>
                        <td>{calculatedMoment.flightBurn}</td>
                    </tr>
                    <tr class="output">
                        <td>Landing weight</td>
                        <td></td>
                        <td></td>
                        <td>{totalMoments.land}</td>
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

