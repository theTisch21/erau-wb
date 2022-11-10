<script lang="ts">
	import type { Writable } from "svelte/store"

	export let data: Writable<App.FuelLineItem>
	export let name: string
	export let testTag: string
</script>

<tr>
	<td>{name}</td>
	<td id="{testTag}-weight">{$data.weight}</td>
	<td id="{testTag}-arm">{$data.arm}</td>
	<td id="{testTag}-moment">{$data.moment}</td>
	<td>
        <input id="{testTag}-gallon" type="text" bind:value={$data.gallons} class={$data.gallons == '' ? 'empty' : 'success'}/>
    </td>
</tr>

<style>
	.empty {
		background-color: lime;
	}
	.success {
		background-color: white;
	}
</style>
