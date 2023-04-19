<script lang="ts">
	import { writable, type Writable } from 'svelte/store'

	const stdAltimiter = 29.92
	export let pressureAltitude: Writable<string> = writable('')
	export let altimiter: Writable<string> = writable('')
	let fieldElevation = writable('5045')
	fieldElevation.subscribe(refresh)
	altimiter.subscribe(refresh)
	function refresh() {
		pressureAltitude.set(
			((stdAltimiter - Number($altimiter)) * 1000 + Number($fieldElevation)).toFixed(0)
		)
	}
</script>

<main>
	<h2>Pressure Altitude:</h2>
	<label for="pa-fieldElevation">Field elevation</label><br />
	<input
		id="pa-fieldElevation"
		bind:value={$fieldElevation}
		placeholder="Field Elevation"
		class={$fieldElevation == '' ? 'empty' : 'success'}
	/>
	<br />
	<label for="pa-currentAltimiter">Current altimiter</label><br />
	<input
		id="pa-currentAltimiter"
		bind:value={$altimiter}
		placeholder="Current Altimiter"
		class={$altimiter == '' ? 'empty' : 'success'}
	/>
	<p id="pa-result">{$pressureAltitude}ft</p>
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
