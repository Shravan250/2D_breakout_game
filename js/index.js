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
  ball = this.add.sprite(50, 50, "ball");
  this.physics.add.existing(ball);
  ball.body.setVelocity(150, 150);
}

function update() {}
