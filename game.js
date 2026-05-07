// Canvas and context setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Audio system
const audioSystem = {
  audioContext: null,
  musicEnabled: true,
  sfxEnabled: true,
  masterGain: null,
  musicOscillator: null,
  musicGain: null,

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.audioContext.destination);
    }
  },

  playBackgroundMusic() {
    if (!this.musicEnabled || this.musicOscillator) return;
    this.init();

    const now = this.audioContext.currentTime;
    const tempo = 0.5; // 500ms per beat

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

  stopBackgroundMusic() {
    if (this.musicOscillator) {
      this.musicOscillator.stop();
      this.musicOscillator = null;
    }
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
    } else {
      this.stopBackgroundMusic();
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
    dx: 0
  },
  ball: {
    x: canvas.width / 2,
    y: canvas.height - 50,
    radius: 5,
    dx: 4,
    dy: -4,
    speed: 4
  },
  bricks: [],
  score: 0,
  lives: 3,
  isRunning: false,
  gameOver: false,
  won: false
};

// Input handling
const keys = {};

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;

  if (e.key === ' ') {
    e.preventDefault();
    if (!gameState.isRunning && !gameState.gameOver && !gameState.won) {
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

// Initialize audio buttons state
document.getElementById('musicToggle').classList.add('active');
document.getElementById('soundToggle').classList.add('active');

// Initialize bricks
function createBricks() {
  gameState.bricks = [];
  const brickWidth = 60;
  const brickHeight = 15;
  const brickPadding = 10;
  const bricksPerRow = Math.floor((canvas.width - 20) / (brickWidth + brickPadding));
  const brickRows = 4;

  const colors = ['#0ff', '#f0f', '#ff0', '#0f0', '#f00'];

  for (let row = 0; row < brickRows; row++) {
    for (let col = 0; col < bricksPerRow; col++) {
      const x = 10 + col * (brickWidth + brickPadding);
      const y = 40 + row * (brickHeight + brickPadding);
      gameState.bricks.push({
        x,
        y,
        width: brickWidth,
        height: brickHeight,
        active: true,
        color: colors[row % colors.length]
      });
    }
  }
}

// Drawing functions
function drawPaddle() {
  const { paddle } = gameState;
  ctx.fillStyle = '#0ff';
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  // Retro border effect
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
  const { ball } = gameState;
  ctx.fillStyle = '#ff0';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();

  // Retro outline
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawBricks() {
  gameState.bricks.forEach((brick) => {
    if (!brick.active) return;

    ctx.fillStyle = brick.color;
    ctx.fillRect(brick.x, brick.y, brick.width, brick.height);

    // Retro border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
  });
}

function drawUI() {
  document.getElementById('score').textContent = gameState.score;
  document.getElementById('lives').textContent = gameState.lives;
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
  ctx.fillText(`FINAL SCORE: ${gameState.score}`, canvas.width / 2, canvas.height / 2 + 20);
  ctx.fillText('PRESS SPACE TO RESTART', canvas.width / 2, canvas.height / 2 + 80);
}

function drawWin() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0f0';
  ctx.font = 'bold 48px Courier New';
  ctx.textAlign = 'center';
  ctx.fillText('YOU WIN!', canvas.width / 2, canvas.height / 2 - 40);

  ctx.fillStyle = '#ff0';
  ctx.font = '24px Courier New';
  ctx.fillText(`SCORE: ${gameState.score}`, canvas.width / 2, canvas.height / 2 + 20);
  ctx.fillText('PRESS SPACE TO PLAY AGAIN', canvas.width / 2, canvas.height / 2 + 80);
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

  // Keep paddle in bounds
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) {
    paddle.x = canvas.width - paddle.width;
  }
}

function updateBall() {
  const { ball, paddle } = gameState;

  if (!gameState.isRunning) {
    // Stick ball to paddle when not running
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

    // Add spin based on where ball hits paddle
    const hitPos = (ball.x - paddle.x) / paddle.width;
    ball.dx = (hitPos - 0.5) * 8;

    // Play paddle hit sound
    audioSystem.playSFX('paddle-hit');
  }

  // Bottom (lose life)
  if (ball.y - ball.radius > canvas.height) {
    gameState.lives--;
    gameState.isRunning = false;

    if (gameState.lives <= 0) {
      gameState.gameOver = true;
      audioSystem.playSFX('game-over');
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
      brick.active = false;
      gameState.score += 10;
      ball.dy = -ball.dy;

      // Play brick break sound
      audioSystem.playSFX('brick-break');

      // Check win condition
      if (gameState.bricks.every((b) => !b.active)) {
        gameState.won = true;
        gameState.isRunning = false;
        audioSystem.playSFX('win');
      }
    }
  });
}

function render() {
  // Clear canvas with retro black background
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw game elements
  drawBricks();
  drawBall();
  drawPaddle();

  // Draw UI
  drawUI();

  // Draw messages
  if (!gameState.isRunning && !gameState.gameOver && !gameState.won) {
    drawStartMessage();
  }

  if (gameState.gameOver) {
    drawGameOver();
  }

  if (gameState.won) {
    drawWin();
  }
}

function update() {
  if (!gameState.gameOver && !gameState.won) {
    updatePaddle();
    updateBall();
  }
}

// Reset game
function resetGame() {
  gameState.score = 0;
  gameState.lives = 3;
  gameState.isRunning = false;
  gameState.gameOver = false;
  gameState.won = false;
  gameState.ball.x = canvas.width / 2;
  gameState.ball.y = canvas.height - 50;
  gameState.ball.dx = 4;
  gameState.ball.dy = -4;
  gameState.paddle.x = canvas.width / 2 - 50;
  createBricks();
  audioSystem.playBackgroundMusic();
}

// Game loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// Initialize and start
createBricks();
audioSystem.playBackgroundMusic();
gameLoop();
