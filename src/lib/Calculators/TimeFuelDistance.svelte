<script lang="ts">
	import { writable } from 'svelte/store'

	let startAlt = writable('')
	let endAlt = writable('')
	let startTemp = writable('')
	let endTemp = writable('')
</script>

<main>
    <label for="tfd-startalt">Start altitude</label>
	<input id="tfd-startalt" bind:value={startAlt} placeholder="Start altitude" class={$startAlt == "" ? "empty" : "success"}>
	<label for="tfd-starttemp">Start temperature °C</label>
	<input id="tfd-starttemp" bind:value={startTemp} placeholder="Start temperature °C" class={$startTemp == "" ? "empty" : "success"}>
	<label for="tfd-endalt">End altitude</label>
	<input id="tfd-endalt" bind:value={endAlt} placeholder="End altitude" class={$endAlt == "" ? "empty" : "success"}>
	<label for="tfd-endtemp">End temperature °C</label>
	<input id="tfd-endtemp" bind:value={endTemp} placeholder="End temperature °C" class={$endTemp == "" ? "empty" : "success"}>
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
