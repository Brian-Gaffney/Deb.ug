# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## System Limitations

Don't try to run sudo prefixed commands. It will fail. Ask the user to run sudo prefixed commands for you.

## Project Overview

Personal website for Brian Gaffney (deb.ug) built with Svelte 3 and TypeScript. The site features:
- Main landing page with personal content
- Full Anaconda snake game at `/anaconda/` route
- Interactive background snake that eats text letter-by-letter on the homepage

## Development Commands

```bash
# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Serve production build locally
npm run start

# Type checking
npm run check
```

## Deployment

- **Main branch**: Auto-deploys to https://deb.ug via Netlify
- **Dev branch**: Auto-deploys to https://dev--deb-ug.netlify.app via Netlify

Push to `main` branch to deploy changes to production.

## Architecture

### Routing Structure

The app uses `svelte-routing` for client-side routing:
- `src/main.ts` → bootstraps `src/App.svelte`
- `src/App.svelte` → defines routes using `<Router>` and `<Route>` components
- `/` route → `src/components/HomePage.svelte` (main landing page)
- `/anaconda` route → `src/components/AnacondaGame.svelte` (full game)

**Important**: The dev server uses `sirv` with the `--single` flag to support client-side routing (SPA mode). Without this flag, direct navigation to `/anaconda` will 404.

### Component Hierarchy

```
App.svelte (Router)
├── HomePage.svelte (/ route)
│   ├── BackgroundSnake.svelte (interactive background)
│   └── Content.svelte (main content sections)
└── AnacondaGame.svelte (/anaconda route)
    └── Game instance from src/anaconda/
```

### Anaconda Game Integration

The Anaconda snake game lives in `src/anaconda/` and is integrated in two ways:

1. **Full Game** (`/anaconda` route via `AnacondaGame.svelte`):
   - Complete game with UI, menus, scoring
   - Uses `Game` class from `src/anaconda/game/Game.ts`
   - Assets served from `public/anaconda/`

2. **Background Snake** (homepage via `BackgroundSnake.svelte`):
   - Shares core snake logic from `src/anaconda/entities/Snake.ts`
   - User-controlled: spawns on Space, controlled with arrow keys
   - Eats text letter-by-letter using DOM manipulation
   - Uses character-level `<span>` wrapping with `opacity: 0` to maintain layout when eating letters
   - Death animation: tail chases head while maintaining tube body appearance

**Key Snake Implementation Details**:
- Snake uses a trail-based rendering system (not segment-by-segment)
- `trailPoints` array stores positions along the snake's path
- Width calculations create bulbous head and tapered tail
- Background snake spawns in bottom-right, facing top-left
- Color override: Background snake uses `#ff1f22` (site red) instead of neon green

### Anaconda Game Structure

Located in `src/anaconda/`:
```
game/
  ├── Game.ts           - Main game orchestrator
  ├── GameState.ts      - State management (menu, playing, game over)
  ├── GameLoop.ts       - Animation loop
  └── constants.ts      - GAME_CONFIG and COLORS (mutable for responsive scaling)

entities/
  ├── Snake.ts          - Snake entity with trail-based rendering
  ├── Food.ts           - Food entity (red stationary, blue moving)
  └── Vector2.ts        - 2D vector math utilities

rendering/
  ├── Renderer.ts       - Canvas rendering wrapper
  └── effects/
      ├── NeonEffect.ts      - Glow effects
      └── ParticleSystem.ts  - Particle explosions

input/
  └── InputManager.ts   - Keyboard/touch input handling

audio/
  └── AudioManager.ts   - Background music (assets in public/anaconda/)
```

**Important**: `GAME_CONFIG` in `constants.ts` is mutable and updates on window resize to handle responsive scaling. `COLORS` object is modified at runtime by BackgroundSnake to override colors.

## Color Palette

Use these exact colors from the site's design:
```
Red RYB: #FF1F22         (primary accent, used for headings and snake)
Ultramarine blue: #3358FF
Prussian blue: #003049
Baby powder: #FDFFFC
Safety yellow: #F1D302
```

## Build Configuration

- **Bundler**: Rollup
- **TypeScript**: Configured via `@tsconfig/svelte`
- **Output**: `public/build/bundle.js` and `public/build/bundle.css`
- **Resolve extensions**: `.svelte`, `.mjs`, `.js`, `.json`, `.node`, `.ts`
- **Important**: Rollup config includes `exportConditions: ['svelte']` for svelte-routing compatibility

## Working with the Background Snake

When modifying `BackgroundSnake.svelte`:
- Snake private properties are accessed via `@ts-ignore` comments (Snake class has private fields)
- Text eating converts text nodes to character-level spans on first collision
- Use `element.classList.contains('snake-eaten-parent')` to check if already converted
- Collision detection handles both text nodes (via Range API) and span elements
- Always invalidate cache (`snake.cacheValid = false`) after modifying `trailPoints`
- Death animation temporarily modifies `trailPoints` array, then restores it

## Text Restoration

The background snake wraps individual characters in spans and sets `opacity: 0` when eaten. On component destroy (`onDestroy`), the original text is restored by:
1. Checking for `snake-eaten-parent` class
2. Setting `element.textContent` back to original
3. Removing the class

This ensures no permanent DOM modifications remain after navigation.
