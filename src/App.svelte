<script lang="ts">
	import Content from './Content.svelte'
</script>

<main>
	<h1>Brian Gaffney</h1>

	<Content order={3} />
</main>

<style>
	main {
		padding: 1em;
		max-width: 440px;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	h1 {
		color: #ff1f22;
		font-weight: 100;
		font-size: 3rem;

		/* System fonts - https://systemfontstack.com/ */
		/* font-family: Menlo, Consolas, Monaco, Liberation Mono, Lucida Console,
			monospace; */
	}
</style>
