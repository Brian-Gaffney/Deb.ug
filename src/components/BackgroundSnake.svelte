<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import { Snake } from '../anaconda/entities/Snake.js'
	import { Vector2 } from '../anaconda/entities/Vector2.js'
	import { Renderer } from '../anaconda/rendering/Renderer.js'
	import { Direction } from '../anaconda/input/InputManager.js'
	import { GAME_CONFIG, COLORS } from '../anaconda/game/constants.js'

	let canvas: HTMLCanvasElement
	let snake: Snake | null = null
	let renderer: Renderer
	let animationId: number
	let lastTime = 0
	let snakeState: 'inactive' | 'alive' | 'dying' | 'dead' = 'inactive'
	let deathAnimationProgress = 0
	let originalTextContent = new Map<Node, string>()

	// Keyboard state
	let keys = new Set<string>()

	// Track eaten letters for restoration
	let textNodesMap = new Map<Node, { element: HTMLElement, originalText: string }>()

	function initCanvas() {
		if (!canvas) return
		canvas.width = window.innerWidth
		canvas.height = window.innerHeight

		GAME_CONFIG.CANVAS_WIDTH = canvas.width
		GAME_CONFIG.CANVAS_HEIGHT = canvas.height
		GAME_CONFIG.SCALE = 1

		renderer = new Renderer(canvas)
	}

	function spawnSnake() {
		if (snakeState !== 'inactive') return

		// Spawn in center of screen
		const startPos = new Vector2(canvas.width / 2, canvas.height / 2)
		snake = new Snake(startPos)
		snakeState = 'alive'

		// Build text nodes map
		buildTextNodesMap()
	}

	function buildTextNodesMap() {
		textNodesMap.clear()
		const walker = document.createTreeWalker(
			document.body,
			NodeFilter.SHOW_TEXT,
			null
		)

		let node
		while ((node = walker.nextNode())) {
			const text = node.textContent
			if (text && text.trim().length > 0) {
				const element = node.parentElement
				if (element && !element.closest('canvas') && !element.closest('script')) {
					textNodesMap.set(node, {
						element: element,
						originalText: text
					})
				}
			}
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		keys.add(event.key)

		// Spawn snake on Space press
		if (event.key === ' ' && snakeState === 'inactive') {
			event.preventDefault()
			spawnSnake()
		}
	}

	function handleKeyUp(event: KeyboardEvent) {
		keys.delete(event.key)
	}

	function checkLetterCollisions() {
		if (!snake || snakeState !== 'alive') return

		const headPos = snake.getHeadPosition()

		// Check all text nodes
		for (const [node, data] of textNodesMap.entries()) {
			const { element } = data
			const range = document.createRange()
			const text = node.textContent || ''

			if (text.length === 0) continue

			// Check each character in this text node
			for (let i = 0; i < text.length; i++) {
				const char = text[i]
				if (char.trim().length === 0) continue // Skip whitespace

				try {
					range.setStart(node, i)
					range.setEnd(node, i + 1)
					const rect = range.getBoundingClientRect()

					// Check if snake head overlaps this character
					if (
						headPos.x >= rect.left &&
						headPos.x <= rect.right &&
						headPos.y >= rect.top &&
						headPos.y <= rect.bottom
					) {
						// Eat this letter!
						eatLetter(node, i)
						snake.addGrowth(1)
						return // Only eat one letter per frame
					}
				} catch (e) {
					// Range might be invalid, skip
					continue
				}
			}
		}
	}

	function eatLetter(node: Node, index: number) {
		const text = node.textContent || ''
		if (index >= text.length) return

		// Remove the character at this index
		const newText = text.slice(0, index) + text.slice(index + 1)
		node.textContent = newText

		// Update our map
		const data = textNodesMap.get(node)
		if (data) {
			if (newText.trim().length === 0) {
				// All text eaten, remove from map
				textNodesMap.delete(node)
			}
		}
	}

	function handleInput() {
		if (!snake || snakeState !== 'alive') return

		// Handle turning
		if (keys.has('ArrowLeft')) {
			snake.setDirection(Direction.LEFT)
		} else if (keys.has('ArrowRight')) {
			snake.setDirection(Direction.RIGHT)
		} else {
			snake.stopTurning()
		}

		// Handle boost
		snake.setBoost(keys.has(' '))
	}

	function update(currentTime: number) {
		if (!lastTime) lastTime = currentTime
		const deltaTime = currentTime - lastTime
		lastTime = currentTime

		if (snakeState === 'alive') {
			handleInput()
			snake!.update(deltaTime)

			// Check collisions
			if (snake!.checkBoundaryCollision() || snake!.checkSelfCollision()) {
				startDeathAnimation()
			}

			// Check letter collisions
			checkLetterCollisions()

		} else if (snakeState === 'dying') {
			// Death animation: tail catches up to head
			deathAnimationProgress += deltaTime * 0.003 // Speed of tail catching up
			if (deathAnimationProgress >= 1.0) {
				snakeState = 'dead'
				snake = null
				setTimeout(() => {
					snakeState = 'inactive'
					deathAnimationProgress = 0
				}, 500)
			}
		}

		// Render
		if (renderer && canvas) {
			// Clear canvas with transparency instead of black
			const ctx = renderer.getContext()
			ctx.clearRect(0, 0, canvas.width, canvas.height)

			if (snake && (snakeState === 'alive' || snakeState === 'dying')) {
				renderSnakeWithDeathAnimation()
			}
		}

		animationId = requestAnimationFrame(update)
	}

	function startDeathAnimation() {
		snakeState = 'dying'
		deathAnimationProgress = 0
	}

	function renderSnakeWithColor(color: string) {
		if (!snake) return

		// Temporarily override the COLORS to render in red
		const originalColor = COLORS.NEON_GREEN
		// @ts-ignore - we need to modify the const temporarily
		COLORS.NEON_GREEN = color

		// Use the proper snake render method which draws the full body
		snake.render(renderer)

		// Restore original color
		// @ts-ignore
		COLORS.NEON_GREEN = originalColor
	}

	function renderSnakeWithDeathAnimation() {
		if (!snake) return

		if (snakeState === 'dying') {
			// For death animation, we can't use the full render
			// Just draw a shrinking line
			const ctx = renderer.getContext()
			ctx.save()

			const allPositions = snake.getAllPositions()
			const pointsToShow = Math.floor(allPositions.length * (1 - deathAnimationProgress))

			if (pointsToShow > 2) {
				const visiblePoints = allPositions.slice(0, pointsToShow)

				ctx.strokeStyle = '#ff1f22'
				ctx.lineWidth = 2
				ctx.shadowColor = '#ff1f22'
				ctx.shadowBlur = 8

				ctx.beginPath()
				ctx.moveTo(visiblePoints[0].x, visiblePoints[0].y)
				for (let i = 1; i < visiblePoints.length; i++) {
					ctx.lineTo(visiblePoints[i].x, visiblePoints[i].y)
				}
				ctx.stroke()
			}

			ctx.restore()
		} else {
			// Normal render with red color using proper snake body
			renderSnakeWithColor('#ff1f22')
		}
	}

	function handleResize() {
		if (canvas) {
			canvas.width = window.innerWidth
			canvas.height = window.innerHeight
			GAME_CONFIG.CANVAS_WIDTH = canvas.width
			GAME_CONFIG.CANVAS_HEIGHT = canvas.height
		}
	}

	onMount(() => {
		initCanvas()
		animationId = requestAnimationFrame(update)
		window.addEventListener('resize', handleResize)
		window.addEventListener('keydown', handleKeyDown)
		window.addEventListener('keyup', handleKeyUp)

		return () => {
			window.removeEventListener('resize', handleResize)
			window.removeEventListener('keydown', handleKeyDown)
			window.removeEventListener('keyup', handleKeyUp)
		}
	})

	onDestroy(() => {
		if (animationId) {
			cancelAnimationFrame(animationId)
		}

		// Restore all text
		for (const [node, data] of textNodesMap.entries()) {
			if (node.textContent !== data.originalText) {
				node.textContent = data.originalText
			}
		}
	})
</script>

<canvas bind:this={canvas} class="background-snake-canvas"></canvas>

<style>
	.background-snake-canvas {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		pointer-events: none;
	}
</style>
