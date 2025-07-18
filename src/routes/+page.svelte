<script lang="ts">
	//
	// Imports
	//
	import { writable, type Writable } from 'svelte/store'
	import { lookupAircraft, type Aircraft } from '$lib/Lookups/Aircraft/aircraft'
	import Line from '$lib/Lines/Line.svelte'
	import FuelLine from '$lib/Lines/FuelLine.svelte'
	import OutputLine from '$lib/Lines/OutputLine.svelte'
	import PressureAlt from '$lib/Calculators/PressureAlt.svelte'
	import { decodeMetar } from '$lib/Calculators/metar'
	import { onMount } from 'svelte'
	import type { UserAlert } from './api/alert/+server'
	import OverrideLine from '$lib/Lines/OverrideLine.svelte'
	import type { TableOutput } from '$lib/Flow/table'
	import { Component, flow, type CompleteFlowOutput } from '$lib/Flow/flow'
	import { get } from 'svelte/store'
	import type { LimitResult } from '$lib/Flow/limitCalc'
	import { WB } from '$lib/WBError'
	import ErrorShower from '$lib/ErrorShower.svelte'

	//
	// Errors
	//

	let persistientErrors: Writable<WB[]> = writable([])
	let errorWritable: Writable<WB[]> = writable([])
	// Most errors can be cleared if the user changes their input. This function is called every refresh to make sure those errors don't build up.
	function wipeTempErrors() {
		let persistient = get(persistientErrors)
		errorWritable.set([...persistient])
	}
	function handleError(error: WB, persistient: boolean = false) {
		if (persistient) {
			let p = get(persistientErrors)
			p.push(error)
			persistientErrors.set(p)
		}
		// For any error
		let e = get(errorWritable)
		e.push(error)
		errorWritable.set(e)
	}

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
	let newAircraftData: Aircraft = {
		name: '',
		tailNumber: '',
		weight: 0,
		arm: 0,
		moment: 0
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

	//Change in aircraft overrides
	let isOverridingChangeInAircraft = writable(false)
	let changeOverrideData: Writable<Aircraft> = writable({
		name: '',
		tailNumber: '',
		weight: 0,
		arm: 0,
		moment: 0
	})

	let wind = writable('')
	let isTailwind = writable(false)
	//Flow
	let isOverridingToWeight = writable(false)
	let toWeightOverride = writable(0)
	let isOverridingClimbAlt = writable(false)
	let climbAltOverride = writable('')
	let flowResult: CompleteFlowOutput = {
		table: {
			aircraft: {
				weight: 0,
				arm: 0,
				moment: 0
			},
			frontSeats: {
				weight: 0,
				arm: 0,
				moment: 0
			},
			rearSeats: {
				weight: 0,
				arm: 0,
				moment: 0
			},
			frontBags: {
				weight: 0,
				arm: 0,
				moment: 0
			},
			aftBags: {
				weight: 0,
				arm: 0,
				moment: 0
			},
			zeroFuel: {
				weight: 0,
				arm: 0,
				moment: 0
			},
			rampFuel: {
				weight: 0,
				gallons: 0,
				arm: 0,
				moment: 0
			},
			ramp: {
				weight: 0,
				arm: 0,
				moment: 0
			},
			taxi: {
				weight: 0,
				gallons: 0,
				arm: 0,
				moment: 0
			},
			takeoff: {
				weight: 0,
				arm: 0,
				moment: 0
			},
			flight: {
				weight: 0,
				gallons: 0,
				arm: 0,
				moment: 0
			},
			landing: {
				weight: 0,
				arm: 0,
				moment: 0
			},
			changeAircraft: undefined
		},
		pressureAltitude: 0,
		maneuveringSpeed: 0,
		performance: {
			takeoffRoll: 0,
			takeoffFifty: 0,
			climbRate: 0,
			landRoll: 0,
			landFifty: 0
		},
		validation: {
			result: true,
			comment: '',
			overweightGallons: undefined
		}
	}

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
			if (a.toLowerCase().startsWith('t')) {
				handleError(
					new WB(
						123,
						"You are using a TEST aircraft! This aircraft's data is set and will never change. Do not use this for actual weight and balance!",
						Component.Table
					)
				)
			}
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
	wind.subscribe(refresh)
	isTailwind.subscribe(refresh)
	//Override
	overrideData.subscribe((o) => {
		aircraftData = o
		refresh()
	})
	changeOverrideData.subscribe((o) => {
		newAircraftData = o
		refresh()
	})
	toWeightOverride.subscribe(refresh)
	isOverridingToWeight.subscribe(refresh)
	isOverridingChangeInAircraft.subscribe(refresh)
	changeOverrideData.subscribe(refresh)
	climbAltOverride.subscribe(refresh)
	isOverridingClimbAlt.subscribe(refresh)

	//
	// Functions
	//
	function setMaxFuel() {
		//Get weight difference
		let newGallons = Number(get(rampFuel)) - (flowResult.validation.overweightGallons ?? 0)
		rampFuel.set(newGallons.toString())
		refresh()
	}

	//
	// Refresh
	//

	function refresh() {
		//Clear any temporary errors from the last refresh
		wipeTempErrors()
		//Complete linear flow
		try {
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
					},
					isChangingAircraft: newAircraft,
					changeInAircraft: newAircraftData
				},
				altimiter: Number(get(currentAltimiter)),
				fieldElevation: Number(get(currentFieldElevation)),
				headwind: get(isTailwind) ? -1 * Number(get(wind)) : Number(get(wind)),
				temperature: Number(get(currentTemp)),
				toWeightOverride: get(isOverridingToWeight) ? get(toWeightOverride) : 0,
				climbAlt: get(isOverridingClimbAlt) ? Number(get(climbAltOverride)) : 6000
			})
		} catch (error) {
			//Detect if this is a WB error by checking if it has the WB code property
			if ((error as any).wbcode == undefined) handleError(new WB(999, String(error)))
			else {
				//if error is a WB error
				let wbError: WB = error as WB

				handleError(wbError)
			}
		}
	}

	//
	// Loading
	//

	//Wait, why are we calling onMount down here?
	//By now, the variables have had a chance to initialize, so we can safely modify them here. This is mostly to load user and METAR data into the input boxes. We also call refresh() at the end to ensure data is always accurate.
	onMount(() => {
		//METAR
		if (metar.temp != null) {
			$currentTemp = metar.temp.toString()
		} else {
			handleError(
				new WB(
					124,
					'Unable to get temperature from METAR. Please add it manually',
					Component.PerfTemp
				),
				true
			)
		}
		if (metar.altimiter != null) {
			$currentAltimiter = metar.altimiter.toString()
		} else {
			handleError(
				new WB(
					125,
					'Unable to get altimiter from METAR. Please add it manually',
					Component.PressureAltitude
				),
				true
			)
		}

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
			<h1>Welcome to Traffic Cone's ERAU Cessna 172 Weight and Balance Calculator!</h1>
			<h2>
				You are using V3.5.2 <a href="https://github.com/thetisch21/erau-wb/blob/main/CHANGELOG.md"
					>What's new?</a
				>
			</h2>
			<p>Fill out the info below to calculate weight and balance for your aircraft!</p>
			<p>
				<strong>DISCLAIMER:</strong> These calculations are provided as reference, with no guarantee
				of accuracy, and should be checked against your own calculations. You, as either the pilot in
				command or acting pilot in command, are ultimately responsible for ensuring accurate weight and
				balance and performance calculations, and verifying they are within the limits outlined in the
				Pilot's Operating Handbook and the ERAU Flight Operations Manual.
			</p>
			<p>
				<strong>Rounding:</strong> Most numbers in the table are rounded UP to 2 decimal places (except
				ETA data). Performance numbers are rounded up to the nearest whole number. Climb rate and maneuvering
				speed are rounded down.
			</p>
			<p>
				<strong>ETA data accuracy:</strong> These numbers from ETA are up to date as of July 15,
				2025, but may not be completely up to date. <br />Please double-check with the POH during
				your preflight or check with the numbers on ETA to ensure accurate calculations.
			</p>
			<p>
				Notice something out of date? Send me an email: <a href="mailto:admin@erauwb.com"
					>admin@erauwb.com</a
				>
			</p>
		</div>
		{#if alert.alert}
			<div class="warning">
				<h1>WARNING</h1>
				<p>{alert.alertText}</p>
			</div>
		{/if}
		<ErrorShower component={Component.StartAndEnd} alerts={errorWritable} />
		<div id="calc">
			<h2>Aircraft:</h2>
			{#if !$isOverriding}
				<p>Use R- then the aircraft number. Add a space if the number is a single digit</p>
				<p>
					Examples: Riddle 12 = R-12 <br /> Riddle 5 = R- 5<br /> Riddle 25 (west ops) = R-25 W
					<br />For aircraft with extra characters (W, AF, *, SPIN, etc.), including them is
					optional<br />
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
						aircraftName.set('R-26')
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
				hidden={$isOverridingChangeInAircraft}
				type="text"
				id="new-aircraft-input"
				placeholder="Copy from ETA"
				title="Aircraft"
				bind:value={$newAircraftName}
				style="font-size: large;"
				class={newAircraftInputFail ? ($newAircraftName != '' ? 'fail' : 'empty') : 'empty'}
			/>
			<button
				id="change-aircraft-override-button"
				hidden={$isOverridingChangeInAircraft}
				on:click={() => {
					isOverridingChangeInAircraft.set(true)
				}}>Override new aircraft values</button
			>
			{#if flowResult.table.changeAircraft}
				<table>
					<tbody>
						{#if $isOverridingChangeInAircraft}
							<OverrideLine
								data={changeOverrideData}
								name="New aircraft"
								testTag="change-aircraft-override"
							/>
						{:else}
							<OutputLine data={newAircraftData} name="New aircraft" testTag="changeAircraft" />
						{/if}
						<tr>
							<td>Difference</td>
							<td id="diff-weight">{flowResult.table.changeAircraft.diff.weight}</td>
							<td id="diff-arm">{flowResult.table.changeAircraft.diff.arm}</td>
							<td id="diff-moment">{flowResult.table.changeAircraft.diff.moment}</td>
						</tr>
						<tr class="output">
							<td>New Takeoff weight</td>
							<td id="new-takeoff-weight">{flowResult.table.changeAircraft.takeoff.weight}</td>
							<td id="new-takeoff-arm">{flowResult.table.changeAircraft.takeoff.arm}</td>
							<td id="new-takeoff-moment">{flowResult.table.changeAircraft.takeoff.moment}</td>
						</tr>
						<tr class="output">
							<td>New Landing weight</td>
							<td id="new-land-weight">{flowResult.table.changeAircraft.landing.weight}</td>
							<td id="new-land-arm">{flowResult.table.changeAircraft.landing.arm}</td>
							<td id="new-land-moment">{flowResult.table.changeAircraft.landing.moment}</td>
						</tr>
					</tbody>
				</table>
			{/if}
		</div>
		<div id="validation" class={flowResult.validation.result ? 'good' : 'bad'}>
			<h1>{flowResult.validation.comment}</h1>
			{#if !flowResult.validation.result && (flowResult.validation.overweightGallons ?? 0) > 0}
				<button id="max-fuel-button" on:click={setMaxFuel}>Set fuel to maximum allowed</button>
			{/if}
		</div>
		<ErrorShower component={Component.Table} alerts={errorWritable} />
		<div id="Va">
			<h2>Maneuvering speed:</h2>
			<p id="va-output">Va = {flowResult.maneuveringSpeed} kts</p>
		</div>
		<PressureAlt fieldElevation={currentFieldElevation} altimiter={currentAltimiter}
			>{flowResult.pressureAltitude}</PressureAlt
		>
		<ErrorShower component={Component.PressureAltitude} alerts={errorWritable} />
		<div id="Performance">
			<h2>Performance data</h2>
			<h3>Temperature</h3>
			<label for="perf-temp-input">Temperature °C</label><br />
			<input
				type="text"
				id="perf-temp-input"
				placeholder="Current Temperature °C"
				title="Aircraft"
				bind:value={$currentTemp}
				class={$currentTemp == '' ? 'empty' : 'success'}
			/>
			<ErrorShower component={Component.PerfTemp} alerts={errorWritable} />
			<h3>Wind</h3>
			<p>
				{#if $isTailwind}Enter the current tailwind in knots. If you have a headwind, uncheck the
					checkbox below
				{:else}Enter the current headwind in knots. If you have a tailwind, check the checkbox below
				{/if}
			</p>
			<input type="checkbox" id="perf-wind-tailwind" bind:checked={$isTailwind} /><br />
			<input
				type="text"
				id="perf-wind-input"
				placeholder="Wind (kts)"
				title="Winds"
				bind:value={$wind}
				class={$wind == '' ? 'empty' : 'success'}
			/><br />
			<ErrorShower component={Component.Wind} alerts={errorWritable} />
			<h3>Weight</h3>
			<label for="override-to-weight-box">Override Takeoff Weight:</label>
			<input type="checkbox" id="override-to-weight-box" bind:checked={$isOverridingToWeight} />
			{#if $isOverridingToWeight}
				<label for="to-weight-override">Select which takeoff tables to use</label>
				<select id="to-weight-override" bind:value={$toWeightOverride}>
					<option selected value="2550">2550 lbs </option><option value="2400"
						>2400 lbs
					</option><option value="2200">2200 lbs </option></select
				>
				<p>Using {$toWeightOverride}lbs performance tables</p>
			{:else}
				<p>
					Using {(() => {
						if (flowResult.table.takeoff.weight > 2400) return 2550
						if (flowResult.table.takeoff.weight > 2200) return 2400
						return 2200
					})()}lbs performance tables
				</p>
			{/if}
			<h3>Altitude</h3>
			<p>Using 6000ft (traffic pattern altitude)</p>
			<label for="override-climb-alt">Override rate of climb altitude:</label>
			<input type="checkbox" id="override-climb-alt" bind:checked={$isOverridingClimbAlt} />
			{#if $isOverridingClimbAlt}
				<input
					type="text"
					id="perf-climb-alt"
					placeholder="Altitude"
					title="Climb altitude"
					bind:value={$climbAltOverride}
					class={$climbAltOverride == '' ? 'empty' : 'success'}
				/><br />
			{/if}
			<h3>Result</h3>
			<p id="perf-to-roll">Takeoff roll: {flowResult.performance.takeoffRoll}</p>
			<p id="perf-to-50">Takeoff 50ft: {flowResult.performance.takeoffFifty}</p>
			<p id="perf-climb">
				Climb rate: {flowResult.performance.climbRate} @ {$isOverridingClimbAlt
					? $climbAltOverride
					: 6000}ft
			</p>
			<p id="perf-land-roll">Land roll: {flowResult.performance.landRoll}</p>
			<p id="perf-land-50">Land 50ft: {flowResult.performance.landFifty}</p>
		</div>
		<ErrorShower component={Component.PerfResult} alerts={errorWritable} />
		<ErrorShower component={Component.StartAndEnd} alerts={errorWritable} />
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
		background-color: #f44;
		color: black;
	}
	.warning {
		padding: 2em;
		background-color: #f44;
		color: black;
		font-size: larger;
		font-weight: bold;
	}
	.notice {
		padding: 2em;
		background-color: #ff4;
		color: black;
		font-size: larger;
		font-weight: bold;
	}
</style>
