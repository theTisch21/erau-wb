<script lang="ts">
	import type { Writable } from "svelte/store"
	import type { Component } from "./Flow/flow"
	import type { WB } from "./WBError"

    export let alerts: Writable<WB[]>
    export let component: Component
    let alertArray: WB[] = []
    alerts.subscribe(a => {
        alertArray = []
        a.forEach(alert => {
            if(alert.component == component) {
                alertArray.push(alert)
            }
        })
    })
</script>

<main>
    {#if alertArray.length > 0}
    <div class="notice">
        <h1>ALERT</h1>
        {#each alertArray as a}
        <p>{a.formatted}</p>
        {/each}
    </div>
    {/if}
</main>
    
<style>
	.notice {
		padding: 2em;
        margin: 1em 0;
		background-color: #f70;
		color: black;
		font-size: larger;
		font-weight: bold;
	}
</style>