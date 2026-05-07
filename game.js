// Canvas and context setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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
  }

  // Bottom (lose life)
  if (ball.y - ball.radius > canvas.height) {
    gameState.lives--;
    gameState.isRunning = false;

    if (gameState.lives <= 0) {
      gameState.gameOver = true;
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

      // Check win condition
      if (gameState.bricks.every((b) => !b.active)) {
        gameState.won = true;
        gameState.isRunning = false;
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
}

// Game loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// Initialize and start
createBricks();
gameLoop();
