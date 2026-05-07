// Canvas and context setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Rooms configuration
let roomsConfig = null;
let currentRoomId = 1;
let gameReady = false;

// Audio system
const audioSystem = {
  audioContext: null,
  musicEnabled: true,
  sfxEnabled: true,
  masterGain: null,

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.audioContext.destination);
    }
  },

  playBackgroundMusic() {
    if (!this.musicEnabled) return;
    this.init();

    const now = this.audioContext.currentTime;
    const tempo = 0.5;

    const melody = [
      { freq: 330, duration: tempo },
      { freq: 330, duration: tempo },
      { freq: 330, duration: tempo },
      { freq: 330, duration: tempo },
      { freq: 380, duration: tempo },
      { freq: 420, duration: tempo },
      { freq: 330, duration: tempo * 2 },
      { freq: 330, duration: tempo },
      { freq: 330, duration: tempo },
      { freq: 330, duration: tempo * 2 },
    ];

    const playMelody = (startTime) => {
      let currentTime = startTime;
      melody.forEach((note) => {
        this.playTone(note.freq, note.duration, currentTime, 0.1, 0.3);
        currentTime += note.duration;
      });

      if (this.musicEnabled) {
        setTimeout(() => playMelody(currentTime), (currentTime - now) * 1000);
      }
    };

    playMelody(now);
  },

  playTone(frequency, duration, startTime, attackTime, decayTime) {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'square';
    osc.frequency.value = frequency;

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.3, startTime + attackTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration - decayTime);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  },

  playSFX(type) {
    if (!this.sfxEnabled) return;
    this.init();

    const now = this.audioContext.currentTime;

    switch (type) {
      case 'paddle-hit':
        this.playTone(400, 0.1, now, 0.02, 0.08);
        this.playTone(500, 0.08, now + 0.05, 0.02, 0.06);
        break;
      case 'brick-break':
        this.playTone(600, 0.15, now, 0.02, 0.1);
        this.playTone(800, 0.1, now + 0.08, 0.02, 0.08);
        break;
      case 'power-up':
        this.playTone(700, 0.2, now, 0.05, 0.15);
        this.playTone(900, 0.2, now + 0.1, 0.05, 0.15);
        break;
      case 'win':
        this.playTone(523, 0.2, now, 0.05, 0.15);
        this.playTone(659, 0.2, now + 0.15, 0.05, 0.15);
        this.playTone(784, 0.3, now + 0.3, 0.05, 0.25);
        break;
      case 'game-over':
        this.playTone(400, 0.15, now, 0.05, 0.1);
        this.playTone(300, 0.15, now + 0.15, 0.05, 0.1);
        this.playTone(200, 0.3, now + 0.3, 0.05, 0.25);
        break;
    }
  },

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicEnabled) {
      this.playBackgroundMusic();
    }
  },

  toggleSFX() {
    this.sfxEnabled = !this.sfxEnabled;
  },
};

// Game state
const gameState = {
  paddle: {
    x: canvas.width / 2 - 50,
    y: canvas.height - 20,
    width: 100,
    height: 10,
    speed: 6,
    dx: 0,
    defaultWidth: 100,
    paddleSizeMultiplier: 1,
    paddleSizeTimer: 0,
  },
  balls: [],
  bricks: [],
  score: 0,
  lives: 3,
  isRunning: false,
  gameOver: false,
  won: false,
  brickTouchCount: 0,
  currentBallSpeed: 4,
};

// Room system
async function loadRoomsConfig() {
  const response = await fetch('rooms/config.json');
  roomsConfig = await response.json();
}

function getCurrentRoomConfig() {
  return roomsConfig.rooms.find(r => r.id === currentRoomId);
}

function createBricks() {
  gameState.bricks = [];
  const config = getCurrentRoomConfig();
  const brickWidth = 60;
  const brickHeight = 15;
  const brickPadding = 10;
  const bricksPerRow = config.bricksPerRow;
  const brickRows = config.rows;

  const colors = ['#0ff', '#f0f', '#ff0', '#0f0', '#f00'];
  const brickTypes = ['STANDARD', 'STANDARD', 'STANDARD', 'STANDARD', 'STANDARD'];

  // Add special bricks
  if (config.specialBricks.length > 0) {
    config.specialBricks.forEach(special => {
      const count = Math.floor((bricksPerRow * brickRows) * special.chance);
      for (let i = 0; i < count; i++) {
        brickTypes.push(special.type);
      }
    });

    // Shuffle brickTypes
    for (let i = brickTypes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [brickTypes[i], brickTypes[j]] = [brickTypes[j], brickTypes[i]];
    }
  }

  let typeIndex = 0;
  for (let row = 0; row < brickRows; row++) {
    for (let col = 0; col < bricksPerRow; col++) {
      const x = 10 + col * (brickWidth + brickPadding);
      const y = 40 + row * (brickHeight + brickPadding);
      const type = brickTypes[typeIndex] || 'STANDARD';

      let durability = 1;
      let displayColor = colors[row % colors.length];

      if (type === 'TOUGH') durability = 2;
      if (type === 'ARMORED') durability = 3;

      gameState.bricks.push({
        x,
        y,
        width: brickWidth,
        height: brickHeight,
        active: true,
        type,
        color: displayColor,
        durability,
        maxDurability: durability,
      });

      typeIndex++;
    }
  }
}

function initializeBall() {
  gameState.balls = [{
    x: canvas.width / 2,
    y: canvas.height - 50,
    radius: 5,
    dx: 4,
    dy: -4,
    stuck: false,
  }];
  gameState.currentBallSpeed = getCurrentRoomConfig().ballSpeed;
}

// Input handling
const keys = {};

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;

  if (e.key === ' ') {
    e.preventDefault();
    if (gameState.balls.some(b => b.stuck)) {
      // Release stuck ball
      gameState.balls.forEach(b => {
        if (b.stuck) {
          b.stuck = false;
          b.dx = 4;
          b.dy = -4;
        }
      });
    } else if (!gameState.isRunning && !gameState.gameOver && !gameState.won) {
      gameState.isRunning = true;
    } else if (gameState.gameOver || gameState.won) {
      resetGame();
    }
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Audio button controls
document.getElementById('musicToggle').addEventListener('click', () => {
  audioSystem.toggleMusic();
  const btn = document.getElementById('musicToggle');
  btn.classList.toggle('active', audioSystem.musicEnabled);
});

document.getElementById('soundToggle').addEventListener('click', () => {
  audioSystem.toggleSFX();
  const btn = document.getElementById('soundToggle');
  btn.classList.toggle('active', audioSystem.sfxEnabled);
});

document.getElementById('musicToggle').classList.add('active');
document.getElementById('soundToggle').classList.add('active');

// Drawing functions
function drawPaddle() {
  const { paddle } = gameState;
  ctx.fillStyle = '#0ff';
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
  gameState.balls.forEach((ball) => {
    ctx.fillStyle = ball.stuck ? '#f0f' : '#ff0';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.stroke();
  });
}

function drawBricks() {
  gameState.bricks.forEach((brick) => {
    if (!brick.active) return;

    ctx.fillStyle = brick.color;
    ctx.fillRect(brick.x, brick.y, brick.width, brick.height);

    // Draw durability indicator
    if (brick.durability > 1) {
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Courier New';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(brick.durability, brick.x + brick.width / 2, brick.y + brick.height / 2);
    }

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
  });
}

function drawUI() {
  document.getElementById('score').textContent = gameState.score;
  document.getElementById('lives').textContent = gameState.lives;
  document.getElementById('roomDisplay').textContent = `ROOM ${currentRoomId}: ${getCurrentRoomConfig().name}`;
}

function drawGameOver() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#f0f';
  ctx.font = 'bold 48px Courier New';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);

  ctx.fillStyle = '#0ff';
  ctx.font = '24px Courier New';
  ctx.fillText(`SCORE: ${gameState.score}`, canvas.width / 2, canvas.height / 2 + 20);
  ctx.fillText('PRESS SPACE TO RESTART', canvas.width / 2, canvas.height / 2 + 80);
}

function drawRoomComplete() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0f0';
  ctx.font = 'bold 48px Courier New';
  ctx.textAlign = 'center';
  ctx.fillText('ROOM COMPLETE!', canvas.width / 2, canvas.height / 2 - 40);

  if (currentRoomId < roomsConfig.gameDefaults.totalRooms) {
    ctx.fillStyle = '#ff0';
    ctx.font = '24px Courier New';
    ctx.fillText(`SCORE: ${gameState.score}`, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText('PRESS SPACE FOR NEXT ROOM', canvas.width / 2, canvas.height / 2 + 80);
  } else {
    ctx.fillStyle = '#ff0';
    ctx.font = '24px Courier New';
    ctx.fillText(`FINAL SCORE: ${gameState.score}`, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText('YOU BEAT THE GAME!', canvas.width / 2, canvas.height / 2 + 60);
    ctx.fillText('PRESS SPACE TO RESTART', canvas.width / 2, canvas.height / 2 + 100);
  }
}

function drawStartMessage() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0ff';
  ctx.font = 'bold 32px Courier New';
  ctx.textAlign = 'center';
  ctx.fillText('PRESS SPACE TO START', canvas.width / 2, canvas.height / 2);
}

// Update functions
function updatePaddle() {
  const { paddle } = gameState;

  if (keys['ArrowLeft']) {
    paddle.dx = -paddle.speed;
  } else if (keys['ArrowRight']) {
    paddle.dx = paddle.speed;
  } else {
    paddle.dx = 0;
  }

  paddle.x += paddle.dx;

  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) {
    paddle.x = canvas.width - paddle.width;
  }

  // Update paddle size timer
  if (paddle.paddleSizeTimer > 0) {
    paddle.paddleSizeTimer--;
    if (paddle.paddleSizeTimer === 0) {
      paddle.width = paddle.defaultWidth;
      paddle.paddleSizeMultiplier = 1;
    }
  }
}

function updateBalls() {
  const { paddle, balls } = gameState;
  const config = getCurrentRoomConfig();

  balls.forEach((ball, ballIndex) => {
    if (ball.stuck) {
      ball.x = paddle.x + paddle.width / 2;
      ball.y = paddle.y - ball.radius;
      return;
    }

    if (!gameState.isRunning) {
      ball.x = paddle.x + paddle.width / 2;
      ball.y = paddle.y - ball.radius;
      return;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (left and right)
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
      ball.dx = -ball.dx;
      ball.x = Math.max(ball.radius, Math.min(canvas.width - ball.radius, ball.x));
      // Reset ball speed on wall hit
      gameState.brickTouchCount = 0;
      gameState.currentBallSpeed = config.ballSpeed;
    }

    // Wall collision (top)
    if (ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
      ball.y = ball.radius;
    }

    // Paddle collision
    if (
      ball.y + ball.radius > paddle.y &&
      ball.x > paddle.x &&
      ball.x < paddle.x + paddle.width
    ) {
      ball.dy = -ball.dy;
      ball.y = paddle.y - ball.radius;

      const hitPos = (ball.x - paddle.x) / paddle.width;
      ball.dx = (hitPos - 0.5) * 8;

      audioSystem.playSFX('paddle-hit');
    }

    // Bottom (lose life)
    if (ball.y - ball.radius > canvas.height) {
      balls.splice(ballIndex, 1);
      if (balls.length === 0) {
        gameState.lives--;
        gameState.isRunning = false;
        gameState.brickTouchCount = 0;
        gameState.currentBallSpeed = config.ballSpeed;

        if (gameState.lives <= 0) {
          gameState.gameOver = true;
          audioSystem.playSFX('game-over');
        } else {
          // Create a new ball for next attempt
          initializeBall();
        }
      }
    }

    // Brick collision
    gameState.bricks.forEach((brick) => {
      if (!brick.active) return;

      if (
        ball.x > brick.x &&
        ball.x < brick.x + brick.width &&
        ball.y > brick.y &&
        ball.y < brick.y + brick.height
      ) {
        ball.dy = -ball.dy;

        // Handle special brick effects
        brick.durability--;
        if (brick.durability <= 0) {
          brick.active = false;
          gameState.score += 10;

          // Increase ball speed after hitting brick
          gameState.brickTouchCount++;
          if (gameState.brickTouchCount % 3 === 0 && gameState.currentBallSpeed < config.maxSpeed) {
            gameState.currentBallSpeed += config.speedIncrement;
            // Normalize ball direction to maintain speed
            const speed = gameState.currentBallSpeed;
            const magnitude = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
            ball.dx = (ball.dx / magnitude) * speed;
            ball.dy = (ball.dy / magnitude) * speed;
          }

          // Apply special brick effects
          if (brick.type === 'MULTI') {
            audioSystem.playSFX('power-up');
            // Create 2 additional balls
            for (let i = 0; i < 2; i++) {
              gameState.balls.push({
                x: brick.x + brick.width / 2,
                y: brick.y + brick.height / 2,
                radius: 5,
                dx: (Math.random() - 0.5) * 8,
                dy: -4,
                stuck: false,
              });
            }
          } else if (brick.type === 'PADDLE') {
            audioSystem.playSFX('power-up');
            gameState.paddle.width = gameState.paddle.defaultWidth * 1.5;
            gameState.paddle.paddleSizeMultiplier = 1.5;
            gameState.paddle.paddleSizeTimer = 300; // 5 seconds at 60 FPS
          } else if (brick.type === 'STICKY') {
            audioSystem.playSFX('power-up');
            ball.stuck = true;
          } else if (brick.type === 'SLOW') {
            audioSystem.playSFX('power-up');
            gameState.currentBallSpeed = Math.max(3, gameState.currentBallSpeed - 1);
            const magnitude = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
            ball.dx = (ball.dx / magnitude) * gameState.currentBallSpeed;
            ball.dy = (ball.dy / magnitude) * gameState.currentBallSpeed;
          } else {
            audioSystem.playSFX('brick-break');
          }
        } else {
          audioSystem.playSFX('brick-break');
        }

        // Check win condition
        if (gameState.bricks.every((b) => !b.active)) {
          gameState.won = true;
          gameState.isRunning = false;
          audioSystem.playSFX('win');
        }
      }
    });
  });
}

function render() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawBricks();
  drawBall();
  drawPaddle();

  drawUI();

  if (!gameState.isRunning && !gameState.gameOver && !gameState.won) {
    drawStartMessage();
  }

  if (gameState.gameOver) {
    drawGameOver();
  }

  if (gameState.won) {
    drawRoomComplete();
  }
}

function update() {
  if (!gameState.gameOver && !gameState.won) {
    updatePaddle();
    updateBalls();
  }
}

// Reset and advance functions
function resetGame() {
  if (gameState.won) {
    if (currentRoomId < roomsConfig.gameDefaults.totalRooms) {
      currentRoomId++;
    } else {
      currentRoomId = 1;
    }
  }

  gameState.lives = 3;
  gameState.isRunning = false;
  gameState.gameOver = false;
  gameState.won = false;
  gameState.brickTouchCount = 0;
  gameState.paddle.width = gameState.paddle.defaultWidth;
  gameState.paddle.x = canvas.width / 2 - gameState.paddle.width / 2;
  gameState.paddle.paddleSizeTimer = 0;

  createBricks();
  initializeBall();
  audioSystem.playBackgroundMusic();
}

// Game loop
function gameLoop() {
  if (!gameReady) {
    requestAnimationFrame(gameLoop);
    return;
  }
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// Initialize and start
async function init() {
  try {
    await loadRoomsConfig();
    if (!roomsConfig) {
      console.error('Failed to load rooms config');
      return;
    }
    createBricks();
    initializeBall();
    audioSystem.playBackgroundMusic();
    gameReady = true;
    gameLoop();
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

init();
