# HyperWall

A collection of retro-style arcade games built with vanilla HTML5, CSS3, and Canvas. Developed iteratively for educational purposes with a strong focus on 1980s aesthetic and simplicity.

## Games

### Casse Brique (Brick Breaker)

A classic brick breaker arcade game with retro neon styling, dynamic difficulty, and special bricks.

**Status:** Full game with 4 rooms, special brick types, progressive difficulty, and multiple ball physics.

**How to Play:**
- Use **← →** arrow keys to move the paddle
- Press **SPACE** to start/launch stuck balls
- Break all the bricks to complete the room
- Progress through 4 rooms with increasing difficulty
- Don't let the ball fall off the bottom
- Each brick destroyed = 10 points
- You have 3 lives per room (score carries over)

**Room Progression:**

| Room | Name | Difficulty | Special Bricks | Features |
|------|------|-----------|-----------------|----------|
| 1 | Warm Up | Easy | None | Standard bricks, basic gameplay |
| 2 | Brick Madness | Medium | MULTI, PADDLE, TOUGH | First special bricks introduced |
| 3 | Speed Challenge | Hard | MULTI, PADDLE, STICKY, TOUGH, ARMORED | Ball acceleration, sticky bricks |
| 4 | Chaos Mode | Very Hard | All types + SLOW | 60 bricks, extreme speed, high risk/reward |

**Special Brick Types:**

**Bonus Bricks:**
- 🔵 **MULTI** — Destroys into 3 separate balls (blue outline)
- 🟩 **PADDLE** — Enlarges paddle by 50% for 5 seconds
- 🟪 **STICKY** — Ball sticks to paddle; press SPACE to launch
- 🟡 **SLOW** — Reduces ball speed by 1 unit

**Malus Bricks:**
- 🔴 **TOUGH** — Requires 2 hits to destroy (shows "2" on brick)
- 🟥 **ARMORED** — Requires 3 hits to destroy (shows "3" on brick)

**Features:**
- **Progressive Difficulty:** Ball speed increases every 3 brick hits; resets on wall contact
- **Multiple Balls:** MULTI bricks create up to 3 balls simultaneously
- **Sticky Mechanics:** Hold ball on paddle, launch with SPACE for precision control
- **Dynamic Rooms:** Each room is configurable with unique brick layouts and mechanics
- **Score Persistence:** Score carries over between rooms
- **Lives Reset:** 3 lives reset for each new room
- **Retro Aesthetics:** Neon cyan/magenta/yellow colors with 1980s arcade styling
- **8-bit Audio:** Background music and SFX toggle buttons

**Technical Details:**
- Canvas-based rendering with support for multiple balls
- Procedural brick placement with random special brick assignment
- Ball speed normalization to maintain physics consistency
- Room configuration via `rooms/config.json`
- Web Audio API for 8-bit sound generation

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

## Room System

Rooms are defined in `rooms/config.json` and individual markdown files in `rooms/`.

### Room Configuration

Each room in `rooms/config.json` contains:
```json
{
  "id": 1,
  "name": "Room Name",
  "difficulty": 1,
  "rows": 4,
  "bricksPerRow": 8,
  "ballSpeed": 4,
  "paddleWidth": 100,
  "speedIncrement": 0.3,
  "maxSpeed": 8,
  "specialBricks": [
    {"type": "MULTI", "chance": 0.15},
    {"type": "TOUGH", "chance": 0.10}
  ]
}
```

### Adding New Rooms

1. Add room config to `rooms/config.json` (increment `totalRooms`)
2. Create `rooms/room5.md` with description and objectives
3. Special brick chances should be probabilities (0.0-1.0)
4. Increase `ballSpeed` and `speedIncrement` for harder rooms

## Roadmap

### Completed Iterations ✅
1. Basic paddle, ball, and game loop with collision detection
2. Bricks and brick collision
3. Score, lives, and game states (start/play/over/win)
4. Enhanced controls and ball spin mechanics
5. 8-bit sound effects and background music
6. Room system with 4 progressively harder levels
7. Special bricks (bonus and malus) with random placement
8. Progressive ball speed and multiple ball physics

### Planned Future Iterations
9. Additional rooms (5+)
10. Leaderboard and high score persistence
11. Additional special brick types
12. Boss battles or challenge rooms
13. Save/resume functionality
14. New game modes (time attack, survival)

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
