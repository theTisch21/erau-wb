<script lang="ts">
	//
	// Imports
	//
	import { writable, type Writable } from 'svelte/store'
	import { lookupAircraft, type Aircraft } from '$lib/Lookups/Aircraft/aircraft'
	import { calcLimits } from '$lib/limitCalc'
	import Line from '$lib/Lines/Line.svelte'
	import FuelLine from '$lib/Lines/FuelLine.svelte'
	import OutputLine from '$lib/Lines/OutputLine.svelte'
	import {
		FuelLineItem,
		LineItem,
		type CalculatedLine,
		type LineItems,
		type OutputLineItems
	} from '$lib/classes'
	import { round } from '$lib/round'
	import PressureAlt from '$lib/Calculators/PressureAlt.svelte'
	import {
		calculatePerformanceData,
		type PerformanceOutput
	} from '$lib/Lookups/Performance/Landing/performance'
	import { getClimbLine, getClimbRate } from '$lib/Lookups/Performance/Climb/climbRate'
	import { decodeMetar } from '$lib/Calculators/metar'
	import { onMount } from 'svelte'

	//
	// Data
	//

	//METAR data
	export let data: import('./$types').PageServerData
	const metar = data.metar

	//
	// Variables
	//

	//Validation
	let validationResult: { result: boolean; comment: string } = {
		result: false,
		comment: 'No data entered'
	}

	//Input/Output
	let input: {
		frontSeats: LineItem
		rearSeats: LineItem
		frontBag: LineItem
		rearBag: LineItem
		rampFuel: FuelLineItem
		taxiBurn: FuelLineItem
		flightBurn: FuelLineItem
	} = {
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
		}
	}

	//Aircraft lookups
	let aircraftName = writable('')
	let inputFail = false
	let aircraftData: Aircraft = { name: '', tailNumber: '', weight: 0, arm: 0, moment: 0 }

	//Change in aircraft
	let newAircraft = false
	let newAircraftInputFail = false
	let newAircraftName = writable('')
	let newAircraftData: Aircraft = { name: '', tailNumber: '', weight: 0, arm: 0, moment: 0 }
	let newAircraftTotals = {
		takeoffWeight: 0,
		takeoffMoment: 0,
		landWeight: 0,
		landMoment: 0
	}

	//Climb rate
	let climbRate: { rate: number; altitude: number } = { rate: 0, altitude: 0 }

	//Land/Takeoff Performance
	let Va = 0
	let performanceResult: { out: PerformanceOutput; downOption: boolean; notes?: string }
	let performanceData: PerformanceOutput = {
		takeoffRoll: 0,
		takeoffFifty: 0,
		landRoll: 0,
		landFifty: 0
	}
	let isRoundingDown = writable(false)
	let currentPressureAltitude = writable('')
	let currentTemp = writable('')

	//
	// Subscriptions
	//

	//Aircraft
	aircraftName.subscribe(async (a) => {
		let newPlane = await lookupAircraft(a)
		if (newPlane != null) {
			inputFail = false
			aircraftData = newPlane
			refresh()
		} else {
			inputFail = true
		}
	})
	newAircraftName.subscribe(async (a) => {
		let newPlane = await lookupAircraft(a)
		if (newPlane != null) {
			newAircraftInputFail = false
			newAircraftData = newPlane
			refresh()
		} else {
			newAircraftInputFail = true
		}
	})

	//Refresh
	//Input
	input.frontSeats.subscribeToMoment(refresh)
	input.rearSeats.subscribeToMoment(refresh)
	input.frontBag.subscribeToMoment(refresh)
	input.rearBag.subscribeToMoment(refresh)
	input.rampFuel.subscribeToMoment(refresh)
	input.taxiBurn.subscribeToMoment(refresh)
	input.flightBurn.subscribeToMoment(refresh)
	//Performance
	currentTemp.subscribe(refresh)
	currentPressureAltitude.subscribe(refresh)
	isRoundingDown.subscribe(refresh)

	//
	// Refresh
	//

	function refresh() {
		//Calculate total weights
		output.empty.weight = round(
			aircraftData.weight +
				input.frontSeats.weight +
				input.rearSeats.weight +
				input.frontBag.weight +
				input.rearBag.weight
		)
		output.ramp.weight = round(output.empty.weight + input.rampFuel.weight)
		output.takeoff.weight = round(output.ramp.weight + input.taxiBurn.weight)
		output.land.weight = round(output.takeoff.weight + input.flightBurn.weight)
		//Calculate total moments
		output.empty.moment = round(
			aircraftData.moment +
				input.frontSeats.moment +
				input.rearSeats.moment +
				input.frontBag.moment +
				input.rearBag.moment
		)
		output.ramp.moment = round(output.empty.moment + input.rampFuel.moment)
		output.takeoff.moment = round(output.ramp.moment + input.taxiBurn.moment)
		output.land.moment = round(output.takeoff.moment + input.flightBurn.moment)
		//Calculate arms
		output.empty.arm = round(output.empty.moment / output.empty.weight)
		output.ramp.arm = round(output.ramp.moment / output.ramp.weight)
		output.takeoff.arm = round(output.takeoff.moment / output.takeoff.weight)
		output.land.arm = round(output.land.moment / output.land.weight)
		//Climb rate
		if ($currentPressureAltitude != undefined) {
			//If it hasn't been set yet, just skip it
			//Due to how it's setup, a bad input can cause an infinite loop. We catch that here
			try {
				climbRate = getClimbRate(Number($currentPressureAltitude), Number($currentTemp))
			} catch (error) {
				console.log('Bad input to climb calculator')
				console.log(error)
			}
		}
		//This object is so that we don't have to embed performance logic inside the new aircraft block, thereby not duplicating it.
		let p: { toWeight: number; toMoment: number; landWeight: number } = {
			toWeight: 0,
			toMoment: 0,
			landWeight: 0
		}
		//New aircraft
		if (newAircraft) {
			newAircraftTotals.takeoffWeight = round(
				output.takeoff.weight - (aircraftData.weight - newAircraftData.weight)
			)
			newAircraftTotals.landWeight = round(
				output.land.weight - (aircraftData.weight - newAircraftData.weight)
			)
			newAircraftTotals.takeoffMoment = round(
				output.takeoff.moment - (aircraftData.moment - newAircraftData.moment)
			)
			newAircraftTotals.landMoment = round(
				output.land.moment - (aircraftData.moment - newAircraftData.moment)
			)
			p.toWeight = newAircraftTotals.takeoffWeight
			p.landWeight = newAircraftTotals.landWeight
			p.toMoment = newAircraftTotals.takeoffMoment
		} else {
			p.toWeight = output.takeoff.weight
			p.landWeight = output.land.weight
			p.toMoment = output.takeoff.moment
		}
		//Performance
		performanceResult = calculatePerformanceData(
			p.toWeight,
			Number($currentPressureAltitude),
			Number($currentTemp),
			$isRoundingDown
		)
		performanceData = performanceResult.out
		//Validate
		validationResult = calcLimits(p.toWeight, p.toMoment, input)
		Va = Math.floor(Math.sqrt(p.landWeight / 2550) * 105)
	}

	//
	// Loading
	//

	//Wait, why are we calling onMount down here?
	//By now, the variables have had a chance to initialize, so we can safely modify them here. This is mostly to load user and METAR data into the input boxes. We also call refresh() at the start and end to ensure data is always accurate.
	onMount(() => {
		refresh()
		
		//METAR
		//decodeMetar(metar)

		//User data
		//Coming soon:tm:
		refresh()
	})
</script>

<main>
	<head>
		<title>Weight and Balance</title>
	</head>
	<body>
		<div id="header">
			<h1>{metar}</h1>
			<h1>Welcome to Sam's ERAU Cessna 172 Weight and Balance Calculator!</h1>
			<p>Fill out the info below to calculate weight and balance for your aircraft!</p>
			<p>
				<strong>Please note:</strong> All numbers are rounded UP to 2 decimal places, except for the
				data from ETA
			</p>
			<p>
				<strong>Please note again:</strong> These numbers from ETA are up to date as of November 4,
				2022, but may not be completely up to date. <br />Please double-check with the POH during
				your preflight or check with the numbers on ETA to ensure accurate calculations.
			</p>
			<p>
				Notice something out of date? Send me an email: <a href="mailto:tischaes@my.erau.edu"
					>tischaes@my.erau.edu</a
				>
			</p>
		</div>
		<!--
            <div class="warning">
                <h1>ATTENTION</h1>
                <p>The numbers for takeoff roll over 50 ft. obstacle (Total ft on weight and balance sheet) are INNACURATE. Do not use them!!</p>
                <p>Reminder, double check all these numbers before using them. There's always a chance of a bug I didn't catch (Like this one!)</p>
            </div>
        -->
		<div id="calc">
			<h2>Aircraft:</h2>
			<input
				id="aircraft-input"
				type="text"
				placeholder="Copy from ETA"
				title="Aircraft"
				bind:value={$aircraftName}
				style="font-size: large;"
				class={inputFail ? ($aircraftName != '' ? 'fail' : 'empty') : 'empty'}
			/>
			<p>Tail number: {aircraftData.tailNumber}</p>
			<button
				on:click={() => {
					aircraftName.set('R-55')
				}}>Set to heaviest aircraft</button
			>
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
					<Line data={input.frontBag} name="Front Bags" testTag="fb" defaultValue="17" />
					<Line data={input.rearBag} name="Aft bag" testTag="aft" defaultValue="0" />
					<OutputLine data={output.empty} name="Empty weight" testTag="empty" />
					<FuelLine data={input.rampFuel} name="Ramp Fuel" testTag="rampFuel" defaultValue="53" />
					<OutputLine data={output.ramp} name="Ramp weight" testTag="ramp" />
					<FuelLine
						data={input.taxiBurn}
						name="Burn in taxi"
						testTag="taxi"
						subtract
						defaultValue="1.4"
					/>
					<OutputLine data={output.takeoff} name="Takeoff weight" testTag="takeoff" />
					<FuelLine
						data={input.flightBurn}
						name="Burn in flight"
						testTag="flight"
						subtract
						defaultValue="15"
					/>
					<OutputLine data={output.land} name="Landing weight" testTag="land" />
				</tbody>
			</table>
			<button
				id="new-aircraft-button"
				hidden={newAircraft}
				on:click={() => {
					newAircraft = true
				}}>Change in aircraft</button
			>
		</div>
		<div id="newAircraft" hidden={!newAircraft}>
			<input
				type="text"
				id="new-aircraft-input"
				placeholder="Copy from ETA"
				title="Aircraft"
				bind:value={$newAircraftName}
				style="font-size: large;"
				class={newAircraftInputFail ? ($newAircraftName != '' ? 'fail' : 'empty') : 'empty'}
			/>
			<table>
				<tbody>
					<tr>
						<td>Difference</td>
						<td id="diff-weight">{round(newAircraftData.weight - aircraftData.weight)}</td>
						<td id="diff-arm">{round(aircraftData.arm - newAircraftData.arm)}</td>
						<td id="diff-moment">{round(newAircraftData.moment - aircraftData.moment)}</td>
					</tr>
					<tr class="output">
						<td>New Takeoff weight</td>
						<td id="new-takeoff-weight">{newAircraftTotals.takeoffWeight}</td>
						<td id="new-takeoff-arm"
							>{round(newAircraftTotals.takeoffMoment / newAircraftTotals.takeoffWeight)}</td
						>
						<td id="new-takeoff-moment">{newAircraftTotals.takeoffMoment}</td>
					</tr>
					<tr class="output">
						<td>New Landing weight</td>
						<td id="new-land-weight">{newAircraftTotals.landWeight}</td>
						<td id="new-land-arm"
							>{round(newAircraftTotals.landMoment / newAircraftTotals.landWeight)}</td
						>
						<td id="new-land-moment">{newAircraftTotals.landMoment}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div id="validation" class={validationResult.result ? 'good' : 'bad'}>
			<h1>{validationResult.comment}</h1>
		</div>
		<div id="Va">
			<h2>Maneuvering speed:</h2>
			<p>Va = {Va} kts</p>
		</div>
		<PressureAlt pressureAltitude={currentPressureAltitude} />
		<div id="Performance">
			<h2>Performance data</h2>
			<p>
				These DO NOT factor in winds. Reference the PIM if you have headwind equal or greater than
				9kts or tailwind equal or greater than 2kts
			</p>
			<input
				type="text"
				id="perf-temp-input"
				placeholder="Current Temperature °C"
				title="Aircraft"
				bind:value={$currentTemp}
				class={$currentTemp == '' ? 'empty' : 'success'}
			/>
			<p id="perf-to-roll">Takeoff roll: {performanceData.takeoffRoll}</p>
			<p id="perf-to-50">Takeoff 50ft: {performanceData.takeoffFifty}</p>
			<p id="perf-climb">Climb rate: {climbRate.rate} @ {climbRate.altitude}ft</p>
			<p id="perf-land-roll">Land roll: {performanceData.landRoll}</p>
			<p id="perf-land-50">Land 50ft: {performanceData.landFifty}</p>
			{#if performanceResult.downOption}
				<h3>{performanceResult.notes}</h3>
				<input type="checkbox" bind:checked={$isRoundingDown} />
			{/if}
		</div>
	</body>
</main>

<style>
	table,
	th,
	td {
		border: 2px solid;
		border-collapse: collapse;
	}
	input {
		transition: all 0.5s;
	}
	td {
		width: 100px;
		height: 30px;
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
		transition: all 0.25s;
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
	/*
    .warning {
        padding: 2em;
        background-color: red;
        color: white;
    }
    */
</style>
