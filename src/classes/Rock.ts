export class Rock extends Phaser.GameObjects.Sprite{
	constructor (scene){
		super(scene, 0, 0, 'rock');

		this.speed = 10;
		//this.body.allowGravity = false;
	}

	fire (x, y, fireSpeed){
			this.body.allowGravity = false;
			this.setPosition(x, y);

			this.speed = fireSpeed;

			this.setActive(true);
			this.setVisible(true);
	}
	
	kill(){
			this.setActive(false);
			this.setVisible(false);
			this.x = 0;
			this.y = 0;
	}

	update(time,delta){
		this.x += this.speed;

		if(this.speed > 0 && this.x > 2000 ||
			 this.speed < 0 && this.x < -1000){
			this.kill();
		}
	}
}
