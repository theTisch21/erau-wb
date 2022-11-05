<script lang="ts">
	import { writable, type Writable } from "svelte/store"
	import { lookup, type Aircraft } from "$lib/aircraft"
	import { calcMoment, type LineItems } from "$lib/momentCalc"
	import { calcLimits } from "$lib/limitCalc"

    let aircraftName = writable("")
    let inputFail = false
    let aircraftData: Aircraft = {name: "", weight: 0, arm: 0, moment: 0}
    aircraftName.subscribe(async a => {
        let newPlane = await lookup(a)
        if(newPlane != null) {
            inputFail = false
            aircraftData = newPlane
            refresh()
        } else {
            inputFail = true
        }
    })

    let input: Writable<LineItems<string>> = writable({
        frontSeats: "",
        rearSeats: "",
        frontBag: "17",
        rearBag: "",
        fuel: "",
        taxiBurn: "",
        flightBurn: ""
    })

    let numberInput = {
            frontSeats: Number($input.frontSeats),
            rearSeats: Number($input.rearSeats),
            frontBag: Number($input.frontBag),
            rearBag: Number($input.rearBag),
            fuel: Number($input.fuel),
            taxiBurn: Number($input.taxiBurn),
            flightBurn: Number($input.flightBurn),
        }

    let fuelInput = writable({
        ramp: "53",
        taxiBurn: "1.33",
        flightBurn: ""
    })

    fuelInput.subscribe(fuelInput => {
        $input.fuel = (Number(fuelInput.ramp) * 6).toFixed(2)
        $input.taxiBurn = (Number(fuelInput.taxiBurn) * 6).toFixed(2)
        $input.flightBurn = (Number(fuelInput.flightBurn) * 6).toFixed(2)
    })

    let calculatedMoment: LineItems<number> = {
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

    let totalWeights = {
        empty: 0,
        ramp: 0,
        takeoff: 0,
        land: 0
    }    

    let validationResult: {result: boolean, comment: string} = {
        result: false,
        comment: "No data entered"
    }

    input.subscribe(() => {
        refresh()
    })

    function refresh() {
        //Convert weight strings into numbers
        let numberInput: LineItems<number> = {
            frontSeats: Number($input.frontSeats),
            rearSeats: Number($input.rearSeats),
            frontBag: Number($input.frontBag),
            rearBag: Number($input.rearBag),
            fuel: Number($input.fuel),
            taxiBurn: Number($input.taxiBurn),
            flightBurn: Number($input.flightBurn),
        }
        //Calculate total weights
        totalWeights.empty = Number((aircraftData.weight + numberInput.frontSeats + numberInput.rearSeats + numberInput.frontBag + numberInput.rearBag).toFixed(2))
        totalWeights.ramp = Number((totalWeights.empty + numberInput.fuel).toFixed(2))
        totalWeights.takeoff = Number((totalWeights.ramp - numberInput.taxiBurn).toFixed(2))
        totalWeights.land = Number((totalWeights.takeoff - numberInput.flightBurn).toFixed(2))
        //Calculate total moments
        calculatedMoment = calcMoment(numberInput)
        totalMoments.empty = Number((aircraftData.moment + calculatedMoment.frontSeats + calculatedMoment.rearSeats + calculatedMoment.frontBag + calculatedMoment.rearBag).toFixed(2))
        totalMoments.ramp = Number((totalMoments.empty + calculatedMoment.fuel).toFixed(2))
        totalMoments.takeoff = Number((totalMoments.ramp - calculatedMoment.taxiBurn).toFixed(2))
        totalMoments.land = Number((totalMoments.takeoff - calculatedMoment.flightBurn).toFixed(2))
        //Validate
        validationResult = calcLimits(totalWeights.takeoff, totalMoments.takeoff)
    }

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
            <button on:click={()=>{aircraftName.set("R-73")}}>Set to heaviest aircraft</button>
            <table>
                <thead>
                    <th>Item</th>
                    <th>Weight (lbs)</th>
                    <th>Arm</th>
                    <th>Moment</th>
                    <th>Fuel (gal)</th>
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
                        <td>{totalWeights.empty}</td>
                        <td>{(totalMoments.empty/totalWeights.empty).toFixed(2)}</td>
                        <td>{totalMoments.empty}</td>
                    </tr>
                    <tr>
                        <td>Ramp fuel</td>
                        <td>{$input.fuel}</td>
                        <td>48</td>
                        <td>{calculatedMoment.fuel}</td>
                        <td><input type="text" bind:value={$fuelInput.ramp} class={$fuelInput.ramp == "" ? "empty" : "success"}></td>
                    </tr>
                    <tr class="output">
                        <td>Ramp weight</td>
                        <td>{totalWeights.ramp}</td>
                        <td>{(totalMoments.ramp/totalWeights.ramp).toFixed(2)}</td>
                        <td>{totalMoments.ramp}</td>
                    </tr>
                    <tr>
                        <td>Burn in taxi</td>
                        <td>-{$input.taxiBurn}</td>
                        <td>48</td>
                        <td>-{calculatedMoment.taxiBurn}</td>
                        <td>-<input type="text" bind:value={$fuelInput.taxiBurn} class={$fuelInput.taxiBurn == "" ? "empty" : "success"}></td>
                    </tr>
                    <tr class="output">
                        <td>Takeoff weight</td>
                        <td>{totalWeights.takeoff}</td>
                        <td>{(totalMoments.takeoff/totalWeights.takeoff).toFixed(2)}</td>
                        <td>{totalMoments.takeoff}</td>
                    </tr>
                    <tr>
                        <td>Burn in flight</td>
                        <td>-{$input.flightBurn}</td>
                        <td>48</td>
                        <td>-{calculatedMoment.flightBurn}</td>
                        <td>-<input type="text" bind:value={$fuelInput.flightBurn} class={$fuelInput.flightBurn == "" ? "empty" : "success"}></td>
                    </tr>
                    <tr class="output">
                        <td>Landing weight</td>
                        <td>{totalWeights.land}</td>
                        <td>{(totalMoments.land/totalWeights.land).toFixed(2)}</td>
                        <td>{totalMoments.land}</td>
                    </tr>
                </tbody>
            </table>
            
        </div>
        <div id="validation" class={validationResult.result ? "good" : "bad"}>
            <h1>{validationResult.comment}</h1>
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
    button {
        text-align: center;
        background-color: aqua;
        border-radius: 50px;
        font-size: large;
        transition: all .25s;
    }
    button:hover {
        background-color: rgb(0, 155, 155);
    }
    #validation {
        margin: 5px;
        padding: 50px;
        width: fit-content;
    }
    #validation.good {
        background-color: green;
    }
    #validation.bad {
        background-color: red;
        color: white;
    }
</style>

