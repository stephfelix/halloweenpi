var Mp3Player 		= require('./Mp3Player');
var logger 			= require('./logger');
var FirePlace 			= require('./FirePlace');
var ScreenController = require('./ScreenController');

function PiPlayer(options) {
	logger.info('Initialized...');

	var isPlaying = false;
	var lastRandomIndex = -1;
	var randomSoundEffectTimer;

	var player = new Mp3Player();
	var fireplace = new FirePlace(logger);
	var screen = new ScreenController(options.images, logger);

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

		fireplace.randomEffect();
		var randomImageCallback = screen.displayRandomImage();

		isPlaying = true;
		player.play(randomMp3, function(playbackError) {
			if (playbackError) {
				logger.error('Error playing Mp3.', playbackError);
			}
			logger.info('Finished mp3.', randomMp3);

			isPlaying = false;
			randomImageCallback();
			playSoundEffectAtRandomTime();
		});
	}

	function playSoundEffectAtRandomTime() {
		var minTimeSecs = 5;
		var maxTimeSecs = 15;
		var randomTimeoutSecs = Math.floor(Math.random() * (maxTimeSecs - minTimeSecs + 1) + minTimeSecs);
		randomSoundEffectTimer = setTimeout(playRandomMp3, randomTimeoutSecs * 1000);
	}

	screen.init();
	playSoundEffectAtRandomTime();
	fireplace.init();

	process.on('SIGINT', function() {
		logger.info('Shutdown...');
		clearTimeout(randomSoundEffectTimer);

		fireplace.exit();
		screen.clear();

		blinkt.clear();
		blinkt.show();

		process.exit();
	});
}

module.exports = PiPlayer;
