import Player from "./Player.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }
    preload() {
        console.log("preload");
        // Player.preload(this);
        this.load.spritesheet('player1', "../assets/images/down_walk.png", {
            frameWidth: 24,
            frameHeight: 24
        })

        this.load.image("roomTiles", "assets/map/Room_Builder_Office_16x16.png");
        this.load.image("objectTiles", "assets/map/Modern_Office_16x16.png");
        this.load.tilemapTiledJSON("map", "assets/map/map01.json");
        
    }

    create() {
        console.log("create");
        this.matter.world.setBounds();

        const map = this.make.tilemap({ key: "map" });
        const roomTileset = map.addTilesetImage("Room_Builder_Office_16x16", "roomTiles");
        const objectTileset = map.addTilesetImage("Modern_Office_16x16", "objectTiles");
        
        const background = map.createLayer("background", roomTileset, 0, 0);
        const wall = map.createLayer("wall", roomTileset, 0, 0);        
        const desk = map.createLayer("desk", objectTileset, 0, 0);
        const object = map.createLayer("object", objectTileset, 0, 0);

        wall.setCollisionByProperty({ collides: true });
        object.setCollisionByProperty({ collides: true });
        desk.setCollisionByProperty({ collides: true });

        this.matter.world.convertTilemapLayer(wall);
        this.matter.world.convertTilemapLayer(object);
        this.matter.world.convertTilemapLayer(desk);
        
        // this.player = new Player({
        //     scene: this,
        //     x: 100,
        //     y: 100,
        //     texture: "down_walk",
        //     frame: "princess_idle_1"
        // });
        // this.add.existing(this.player);

        this.player = this.matter.add.sprite(100, 100, "player1", null, {
            isSensor: false,
        })

        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        var playerCollider = Bodies.rectangle(this.player.x, this.player.y, 13, 16, { 
            isSensor: false, 
            label: 'playerCollider' 
        });
        const compoundBody = Body.create({
            parts: [playerCollider],
            frictionAir: 0.35,
        });
        this.player.setExistingBody(compoundBody);
        this.player.setFixedRotation();

        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        });
    }
    
    update() {
        // this.player.update();
        const speed = 2.5;
        let playerVelocity = new Phaser.Math.Vector2();
        if (this.player.inputKeys.left.isDown) {
            playerVelocity.x = -1;
        } else if (this.player.inputKeys.right.isDown) {
            playerVelocity.x = 1;
        }
        if (this.player.inputKeys.up.isDown) {
            playerVelocity.y = -1;
        } else if (this.player.inputKeys.down.isDown) {
            playerVelocity.y = 1;
        }
        playerVelocity.normalize();
        playerVelocity.scale(speed);

        this.player.setVelocity(playerVelocity.x, playerVelocity.y);
    }


}