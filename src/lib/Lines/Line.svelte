<script lang="ts">
	import '../../routes/global.css'
	import type { Writable } from 'svelte/store'
	export let input: Writable<string>
	export let arm: string
	export let name: string
	export let testTag: string
</script>

<tr>
	<td>{name}</td>
	<td id="{testTag}-weight"
		><input type="text" bind:value={$input} class={$input == '' ? 'empty' : 'success'} /></td
	>
	<td id="{testTag}-arm">{arm}</td>
	<td id="{testTag}-moment"
		><slot><p>If you are seeing this message, please let Sam know</p></slot></td
	>
</tr>

<style>
	.empty {
		background-color: lime;
	}
	.success {
		background-color: white;
	}
	td {
		border: 2px solid;
		border-collapse: collapse;
	}
	input {
		transition: all 0.5s;
	}
	input {
		box-sizing: content-box;
		width: 70px;
		margin: 5px;
	}
	td {
		width: 100px;
		height: 30px;
	}
	/*
    table, th {
        border: 2px solid;
        border-collapse: collapse;
    }
    .output {
        background-color: #ccccff;
    }
    */
</style>
