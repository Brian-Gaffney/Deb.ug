<script lang="ts">
	import { fade } from 'svelte/transition'
</script>

<main in:fade>
	<div class="about-container">
		<h1>About</h1>

		<div class="illustration">
			<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
				<!-- Desk -->
				<rect x="50" y="180" width="300" height="15" fill="#003049" rx="2"/>
				<rect x="60" y="195" width="10" height="105" fill="#003049"/>
				<rect x="330" y="195" width="10" height="105" fill="#003049"/>

				<!-- Monitor -->
				<rect x="140" y="120" width="120" height="85" fill="#003049" rx="3"/>
				<rect x="148" y="128" width="104" height="65" fill="#3358FF" rx="2"/>

				<!-- Monitor screen glow -->
				<rect x="152" y="132" width="96" height="57" fill="#FDFFFC" opacity="0.3"/>

				<!-- Code on screen -->
				<line x1="160" y1="140" x2="190" y2="140" stroke="#F1D302" stroke-width="2"/>
				<line x1="160" y1="148" x2="210" y2="148" stroke="#FF1F22" stroke-width="2"/>
				<line x1="168" y1="156" x2="200" y2="156" stroke="#FDFFFC" stroke-width="2"/>
				<line x1="168" y1="164" x2="220" y2="164" stroke="#3358FF" stroke-width="2" opacity="0.7"/>
				<line x1="160" y1="172" x2="195" y2="172" stroke="#F1D302" stroke-width="2"/>

				<!-- Monitor stand -->
				<rect x="190" y="205" width="20" height="10" fill="#003049" rx="1"/>
				<rect x="180" y="215" width="40" height="5" fill="#003049" rx="2"/>

				<!-- Chair -->
				<ellipse cx="200" cy="210" rx="35" ry="15" fill="#FF1F22"/>
				<rect x="195" y="210" width="10" height="40" fill="#FF1F22"/>
				<line x1="190" y1="250" x2="180" y2="270" stroke="#FF1F22" stroke-width="8" stroke-linecap="round"/>
				<line x1="210" y1="250" x2="220" y2="270" stroke="#FF1F22" stroke-width="8" stroke-linecap="round"/>

				<!-- Person - head -->
				<circle cx="200" cy="140" r="20" fill="#FDFFFC"/>

				<!-- Person - hair -->
				<path d="M 185 130 Q 180 120 190 115 Q 200 110 210 115 Q 220 120 215 130" fill="#003049"/>

				<!-- Person - body -->
				<rect x="185" y="155" width="30" height="40" fill="#3358FF" rx="5"/>

				<!-- Person - arms -->
				<path d="M 185 165 L 160 175 L 155 185" stroke="#FDFFFC" stroke-width="8" stroke-linecap="round" fill="none"/>
				<path d="M 215 165 L 240 175 L 245 185" stroke="#FDFFFC" stroke-width="8" stroke-linecap="round" fill="none"/>

				<!-- Hands on keyboard area -->
				<ellipse cx="155" cy="188" rx="8" ry="6" fill="#FDFFFC"/>
				<ellipse cx="245" cy="188" rx="8" ry="6" fill="#FDFFFC"/>

				<!-- Keyboard -->
				<rect x="120" y="175" width="160" height="12" fill="#003049" rx="2"/>
				<rect x="125" y="178" width="150" height="6" fill="#FDFFFC" opacity="0.2"/>

				<!-- Coffee mug -->
				<rect x="290" y="160" width="30" height="35" fill="#F1D302" rx="3"/>
				<ellipse cx="305" cy="160" rx="15" ry="5" fill="#F1D302"/>
				<path d="M 320 170 Q 330 170 330 180 Q 330 190 320 190" stroke="#F1D302" stroke-width="3" fill="none"/>

				<!-- Steam from coffee -->
				<path d="M 295 150 Q 293 145 295 140" stroke="#FDFFFC" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6"/>
				<path d="M 305 148 Q 303 143 305 138" stroke="#FDFFFC" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6"/>
				<path d="M 315 150 Q 313 145 315 140" stroke="#FDFFFC" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6"/>

				<!-- Plant on desk -->
				<rect x="70" y="165" width="20" height="15" fill="#FF1F22" rx="2"/>
				<circle cx="80" cy="155" r="8" fill="#F1D302"/>
				<circle cx="72" cy="160" r="7" fill="#3358FF"/>
				<circle cx="88" cy="160" r="7" fill="#3358FF"/>
			</svg>
		</div>

		<div class="poem">
			<p class="line">In the quiet glow of midnight screens,</p>
			<p class="line">Where semicolons dance with dreams,</p>
			<p class="line">We craft our worlds in loops and trees,</p>
			<p class="line">And chase the bugs on phantom breeze.</p>
			<p class="line-break"></p>
			<p class="line">Each function called, a story told,</p>
			<p class="line">In variables we secrets hold,</p>
			<p class="line">From render to deploy we weave,</p>
			<p class="line">The magic users will believe.</p>
		</div>
	</div>
</main>

<style>
	main {
		padding: 2em 1em;
		max-width: 600px;
		margin: 0 auto;
		position: relative;
		z-index: 10;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.about-container {
		width: 100%;
	}

	h1 {
		color: #FF1F22;
		font-weight: 100;
		font-size: 3rem;
		margin-bottom: 2rem;
		text-align: center;
	}

	.illustration {
		width: 100%;
		max-width: 400px;
		margin: 0 auto 3rem;
		filter: drop-shadow(0 4px 12px rgba(51, 88, 255, 0.2));
	}

	.illustration svg {
		width: 100%;
		height: auto;
		display: block;
	}

	.poem {
		background: rgba(0, 48, 73, 0.1);
		padding: 2rem;
		border-radius: 8px;
		border-left: 4px solid #3358FF;
		backdrop-filter: blur(10px);
	}

	.line {
		color: #FDFFFC;
		font-size: 1.1rem;
		line-height: 1.8;
		margin: 0.5rem 0;
		font-style: italic;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.line-break {
		height: 1rem;
		margin: 0;
	}

	@media (min-width: 640px) {
		main {
			padding: 3em 2em;
		}

		.poem {
			padding: 2.5rem 3rem;
		}

		.line {
			font-size: 1.2rem;
		}
	}

	@media (max-width: 480px) {
		h1 {
			font-size: 2.5rem;
		}

		.poem {
			padding: 1.5rem;
		}

		.line {
			font-size: 1rem;
		}
	}
</style>
