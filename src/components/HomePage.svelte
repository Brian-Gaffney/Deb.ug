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
		padding: 2em;
		max-width: 440px;
		position: relative;
		z-index: 10;
		background: #eceff2;
		border-radius: 24px;
		box-shadow: 12px 12px 24px rgba(163, 177, 198, 0.5),
			-12px -12px 24px rgba(255, 255, 255, 0.8);
		margin: 2em;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	h1 {
		color: #7a8693;
		font-weight: 200;
		font-size: 3rem;
		text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.8),
			-2px -2px 4px rgba(163, 177, 198, 0.4);
		margin-bottom: 1em;
	}
</style>
