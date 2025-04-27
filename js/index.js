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

function preload() {
  this.load.image("ball", "img/ball.png");
}

function create() {
  ball = this.physics.add.sprite(240, 160, "ball");
  ball.body.setCollideWorldBounds(true);
  ball.body.setBounce(1, 1);

  ball.body.setVelocity(150, 150);
}

function update() {}
