<script lang="ts">
	import ErrorShower from '$lib/ErrorShower.svelte'
	import { Component } from '$lib/Flow/flow'
	import { calculateTFD, type tfdOutput } from '$lib/Lookups/TFDClimb/tfd'
	import { WB } from '$lib/WBError'
	import { round } from '$lib/round'
	import { get, writable, type Writable } from 'svelte/store'

	let errorWritable: Writable<WB[]> = writable([])
	function handleError(error: WB) {
		error.component = Component.TFDSAD
		let e = get(errorWritable)
		e.push(error)
		errorWritable.set(e)
	}

	let output: tfdOutput = calculateTFD(0, 0, 0, 0)

	let startAlt = writable('')
	let endAlt = writable('')
	let startTemp = writable('')
	let endTemp = writable('')

	startAlt.subscribe(refresh)
	endAlt.subscribe(refresh)
	startTemp.subscribe(refresh)
	endTemp.subscribe(refresh)

	function refresh() {
		errorWritable.set([])
		try {
			output = calculateTFD(
				Number(get(startAlt)),
				Number(get(startTemp)),
				Number(get(endAlt)),
				Number(get(endTemp))
			)
		} catch (error) {
			//Detect if this is a WB error by checking if it has the WB code property
			if ((error as any).wbcode == undefined) handleError(new WB(999, String(error)))
			else {
				//if error is a WB error
				let wbError: WB = error as WB
			}
		}
		console.log(output)
	}
</script>

<main>
	<h2>Time, Fuel, and Distance to climb</h2>
	<label for="tfd-startalt">Start altitude</label><br />
	<input
		id="tfd-startalt"
		bind:value={$startAlt}
		placeholder="Start altitude"
		class={$startAlt == '' ? 'empty' : 'success'}
	/><br />
	<label for="tfd-starttemp">Start temperature °C</label><br />
	<input
		id="tfd-starttemp"
		bind:value={$startTemp}
		placeholder="Start temperature °C"
		class={$startTemp == '' ? 'empty' : 'success'}
	/><br />
	<label for="tfd-endalt">End altitude</label><br />
	<input
		id="tfd-endalt"
		bind:value={$endAlt}
		placeholder="End altitude"
		class={$endAlt == '' ? 'empty' : 'success'}
	/><br />
	<label for="tfd-endtemp">End temperature °C</label><br />
	<input
		id="tfd-endtemp"
		bind:value={$endTemp}
		placeholder="End temperature °C"
		class={$endTemp == '' ? 'empty' : 'success'}
	/><br />

	<h3>Result:</h3>
	<p id="tfd-res-t">Time: {round(output.time)}</p>
	<p id="tfd-res-f">Fuel: {round(output.fuel)}</p>
	<p id="tfd-res-f-taxi">Fuel (+ 1.4 gal. for taxi): {round(output.fuel)}</p>
	<p id="tfd-res-d">Distance: {round(output.distance)}</p>

	<h3>Bottom of climb (original):</h3>
	<p id="tfd-b-t">Time: {round(output.startLine.time)}</p>
	<p id="tfd-b-f">Fuel: {round(output.startLine.fuel)}</p>
	<p id="tfd-b-d">Distance: {round(output.startLine.distance)}</p>

	<h3>Bottom of climb (temperature corrected):</h3>
	<p id="tfd-b-t">Time: {round(output.modifiedStartLine.time)}</p>
	<p id="tfd-b-f">Fuel: {round(output.modifiedStartLine.fuel)}</p>
	<p id="tfd-b-d">Distance: {round(output.modifiedStartLine.distance)}</p>

	<h3>Top of climb (original):</h3>
	<p id="tfd-t-t">Time: {round(output.endLine.time)}</p>
	<p id="tfd-t-f">Fuel: {round(output.endLine.fuel)}</p>
	<p id="tfd-t-d">Distance: {round(output.endLine.distance)}</p>

	<h3>Top of climb (temperature corrected):</h3>
	<p id="tfd-t-t">Time: {round(output.modifiedEndLine.time)}</p>
	<p id="tfd-t-f">Fuel: {round(output.modifiedEndLine.fuel)}</p>
	<p id="tfd-t-d">Distance: {round(output.modifiedEndLine.distance)}</p>

	<ErrorShower component={Component.TFDSAD} alerts={errorWritable} />
</main>

<style>
	.empty {
		background-color: lime;
	}
	.success {
		background-color: white;
	}
	input {
		transition: all 0.5s;
	}
</style>
