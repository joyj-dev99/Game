// import Player from "./Player.js";

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

         // 프로그래스 바 초기 설정
         this.progress = 90;

         // 프로그래스 바의 배경
         this.progressBarBackground = this.add.graphics();
         this.progressBarBackground.fillStyle(0x222222, 1);
         this.progressBarBackground.fillRect(5, 5, 100, 10);
 
         // 프로그래스 바
         this.progressBar = this.add.graphics();

         // 진행률 텍스트
        this.progressText = this.add.text(108, 6, this.progress + '%', { fontSize: '10px', fill: '#000000' });


         // 남은 시간 초기화
         this.leftTime = 60;

         // 남은 시간 텍스트 배경
        this.leftTimeBackground = this.add.graphics();
        this.leftTimeBackground.fillStyle(0xffffff, 0.8); // 검정색 배경에 50% 투명도
        this.leftTimeBackground.fillRect(145, 2, 110, 20); // 배경의 크기와 위치 조정

         // 남은 시간 텍스트
         this.leftTimeText = this.add.text(150, 5, '남은 시간 60초', {fontSize: '15px', fill : '#000'});
 
         // 1초마다 진행률을 업데이트하는 타이머 이벤트 설정
         this.time.addEvent({
             delay: 1000, // 1초마다
             callback: this.updateLeftTime, 
             callbackScope: this,
             loop: true
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

    updateLeftTime() {
        if (this.leftTime > 0) {
            this.leftTime -= 1;
        }

        this.leftTimeText.setText(`남은 시간 ${this.leftTime}초`);
    }

    updateProgress() {
        if (this.progress < 100) {
            this.progress += 1; // 진행률 1% 증가
            console.log("진행률 : " + this.progress);
        }

        // 프로그래스 바 업데이트
        this.progressBar.clear();
        this.progressBar.fillStyle(0xffffff, 1);
        this.progressBar.fillRect(6, 6, 98 * (this.progress / 100), 8);
        // 진행률 텍스트 업데이트
        this.progressText.setText(this.progress + '%');

        if (this.progress >= 100) {
            this.progressBar.clear();
            this.progressBar.fillStyle(0x00ff00, 1); // 완료된 바의 색상 (초록색)
            this.progressBar.fillRect(6, 6, 98, 8);
            this.progressText.setText('100%');
        }
    }
}