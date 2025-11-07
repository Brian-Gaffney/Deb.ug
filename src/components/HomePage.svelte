<script lang="ts">
	import { fade } from 'svelte/transition'
	import Content from '../Content.svelte'
	import BackgroundSnake from './BackgroundSnake.svelte'
</script>

<BackgroundSnake />

<main>
	<h1>Brian Gaffney</h1>
	<Content order={3} />
</main>

<style>
	main {
		padding: 1em;
		max-width: 440px;
		position: relative;
		z-index: 10;
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
	}
</style>
