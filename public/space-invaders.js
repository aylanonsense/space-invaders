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

	// our game classes! ships + fleets + invaders
	class Entity {
		constructor(params) {
			this.x = params.x || 0;
			this.y = params.y || 0;
			this.width = params.width || 0;
			this.height = params.height || 0;
			this.sprite = params.sprite || 0;
		}
		update() {}
		render() {
			// ctx.strokeStyle = '#666';
			// ctx.lineWidth = 1;
			// ctx.strokeRect(Math.round(this.x) + 0.5, Math.round(this.y) + 0.5, this.width - 1, this.height - 1);
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
			if (buttons.KeyA || buttons.ArrowLeft) {
				this.x -= 1;
			}
			if (buttons.KeyD || buttons.ArrowRight) {
				this.x += 1;
			}
			this.x = Math.max(10, Math.min(this.x, GAME_WIDTH - this.width - 10));
		}
	};

	class InvaderFleet {
		constructor(params) {
			this.rows = params.rows.map((InvaderClass, i) => {
				return new InvaderFleetRow({
					y: 70 - 16 * i,
					numInvaders: params.numInvadersPerRow,
					InvaderClass
				});
			});
			this.framesUntilMove = 20;
			this.nextRowToMove = 0;
			this.nextMoveX = 1;
			this.nextMoveY = 0;
		}
		update() {
			this.framesUntilMove -= 1;
			if (this.framesUntilMove <= 0) {
				this.framesUntilMove = 20;
				this.rows[this.nextRowToMove].update(this.nextMoveX, this.nextMoveY);
				this.nextRowToMove += 1;
				if (this.nextRowToMove >= this.rows.length) {
					this.nextRowToMove = 0;
					this.nextMoveX *= -1;
				}
			}
		}
		render() {
			for (let row of this.rows) {
				row.render();
			}
		}
	}

	class InvaderFleetRow {
		constructor(params) {
			this.invaders = [];
			for (let i = 0; i < params.numInvaders; i++) {
				this.invaders.push(new params.InvaderClass({
					x: 22 + 16 * i,
					y: params.y
				}));
			}
		}
		update(dx, dy) {
			for (let invader of this.invaders) {
				invader.update(dx, dy);
			}
		}
		render() {
			for (let invader of this.invaders) {
				invader.render();
			}
		}
	}

	class Invader extends Entity {
		constructor(params) {
			super({
				height: 8,
				...params
			});
		}
		update(dx, dy) {
			this.x += dx;
			this.y += dy;
			if (this.sprite % 2 === 0) {
				this.sprite -= 1;
			}
			else {
				this.sprite += 1;
			}
		}
	}

	class SmallInvader extends Invader {
		constructor(params) {
			super({
				width: 8,
				sprite: 1,
				...params,
				x: params.x + 1
			});
		}
	}

	class MediumInvader extends Invader {
		constructor(params) {
			super({
				width: 11,
				sprite: 3,
				...params
			});
		}
	}

	class LargeInvader extends Invader {
		constructor(params) {
			super({
				width: 12,
				sprite: 5,
				...params
			});
		}
	}

	// initialize the game with just a ship against a fleet
	let ship = new Ship({});
	let fleet = new InvaderFleet({
		rows: [ LargeInvader, MediumInvader, SmallInvader ],
		numInvadersPerRow: 11
	});

	// kick off an update + render game loop
	function loop() {
		// update
		ship.update();
		fleet.update();

		// clear the canvas
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

		// draw all of our game entities
		ship.render();
		fleet.render();

		// schedule the next loop
		window.requestAnimationFrame(loop);
	}
	window.requestAnimationFrame(loop);
});