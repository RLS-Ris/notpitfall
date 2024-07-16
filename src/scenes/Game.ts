import {Scene} from 'phaser';
import {Screen} from '../classes/Screen';
import {Player} from '../classes/Player';
import {Rock} from '../classes/Rock';

export class Game extends Scene
{
	camera : Phaser.Cameras.Scene2D.Camera;
	player;
	rocks;
	ground;

	treasure;
	treasureCount = 0;

	WORLD_LENGTH = 32;
	SCRN_LMT_LEFT = 50;
	SCRN_LMT_RIGHT = 1000;
	
	ROCK_SPEED = 3;
	ROCK_SPACING = 300;
	ROCK_FREQUENCY = 6000;
	lastRockFired = 0;

	screenDirection = 1;
	screenNumber;
	screens = [];
	currentScreen;

	constructor ()
	{
		super('Game');
	}

	init_world(){
		let initialSeed = Phaser.Math.RND.integer();
		let rnd = Phaser.Math.RND;

		for(let i = 0; i < this.WORLD_LENGTH; i++){
			let s = new Screen(i);
					
			Phaser.Math.RND.sow([i + initialSeed]);

			s.layout = rnd.between(0,3);

			// Only add rocks if there isn't a pit.
			if(s.layout == 0 || s.layout == 1){
				s.rockAmount = rnd.between(0,3);
			}

			s.endItem = rnd.between(0,2);
			s.undergroundItem = rnd.between(0,1);

			this.screens.push(s);
		}

		this.currentScreen = this.screens[0];
	}

	create ()
	{
		this.init_world();

		this.camera = this.cameras.main;
		this.camera.setBackgroundColor(0x333333);
		
		this.ground = this.physics.add.staticGroup();
		this.ground.create(500,550,'').setScale(40,2).refreshBody();
		this.ground.create(500,550,'').setScale(9,2).refreshBody();
		this.ground.create(100,550,'').setScale(9,2).refreshBody();
		this.ground.create(900,550,'').setScale(9,2).refreshBody();
		this.ground.create(500,790,'').setScale(40,2).refreshBody();
		
		this.player = new Player(this, 0, 0);	
		this.player.x = 100;
		this.player.y = 500;

		this.treasure = this.physics.add.sprite(900,500,'treasure');
		this.treasure.body.allowGravity = false;
		this.treasure.body.enable = false;
		this.treasure.setActive(false);
		this.treasure.setVisible(false);

		this.rocks = this.physics.add.group({
				classType:Rock,
				maxSize:20,
				runChildUpdate:true
		});

		this.physics.add.collider(this.player, this.ground);
		
		this.physics.add.overlap(
				this.player, this.treasure,
				this.collect_treasure, null, this);

		this.physics.add.overlap(
			this.player, this.rocks,
			this.player.damage, null, this.player); 
		
		this.screenNumber = 0;
		this.screen_reset();
	}

	collect_treasure(){
			this.treasureCount++;
			this.currentScreen.treasureCollected = true;
			
			this.treasure.body.enable = false;
			this.treasure.setActive(false);
			this.treasure.setVisible(false);
	}

	screen_reset(){
		this.currentScreen = this.screens[this.screenNumber];

		let aliveRocks = [];
	  this.aliveRocks =	this.rocks.getChildren();

		// Kill all rocks in the group.
		for(let i = 0; i < this.aliveRocks.length; i++){
				this.aliveRocks[i].kill();
				this.lastRockFired = 0;
		}

		this.treasure.setActive(false);
		this.treasure.setVisible(false);
		this.treasure.body.enable = false;

		if(this.currentScreen.endItem == 2 && 
			 !this.currentScreen.treasureCollected){;
				this.treasure.body.enable = true;
				this.treasure.setActive(true);
				this.treasure.setVisible(true);
		}
	}

	move_screen(dist){
		if(Math.sign(dist) < 0){// going left
			this.player.x = this.SCRN_LMT_RIGHT;
			this.screenDirection = -1;
		}else{									// going right
			this.player.x = this.SCRN_LMT_LEFT;
			this.screenDirection = 1;
		}
		
		this.screenNumber = Phaser.Math.Wrap(
				this.screenNumber + dist, 0, this.WORLD_LENGTH);
		this.screen_reset();
	}

	spawn_rocks(count, direction){
		let speed = 4;
		let firePos = 0;
			
		if(this.screenDirection == -1) {
				this.speed = this.ROCK_SPEED; 
				this.firePos = -400;}
		if(this.screenDirection == 1) {
				this.speed = -this.ROCK_SPEED;
				this.firePos = 1200;}

		for(let i = 0; i < count; i++){
			const rock = this.rocks.get();
			if(rock){
				rock.fire(
						this.firePos+i*this.ROCK_SPACING,
						500,this.speed);
			}
		}
	}

	update (time, delta) {
		if(time > this.lastRockFired){
			if(this.player.x < 9800){

				this.spawn_rocks(this.currentScreen.rockAmount, 'left');
				this.lastRockFired = time + this.ROCK_FREQUENCY;
			}
		}

		// WRAP AROUND
		if(this.player.x < this.SCRN_LMT_LEFT) this.move_screen(-1);
		if(this.player.x > this.SCRN_LMT_RIGHT) this.move_screen(1);
	}
}
