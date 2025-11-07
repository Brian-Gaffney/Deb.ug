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
	let lastFrameTime = 0
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

		// Spawn in bottom right, facing towards top-left
		const startPos = new Vector2(canvas.width - 50, canvas.height - 50)
		snake = new Snake(startPos)

		// Set angle to face top-left (roughly -135 degrees = 5π/4 radians)
		const targetAngle = (5 * Math.PI) / 4
		// @ts-ignore - accessing private property to set initial direction
		snake.currentAngle = targetAngle

		// Reinitialize trail points to match the new direction
		// @ts-ignore - accessing private properties
		snake.trailPoints = []
		// @ts-ignore
		const maxTrailLength = snake.maxTrailLength
		// @ts-ignore
		const trailSpacing = GAME_CONFIG.TRAIL_POINT_SPACING

		for (let i = 0; i <= maxTrailLength; i += trailSpacing) {
			const trailPoint = new Vector2(
				startPos.x - Math.cos(targetAngle) * i, // Extend backwards (opposite of facing direction)
				startPos.y - Math.sin(targetAngle) * i
			)
			// @ts-ignore
			snake.trailPoints.push(trailPoint)
		}
		// @ts-ignore
		snake.lastTrailPoint = startPos.clone()
		// @ts-ignore
		snake.cacheValid = false

		snakeState = 'alive'

		// Build text nodes map
		buildTextNodesMap()

		// Restart animation loop
		lastTime = 0
		lastFrameTime = 0
		animationId = requestAnimationFrame(update)
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

			// If already converted to spans, check each span
			if (element.classList.contains('snake-eaten-parent')) {
				const spans = element.querySelectorAll('.snake-char')
				for (let i = 0; i < spans.length; i++) {
					const span = spans[i] as HTMLElement

					// Skip if already eaten (invisible)
					if (span.style.opacity === '0') continue

					// Skip whitespace
					if (span.textContent?.trim().length === 0) continue

					const rect = span.getBoundingClientRect()
					if (
						headPos.x >= rect.left &&
						headPos.x <= rect.right &&
						headPos.y >= rect.top &&
						headPos.y <= rect.bottom
					) {
						span.style.opacity = '0'
						snake.addGrowth(1)
						return // Only eat one letter per frame
					}
				}
			} else {
				// Check original text node
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
							eatLetter(element, node, i)
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
	}

	function eatLetter(element: HTMLElement, node: Node, index: number) {
		// Convert text node to spans if not already done
		if (!element.classList.contains('snake-eaten-parent')) {
			const text = node.textContent || ''
			element.classList.add('snake-eaten-parent')

			// Replace text node with individual character spans
			const fragment = document.createDocumentFragment()
			for (let i = 0; i < text.length; i++) {
				const span = document.createElement('span')
				span.textContent = text[i]
				span.classList.add('snake-char')
				fragment.appendChild(span)
			}
			element.replaceChild(fragment, node)
		}

		// Find and hide the character at index
		const spans = element.querySelectorAll('.snake-char')
		if (spans[index]) {
			(spans[index] as HTMLElement).style.opacity = '0'
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
		// Cap at 60fps (~16.67ms per frame)
		const targetFrameTime = 1000 / 60
		if (currentTime - lastFrameTime < targetFrameTime) {
			animationId = requestAnimationFrame(update)
			return
		}

		if (!lastTime) lastTime = currentTime
		const deltaTime = currentTime - lastTime
		lastTime = currentTime
		lastFrameTime = currentTime

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
					// Animation loop will stop naturally when inactive
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

		// Only continue animation loop if snake is active
		if (snakeState === 'alive' || snakeState === 'dying') {
			animationId = requestAnimationFrame(update)
		}
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
			// Tail catches up to head - temporarily truncate trail points
			const allPositions = snake.getAllPositions()
			const pointsToShow = Math.floor(allPositions.length * (1 - deathAnimationProgress))

			if (pointsToShow > 2) {
				// Temporarily modify the snake's trail to show only the visible portion
				// @ts-ignore - accessing private property
				const originalTrail = snake.trailPoints
				// @ts-ignore - accessing private property
				snake.trailPoints = allPositions.slice(0, pointsToShow)
				// @ts-ignore - invalidate cache so render recalculates
				snake.cacheValid = false

				// Render with proper snake body
				renderSnakeWithColor('#ff1f22')

				// Restore original trail
				// @ts-ignore
				snake.trailPoints = originalTrail
				// @ts-ignore
				snake.cacheValid = false
			}
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
		// Animation loop now starts only when snake spawns (not on mount)
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

		// Restore all text by removing spans and restoring original
		for (const [node, data] of textNodesMap.entries()) {
			const { element, originalText } = data
			if (element.classList.contains('snake-eaten-parent')) {
				element.classList.remove('snake-eaten-parent')
				element.textContent = originalText
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

	:global(.snake-char) {
		transition: opacity 0.2s ease-out;
	}
</style>
