var Mp3Player 		= require('./Mp3Player');
var logger 			= require('./logger');
var blinkt = require('blinkt');


function PiPlayer(options) {
	logger.info('Initialized...');

	var isPlaying = false;
	var lastRandomIndex = -1;
	var randomSoundEffectTimer;
	var firePlaceTimer;

	var player = new Mp3Player();

	function randomFromArray(array) {
		var randomIndex = 0;
		do {
			randomIndex = Math.floor(Math.random() * array.length);
		} while (randomIndex === lastRandomIndex);
		lastRandomIndex = randomIndex;

		return array[randomIndex];
	}

	function playRandomMp3() {
		var randomMp3 = randomFromArray(options.soundFiles);
		logger.info('Playing mp3.', randomMp3);

		isPlaying = true;
		player.play(randomMp3, function(playbackError) {
			if (playbackError) {
				logger.error('Error playing Mp3.', playbackError);
			}
			logger.info('Finished mp3.', randomMp3);

			isPlaying = false;
			playSoundEffectAtRandomTime();
		});
	}

	function playSoundEffectAtRandomTime() {
		var minTimeSecs = 15;
		var maxTimeSecs = 40;
		var randomTimeoutSecs = Math.floor(Math.random() * (maxTimeSecs - minTimeSecs + 1) + minTimeSecs);
		randomSoundEffectTimer = setTimeout(playRandomMp3, randomTimeoutSecs * 1000);
	}

	var colors = [
		[255, 0, 0],
		[255, 194, 0],
		[255, 165, 0]
	];
	var interval = 0.05;

	function firePlace() {

		var brightness = 0.2 + Math.random() * 0.5;
		var color = colors[Math.floor(Math.random() * colors.length)];
		var pixel = Math.floor(Math.random() * 8);

		blinkt.setPixel(pixel, color[0], color[1], color[2], brightness);
		blinkt.show();

		firePlaceTimer = setTimeout(firePlace, interval * 1000);

		// blinkt.setAll(255, 127, 127, 0.5);
		// blinkt.show();
	}

	playSoundEffectAtRandomTime();
	firePlace();

	process.on('SIGINT', function() {
		logger.info('Shutdown...');
		clearTimeout(randomSoundEffectTimer);
		clearTimeout(firePlaceTimer);

		blinkt.clear();
		blinkt.show();

		process.exit();
	});
}

module.exports = PiPlayer;
