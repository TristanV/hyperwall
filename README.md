# HyperWall

A collection of retro-style arcade games built with vanilla HTML5, CSS3, and Canvas. Developed iteratively for educational purposes with a strong focus on 1980s aesthetic and simplicity.

## Games

### Casse Brique (Brick Breaker)

A classic brick breaker arcade game with retro neon styling.

**Status:** Core game loop complete with collision detection, scoring, and win/lose conditions.

**How to Play:**
- Use **← →** arrow keys to move the paddle
- Press **SPACE** to start the game
- Break all the bricks to win
- Don't let the ball fall off the bottom
- Each brick destroyed = 10 points
- You have 3 lives

**Features:**
- **Paddle Control:** Smooth left/right movement with arrow keys
- **Ball Physics:** Realistic collision with walls, paddle, and bricks
- **Scoring System:** 10 points per brick destroyed
- **Lives System:** Lose a life when the ball falls; game over at 0 lives
- **Win Condition:** Destroy all bricks to win
- **Retro Aesthetics:** Neon cyan/magenta/yellow colors with 1980s arcade styling

**Technical Details:**
- Single Canvas element for rendering
- Pixel-perfect collision detection
- 60 FPS game loop using `requestAnimationFrame`
- Game state managed in a single object

## Getting Started

### Requirements
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or dependencies required

### Installation

Clone the repository:
```bash
git clone https://github.com/TristanV/hyperwall.git
cd hyperwall
```

### Running Locally

Serve the files using any HTTP server:

**Using Python 3:**
```bash
python -m http.server 8000
```

**Using Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

**Using Node.js (http-server):**
```bash
npx http-server
```

Then open your browser and navigate to:
```
http://localhost:8000
```

## Project Structure

```
hyperwall/
├── README.md           # This file
├── CLAUDE.md           # Developer guidance for Claude Code
├── index.html          # Main game page
├── style.css           # Retro styling
├── game.js             # Game logic and Canvas rendering
├── .gitignore          # Git ignore rules
└── .git/               # Git repository
```

## Design Philosophy

### Retro 1980s Aesthetic
- Limited neon color palette: cyan, magenta, yellow, green, red
- Simple geometric shapes with bold outlines
- No anti-aliasing for crisp pixel-like appearance
- Classic arcade font and flickering title effects
- Authentic arcade game feel

### Code Structure
- **Vanilla JavaScript:** No frameworks, pure browser APIs
- **Canvas Rendering:** All graphics drawn fresh every frame
- **Modular Functions:** Separate functions for rendering, updating, and collision detection
- **Single Game State:** All game data in a centralized object for clarity

### Teaching Focus
- Code is intentionally simple and readable
- Each iteration adds one meaningful feature
- Comments explain WHY, not WHAT (code is self-documenting)
- Perfect for learning game development fundamentals

## Roadmap

### Planned Iterations
1. ✅ **Iteration 1:** Basic paddle, ball, and game loop with collision detection
2. ✅ **Iteration 2:** Bricks and brick collision
3. ✅ **Iteration 3:** Score, lives, and game states (start/play/over/win)
4. **Iteration 4:** Enhanced controls and ball spin mechanics
5. **Iteration 5:** Sound effects and visual feedback
6. **Iteration 6:** Levels and difficulty progression
7. **Iteration 7:** Power-ups (paddle size, ball speed, extra lives)
8. **Future:** Additional games (Pong, Space Invaders, Pac-Man style games)

## Controls

**Casse Brique:**
- `← Arrow Left` — Move paddle left
- `→ Arrow Right` — Move paddle right
- `SPACE` — Start game / Restart after game over

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

All modern browsers with support for:
- HTML5 Canvas
- ES6 JavaScript
- CSS3 Flexbox

## Development

### Architecture

The game uses a simple but effective structure:

1. **Game State Object:** Centralized store for all game data (paddle, ball, bricks, score, lives)
2. **Update Loop:** Applies physics and logic changes to game state
3. **Render Loop:** Draws everything to Canvas based on current state
4. **Input Handling:** Window event listeners for keyboard input
5. **Collision Detection:** Per-frame checks for collisions with game objects

### Key Functions

- `updatePaddle()` — Handle paddle input and movement
- `updateBall()` — Apply physics and detect collisions
- `render()` — Draw all game elements to Canvas
- `gameLoop()` — Main loop using requestAnimationFrame

### Adding Features

When adding new features:
1. Update `gameState` object if new state is needed
2. Add update logic in appropriate `update*()` function
3. Add rendering code in `draw*()` function
4. Update CLAUDE.md and README.md with new information

## Performance

- **Rendering:** Canvas-based; no DOM layout thrashing
- **60 FPS:** Smooth animations on modern hardware
- **Memory:** Minimal; brick objects reused across levels
- **File Size:** ~30KB total (unminified); loads instantly

## License

MIT

## Author

Built iteratively for educational purposes as part of the HyperWall project.

---

**Last Updated:** 2026-05-07  
**Game Status:** Casse Brique - Core gameplay complete  
**Next Focus:** Enhanced controls and ball spin mechanics
