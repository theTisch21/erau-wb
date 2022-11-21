<script lang="ts">
	import { writable, type Writable } from "svelte/store"
	import { lookup, type Aircraft } from "$lib/aircraft"
	import { calcLimits } from "$lib/limitCalc"
	import Line from "$lib/Lines/Line.svelte"
	import FuelLine from "$lib/Lines/FuelLine.svelte"
	import OutputLine from "$lib/Lines/OutputLine.svelte"
	import { FuelLineItem, LineItem, type CalculatedLine, type LineItems, type OutputLineItems } from "$lib/classes"

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

    let input = {
        frontSeats: new LineItem(37),
        rearSeats: new LineItem(73),
        frontBag: new LineItem(95),
        rearBag: new LineItem(123),
        rampFuel: new FuelLineItem(48),
        taxiBurn: new FuelLineItem(48),
        flightBurn: new FuelLineItem(48)
    }

    input.frontSeats.subscribeToMoment(refresh)
    input.rearSeats.subscribeToMoment(refresh)
    input.frontBag.subscribeToMoment(refresh)
    input.rearBag.subscribeToMoment(refresh)
    input.rampFuel.subscribeToMoment(refresh)
    input.taxiBurn.subscribeToMoment(refresh)
    input.flightBurn.subscribeToMoment(refresh)

    let output: OutputLineItems<CalculatedLine> = {
        empty: {
            weight: 0,
            arm: 0,
            moment: 0
        },
        ramp: {
            weight: 0,
            arm: 0,
            moment: 0
        },
        takeoff: {
            weight: 0,
            arm: 0,
            moment: 0
        },
        land: {
            weight: 0,
            arm: 0,
            moment: 0
        },
    }

    let validationResult: {result: boolean, comment: string} = {
        result: false,
        comment: "No data entered"
    }

    //
    // Change in aircraft
    //
    let newAircraft = false
    let newAircraftInputFail = false
    let newAircraftName = writable("")
    let newAircraftData: Aircraft = {name: "", weight: 0, arm: 0, moment: 0}
    let newAircraftTotals = {
        takeoffWeight: 0,
        takeoffMoment: 0,
        landWeight: 0,
        landMoment: 0
    }
    newAircraftName.subscribe(async a => {
        let newPlane = await lookup(a)
        if(newPlane != null) {
            newAircraftInputFail = false
            newAircraftData = newPlane
            refresh()
        } else {
            newAircraftInputFail = true
        }
    })

    //
    // Refresh
    //
    function refresh() {
        //Calculate total weights
        output.empty.weight = Number((aircraftData.weight + input.frontSeats.weight + input.rearSeats.weight + input.frontBag.weight + input.rearBag.weight).toFixed(2))
        output.ramp.weight = Number((output.empty.weight + input.rampFuel.weight).toFixed(2))
        output.takeoff.weight = Number((output.ramp.weight + input.taxiBurn.weight).toFixed(2))
        output.land.weight = Number((output.takeoff.weight + input.flightBurn.weight).toFixed(2))
        //Calculate total moments
        output.empty.moment = Number((aircraftData.moment + input.frontSeats.moment + input.rearSeats.moment + input.frontBag.moment + input.rearBag.moment).toFixed(2))
        output.ramp.moment = Number((output.empty.moment + input.rampFuel.moment).toFixed(2))
        output.takeoff.moment = Number((output.ramp.moment + input.taxiBurn.moment).toFixed(2))
        output.land.moment = Number((output.takeoff.moment + input.flightBurn.moment).toFixed(2))
        //Calculate arms
        output.empty.arm = Number((output.empty.moment / output.empty.weight).toFixed(2))
        output.ramp.arm = Number((output.ramp.moment / output.ramp.weight).toFixed(2))
        output.takeoff.arm = Number((output.takeoff.moment / output.takeoff.weight).toFixed(2))
        output.land.arm = Number((output.land.moment / output.land.weight).toFixed(2))
        //New aircraft
        if(newAircraft) {
            newAircraftTotals.takeoffWeight = Number((output.takeoff.weight - (aircraftData.weight - newAircraftData.weight)).toFixed(2))
            newAircraftTotals.landWeight = Number((output.land.weight - (aircraftData.weight - newAircraftData.weight)).toFixed(2))
            newAircraftTotals.takeoffMoment = Number((output.takeoff.moment - (aircraftData.moment - newAircraftData.moment)).toFixed(2))
            newAircraftTotals.landMoment = Number((output.land.moment - (aircraftData.moment - newAircraftData.moment)).toFixed(2))
            //Validate
            validationResult = calcLimits(newAircraftTotals.takeoffWeight, newAircraftTotals.takeoffMoment)
        } else {
            //Validate
            validationResult = calcLimits(output.takeoff.weight, output.takeoff.moment)
        }
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
            <p>Please note: Except for the data from ETA, all numbers are rounded UP to the nearest whole number or to 2 decimal places. This includes fuel burn during taxi, if you put in -1.4 gallons it will round to -8 pounds up from -8.4</p>   
        </div>
        <div id="calc">
            <h2>Aircraft:</h2>
            <input id="aircraft-input" type="text" placeholder="Copy from ETA" title="Aircraft" bind:value={$aircraftName} style="font-size: large;" class={inputFail ? ($aircraftName != "" ? "fail" : "empty") : "empty"}/>
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
                    <OutputLine data={aircraftData} name="Aircraft" testTag="aircraft" />                    
                    <Line data={input.frontSeats} name="Front Seats" testTag="fs" />                
                    <Line data={input.rearSeats} name="Rear seats" testTag="rs" />
                    <Line data={input.frontBag} name="Front Bags" testTag="fb" defaultValue=17 />
                    <Line data={input.rearBag} name="Aft bag" testTag="aft" defaultValue=0 />                 
                    <OutputLine data={output.empty} name="Empty weight" testTag="empty"/>
                    <FuelLine data={input.rampFuel} name="Ramp Fuel" testTag="rampFuel" defaultValue=53 />
                    <OutputLine data={output.ramp} name="Ramp weight" testTag="ramp" />
                    <FuelLine data={input.taxiBurn} name="Burn in taxi" testTag="taxi" subtract defaultValue=1.4 />
                    <OutputLine data={output.takeoff} name="Takeoff weight" testTag="takeoff" />
                    <FuelLine data={input.flightBurn} name="Burn in flight" testTag="flight" subtract defaultValue=15 />
                    <OutputLine data={output.land} name="Landing weight" testTag="land" />
                </tbody>
            </table>
            <button id="new-aircraft-button" hidden={newAircraft} on:click={()=>{newAircraft = true}}>Change in aircraft</button>
        </div>
        <div id="newAircraft" hidden={!newAircraft}>
            <input type="text" id="new-aircraft-input" placeholder="Copy from ETA" title="Aircraft" bind:value={$newAircraftName} style="font-size: large;" class={newAircraftInputFail ? ($newAircraftName != "" ? "fail" : "empty") : "empty"}/>
            <table>
                <tbody>
                    <tr>
                        <td>Difference</td>
                        <td id="diff-weight">-{(aircraftData.weight - newAircraftData.weight).toFixed(2)}</td>
                        <td id="diff-arm">{(aircraftData.arm - newAircraftData.arm).toFixed(2)}</td>
                        <td id="diff-moment">-{(aircraftData.moment - newAircraftData.moment).toFixed(2)}</td>
                    </tr>
                    <tr class="output">
                        <td>New Takeoff weight</td>
                        <td id="new-takeoff-weight">{newAircraftTotals.takeoffWeight}</td>
                        <td id="new-takeoff-arm">{(newAircraftTotals.takeoffMoment/newAircraftTotals.takeoffWeight).toFixed(2)}</td>
                        <td id="new-takeoff-moment">{newAircraftTotals.takeoffMoment}</td>
                    </tr>
                    <tr class="output">
                        <td>New Landing weight</td>
                        <td id="new-land-weight">{newAircraftTotals.landWeight}</td>
                        <td id="new-land-arm">{(newAircraftTotals.landMoment/newAircraftTotals.landWeight).toFixed(2)}</td>
                        <td id="new-land-moment">{newAircraftTotals.landMoment}</td>
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
    .empty {
        background-color: lime;
    }
    .success {
        background-color: white;
    }
    .fail {
        background-color: red;
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

