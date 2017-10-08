var blinkt = require('blinkt');

var FirePlace = function(logger) {
	var firePlaceTimer;

	var colors = [
		[255, 0, 0],
		[255, 194, 0],
		[255, 165, 0],

		[173, 36, 1],
		[216, 103, 10],
		[216, 148, 10],
		[221, 191, 37]
	];
	var interval = 0.05;

	var lastRandomIndex;

	this.init = function() {
		doInit();

		nextColor();
	}

	this.randomEffect = function() {
		var randomIndex = 0;
		do {
			randomIndex = Math.floor(Math.random() * effects.length);
		} while (randomIndex === lastRandomIndex);
		lastRandomIndex = randomIndex;

		effects[randomIndex]();
	}

	function reset() {
		doInit();
		firePlace();

		logger.info("Starting fireplace");
	}

	function doInit() {
		var color = colors[Math.floor(Math.random() * colors.length)];
		var brightness = 0.2 + Math.random() * 0.7;
		blinkt.setAll(color[0], color[1], color[2], brightness);
		blinkt.show();
	}

	this.exit = function() {
		clearTimeout(firePlaceTimer);
	}

	function firePlace() {
		var brightness = 0.2 + Math.random() * 0.5;
		var color = colors[Math.floor(Math.random() * colors.length)];
		var pixel = Math.floor(Math.random() * 8);

		blinkt.setPixel(pixel, color[0], color[1], color[2], brightness);
		blinkt.show();

		firePlaceTimer = setTimeout(firePlace, interval * 1000);
	}

	this.flash = function() {
		clearTimeout(firePlaceTimer);

		logger.info("Starting flash effect");

		blinkt.clear();
		blinkt.show();

		flashIntensity = 0;
		firePlaceTimer = setTimeout(flashUp, interval * 1000);
	}

	this.blink = function() {
		clearTimeout(firePlaceTimer);

		logger.info("Starting blink effect");

		blinkt.clear();
		blinkt.show();

		blinkCount = 0;
		firePlaceTimer = setTimeout(blinkOn, interval * 1000);
	}

	var colorIndex = 0;
	function nextColor() {

		if(colorIndex >= colors.length){
			colorIndex = 0;
			reset();
			return;
		}

		color = colors[colorIndex];
		logger.info("Color[" + colorIndex + "]: " + JSON.stringify(color));
		blinkt.setAll(color[0], color[1], color[2], 1);
		blinkt.show();

		colorIndex++;

		setTimeout(nextColor, 0.5 * 1000);
	}

	var flashIntensity;

	function flashUp() {
		blinkt.setAll(255, 255, 255, flashIntensity);
		blinkt.show();

		flashIntensity += .2;
		if(flashIntensity > 1){
			flashIntensity = 1;
			firePlaceTimer = setTimeout(flashDown, 0.5 * 1000);
			return;
		}

		firePlaceTimer = setTimeout(flashUp, 0.05 * 1000);
	}

	function flashDown() {
		blinkt.setAll(255, 255, 255, flashIntensity);
		blinkt.show();
		
		flashIntensity -= .1;

		if(flashIntensity < 0.1){
			flashIntensity = 0;

			blinkt.clear();
			blinkt.show();

			reset();
			return;
		}

		firePlaceTimer = setTimeout(flashDown, 0.05 * 1000);
	}

	var blinkCount = 0;
	function blinkOn() {
		if(blinkCount == 4) {
			blinkCount = 0;

			reset();
			return;
		}

		blinkt.setAll(255, 255, 255, 1);
		blinkt.show();

		firePlaceTimer = setTimeout(blinkOff, 0.3 * 1000);
		blinkCount++;
	}

	function blinkOff() {
		blinkt.clear();
		blinkt.show();
		
		firePlaceTimer = setTimeout(blinkOn, 0.3 * 1000);
	}


	var effects = [
		this.flash,
		this.blink
	];

}

module.exports = FirePlace;