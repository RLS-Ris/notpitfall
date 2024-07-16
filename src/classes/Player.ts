export class Player extends Phaser.Physics.Arcade.Sprite{
	
	GROUND_SPEED = 190;
	JUMP_H = 560;
	GRAV_UP = 1200;
	GRAV_DOWN = 800;
		
	constructor (scene, x, y){
		super(scene, x, y, 'player');

		scene.add.existing(this);
		scene.physics.add.existing(this);
		
		this.cursors = scene.input.keyboard.createCursorKeys();
	}

	damage (){
		this.body.setVelocityX(0);
		this.body.setVelocityY(5);
		this.y -= 5;
	}

	preUpdate(time,delta){	
		super.preUpdate(time, delta);
			// Movement
		const { left, right, up } = this.cursors;
		// Grounded movement		
		if(this.body.onFloor()){
			if (left.isDown) {
				this.setVelocityX(-this.GROUND_SPEED);
			}
			else if (right.isDown) {
				this.setVelocityX(this.GROUND_SPEED);
			}
			else {
				this.setVelocityX(0);
			}
			if(up.isDown) {
					this.setVelocityY(-this.JUMP_H);
			}
		}else{ // Airborne
		}

		if(this.body.velocity.y > 0){
			this.body.setGravityY(this.GRAV_DOWN);
		}else{
			this.body.setGravityY(this.GRAV_UP);
		}
	}
}
