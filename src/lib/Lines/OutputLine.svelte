<script lang="ts">
	import type { CalculatedLine } from "$lib/classes"
	import type { Writable } from "svelte/store"

    export let data: CalculatedLine
    export let name: string
    export let testTag: string
    export let exact: boolean = false
</script>

    <tr class="output">
        <td>{name}</td>
        <td id="{testTag}-weight">{data.weight}</td>
        <td id="{testTag}-arm">{data.arm}</td>
        <td id="{testTag}-moment">{data.moment}</td>
    </tr>

<style>        
    .output {
        background-color: #ccccff;
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