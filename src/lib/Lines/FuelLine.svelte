<script lang="ts">
	import type { FuelLineItem } from '$lib/classes'
	import { writable, type Writable } from 'svelte/store'

	export let data: FuelLineItem
	export let name: string
	export let testTag: string
	export let subtract: boolean = false
	export let defaultValue: number | string | null = null
	let input = writable('')
	input.subscribe((gallons) => {
		data.setGallons(subtract ? -gallons : gallons)
	})
	let output = 0
	let weight = 0
	//I know... this is a very weird way to do it, but it works.
	//TODO refactor and make good
	data.subscribeToOverrideGallons((gallons) => {
		input.set(gallons)
	})
	data.subscribeToMoment((moment) => {
		weight = data.weight
		output = moment
	})
	if (defaultValue != null) {
		input.set(defaultValue.toString())
	}
</script>

<tr>
	<td>{name}</td>
	<td id="{testTag}-weight">{weight}</td>
	<td id="{testTag}-arm">{data.arm}</td>
	<td id="{testTag}-moment">{output}</td>
	<td>
		{#if subtract}-{/if}<input
			id="{testTag}-gallon"
			type="text"
			bind:value={$input}
			class={$input == '' ? 'empty' : $input == defaultValue ? 'success' : 'warn'}
		/>
	</td>
</tr>

<style>
	.empty {
		background-color: lime;
	}
	.success {
		background-color: white;
	}
	.warn {
		background-color: yellow;
	}
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
	input {
		box-sizing: content-box;
		width: 70px;
		margin: 5px;
	}
	/*
    table, th {
        border: 2px solid;
        border-collapse: collapse;
    }
    table input {
        box-sizing: content-box;
        width: 70px;
        margin: 5px;
    }
    .output {
        background-color: #ccccff;
    }
    */
</style>
