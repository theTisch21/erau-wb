<script lang="ts">
	import { writable, type Writable } from 'svelte/store'
	import { z } from 'zod'
	export let min = null
	export let max = null
	export let out: Writable<number> = writable()
	let error = ''

	let schema = z.number()
	if (max != null) schema = schema.lte(max)
	if (min != null) schema = schema.gte(min)

	let input = writable('')
	let isGood = true
	input.subscribe((i) => {
		let parsedInput = schema.safeParse(i)
		if (parsedInput.success) {
			isGood = true
			out.set(parsedInput.data)
			error = ''
		} else {
			isGood = false
			error = parsedInput.error.message
		}
	})
</script>

<body>
	<label>
		{error}
		<input class={isGood ? '' : 'validationFail'} type="text" bind:value={input} />
	</label>
</body>

<style>
	.validationFail {
		border-width: 10px;
		border-color: yellow;
		border-radius: 4px;
	}
</style>
