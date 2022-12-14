<script lang="ts">
	import type { LineItem } from "$lib/classes"
	import { writable, type Writable } from "svelte/store"
    export let data: LineItem
    export let name: string
    export let testTag: string
    export let defaultValue: number | string | null = null
    let input = writable("")
    input.subscribe(weight => {
        data.setWeight(weight)
    })
    let output = 0
    data.subscribeToMoment(moment => {
        output = moment
    })
	if(defaultValue != null) {
		input.set(defaultValue.toString())
	}
</script>


<tr>
    <td>{name}</td>
    <td id="{testTag}-weight"><input  type="text" bind:value={$input} class={$input == "" ? "empty" : "success"}></td>
    <td id="{testTag}-arm">{data.arm}</td>
    <td id="{testTag}-moment">{output}</td>
</tr>


<style>
    .empty {
        background-color: lime;
    }
    .success {
        background-color: white;
    }
     td {
        border: 2px solid;
        border-collapse: collapse;
    }
    input {
        transition: all .5s;
    }
    input {
        box-sizing: content-box;
        width: 70px;
        margin: 5px;
    }
    td {
        width: 100px;
        height: 30px
    }
    /*
    table, th {
        border: 2px solid;
        border-collapse: collapse;
    }
    .output {
        background-color: #ccccff;
    }
    */
</style>