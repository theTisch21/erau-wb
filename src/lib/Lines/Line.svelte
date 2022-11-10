<script lang="ts">
	import type { Writable } from "svelte/store"

    export let data: Writable<App.LineItem>
    export let name: string
    export let testTag: string
</script>

<body>
    <tr>
        <td>{name}</td>
        <td id="{testTag}-weight"><input  type="text" bind:value={$data.weight} class={$data.weight == "" ? "empty" : "success"}></td>
        <td id="{testTag}-arm">37</td>
        <td id="{testTag}-moment">{$data.moment}</td>
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