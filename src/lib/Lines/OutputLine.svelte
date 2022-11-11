<script lang="ts">
	import type { CalculatedLine } from "$lib/classes"
	import type { Writable } from "svelte/store"

    export let data: CalculatedLine
    export let name: string
    export let testTag: string
</script>
<body>    
    <tr class="output">
        <td>{name}</td>
        <td id="{testTag}-weight">{data.weight}</td>
        <td id="{testTag}-arm">{(data.moment/data.weight).toFixed(2)}</td>
        <td id="{testTag}-moment">{data.moment}</td>
    </tr>
</body>
<style>        
    .output {
        background-color: #ccccff;
    }
</style>