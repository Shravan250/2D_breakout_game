const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 320,
  backgroundColor: "#eee",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 },
      fps: 60,
      enableBody: true,
      checkCollision: {
        up: true,
        down: true,
        left: true,
        right: true,
      },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

let ball;
let paddle;
let bricks;
let newBrick;
let brickInfo;
function preload() {
  this.load.image("ball", "img/ball.png");
  this.load.image("paddle", "img/paddle.png");
  this.load.image("brick", "img/brick.png");
}

function create() {
  // Create paddle
  paddle = this.physics.add.sprite(
    this.sys.game.config.width * 0.5,
    this.sys.game.config.height - 5,
    "paddle"
  );
  paddle.setOrigin(0.5, 1);
  paddle.setImmovable(true);

  // Create ball
  ball = this.physics.add.sprite(
    this.sys.game.config.width * 0.5,
    this.sys.game.config.height - 50,
    "ball"
  );
  ball.setOrigin(0.5);
  ball.body.setCollideWorldBounds(true);
  ball.body.setBounce(1, 1);
  ball.body.setVelocity(150, -150);
  ball.initialSpeed = Math.hypot(150, -150);

  // Listen for when ball hits the bottom edge
  ball.body.onWorldBounds = true;
  this.physics.world.on("worldbounds", function (body) {
    if (body.gameObject === ball && body.blocked.down) {
      alert("Game Over!");
      location.reload();
    }
  });

  // Add collision between ball and paddle
  this.physics.add.collider(ball, paddle, (ball, paddle) => {
    // How far from the paddle’s center did the ball hit?
    // -1 = extreme left, +1 = extreme right
    const relativeIntersectX = (ball.x - paddle.x) / (paddle.displayWidth / 2);

    // Clamp to [-1, 1]
    const clampX = Phaser.Math.Clamp(relativeIntersectX, -1, 1);

    // Map to a max bounce angle (e.g. 60° / π/3)
    const maxBounce = Math.PI / 3;
    let bounceAngle = clampX * maxBounce;

    // Avoid nearly-zero angles (prevents straight vertical)
    const minAngle = 0.1; // ~5.7°
    if (Math.abs(bounceAngle) < minAngle) {
      bounceAngle = bounceAngle < 0 ? -minAngle : minAngle;
    }

    // tiny random tweak to avoid repetitive paths
    bounceAngle += Phaser.Math.FloatBetween(-0.1, 0.1);

    // Recompute velocity components,
    // always sending the ball **upwards** (negative Y)
    const speed = ball.initialSpeed;
    const vx = speed * Math.sin(bounceAngle);
    const vy = -Math.abs(speed * Math.cos(bounceAngle));

    ball.body.setVelocity(vx, vy);
  });

  //Enable pointer input
  this.input.on(
    "pointermove",
    (pointer) => {
      paddle.x = Phaser.Math.Clamp(
        pointer.x,
        paddle.width / 2,
        this.sys.game.config.width - paddle.width / 2
      );
    },
    this
  );

  //initilize bricks
  initBricks(this);
}

function update() {
  const targetSpeed = 300;
  let { x: vx, y: vy } = ball.body.velocity;
  const current = Math.hypot(vx, vy);
  if (current > 0) {
    ball.body.setVelocity(
      (vx / current) * targetSpeed,
      (vy / current) * targetSpeed
    );
  }
}

function initBricks(scene) {
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

function handleBallBrickCollision(ball, bricks) {
  bricks.disableBody(true, true);

  //current velocity
  let vx = ball.body.velocity.x;
  let vy = ball.body.velocity.y;

  //Compute overlaps to detect which face was hit
  const overlapX = Math.abs(ball.x - bricks.x) - bricks.displayWidth / 2;
  const overlapY = Math.abs(ball.y - bricks.y) - bricks.displayHeight / 2;

  if (overlapX > overlapY) {
    // Hit left/right face → flip X
    vx = -vx;
  } else {
    // Hit top/bottom face → flip Y
    vy = -vy;
  }

  // Build a fresh angle, then nudge it slightly
  let angle = Math.atan2(vy, vx);
  // avoid exact 0/90° trajectories by adding a small random tweak
  angle += Phaser.Math.FloatBetween(-1, 1);

  // Re-normalize to your stored initial speed
  const speed = ball.initialSpeed;
  const newVx = Math.cos(angle) * speed;
  const newVy = Math.sin(angle) * speed;

  ball.body.setVelocity(newVx, newVy);
}
