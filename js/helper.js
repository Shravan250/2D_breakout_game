// Game objects - these need to be accessible in both files
export let ball;
export let paddle;
export let bricks;
export let newBrick;
export let brickInfo;
export let scoreText;
export let score = 0;
export let lives = 3;
export let livesText;
export let lifeLostText;
export let gameOver = false;
let playing = false;
let startButton;

// Constants
export const BALL_SPEED = 250;
export const MAX_BOUNCE_ANGLE = Math.PI / 3; // 60 degrees
export const MIN_BOUNCE_ANGLE = 0.1; // ~5.7 degrees

// Create start button
export function createStartButton(scene) {
  startButton = scene.add.sprite(
    scene.game.config.width * 0.5,
    scene.game.config.height * 0.5,
    "button"
  );
  startButton.setInteractive();
  startButton.on("pointerdown", () => {
    playing = true;
    startButton.destroy();
    ball.body.setVelocity(BALL_SPEED, -BALL_SPEED);
  });
}

// Create paddle
export function createPaddle(scene) {
  paddle = scene.physics.add.sprite(
    scene.game.config.width * 0.5,
    scene.game.config.height - 5,
    "paddle"
  );
  paddle.setOrigin(0.5, 1);
  paddle.setImmovable(true);
}

// Create ball
export function createBall(scene) {
  ball = scene.physics.add.sprite(
    scene.game.config.width * 0.5,
    scene.game.config.height - 50,
    "ball"
  );
  // Create the wobble animation
  scene.anims.create({
    key: "wobble",
    frames: scene.anims.generateFrameNumbers("ball", {
      frames: [0, 1, 0, 2, 0, 1, 0, 2, 0],
    }),
    frameRate: 24,
  });

  ball.setOrigin(0.5);
  ball.body.setCollideWorldBounds(true);
  ball.body.setBounce(1, 1);
  ball.body.setVelocity(0, 0);
  ball.initialSpeed = Math.hypot(BALL_SPEED, -BALL_SPEED);
}

// Create score text
export function createScoreText(scene) {
  scoreText = scene.add.text(5, 5, `Points: ${score}`, {
    font: "18px Arial",
    fill: "#0095DD",
  });
}

// Create lives text
export function createLivesText(scene) {
  livesText = scene.add.text(
    scene.game.config.width - 5,
    5,
    `Lives: ${lives}`,
    {
      font: "18px Arial",
      fill: "#0095DD",
    }
  );
  livesText.setOrigin(1, 0);
  lifeLostText = scene.add.text(
    scene.game.config.width * 0.5,
    scene.game.config.height * 0.5,
    "Life lost, click to continue",
    { font: "18px Arial", fill: "#0095DD" }
  );
  lifeLostText.setOrigin(0.5);
  lifeLostText.visible = false;
}

// Setup collisions
export function setupCollisions(scene) {
  ball.body.onWorldBounds = true;
  scene.physics.world.on("worldbounds", (body) => {
    handleWorldBoundsCollision(ball, body, scene);
  });
  scene.physics.add.collider(ball, paddle, handlePaddleCollision);
}

// Setup input
export function setupInput(scene) {
  scene.input.on(
    "pointermove",
    (pointer) => {
      if (!playing || gameOver) return;
      paddle.x = Phaser.Math.Clamp(
        pointer.x,
        paddle.width / 2,
        scene.game.config.width - paddle.width / 2
      );
    },
    scene
  );
}

// Handle world bounds collision
function handleWorldBoundsCollision(ball, body, scene) {
  if (body.gameObject === ball && body.blocked.down) {
    lives -= 1;
    livesText.setText(`Lives: ${lives}`);
    if (lives === 0) {
      ball.setVelocity(0, 0);
      lifeLostText.visible = true;
      lifeLostText.setInteractive();
      lifeLostText.on("pointerdown", () => {
        location.reload();
      });
      gameOver = true;
    } else {
      ball.setPosition(
        scene.game.config.width * 0.5,
        scene.game.config.height - 50
      );
      ball.body.setVelocity(BALL_SPEED, -BALL_SPEED);
    }
  }
}

// Handle paddle collision
function handlePaddleCollision(ball, paddle) {
  ball.play("wobble");
  const relativeIntersectX = (ball.x - paddle.x) / (paddle.displayWidth / 2);
  const clampX = Phaser.Math.Clamp(relativeIntersectX, -1, 1);

  let bounceAngle = clampX * MAX_BOUNCE_ANGLE;

  if (Math.abs(bounceAngle) < MIN_BOUNCE_ANGLE) {
    bounceAngle = bounceAngle < 0 ? -MIN_BOUNCE_ANGLE : MIN_BOUNCE_ANGLE;
  }

  bounceAngle += Phaser.Math.FloatBetween(-0.1, 0.1);

  const speed = ball.initialSpeed;
  const vx = speed * Math.sin(bounceAngle);
  const vy = -Math.abs(speed * Math.cos(bounceAngle));

  ball.body.setVelocity(vx, vy);
}

// Initialize bricks
export function initBricks(scene) {
  brickInfo = {
    width: 50,
    height: 20,
    count: {
      row: 3,
      col: 7,
    },
    offset: {
      top: 50,
      left: 60,
    },
    padding: 10,
  };

  bricks = scene.physics.add.group();

  for (let c = 0; c < brickInfo.count.col; c++) {
    for (let r = 0; r < brickInfo.count.row; r++) {
      let brickX =
        brickInfo.offset.left + c * (brickInfo.width + brickInfo.padding);
      let brickY =
        brickInfo.offset.top + r * (brickInfo.height + brickInfo.padding);
      newBrick = scene.physics.add.sprite(brickX, brickY, "brick");
      newBrick.setImmovable(true);
      newBrick.setOrigin(0.5);
      bricks.add(newBrick);
    }
  }

  scene.physics.add.collider(ball, bricks, handleBallBrickCollision);
}

// Handle brick collision
function handleBallBrickCollision(ball, brick) {
  ball.play("wobble");

  // Create a tween for the brick's scale
  brick.scene.tweens.add({
    targets: brick,
    scaleX: 0,
    scaleY: 0,
    duration: 200,
    ease: "Linear",
    onComplete: () => {
      brick.destroy();
      score += 10;
      scoreText.setText(`Points: ${score}`);

      if (bricks.countActive() === 0) {
        alert("You win!");
        location.reload();
      }
    },
  });

  let vx = ball.body.velocity.x;
  let vy = ball.body.velocity.y;

  const overlapX = Math.abs(ball.x - brick.x) - brick.displayWidth / 2;
  const overlapY = Math.abs(ball.y - brick.y) - brick.displayHeight / 2;

  if (overlapX > overlapY) {
    vx = -vx;
  } else {
    vy = -vy;
  }

  let angle = Math.atan2(vy, vx);
  angle += Phaser.Math.FloatBetween(-1, 1);

  const speed = ball.initialSpeed;
  const newVx = Math.cos(angle) * speed;
  const newVy = Math.sin(angle) * speed;

  ball.body.setVelocity(newVx, newVy);
}
