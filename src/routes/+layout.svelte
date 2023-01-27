<script lang="ts">
	import Header from '$lib/Header.svelte'
	import './global.css'
</script>

<Header />

<main>
	<slot />
</main>

<footer>
	<p>Source code: <a href="https://github.com/theTisch21/erau-wb">Click here!</a></p>
</footer>

<style>
	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
</style>
