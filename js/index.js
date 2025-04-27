import {
  createPaddle,
  createBall,
  setupCollisions,
  setupInput,
  initBricks,
  ball,
  createScoreText,
  createLivesText,
} from "./helper.js";

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

function preload() {
  this.load.image("ball", "img/ball.png");
  this.load.image("paddle", "img/paddle.png");
  this.load.image("brick", "img/brick.png");
}

function create() {
  createPaddle(this);
  createBall(this);
  createScoreText(this);
  createLivesText(this);
  setupCollisions(this);
  setupInput(this);
  initBricks(this);
}

function update() {
  if (ball && ball.body) {
    const targetSpeed = ball.initialSpeed;
    let { x: vx, y: vy } = ball.body.velocity;
    const current = Math.hypot(vx, vy);
    if (current > 0) {
      ball.body.setVelocity(
        (vx / current) * targetSpeed,
        (vy / current) * targetSpeed
      );
    }
  }
}
