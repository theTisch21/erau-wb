<script lang="ts">
	import type { FuelLineItem } from "$lib/classes"
	import type { Writable } from "svelte/store"

	export let data: FuelLineItem
	export let name: string
	export let testTag: string
</script>

<tr>
	<td>{name}</td>
	<td id="{testTag}-weight">{data.weight}</td>
	<td id="{testTag}-arm">{data.arm}</td>
	<td id="{testTag}-moment">{data.moment}</td>
	<td>
        <input id="{testTag}-gallon" type="text" bind:value={data.gallons} class={data.gallons == 0 ? 'empty' : 'success'}/>
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
    table .output {
        background-color: #ccccff;
    }
</style>
