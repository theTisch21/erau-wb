<script>
    import { writable } from "svelte/store"

    const stdAltimiter = 29.92
    let fieldElevation = writable("5045")
    let currentAltimiter = writable("")
    let pressureAltitude = (stdAltimiter - Number($currentAltimiter)) * 1000  + Number($fieldElevation)
</script>

<main>
    <input bind:value={$fieldElevation} placeholder="Field Elevation">
    <input bind:value={$currentAltimiter} placeholder="Current Altimiter">
    <p>{pressureAltitude}</p>
</main>