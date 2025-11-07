<script lang="ts">
	import { fade } from 'svelte/transition'

	import { getFadeParams } from './utils'

	export let order
</script>

<section class="neomorph-raised" transition:fade={{ ...getFadeParams(order) }}>
	<p>
		Director, Engineering at <a href="https://persuit.com">PERSUIT</a>
	</p>

	<p>I'm in Melbourne, Australia.</p>

	<p>I like solving real problems and delivering real value.</p>
</section>

<div class="content-wrapper">
	<section class="neomorph-inset" transition:fade={{ ...getFadeParams(order + 1) }}>
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

	<!-- Additional showcase boxes -->
	<section class="neomorph-raised showcase-box" transition:fade={{ ...getFadeParams(order + 2) }}>
		<h2>Skills</h2>
		<div class="pill-container">
			<span class="pill neomorph-pill">TypeScript</span>
			<span class="pill neomorph-pill">React</span>
			<span class="pill neomorph-pill">Node.js</span>
			<span class="pill neomorph-pill">Leadership</span>
		</div>
	</section>

	<section class="neomorph-flat showcase-box" transition:fade={{ ...getFadeParams(order + 3) }}>
		<h2>Interests</h2>
		<p>Building elegant solutions to complex problems. Mentoring engineers. Making software that people love to use.</p>
	</section>
</div>

<style>
	section {
		margin-bottom: 2em;
		max-width: 70ch; /* 70 chars wide */
		padding: 1.5em;
		border-radius: 16px;
		transition: all 0.3s ease;
	}

	/* Neumorphic raised effect (extruded from surface) */
	.neomorph-raised {
		background: #eceff2;
		box-shadow: 8px 8px 16px rgba(163, 177, 198, 0.5),
			-8px -8px 16px rgba(255, 255, 255, 0.8);
	}

	/* Neumorphic inset effect (pressed into surface) */
	.neomorph-inset {
		background: #eceff2;
		box-shadow: inset 4px 4px 8px rgba(163, 177, 198, 0.4),
			inset -4px -4px 8px rgba(255, 255, 255, 0.7);
	}

	/* Flat neumorphic (subtle depth) */
	.neomorph-flat {
		background: linear-gradient(145deg, #d9dde1, #ffffff);
		box-shadow: 4px 4px 8px rgba(163, 177, 198, 0.3),
			-4px -4px 8px rgba(255, 255, 255, 0.5);
	}

	.content-wrapper {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5em;
		margin-top: 2em;
	}

	.content-wrapper section {
		flex: 1 1 20em;
		min-width: 250px;
	}

	.showcase-box {
		min-height: 150px;
	}

	h2 {
		color: #6b7b8c;
		font-weight: 300;
		font-size: 1.7rem;
		margin-bottom: 0.8em;
		text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8),
			-1px -1px 2px rgba(163, 177, 198, 0.3);
	}

	ul {
		list-style: none;
		padding: 0;
	}

	ul li {
		padding: 0.4em 0;
	}

	a {
		padding: 0.3em 0.5em;
		border-radius: 8px;
		display: inline-block;
	}

	/* Pill styling for skills */
	.pill-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8em;
	}

	.pill {
		padding: 0.5em 1em;
		border-radius: 20px;
		font-size: 0.9rem;
		transition: all 0.3s ease;
	}

	.neomorph-pill {
		background: #eceff2;
		color: #6b7b8c;
		box-shadow: 3px 3px 6px rgba(163, 177, 198, 0.5),
			-3px -3px 6px rgba(255, 255, 255, 0.8);
	}

	.neomorph-pill:hover {
		box-shadow: inset 2px 2px 4px rgba(163, 177, 198, 0.5),
			inset -2px -2px 4px rgba(255, 255, 255, 0.8);
	}
</style>
