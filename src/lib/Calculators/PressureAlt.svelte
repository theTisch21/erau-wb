<script lang="ts">
    import { writable } from "svelte/store"

    const stdAltimiter = 29.92
    let pressureAltitude: string = ""
    let fieldElevation = writable("5045")
    let currentAltimiter = writable("")
    fieldElevation.subscribe(refresh)
    currentAltimiter.subscribe(refresh)
    function refresh() {
        pressureAltitude = ((stdAltimiter - Number($currentAltimiter)) * 1000  + Number($fieldElevation)).toFixed(0)
    }
</script>

<main>
    <h2>Pressure Altitude:</h2>
    <input id="pa-fieldElevation" bind:value={$fieldElevation} placeholder="Field Elevation">
    <input id="pa-currentAltimiter" bind:value={$currentAltimiter} placeholder="Current Altimiter">
    <p id="pa-result">{pressureAltitude}ft</p>
</main>