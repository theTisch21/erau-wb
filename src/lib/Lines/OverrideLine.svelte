<script lang="ts">
	import '../../routes/global.css'
	import { writable, type Writable } from 'svelte/store'
	import type { Aircraft } from '$lib/Lookups/Aircraft/aircraft'
	export let data: Writable<Aircraft>
	export let name: string
	export let testTag: string
	let iweight = writable('')
	iweight.subscribe((i) => {
		$data.weight = Number(i)
	})
	let iarm = writable('')
	iarm.subscribe((i) => {
		$data.arm = Number(i)
	})
	let imoment = writable('')
	imoment.subscribe((i) => {
		$data.moment = Number(i)
	})
</script>

<tr>
	<td>{name}</td>
	<td 
		><input id="{testTag}-weight" type="text" bind:value={$iweight} class={$iweight == '' ? 'empty' : 'success'} /></td
	>
	<td 
		><input id="{testTag}-arm" type="text" bind:value={$iarm} class={$iarm == '' ? 'empty' : 'success'} /></td
	>
	<td 
		><input id="{testTag}-moment" type="text" bind:value={$imoment} class={$imoment == '' ? 'empty' : 'success'} /></td
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
