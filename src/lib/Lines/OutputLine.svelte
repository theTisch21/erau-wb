<script lang="ts">
	import type { DataLine } from '$lib/Flow/table'

	export let data: DataLine
	export let name: string
	export let testTag: string
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
	td {
		width: 100px;
		height: 30px;
	}
	/*    
    input {
        transition: all .5s;
    }
    table input {
        box-sizing: content-box;
        width: 70px;
        margin: 5px;
    } */
	td {
		border: 2px solid;
		border-collapse: collapse;
	}
	input {
		transition: all 0.5s;
	}
</style>
