// Game objects - these need to be accessible in both files
export let ball;
export let paddle;
export let bricks;
export let newBrick;
export let brickInfo;

// Constants
export const BALL_SPEED = 150;
export const MAX_BOUNCE_ANGLE = Math.PI / 3; // 60 degrees
export const MIN_BOUNCE_ANGLE = 0.1; // ~5.7 degrees

export function createPaddle(scene) {
  paddle = scene.physics.add.sprite(
    scene.sys.game.config.width * 0.5,
    scene.sys.game.config.height - 5,
    "paddle"
  );
  paddle.setOrigin(0.5, 1);
  paddle.setImmovable(true);
}

// Create ball
export function createBall(scene) {
  ball = scene.physics.add.sprite(
    scene.sys.game.config.width * 0.5,
    scene.sys.game.config.height - 50,
    "ball"
  );
  ball.setOrigin(0.5);
  ball.body.setCollideWorldBounds(true);
  ball.body.setBounce(1, 1);
  ball.body.setVelocity(BALL_SPEED, -BALL_SPEED);
  ball.initialSpeed = Math.hypot(BALL_SPEED, -BALL_SPEED);
}

// Setup collisions
export function setupCollisions(scene) {
  ball.body.onWorldBounds = true;
  scene.physics.world.on("worldbounds", handleWorldBoundsCollision);
  scene.physics.add.collider(ball, paddle, handlePaddleCollision);
}

// Setup input
export function setupInput(scene) {
  scene.input.on(
    "pointermove",
    (pointer) => {
      paddle.x = Phaser.Math.Clamp(
        pointer.x,
        paddle.width / 2,
        scene.sys.game.config.width - paddle.width / 2
      );
    },
    scene
  );
}

// Handle world bounds collision
function handleWorldBoundsCollision(body) {
  if (body.gameObject === ball && body.blocked.down) {
    alert("Game Over!");
    location.reload();
  }
}

// Handle paddle collision
function handlePaddleCollision(ball, paddle) {
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
  brick.disableBody(true, true);

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
  angle += Phaser.Math.FloatBetween(-0.1, 0.1);

  const speed = ball.initialSpeed;
  const newVx = Math.cos(angle) * speed;
  const newVy = Math.sin(angle) * speed;

  ball.body.setVelocity(newVx, newVy);
}
