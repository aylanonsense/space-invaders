window.addEventListener('load', () => {
	const CANVAS_WIDTH = 600;
	const CANVAS_HEIGHT = 400;

	// load the sprite sheet for the game
	let spritesLoaded = false;
	const sprites = new Image();
	sprites.addEventListener('load', () => {
		spritesLoaded = true;
	});
	sprites.src = '/sprites.png';

	// find the canvas we'll be drawing into
	const canvas = document.getElementById('canvas');
	canvas.setAttribute('width', CANVAS_WIDTH);
	canvas.setAttribute('height', CANVAS_HEIGHT);
	const ctx = canvas.getContext('2d');

	function render() {
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	}

	// kick off an update + render game loop
	function loop() {
		render();
		window.requestAnimationFrame(loop);
	}
	window.requestAnimationFrame(loop);
});