<script lang="ts">
	//
	// Imports
	//
	import { writable, type Writable } from 'svelte/store'
	import { lookupAircraft, type Aircraft } from '$lib/Lookups/Aircraft/aircraft'
	import Line from '$lib/Lines/Line.svelte'
	import FuelLine from '$lib/Lines/FuelLine.svelte'
	import OutputLine from '$lib/Lines/OutputLine.svelte'
	import { round } from '$lib/round'
	import PressureAlt from '$lib/Calculators/PressureAlt.svelte'
	import { decodeMetar } from '$lib/Calculators/metar'
	import { onMount } from 'svelte'
	import type { UserAlert } from './api/alert/+server'
	import OverrideLine from '$lib/Lines/OverrideLine.svelte'
	import type { TableOutput } from '$lib/Flow/table'
	import { flow, type CompleteFlowOutput } from '$lib/Flow/flow'
	import { get } from 'svelte/store'
	import type { LimitResult } from '$lib/Flow/limitCalc'

	//
	// Data
	//

	//METAR data
	export let data: import('./$types').PageServerData
	const metar = decodeMetar(data.metar)

	//Alert data
	const alert: UserAlert = data.alert

	//
	// Variables
	//

	//Validation
	let validationResult: LimitResult = {
		result: false,
		comment: 'No data entered'
	}

	//
	// Inputs
	//

	//WB
	let frontSeatsInput = writable('')
	let rearSeatsInput = writable('')
	let frontBagInput = writable('17')
	let rearBagInput = writable('0')

	let rampFuel = writable('53')
	let taxiFuel = writable('1.4')
	let flightFuel = writable('15')

	//Performance and PA
	let isRoundingDown = writable(false)
	let performanceMultiplier = writable('1')
	let currentAltimiter = writable('')
	let currentFieldElevation = writable('5045')
	let currentPressureAltitude = writable('')
	let currentTemp = writable('')

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

	//Aircraft overrides
	let isOverriding = writable(false)
	let overrideData: Writable<Aircraft> = writable({
		name: '',
		tailNumber: '',
		weight: 0,
		arm: 0,
		moment: 0
	})

	//Flow
	let isOverridingToWeight = writable(false)
	let toWeightOverride = writable(0)
	let flowResult: CompleteFlowOutput = flow({
		table: {
			aircraft: aircraftData,
			frontSeats: Number(get(frontSeatsInput)),
			rearSeats: Number(get(rearSeatsInput)),
			frontBags: Number(get(frontBagInput)),
			aftBags: Number(get(rearBagInput)),
			fuel: {
				start: Number(get(rampFuel)),
				taxiBurn: Number(get(taxiFuel)),
				flightBurn: Number(get(flightFuel))
			}
		},
		altimiter: Number(get(currentAltimiter)),
		fieldElevation: Number(get(currentFieldElevation)),
		toWeightOverride: get(toWeightOverride),
		performanceMultiplier: Number(get(performanceMultiplier)),
		temperature: Number(get(currentTemp))
	})

	//
	// Subscriptions
	//

	//Aircraft
	let secretz = false
	aircraftName.subscribe(async (a) => {
		if (a.toLowerCase() == 'orange') {
			secretz = true
		}
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
	//Table inputs
	frontSeatsInput.subscribe(refresh)
	rearSeatsInput.subscribe(refresh)
	frontBagInput.subscribe(refresh)
	rearBagInput.subscribe(refresh)

	rampFuel.subscribe(refresh)
	taxiFuel.subscribe(refresh)
	flightFuel.subscribe(refresh)

	//Performance
	currentTemp.subscribe(refresh)
	currentPressureAltitude.subscribe(refresh)
	currentAltimiter.subscribe(refresh)
	currentFieldElevation.subscribe(refresh)
	isRoundingDown.subscribe(refresh)
	performanceMultiplier.subscribe(refresh)
	//Override
	overrideData.subscribe((o) => {
		aircraftData = o
		refresh()
	})
	toWeightOverride.subscribe(refresh)
	isOverridingToWeight.subscribe(refresh)

	//
	// Functions
	//
	function setMaxFuel() {
		//Get weight difference
		let newGallons = Number(get(rampFuel)) - (validationResult.overweightGallons ?? 0)
		rampFuel.set(newGallons.toString())
		refresh()
	}

	//
	// Refresh
	//

	function refresh() {
		//Complete linear flow
		flowResult = flow({
			table: {
				aircraft: aircraftData,
				frontSeats: Number(get(frontSeatsInput)),
				rearSeats: Number(get(rearSeatsInput)),
				frontBags: Number(get(frontBagInput)),
				aftBags: Number(get(rearBagInput)),
				fuel: {
					start: Number(get(rampFuel)),
					taxiBurn: Number(get(taxiFuel)),
					flightBurn: Number(get(flightFuel))
				}
			},
			altimiter: Number(get(currentAltimiter)),
			fieldElevation: Number(get(currentFieldElevation)),
			performanceMultiplier: Number(get(performanceMultiplier)),
			temperature: Number(get(currentTemp)),
			toWeightOverride: get(isOverridingToWeight) ? get(toWeightOverride) : 0
		})
		//This object is so that we don't have to embed performance logic inside the new aircraft block, thereby not duplicating it.
		let p: { toWeight: number; toMoment: number; landWeight: number } = {
			toWeight: 0,
			toMoment: 0,
			landWeight: 0
		}
		//New aircraft
		/**if (newAircraft) {
			newAircraftTotals.takeoffWeight = round(
				tableOutput.takeoff.weight - (aircraftData.weight - newAircraftData.weight)
			)
			newAircraftTotals.landWeight = round(
				tableOutput.landing.weight - (aircraftData.weight - newAircraftData.weight)
			)
			newAircraftTotals.takeoffMoment = round(
				tableOutput.takeoff.moment - (aircraftData.moment - newAircraftData.moment)
			)
			newAircraftTotals.landMoment = round(
				tableOutput.landing.moment - (aircraftData.moment - newAircraftData.moment)
			)
			p.toWeight = newAircraftTotals.takeoffWeight
			p.landWeight = newAircraftTotals.landWeight
			p.toMoment = newAircraftTotals.takeoffMoment
		} else {
			p.toWeight = tableOutput.takeoff.weight
			p.landWeight = tableOutput.landing.weight
			p.toMoment = tableOutput.takeoff.moment
		}*/
		//Validate
		validationResult = flowResult.validation
	}

	//
	// Loading
	//

	//Wait, why are we calling onMount down here?
	//By now, the variables have had a chance to initialize, so we can safely modify them here. This is mostly to load user and METAR data into the input boxes. We also call refresh() at the end to ensure data is always accurate.
	onMount(() => {
		//METAR
		$currentTemp = metar.temp.toString()
		$currentAltimiter = metar.altimiter.toString()

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
			<h1>Welcome to Sam's ERAU Cessna 172 Weight and Balance Calculator!</h1>
			<h2>
				You are running V2.3 <a href="https://github.com/thetisch21/erau-wb/blob/main/CHANGELOG.md"
					>What's new?</a
				>
			</h2>
			<p>Fill out the info below to calculate weight and balance for your aircraft!</p>
			<p>
				<strong>Please note:</strong> All numbers are rounded UP to 2 decimal places, except for the
				data from ETA
			</p>
			<p>
				<strong>Please note again:</strong> These numbers from ETA are up to date as of January 27
				2023, but may not be completely up to date. <br />Please double-check with the POH during
				your preflight or check with the numbers on ETA to ensure accurate calculations.
			</p>
			<p>
				Notice something out of date? Send me an email: <a href="mailto:sam@erauwb.com"
					>sam@erauwb.com</a
				>
			</p>
		</div>
		{#if alert.alert}
			<div class="warning">
				<h1>WARNING</h1>
				<p>{alert.alertText}</p>
			</div>
		{/if}
		<div id="calc">
			<h2>Aircraft:</h2>
			{#if !$isOverriding}
				<p>Use R- then the aircraft number. Add a space if the number is a single digit</p>
				<p>
					Examples: Riddle 12 = R-12 <br /> Riddle 5 = R- 5<br /> Riddle 25 (west ops) = R-25 W
					<br />(The W is optional)
				</p>
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
				<button
					id="aircraft-override-button"
					on:click={() => {
						isOverriding.set(true)
					}}>Override aircraft values</button
				>
			{/if}
			<table>
				<thead>
					<th>Item</th>
					<th>Weight (lbs)</th>
					<th>Arm</th>
					<th>Moment</th>
					<th>Fuel (gal)</th>
				</thead>
				<tbody>
					<!--
						IDEA TODO
						Use <slot></slot> for a custom line?
						Have a regular output line that takes a WAB object
						But also a line that can slot in things like inputs, avoiding message chains
					-->
					{#if $isOverriding}
						<OverrideLine data={overrideData} name="Aircraft" testTag="aircraft" />
					{:else}
						<OutputLine data={aircraftData} name="Aircraft" testTag="aircraft" />
					{/if}
					<Line input={frontSeatsInput} arm="37" name="Front Seats" testTag="fs"
						>{flowResult.table.frontSeats.moment}</Line
					>
					<Line input={rearSeatsInput} arm="73" name="Rear seats" testTag="rs"
						>{flowResult.table.rearSeats.moment}</Line
					>
					<Line input={frontBagInput} arm="95" name="Front Bags" testTag="fb"
						>{flowResult.table.frontBags.moment}</Line
					>
					<Line input={rearBagInput} arm="123" name="Aft bag" testTag="aft"
						>{flowResult.table.aftBags.moment}</Line
					>
					<OutputLine data={flowResult.table.zeroFuel} name="Zero fuel weight" testTag="empty" />
					<FuelLine
						input={rampFuel}
						arm="48"
						weight={flowResult.table.rampFuel.weight}
						name="Ramp fuel"
						testTag="rampFuel"
						defaultValue="53">{flowResult.table.rampFuel.moment}</FuelLine
					>
					<OutputLine data={flowResult.table.ramp} name="Ramp weight" testTag="ramp" />
					<FuelLine
						input={taxiFuel}
						name="Burn in taxi"
						testTag="taxi"
						subtract
						defaultValue="1.4"
						arm="48"
						weight={flowResult.table.taxi.weight}>{flowResult.table.taxi.moment}</FuelLine
					>
					<OutputLine data={flowResult.table.takeoff} name="Takeoff weight" testTag="takeoff" />
					<FuelLine
						input={flightFuel}
						arm="48"
						name="Burn in flight"
						testTag="flight"
						subtract
						defaultValue="15"
						weight={flowResult.table.flight.weight}>{flowResult.table.flight.moment}</FuelLine
					>
					<OutputLine data={flowResult.table.landing} name="Landing weight" testTag="land" />
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
			{#if !validationResult.result && (validationResult.overweightGallons ?? 0) > 0}
				<button id="max-fuel-button" on:click={setMaxFuel}>Set fuel to maximum allowed</button>
			{/if}
		</div>
		<div id="Va">
			<h2>Maneuvering speed:</h2>
			<p>Va = {flowResult.maneuveringSpeed} kts</p>
		</div>
		<PressureAlt fieldElevation={currentFieldElevation} altimiter={currentAltimiter}>{flowResult.pressureAltitude}</PressureAlt>
		<div id="Performance">
			<h2>Performance data</h2>
			<input
				type="text"
				id="perf-temp-input"
				placeholder="Current Temperature °C"
				title="Aircraft"
				bind:value={$currentTemp}
				class={$currentTemp == '' ? 'empty' : 'success'}
			/>
			<p>
				Performance multiplier <br /> Use if you have winds. Decrease by .1 for every 9kts or
				greater headwind, increase by .1 for every 2kts or greater tailwind <br /> Examples:<br
				/>9kts headwind = .9<br />18kts headwind = .8<br />11kts headwind = .9 (You can only
				subtract 9 once, so only decrease by .1)<br />2kts tailwind = 1.1<br />6kts tailwind = 1.3
			</p>
			<input
				type="text"
				id="perf-multiplier-input"
				placeholder="Multiplier"
				title="Multiplier"
				bind:value={$performanceMultiplier}
				class={$performanceMultiplier == '' ? 'empty' : 'success'}
			/>
			<input type="checkbox" id="overrideToAlt" bind:checked={$isOverridingToWeight} />
			{#if $isOverridingToWeight}
				<label for="toWeightOverride">Select which takeoff tables to use</label>
				<select id="toWeightOverride" bind:value={$toWeightOverride}>
					<option selected value="2550">2550 lbs </option><option value="2400"
						>2400 lbs
					</option><option value="2200">2200 lbs </option></select
				>
				<p>Using {$toWeightOverride}lbs performance tables</p>
			{:else}
				<p>
					Using {(() => {
						const w = flowResult.table.takeoff.weight
						if (w > 2400) return 2550
						if (w > 2200) return 2400
						return 2200
					})()}lbs performance tables
				</p>
			{/if}
			<p id="perf-to-roll">Takeoff roll: {flowResult.performance.takeoffRoll}</p>
			<p id="perf-to-50">Takeoff 50ft: {flowResult.performance.takeoffFifty}</p>
			<p id="perf-climb">
				Climb rate: {flowResult.performance.climbRate} @ {flowResult.performance.climbAlt}ft
			</p>
			<p id="perf-land-roll">Land roll: {flowResult.performance.landRoll}</p>
			<p id="perf-land-50">Land 50ft: {flowResult.performance.landFifty}</p>
		</div>
	</body>
</main>

{#if secretz}
	<style>
		body {
			background-color: #ff7700;
		}
	</style>
{/if}

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
	.warning {
		padding: 2em;
		background-color: red;
		color: white;
	}
</style>
