<script lang="ts">
	import { lookup, type Aircraft } from "$lib/aircraft"
	import { writable } from "svelte/store"
    let aircraft = writable("")
    let plane: Aircraft | null = null
    aircraft.subscribe(async a => {
        console.log(a)
        plane = await lookup(a)
    })
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<input bind:value={$aircraft}>
<p>{JSON.stringify(plane)}</p>