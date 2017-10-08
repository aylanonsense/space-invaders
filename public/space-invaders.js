window.addEventListener('load', () => {
	const CANVAS_SCALE = 3;
	const GAME_WIDTH = 217;
	const GAME_HEIGHT = 248;
	const SPRITE_SHEET_COLS = 5;
	const SPRITE_SHEET_CELL_WIDTH = 16;
	const SPRITE_SHEET_CELL_HEIGHT = 16;

	// prep the canvas we'll be drawing into
	const canvas = document.getElementById('canvas');
	canvas.setAttribute('width', GAME_WIDTH);
	canvas.setAttribute('height', GAME_HEIGHT);
	canvas.style.width = (CANVAS_SCALE * GAME_WIDTH) + 'px';
	canvas.style.height = (CANVAS_SCALE * GAME_HEIGHT) + 'px';
	const ctx = canvas.getContext('2d');

	// load the sprite sheet which has all of our sprites
	const spriteSheet = new Image();
	let spritesLoaded = false;
	spriteSheet.addEventListener('load', () => {
		spritesLoaded = true;
	});
	spriteSheet.src = '/sprites.png';

	// keep track of button presses
	let buttons = {};
	document.body.addEventListener('keydown', evt => {
		buttons[evt.code] = true;
	});
	document.body.addEventListener('keyup', evt => {
		buttons[evt.code] = false;
	});

	// helper method that draws a sprite from the sprite sheet centered
	//   x pixels from the left and y pixels from the top of the canvas
	function drawSprite(spriteIndex, x, y) {
		if (spritesLoaded) {
			let col = spriteIndex % SPRITE_SHEET_COLS;
			let row = Math.floor(spriteIndex / SPRITE_SHEET_COLS);
			ctx.drawImage(spriteSheet,
				col * SPRITE_SHEET_CELL_WIDTH, row * SPRITE_SHEET_CELL_HEIGHT,
				SPRITE_SHEET_CELL_WIDTH, SPRITE_SHEET_CELL_HEIGHT,
				Math.round(x - SPRITE_SHEET_CELL_WIDTH / 2),
				Math.round(y - SPRITE_SHEET_CELL_HEIGHT / 2),
				SPRITE_SHEET_CELL_WIDTH, SPRITE_SHEET_CELL_HEIGHT);
		}
	}

	class Entity {
		constructor(params) {
			this.x = params.x || 0;
			this.y = params.y || 0;
			this.width = params.width || 0;
			this.height = params.height || 0;
			this.sprite = params.sprite || 0;
			this.framesAlive = 0;
		}
		update() {
			this.framesAlive += 1;
		}
		render() {
			ctx.strokeStyle = '#666';
			ctx.lineWidth = 1;
			ctx.strokeRect(Math.round(this.x) + 0.5, Math.round(this.y) + 0.5, this.width - 1, this.height - 1);
			drawSprite(this.sprite, this.x + Math.round(this.width / 2), this.y + Math.round(this.height / 2));
		}
	};

	class Ship extends Entity {
		constructor(params) {
			super({
				x: 120,
				y: 208,
				width: 13,
				height: 8,
				sprite: 0,
				...params
			});
		}
		update() {
			super.update();
			if (buttons.KeyA || buttons.ArrowLeft) {
				this.x -= 1;
			}
			if (buttons.KeyD || buttons.ArrowRight) {
				this.x += 1;
			}
			this.x = Math.max(10, Math.min(this.x, GAME_WIDTH - this.width - 10));
		}
	};

	class Invader extends Entity {
		update() {
			super.update();
			if (this.framesAlive%60 === 10) {
				this.sprite += 1;
			}
			else if (this.framesAlive%60 === 40) {
				this.sprite -= 1;
			}
		}
	}

	class SmallInvader extends Invader {
		constructor(params) {
			super({
				width: 8,
				height: 8,
				sprite: 1,
				...params
			});
		}
	}

	class MediumInvader extends Invader {
		constructor(params) {
			super({
				width: 11,
				height: 8,
				sprite: 3,
				...params
			});
		}
	}

	class BigInvader extends Invader {
		constructor(params) {
			super({
				width: 12,
				height: 8,
				sprite: 5,
				...params
			});
		}
	}

	let entities = [];
	entities.push(new Ship({}));
	entities.push(new SmallInvader({ x: 50, y: 50 }));
	entities.push(new MediumInvader({ x: 100, y: 50 }));
	entities.push(new BigInvader({ x: 150, y: 50 }));

	function update() {
		// update all of our game entities
		for (let entity of Object.values(entities)) {
			entity.update();
		}
	}

	function render() {
		// clear the canvas
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

		// draw all of our game entities
		for (let entity of Object.values(entities)) {
			entity.render();
		}
	}

	// kick off an update + render game loop
	function loop() {
		update();
		render();
		window.requestAnimationFrame(loop);
	}
	window.requestAnimationFrame(loop);
});