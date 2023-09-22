<script lang="ts">
	import { writable, type Writable } from 'svelte/store'

	export let altimiter: Writable<string> = writable('')
	export let fieldElevation = writable('5045')
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
	<p id="pa-result"><slot />ft</p>
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
