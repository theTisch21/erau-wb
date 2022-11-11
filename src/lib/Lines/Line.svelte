<script lang="ts">
	import type { LineItem } from "$lib/classes"
	import type { Writable } from "svelte/store"

    export let data: LineItem
    export let name: string
    export let testTag: string
</script>

<body>
    <tr>
        <td>{name}</td>
        <td id="{testTag}-weight"><input  type="text" bind:value={data.weight} class={data.weight == 0 ? "empty" : "success"}></td>
        <td id="{testTag}-arm">37</td>
        <td id="{testTag}-moment">{data.moment}</td>
    </tr>
</body>

<style>
    .empty {
        background-color: lime;
    }
    .success {
        background-color: white;
    }
</style>