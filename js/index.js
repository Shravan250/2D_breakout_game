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

function preload() {
  this.load.image("ball", "img/ball.png");
  this.load.image("paddle", "img/paddle.png");
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
  ball.body.setVelocity(150, 150);

  // Listen for when ball hits the bottom edge
  ball.body.onWorldBounds = true;
  this.physics.world.on("worldbounds", function (body) {
    if (body.gameObject === ball && body.blocked.down) {
      alert("Game Over!");
      location.reload();
    }
  });

  // Add collision between ball and paddle
  this.physics.add.collider(ball, paddle);

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
}

function update() {}
