window.addEventListener('load', () => {
	const CANVAS_SCALE = 2;
	const CANVAS_WIDTH = 217;
	const CANVAS_HEIGHT = 248;
	const SPRITE_SHEET_COLS = 5;
	const SPRITE_SHEET_CELL_WIDTH = 16;
	const SPRITE_SHEET_CELL_HEIGHT = 16;

	// prep the canvas we'll be drawing into
	const canvas = document.getElementById('canvas');
	canvas.setAttribute('width', CANVAS_WIDTH);
	canvas.setAttribute('height', CANVAS_HEIGHT);
	canvas.style.width = (CANVAS_SCALE * CANVAS_WIDTH) + 'px';
	canvas.style.height = (CANVAS_SCALE * CANVAS_HEIGHT) + 'px';
	const ctx = canvas.getContext('2d');

	// load the sprite sheet which has all of our sprites
	const spriteSheet = new Image();
	let spritesLoaded = false;
	spriteSheet.addEventListener('load', () => {
		spritesLoaded = true;
	});
	spriteSheet.src = '/sprites.png';

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
		}
		update() {}
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
				width: 13,
				height: 8,
				sprite: 0,
				...params
			});
		}
	};

	let entities = [];
	entities.push(new Ship({ x: 50, y: 200 }));

	function update() {
		// update all of our game entities
		for (let entity of Object.values(entities)) {
			entity.update();
		}
	}

	function render() {
		// clear the canvas
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

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