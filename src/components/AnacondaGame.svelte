<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import { Game } from '../anaconda/game/Game.js'
	import { GAME_CONFIG } from '../anaconda/game/constants.js'

	let canvas: HTMLCanvasElement
	let game: Game

	function resizeCanvas() {
		if (!canvas) return

		const maxWidth = window.innerWidth * 0.95
		const maxHeight = window.innerHeight * 0.85

		let width = maxWidth
		let height = width / GAME_CONFIG.ASPECT_RATIO

		if (height > maxHeight) {
			height = maxHeight
			width = height * GAME_CONFIG.ASPECT_RATIO
		}

		canvas.width = Math.floor(width)
		canvas.height = Math.floor(height)

		const scale = canvas.width / GAME_CONFIG.BASE_CANVAS_WIDTH

		GAME_CONFIG.CANVAS_WIDTH = canvas.width
		GAME_CONFIG.CANVAS_HEIGHT = canvas.height
		GAME_CONFIG.SCALE = scale

		GAME_CONFIG.SNAKE_SEGMENT_SIZE = Math.floor(20 * scale)
		GAME_CONFIG.FOOD_SIZE = Math.floor(16 * scale)
		GAME_CONFIG.SNAKE_BASE_SPEED = 120 * scale
		GAME_CONFIG.FOOD_SPEED_BLUE = 200 * scale

		GAME_CONFIG.HEAD_SEGMENT_LENGTH = Math.floor(15 * scale)
		GAME_CONFIG.TAIL_TAPER_LENGTH = Math.floor(100 * scale)
		GAME_CONFIG.CROSS_LINE_SPACING = Math.floor(20 * scale)
		GAME_CONFIG.MAX_TRAIL_LENGTH = Math.floor(300 * scale)
		GAME_CONFIG.TRAIL_POINT_SPACING = Math.max(1, Math.floor(4 * scale))
		GAME_CONFIG.GROWTH_PIXELS = Math.floor(20 * scale)
	}

	onMount(() => {
		resizeCanvas()

		let resizeTimeout: number
		const handleResize = () => {
			clearTimeout(resizeTimeout)
			resizeTimeout = window.setTimeout(resizeCanvas, 100)
		}
		window.addEventListener('resize', handleResize)

		game = new Game(canvas)
		game.start()

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	})

	onDestroy(() => {
		if (game) {
			game.stop()
		}
	})
</script>

<div id="app">
	<div id="title">Anaconda</div>
	<div id="score">00000</div>
	<canvas id="gameCanvas" bind:this={canvas}></canvas>
	<div id="controls">
		Left/Right = move &nbsp;&nbsp; Space = boost &nbsp;&nbsp; M = mute &nbsp;&nbsp; Esc = pause
	</div>
	<div id="ui">
		<div id="pauseMenu" class="hidden">
			<div class="menu-content">
				<h2>PAUSED</h2>
			</div>
		</div>
		<div id="gameOverMenu" class="hidden">
			<div class="menu-content">
				<h2>GAME OVER</h2>
				<div id="okText">OK</div>
			</div>
		</div>
	</div>
</div>

<style>
	:global(:root) {
		--neon-green: #00ff00;
		--dark-bg: #000000;
		--border-color: #ffffff;
		--red-food: #ff0000;
		--cyan-accent: #00ffff;
	}

	#app {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: var(--dark-bg);
		color: var(--neon-green);
		font-family: 'Courier New', monospace;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}

	#gameCanvas {
		border: 2px solid var(--border-color);
		background-color: var(--dark-bg);
		display: block;
		max-width: 95vw;
		max-height: 85vh;
		width: auto;
		height: auto;
	}

	#controls {
		margin-top: 20px;
		color: var(--border-color);
		font-size: 14px;
		text-align: center;
		letter-spacing: 2px;
		opacity: 0.7;
	}

	#ui {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
	}

	#title {
		position: absolute;
		top: 40px;
		left: 50%;
		transform: translateX(-50%);
		color: var(--border-color);
		font-size: 24px;
		font-weight: bold;
		text-shadow: 0 0 8px var(--border-color);
		letter-spacing: 4px;
		font-family: 'Courier New', monospace;
	}

	#score {
		position: absolute;
		top: 40px;
		left: 40px;
		color: var(--neon-green);
		font-size: 24px;
		font-weight: bold;
		text-shadow: 0 0 8px var(--neon-green);
		letter-spacing: 4px;
		font-family: 'Courier New', monospace;
	}

	#pauseMenu,
	#gameOverMenu {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		padding-top: 50px;
		pointer-events: all;
	}

	#pauseMenu.hidden,
	#gameOverMenu.hidden {
		display: none;
	}

	.menu-content {
		background-color: var(--dark-bg);
		border: 2px solid var(--border-color);
		padding: 15px 40px;
		text-align: center;
		color: var(--neon-green);
	}

	.menu-content h2 {
		color: var(--cyan-accent);
		font-size: 24px;
		margin: 0;
		text-shadow: 0 0 8px var(--cyan-accent);
	}

	#okText {
		color: var(--red-food);
		font-size: 24px;
		font-weight: bold;
		margin-top: 15px;
		text-shadow: 0 0 8px var(--red-food);
	}
</style>
