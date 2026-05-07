# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Casse Brique** — a retro-style brick breaker game built in vanilla HTML/CSS/Canvas for teaching purposes. The game will be developed iteratively, adding features incrementally.

Current scope:
- Core game loop and rendering
- Paddle control
- Ball physics
- Brick collision detection
- Score and lives tracking

## Tech Stack

- **HTML5** — page structure
- **CSS3** — styling and retro aesthetics
- **Canvas 2D** — all graphics rendering
- **Vanilla JavaScript** — game logic (no frameworks)

## Development Commands

```bash
# Serve locally (using Python or Node http-server)
python -m http.server 8000
# or
npx http-server
```

Then open `http://localhost:8000/index.html`

## Project Structure

```
exo1/
├── index.html          # Main game page
├── style.css           # Retro styling
└── game.js             # Game logic and Canvas rendering
```

## Design Philosophy

**Retro 1980s Aesthetic:**
- Limited color palette: cyan, magenta, yellow, white, black
- Simple geometric shapes (rectangles, circles)
- No anti-aliasing for crisp pixel-like appearance
- Bold, bold outlines
- Minimal animations (blocky movement, no easing)
- Classic arcade feel

**Code Structure:**
- Single canvas element for all rendering
- Game loop using `requestAnimationFrame`
- Separate functions for rendering vs. logic
- No classes initially—functions and objects for teaching clarity

## Iterative Development Plan

Each iteration adds one meaningful feature:
1. **Iteration 1** — Basic paddle, ball, and game loop with collision detection
2. **Iteration 2** — Bricks and brick collision
3. **Iteration 3** — Score, lives, and game over/win states
4. **Iteration 4** — Enhanced controls and ball speed mechanics
5. **Iteration 5** — Sound effects and visual feedback (optional)
6. **Iteration 6** — Levels and difficulty progression

## Important Context

- Keep it simple for teaching — avoid premature optimization
- All game state lives in a single `gameState` object
- Render everything fresh every frame (no canvas persistence tricks)
- Use pixel-perfect collision detection for arcade authenticity
