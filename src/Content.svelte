<script lang="ts">
	import { fade } from 'svelte/transition'

	import { getFadeParams } from './utils'

	export let order
</script>

<section transition:fade={{ ...getFadeParams(order) }}>
	<p>
		Director, Engineering at <a href="https://persuit.com">PERSUIT</a>
	</p>

	<p>I'm in Melbourne, Australia.</p>

	<p>I like solving real problems and delivering real value.</p>
</section>

<div class="content-wrapper">
	<section transition:fade={{ ...getFadeParams(order + 1) }}>
		<h2>Contact</h2>
		<ul>
			<li><a href="mailto:brian@deb.ug">brian@deb.ug</a></li>
			<li>
				<a
					target="_blank"
					href="https://www.linkedin.com/in/brian-gaffney-80760a42/"
					>Linkadink</a
				>
			</li>
			<li>
				<a target="_blank" href="https://github.com/Brian-Gaffney">Github</a>
			</li>
			<li>
				<a target="_blank" href="https://gitlab.com/briangaffney">Gitlab</a>
			</li>
			<li><a target="_blank" href="tel:+61407668336">+61 407 668 336</a></li>
		</ul>
	</section>
</div>

<style>
	section {
		margin-bottom: 1em;
		max-width: 70ch; /* 70 chars wide */
	}

	.content-wrapper {
		display: flex;
		flex-wrap: wrap;
	}

	.content-wrapper section {
		flex: 20em;
	}

	h2 {
		color: #ff1f22;
		font-weight: 100;
		font-size: 1.7rem;
	}

	ul li {
		padding: 0.2em 0;
	}

	a {
		padding: 0.1em;
	}
</style>
