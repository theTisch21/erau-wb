<script lang="ts">
	import { calculateTFD, type tfdOutput } from '$lib/Lookups/TFDClimb/tfd'
	import { round } from '$lib/round'
	import { get, writable } from 'svelte/store'

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
		output = calculateTFD(
			Number(get(startAlt)),
			Number(get(startTemp)),
			Number(get(endAlt)),
			Number(get(endTemp))
		)
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
	<p>{JSON.stringify(output)}</p>
	<h3>Result:</h3>
	<p>Time: {round(output.time)}</p>
	<p>Fuel: {round(output.fuel)}</p>
	<p>Distance: {round(output.distance)}</p>
	<h3>Bottom of climb:</h3>
	<p>Time: {round(output.startLine.time)}</p>
	<p>Fuel: {round(output.startLine.fuel)}</p>
	<p>Distance: {round(output.startLine.distance)}</p>
	<h3>Top of climb:</h3>
	<p>Time: {round(output.endLine.time)}</p>
	<p>Fuel: {round(output.endLine.fuel)}</p>
	<p>Distance: {round(output.endLine.distance)}</p>
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
