<script lang="ts">
	import { writable, type Writable } from 'svelte/store'

	const stdAltimiter = 29.92
	export let pressureAltitude: Writable<string> = writable('')
	let fieldElevation = writable('5045')
	let currentAltimiter = writable('')
	fieldElevation.subscribe(refresh)
	currentAltimiter.subscribe(refresh)
	function refresh() {
		pressureAltitude.set(
			((stdAltimiter - Number($currentAltimiter)) * 1000 + Number($fieldElevation)).toFixed(0)
		)
	}
</script>

<main>
	<h2>Pressure Altitude:</h2>
	<input
		id="pa-fieldElevation"
		bind:value={$fieldElevation}
		placeholder="Field Elevation"
		class={$fieldElevation == '' ? 'empty' : 'success'}
	/>
	<input
		id="pa-currentAltimiter"
		bind:value={$currentAltimiter}
		placeholder="Current Altimiter"
		class={$currentAltimiter == '' ? 'empty' : 'success'}
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
