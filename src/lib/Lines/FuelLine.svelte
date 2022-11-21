<script lang="ts">
	import type { FuelLineItem } from "$lib/classes"
	import { writable, type Writable } from "svelte/store"

	export let data: FuelLineItem
	export let name: string
	export let testTag: string
	export let subtract: boolean = false
    export let defaultValue: number | string | null = null
    let input = writable("")
    input.subscribe(gallons => {
        data.setGallons(subtract ? -gallons : gallons)
    })
    let output = 0
	let weight = 0
    data.subscribeToMoment(moment => {
		weight = data.weight
        output = moment
    })
	if(defaultValue != null) {
		input.set(defaultValue.toString())
	}
</script>

<tr>
	<td>{name}</td>
	<td id="{testTag}-weight">{weight}</td>
	<td id="{testTag}-arm">{data.arm}</td>
	<td id="{testTag}-moment">{output}</td>
	<td>
        {#if subtract}-{/if}<input id="{testTag}-gallon" type="text" bind:value={$input} class={$input == "" ? 'empty' : 'success'}/>
    </td>
</tr>

<style>
	.empty {
		background-color: lime;
	}
	.success {
		background-color: white;
	}
    table, th, td {
        border: 2px solid;
        border-collapse: collapse;
    }
    input {
        transition: all .5s;
    }
    table input {
        box-sizing: content-box;
        width: 70px;
        margin: 5px;
    }
    td {
        width: 100px;
        height: 30px
    }
    .output {
        background-color: #ccccff;
    }
    input {
        box-sizing: content-box;
        width: 70px;
        margin: 5px;
    }
</style>
