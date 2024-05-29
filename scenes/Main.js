// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Main extends Phaser.Scene {
  constructor() {
    super("main");
  }

  init() {}

  preload() {
    //load images
    this.load.image("skay", "../public/assets/skay.webp");
    this.load.image("platform", "../public/assets/platform.png");
    this.load.spritesheet("dude", "../public/assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });

    this.load.image("triangle", "../public/assets/triangle.png");
  }

  create() {
    //add images
    this.cielo = this.add.image(400, 300, "skay");
    this.cielo.setScale(2);

    // crear grupa plataformas
    this.plataformas = this.physics.add.group();
    // al grupo de plataformas agregar una plataforma
    const platform = this.plataformas.create(400, 568, "platform").setScale(2);
    platform.setImmovable(true);
    platform.body.allowGravity = false;

    // create animations
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "idle",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 1,
    });

    // add player
    this.player = this.physics.add.sprite(100, 450, "dude");

    // add physics to player
    this.player.setBounce(0, 0.2);
    this.player.setCollideWorldBounds(true);
    // start animations
    this.player.anims.play("right", true);

    //collide with platforms
    this.physics.add.collider(this.player, this.plataformas);

    //add cursors
    this.cursor = this.input.keyboard.createCursorKeys();

    // timer event to create platforms
    this.time.addEvent({
      delay: 2000,
      callback: this.createPlatform,
      callbackScope: this,
      loop: true,
    });

    // crear grupo recolectables
    this.recolectables = this.physics.add.group();
    // colision con recolectables
    this.physics.add.collider(
      this.player,
      this.recolectables,
      this.collectRecolectable,
      null,
      this
    );
  }

  update() {
    /* NO APLICA PORQUE SE MUEVE SOLO PARA ADELANTE
    // player movement
    if (this.cursor.left.isDown) {
      this.player.setVelocityX(-160);
      // play animation
      this.player.anims.play("left", true);
    } else if (this.cursor.right.isDown) {
      this.player.setVelocityX(160);
      // play animation
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      // play animation
      this.player.anims.play("idle", true);
    }
    */
    if (this.cursor.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-230);
    }
  }

  createPlatform() {
    const x = 800;
    const y = Phaser.Math.Between(300, 500);
    const width = Phaser.Math.FloatBetween(0.2, 0.5);
    const platform = this.plataformas.create(x, y, "platform");

    //change size of platform
    platform.setScale(width, 1).refreshBody();

    //move to left
    //refresh body to update physics body
    platform.setVelocityX(-200);
    platform.setImmovable(true);
    platform.body.allowGravity = false;

    // insert recolectable item
    const insertRecolectable = Phaser.Math.FloatBetween(0, 1);
    if (insertRecolectable > 0.5) {
      const recolectable = this.physics.add.sprite(x, y - 30, "triangle");
      recolectable.setScale(0.5);
      recolectable.setVelocityX(-200);
      recolectable.setImmovable(true);
      recolectable.body.allowGravity = false;
    }
  }

  collectRecolectable(player, recolectable) {
    console.log("recolectable");
    recolectable.destroy();
  }
}
