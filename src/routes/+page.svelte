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
        totalWeights.empty = Number((aircraftData.weight + input.frontSeats.weight + numberInput.rearSeats + numberInput.frontBag + numberInput.rearBag).toFixed(2))
        totalWeights.ramp = Number((totalWeights.empty + numberInput.fuel).toFixed(2))
        totalWeights.takeoff = Number((totalWeights.ramp - numberInput.taxiBurn).toFixed(2))
        totalWeights.land = Number((totalWeights.takeoff - numberInput.flightBurn).toFixed(2))
        //Calculate total moments
        calculatedMoment = calcMoment(numberInput)
        totalMoments.empty = Number((aircraftData.moment + calculatedMoment.frontSeats + calculatedMoment.rearSeats + calculatedMoment.frontBag + calculatedMoment.rearBag).toFixed(2))
        totalMoments.ramp = Number((totalMoments.empty + calculatedMoment.fuel).toFixed(2))
        totalMoments.takeoff = Number((totalMoments.ramp - calculatedMoment.taxiBurn).toFixed(2))
        totalMoments.land = Number((totalMoments.takeoff - calculatedMoment.flightBurn).toFixed(2))
        //New aircraft
        if(newAircraft) {
            newAircraftTotals.takeoffWeight = Number((totalWeights.takeoff - (aircraftData.weight - newAircraftData.weight)).toFixed(2))
            newAircraftTotals.landWeight = Number((totalWeights.land - (aircraftData.weight - newAircraftData.weight)).toFixed(2))
            newAircraftTotals.takeoffMoment = Number((totalMoments.takeoff - (aircraftData.moment - newAircraftData.moment)).toFixed(2))
            newAircraftTotals.landMoment = Number((totalMoments.land - (aircraftData.moment - newAircraftData.moment)).toFixed(2))
            //Validate
            validationResult = calcLimits(newAircraftTotals.takeoffWeight, newAircraftTotals.takeoffMoment)
        } else {
            //Validate
            validationResult = calcLimits(totalWeights.takeoff, totalMoments.takeoff)
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
                    <Line data={input.frontBag} name="Front Bags" testTag="fb" />                
                    <Line data={input.rearBag} name="Aft bag" testTag="aft" />                 
                    <OutputLine data={output.empty} name="Empty weight" testTag="empty"/>
                    <FuelLine data={input.rampFuel} name="Ramp Fuel" testTag="ramp" />
                    <OutputLine data={output.ramp} name="Ramp weight" testTag="ramp" />
                    <FuelLine data={input.taxiBurn} name="Burn in taxi" testTag="taxi" />
                    <OutputLine data={output.takeoff} name="Takeoff weight" testTag="takeoff" />
                    <FuelLine data={input.flightBurn} name="Burn in flight" testTag="flight" />
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

