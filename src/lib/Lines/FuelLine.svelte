<script lang="ts">
	import type { Writable } from 'svelte/store'
	export let input: Writable<string>
	export let arm: string
	export let name: string
	export let testTag: string
	export let subtract: boolean = false
	export let defaultValue: number | string | null = null
	export let weight: number
</script>

<tr>
	<td>{name}</td>
	<td id="{testTag}-weight">{weight}</td>
	<td id="{testTag}-arm">{arm}</td>
	<td id="{testTag}-moment"><slot><p>If you see this message, please let Sam know</p></slot></td>
	<td>
		{#if subtract}-{/if}<input
			id="{testTag}-gallon"
			type="text"
			bind:value={$input}
			class={$input == '' ? 'empty' : $input == defaultValue ? 'success' : 'warn'}
		/>
	</td>
</tr>

<style>
	.empty {
		background-color: lime;
	}
	.success {
		background-color: white;
	}
	.warn {
		background-color: yellow;
	}
	td {
		border: 2px solid;
		border-collapse: collapse;
	}
	input {
		transition: all 0.5s;
	}
	td {
		width: 100px;
		height: 30px;
	}
	input {
		box-sizing: content-box;
		width: 70px;
		margin: 5px;
	}
	/*
    table, th {
        border: 2px solid;
        border-collapse: collapse;
    }
    table input {
        box-sizing: content-box;
        width: 70px;
        margin: 5px;
    }
    .output {
        background-color: #ccccff;
    }
    */
</style>
